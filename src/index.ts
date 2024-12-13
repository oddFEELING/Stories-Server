import { Hono } from "hono";
import { connectMongoose } from "@/models/_db";
import { addMiddlewares } from "@/utils/middleware";

connectMongoose();

const app = new Hono();

addMiddlewares(app);

export default {
  port: 8000,
  fetch: app.fetch,
};
