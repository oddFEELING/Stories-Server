import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { promiseResolver } from "@/utils/promise-resolver";
import StoryModel from "@/models/story.schema";
import { createAudio } from "@/utils/chapter-audio-utils";
import { bucket } from "@/utils/firebase";
import { getDownloadURL } from "firebase-admin/storage";
import axios from "axios";
import { openai } from "@/services/openai-queries/client.openai";

const app = new Hono();

// ~ =============================================>
// ~ ======= create a new story  -->
// ~ =============================================>
const createStorySchema = z.object({
  title: z.string(),
  passage: z.string(),
  owner: z.string(),
  summary: z.string(),
  initOptions: z.object({
    mode: z.enum(["generated", "original"]),
    genre: z.enum(["fantasy", "sci-fi", "mystery", "horror", "romance"]),
    length: z.enum(["short", "medium", "long"]),
    timePeriod: z.enum([
      "modern",
      "historical",
      "space-age",
      "magical",
      "null",
    ]),
  }),
});

app.post("/create", zValidator("json", createStorySchema), async (c) => {
  const data = c.req.valid("json");
  const { data: story, error } = await promiseResolver(StoryModel.create(data));

  return c.json(story);
});

// ~ =============================================>
// ~ ======= get story by id   -->
// ~ =============================================>
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { data: story, error } = await promiseResolver(StoryModel.findById(id));

  return c.json(story);
});

// ~ =============================================>
// ~ ======= get story by user  -->
// ~ =============================================>
app.get("/owner/:owner", async (c) => {
  const owner = c.req.param("owner");
  const { data: stories, error } = await promiseResolver(
    StoryModel.find({ owner }),
  );

  return c.json(stories);
});

export default app;

// ~ =============================================>
// ~ ======= add chapter content  -->
// ~ =============================================>
app.post(
  "/:story_id/chapter-add-content",
  zValidator(
    "json",
    z.object({
      owner: z.string(),
      chapter_number: z.number(),
      content: z.string(),
    }),
  ),
  async (c) => {
    const story_id = c.req.param("story_id");
    const { chapter_number, content, owner } = c.req.valid("json");

    try {
      // ~ ======= check if the chapter exists -->
      const exists = await StoryModel.exists({
        _id: story_id,
        "chapters.chapter_number": chapter_number,
      });

      // ~ ======= create audio file -->
      if (exists) {
        console.log("Creating audio");
        const story = await StoryModel.findById(exists._id);

        const audioBuffer = await createAudio(content);

        console.log("Generating cover");
        const cover = await openai.images.generate({
          model: "dall-e-3",
          prompt: `
          create a captivating cover image for a storybook  with the following details:
            ${JSON.stringify({
              title: story?.title,
              passage: story?.passage,
              summary: story?.summary,
              chapter_setup: story?.chapters[0].setup,
            })}
            
            Important!
            - Your image should not be the book but the image that should be on the book
          - pick an artistic style that best suits the story. (e.g., watercolor, charcoal sketch, digital painting, collage)
          - Images should be modern and realistic.
          - Focus on rich visual details and storytelling elements without incorporating text or words within the images.
          - The picture should encompass of just one image and not multiple images in one
          `,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        });

        // ~ ======= save chapter cover  -->
        const cover_file = bucket.file(
          `user-files/user-${owner}/stories/${story_id}/chapter-${chapter_number}-cover.png`,
        );
        const image_response = await axios({
          url: cover.data[0].url,
          method: "GET",
          responseType: "stream",
        });

        const writeStream = cover_file.createWriteStream({
          metadata: {
            contentType: image_response.headers["content-type"],
            owner,
            story_id,
            chapter_number,
          },
        });

        image_response.data.pipe(writeStream);

        await new Promise((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });

        // ~ ======= cover download url  -->
        const cover_url = await getDownloadURL(cover_file);

        // ~ ======= save chapter audio -->
        const file = bucket.file(
          `user-files/user-${owner}/stories/${story_id}/chapter-${chapter_number}.mp3`,
        );
        await file.save(audioBuffer, {
          contentType: "audio/mpeg",
          metadata: {
            owner,
            story_id,
            chapter_number,
          },
        });

        // ~ ======= get download url -->
        const audio_url = await getDownloadURL(file);

        console.log("saving to database");
        await StoryModel.updateOne(
          { _id: story_id, "chapters.chapter_number": chapter_number },
          {
            $set: {
              "chapters.$.content.raw": content,
              "chapters.$.audio_url": audio_url,
              updatedAt: new Date(),
              "story_art.image_url": cover_url,
            },
          },
        );

        return c.json({ success: true, audio_url });
      }
    } catch (error) {
      console.log(error);
      return c.json({ error: "Failed to update", success: false });
    }
  },
);
