import * as mongoose from "mongoose";
import { Group } from "../interfaces/group.interface";

const groupSchema = new mongoose.Schema({
  groupName: String,
  users: [{ username: String }],
  messages: [
    {
      sender: String,
      text: String,
      timestamp: Date,
      image: String,
      emoji: String,
    },
  ],
});

const groupModel = mongoose.model<Group & mongoose.Document>(
  "groups",
  groupSchema
);

export default groupModel;
