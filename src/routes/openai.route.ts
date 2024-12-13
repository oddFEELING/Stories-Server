import { Hono } from "hono";
import { zValidator } from "@Hono/zod-validator";
import { z } from "zod";
import { getStorySuggestions } from "@/services/openai-queries/get-story-suggestions";
import { setOriginalStoryChapter } from "@/services/openai-queries/original-story-teller";
import { Story } from "@/models/_db.types";
import StoryModel from "@/models/story.schema";

const app = new Hono();

// ~ =============================================>
// ~ ======= suggest stories from prompt   -->
// ~ =============================================>
app.post(
  "/suggest-story-titles",
  zValidator("json", z.object({ prompt: z.string() })),
  async (c) => {
    const { prompt } = c.req.valid("json");
    const result = await getStorySuggestions(prompt);
    return c.json(result);
  },
);

// ~ =============================================>
// ~ ======= get original story  -->
// ~ =============================================>
const CreateOriginalProps = z.object({
  story_id: z.string(),
  title: z.string(),
  summary: z.string(),
  passage: z.string(),
});

app.post(
  "/get-original-story",
  zValidator("json", CreateOriginalProps),
  async (c) => {
    const data = c.req.valid("json");
    let chapter_response = await setOriginalStoryChapter(data);
    let fits: boolean = false;
    let chapterData;

    while (!fits) {
      console.info("Checking if schema fits");
      const result = z
        .custom<Story["chapters"][0]>()
        .safeParse(JSON.parse(chapter_response || "{}"));

      if (result.success) {
        fits = true;
        chapterData = result.data;
        await StoryModel.findByIdAndUpdate(data.story_id, {
          initialized: true,
          chapters: [result.data],
        });
        return c.json({ chapterData });
      } else {
        // ~ ======= regenerate if it doesnt fit -->
        chapter_response = await setOriginalStoryChapter(data);
      }
    }

    return c.json({ error: "Failed to create chapter data" });
  },
);

export default app;
