import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { poweredBy } from "hono/powered-by";
import { Hono } from "hono";
import appRoute from "@/routes";
import { clerkMiddleware } from "@hono/clerk-auth";

export const addMiddlewares = (app: Hono) => {
  app.use(cors());
  app.use(poweredBy());
  app.use(logger());
  app.use(clerkMiddleware());
  app.route("/", appRoute);
};
