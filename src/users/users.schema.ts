import { z } from "zod";

export const postNewUserSchema = z
  .object({
    username: z
      .string({
        required_error: "username field is required",
      })
      .min(1, "username field cannot be empty"),
    profilePic: z
      .string({
        required_error: "profilePic field is required",
      })
      .min(1, "profilePic field cannot be empty"),
  })
  .strict();

export type PostNewUserDto = z.infer<typeof postNewUserSchema>;
