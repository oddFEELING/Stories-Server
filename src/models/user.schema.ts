import mongoose, { Schema } from "mongoose";
import { User } from "./_db.types";

const UserSchema: Schema = new mongoose.Schema<User>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    auth_id: { type: String, required: true, unique: true },
    other_names: String,
    email: { type: String, required: true, unique: true },
    profile_img: { type: String, required: true },
  },
  { timestamps: true, collection: "users" },
);

const UserModel = mongoose.model<User>("users", UserSchema);

export default UserModel;
