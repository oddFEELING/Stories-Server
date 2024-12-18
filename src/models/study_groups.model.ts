import mongoose, { Schema } from "mongoose";
import { StudyGroup } from "@/models/_db.types";

const StudyGroupSchema = new Schema<StudyGroup>(
  {
    name: String,
    creator: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    members: [{ type: Schema.Types.ObjectId, ref: "users" }],
    series: [
      {
        name: String,
        theme: String,
        duration: String,
        interval: String,
        start_date: String,
        sessions: [
          {
            title: String,
            passage: String,
            cover: String,
            questions: [String],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    collection: "studygroups",
  },
);

const StudyGroupModel = mongoose.model<StudyGroup>(
  "studygroups",
  StudyGroupSchema,
);

export default StudyGroupModel;
