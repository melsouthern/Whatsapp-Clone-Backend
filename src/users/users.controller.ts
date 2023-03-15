import * as express from "express";
import userModel from "./users.model";
import User from "../interfaces/users.interface";
import Controller from "interfaces/controller.interface";
import HttpException from "../exceptions/HttpException";
import {
  validateSignUpSchema,
  validateSignInSchema,
} from "../middleware/validation.model";
import * as bcrypt from "bcrypt";
import { PostSignInDto } from "./users.schema";

class UsersController implements Controller {
  public path = "/users";
  public email = "/:email";
  public router = express.Router();
  private users = userModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    // /users
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, validateSignUpSchema, this.signUpNewUser);

    // /users/:email
    this.router.get(this.path + this.email, this.getUser);
    this.router.post(
      this.path + this.email,
      validateSignInSchema,
      this.signInUser
    );
  }

  getAllUsers = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.users
      .find()
      .then((users) => {
        const filteredWithoutPasswords = users.map((user) => {
          return {
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
          };
        });
        response.send(filteredWithoutPasswords);
      })
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };

  signUpNewUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: User = request.body;

    if (await this.users.findOne({ email: userData.email })) {
      next(
        new HttpException(400, `This email already exists: ${userData.email}`)
      );
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createdUser = new this.users({
        ...userData,
        password: hashedPassword,
      });
      createdUser
        .save()
        .then((savedData) =>
          response.send({
            username: savedData.username,
            email: savedData.email,
            profilePic: savedData.profilePic,
          })
        )
        .catch((error) =>
          next(new HttpException(500, `Internal server error: ${error}`))
        );
    }
  };

  getUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.users
      .find({ email: request.params.email })
      .then((user) =>
        response.send(
          user.length > 0
            ? {
                username: user[0].username,
                email: user[0].email,
                profilePic: user[0].profilePic,
              }
            : user
        )
      )
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };

  signInUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: PostSignInDto = request.body;

    const user = await this.users
      .findOne({ email: userData.email })
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );

    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        userData.password,
        user.password
      );
      isPasswordMatch
        ? response.send({
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
          })
        : next(new HttpException(400, `The password is incorrect`));
    }
    next(new HttpException(400, `Couldn't find user details`));
  };
}

export default UsersController;
