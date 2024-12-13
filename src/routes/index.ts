import { Hono } from "hono";
import usersRoute from "@/routes/users.route";
import openaiRoute from "@/routes/openai.route";
import storiesRoute from "@/routes/stories.route";

const app = new Hono();

// ~ ======= attach routes -->
app.route("/users", usersRoute);
app.route("/openai", openaiRoute);
app.route("/stories", storiesRoute);

export default app;
