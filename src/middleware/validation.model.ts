import { validationMiddleware } from "../middleware/validation.middleware";
import {
  postGroupMessageSchema,
  postNewGroupSchema,
} from "../groups/groups.schema";
import { postNewUserSchema } from "../users/users.schema";

export const validatePostGroupMessage = validationMiddleware(
  postGroupMessageSchema
);

export const validatePostNewGroup = validationMiddleware(postNewGroupSchema);

export const validatePostNewUserSchema =
  validationMiddleware(postNewUserSchema);
