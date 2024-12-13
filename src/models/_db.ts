import * as mongoose from "mongoose";
import { appLogger } from "@/utils/logger";

export const connectMongoose = async () => {
  const mongo_url = Bun.env.MONGODB_URL;
  if (!mongo_url) throw new Error("mongodb url doesn't exist");
  try {
    await mongoose
      .connect(mongo_url, { connectTimeoutMS: 10000 })
      .then(() => appLogger.info("Database Connected!"));
  } catch (error: unknown) {
    appLogger.error(error);
  }
};
