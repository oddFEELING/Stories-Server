import { Hono } from "hono";
import UserService from "@/services/user.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import UserModel from "@/models/user.schema";
import { clerkClient } from "@clerk/express";

const app = new Hono();

// ~ =============================================>
// ~ ======= create a new user   -->
// ~ =============================================>
const newUserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  other_names: z.string().optional(),
  email: z.string(),
  auth_id: z.string(),
  profile_img: z.string(),
});

app.post("/create", zValidator("json", newUserSchema), async (c) => {
  const data = c.req.valid("json");
  const newUser = await UserModel.create(data);
  await clerkClient.users.updateUserMetadata(data.auth_id, {
    publicMetadata: {
      profile_id: newUser._id,
    },
  });
  return c.json(newUser);
});

// ~ =============================================>
// ~ ======= check if user exists   -->
// ~ =============================================>
app.post(
  "/exists",
  zValidator("json", z.object({ auth_id: z.string() })),
  async (c) => {
    const { auth_id } = c.req.valid("json");
    const exists = await UserService.exists(auth_id);
    return c.json({ exists });
  },
);

// ~ =============================================>
// ~ ======= get a user by id   -->
// ~ =============================================>
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await UserModel.findById(id);
  return c.json(user);
});

export default app;
