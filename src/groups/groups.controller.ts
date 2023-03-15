import * as express from "express";
import groupModel from "./groups.model";
import Controller from "interfaces/controller.interface";
import HttpException from "../exceptions/HttpException";
import {
  validatePostGroupMessage,
  validatePostNewGroup,
} from "../middleware/validation.model";
import { PostGroupMessageDto } from "./groups.schema";

class GroupsController implements Controller {
  public path = "/groups";
  public groupName = "/:groupname";
  public messages = "/messages";
  public router = express.Router();
  private groups = groupModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    // /groups
    this.router.get(this.path, this.getAllGroups);
    this.router.post(this.path, validatePostNewGroup, this.postNewGroup);

    // /groups/:groupname
    this.router.get(this.path + this.groupName, this.getGroup);

    // /groups/:groupname/messages
    this.router.get(
      this.path + this.groupName + this.messages,
      this.getGroupMessages
    );
    this.router.post(
      this.path + this.groupName + this.messages,
      validatePostGroupMessage,
      this.postGroupMessage
    );
  }

  getAllGroups = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.groups
      .find()
      .then((groups) => response.send(groups))
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };

  postNewGroup = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const groupData = request.body;
    groupData.messages = [];
    const createdGroup = new this.groups(groupData);
    createdGroup
      .save()
      .then((savedGroup) => response.send(savedGroup))
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };

  getGroup = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.groups
      .find({ groupName: request.params.groupname })
      .then((group) => {
        if (group.length !== 0) {
          response.send(group);
        }
        next(new HttpException(404, "Group not found"));
      })
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };

  getGroupMessages = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.groups
      .find({ groupName: request.params.groupname })
      .then((group) => {
        if (group.length !== 0) {
          response.send(group[0].messages);
        }
        next(
          new HttpException(
            404,
            "Group is not found or there are no messages for this group yet"
          )
        );
      })
      .catch((error) =>
        next(new HttpException(500, `Internal server error: ${error}`))
      );
  };

  postGroupMessage = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const body: PostGroupMessageDto = request.body;

    const newMessage = {
      ...body,
      timestamp: new Date(),
    };
    await this.groups
      .findOneAndUpdate(
        { groupName: request.params.groupname },
        { $push: { messages: newMessage } },
        { new: true }
      )
      .then((group) => response.send(group))
      .catch((error) => {
        next(new HttpException(500, `Internal server error: ${error}`));
      });
  };
}

export default GroupsController;
