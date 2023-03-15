import * as express from "express";
import { z } from "zod";

export const validationMiddleware =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
      }
      return res.status(409).json({
        status: "failed",
        error: err,
      });
    }
  };

export default validationMiddleware;
