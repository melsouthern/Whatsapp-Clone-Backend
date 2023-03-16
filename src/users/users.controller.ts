import * as express from "express";
import userModel from "./users.model";
import { User } from "../interfaces/users.interface";
import { Controller } from "interfaces/controller.interface";
import { Token, DataStoredInToken } from "interfaces/token.interface";
import HttpException from "../exceptions/HttpException";
import {
  validateSignUpSchema,
  validateSignInSchema,
  validateSignOutSchema,
} from "../middleware/validation.model";
import * as bcrypt from "bcrypt";
import { PostNewUserDto, PostSignInDto } from "./users.schema";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.middleware";

class UsersController implements Controller {
  public path = "/users";
  public email = "/:email";
  public signOut = "/sign-out";
  public router = express.Router();
  private users = userModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    // /users
    this.router.get(this.path, authMiddleware, this.getAllUsers);
    this.router.post(this.path, validateSignUpSchema, this.signUpNewUser);

    // /users/:email
    this.router.get(this.path + this.email, authMiddleware, this.getUser);
    this.router.post(
      this.path + this.email,
      validateSignInSchema,
      this.signInUser
    );

    // /users/:email/sign-out
    this.router.post(
      this.path + this.email + this.signOut,
      authMiddleware,
      validateSignOutSchema,
      this.signOutUser
    );
  }

  private createToken(
    user: PostNewUserDto | PostSignInDto,
    next: express.NextFunction
  ) {
    const expiresIn = 60 * 60; // one hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _email: user.email,
    };
    if (secret) {
      return {
        expiresIn,
        token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
      };
    } else {
      next(new HttpException(500, `Could not generate JWT token`));
    }
  }

  private createCookie(tokenData: Token) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
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
        .then((savedData) => {
          const tokenData = this.createToken(savedData, next);
          if (tokenData) {
            response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
            response.send({
              username: savedData.username,
              email: savedData.email,
              profilePic: savedData.profilePic,
            });
          } else {
            next(
              new HttpException(500, `There was an issue generating a token`)
            );
          }
        })
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
      if (isPasswordMatch) {
        const tokenData = this.createToken(user, next);
        tokenData
          ? (response.setHeader("Set-Cookie", [this.createCookie(tokenData)]),
            response.send({
              username: user.username,
              email: user.email,
              profilePic: user.profilePic,
            }))
          : next(
              new HttpException(400, `There was an issue generating a token`)
            );
      } else {
        next(new HttpException(400, `The password is incorrect`));
      }
    }
    next(new HttpException(400, `Couldn't find user details`));
  };

  signOutUser = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userEmail = request.params.email;

    if (response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"])) {
      response.status(200).send(`Successfully signed out ${userEmail}`);
    } else {
      next(
        new HttpException(500, `There was a problem signing out ${userEmail}`)
      );
    }
  };
}

export default UsersController;
