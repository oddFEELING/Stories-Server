import { createUploadthing, type FileRouter } from "uploadthing/express";
import { appLogger } from "@/utils/logger";

const f = createUploadthing();

export const uploadRouter = {
  "chapter-audio-uploader": f({
    audio: { maxFileSize: "32MB", maxFileCount: 1 },
  }).onUploadComplete((data) => {
    appLogger.info("Upload complete", data);
  }),
} satisfies FileRouter;

export type APpFileUploader = typeof uploadRouter;
