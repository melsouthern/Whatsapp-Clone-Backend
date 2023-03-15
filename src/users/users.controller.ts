import * as express from "express";
import userModel from "./users.model";
import User from "../interfaces/users.interface";
import Controller from "interfaces/controller.interface";
import HttpException from "../exceptions/HttpException";
import { validatePostNewUserSchema } from "../middleware/validation.model";

class UsersController implements Controller {
  public path = "/users";
  public user = "/:user";
  public router = express.Router();
  private users = userModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    // /users
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, validatePostNewUserSchema, this.postNewUser);

    // /users/:user
    this.router.get(this.path + this.user, this.getUser);
  }

  getAllUsers = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.users
      .find()
      .then((users) => response.send(users))
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };

  postNewUser = (request: express.Request, response: express.Response) => {
    const userData: User = request.body;
    const createdUser = new this.users(userData);
    createdUser
      .save()
      .then((savedUser) => response.send(savedUser))
      .catch((error) => console.log(error));
  };

  getUser = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.users
      .find({ username: request.params.user })
      .then((user) => response.send(user))
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };
}

export default UsersController;
