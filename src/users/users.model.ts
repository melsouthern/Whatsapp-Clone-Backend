import * as mongoose from "mongoose";
import User from "../interfaces/users.interface";

const userSchema = new mongoose.Schema({
  username: String,
  profilePic: String,
});

const userModel = mongoose.model<User & mongoose.Document>("users", userSchema);

export default userModel;
