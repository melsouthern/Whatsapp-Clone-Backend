import { z } from "zod";

export const postGroupMessageSchema = z
  .object({
    sender: z
      .string({
        required_error: "sender field is required",
      })
      .min(1, "sender field cannot be empty"),
    text: z
      .string({
        required_error: "text field is required",
      })
      .min(1, "text field cannot be empty"),
  })
  .strict();

export const postNewGroupSchema = z
  .object({
    groupName: z
      .string({
        required_error: "groupName field is required",
      })
      .min(1, "groupName field cannot be empty"),
    users: z.array(
      z.object({
        username: z.string({
          required_error: "username field is required",
        }),
      }),
      { required_error: "users field is required" }
    ),
  })
  .strict();

export type PostNewGroupDto = z.infer<typeof postNewGroupSchema>;
export type PostGroupMessageDto = z.infer<typeof postGroupMessageSchema>;
