import express from "express";
import "dotenv/config";
import * as bodyParser from "body-parser";
import GroupsController from "groups/groups.controller";
import UsersController from "users/users.controller";
import errorMiddleware from "./middleware/error.middleware";
import * as mongoose from "mongoose";
import { Controller } from "interfaces/controller.interface";
import cookieParser from "cookie-parser";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: [GroupsController, UsersController], port: number) {
    this.app = express();
    this.port = port;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private connectToDatabase() {
    try {
      const { MONGO_URI } = process.env;
      MONGO_URI
        ? mongoose.connect(MONGO_URI)
        : console.log("Unable to connect to mongoDB");
    } catch (error) {
      console.log(error);
    }
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
