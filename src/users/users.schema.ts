import { z } from "zod";

export const postNewUserSchema = z
  .object({
    username: z
      .string({
        required_error: "username field is required",
      })
      .min(1, "username field cannot be empty"),
    email: z
      .string({
        required_error: "email field is required",
      })
      .min(1, "email field cannot be empty")
      .email(),
    password: z
      .string({
        required_error: "password field is required",
      })
      .min(6, "password field cannot be empty"),
    profilePic: z
      .string({
        required_error: "profilePic field is required",
      })
      .min(1, "profilePic field cannot be empty"),
  })
  .strict();

export const postSignInSchema = z
  .object({
    username: z
      .string({
        required_error: "username field is required",
      })
      .min(1, "username field cannot be empty"),
    email: z
      .string({
        required_error: "email field is required",
      })
      .min(1, "email field cannot be empty")
      .email(),
    password: z
      .string({
        required_error: "password field is required",
      })
      .min(6, "password field cannot be empty"),
  })
  .strict();

export type PostNewUserDto = z.infer<typeof postNewUserSchema>;
export type PostSignInDto = z.infer<typeof postSignInSchema>;
