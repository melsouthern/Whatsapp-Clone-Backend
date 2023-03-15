import { validationMiddleware } from "../middleware/validation.middleware";
import {
  postGroupMessageSchema,
  postNewGroupSchema,
} from "../groups/groups.schema";
import { postNewUserSchema, postSignInSchema } from "../users/users.schema";

export const validatePostGroupMessage = validationMiddleware(
  postGroupMessageSchema
);

export const validatePostNewGroup = validationMiddleware(postNewGroupSchema);

export const validateSignUpSchema = validationMiddleware(postNewUserSchema);

export const validateSignInSchema = validationMiddleware(postSignInSchema);
