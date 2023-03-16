import * as jwt from "jsonwebtoken";
import * as express from "express";
import { DataStoredInToken } from "interfaces/token.interface";
import userModel from "../users/users.model";
import HttpException from "../exceptions/HttpException";

async function authMiddleware(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    if (secret) {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const userEmail = verificationResponse._email;
      const user = await userModel.find({ email: userEmail });
      if (user) {
        next();
      } else {
        next(new HttpException(400, "Auth token is invalid or incorrect"));
      }
    } else {
      next(
        new HttpException(400, "There was an issue verifying your access token")
      );
    }
  } else {
    next(new HttpException(400, "Auth token is missing from your request"));
  }
}

export default authMiddleware;
