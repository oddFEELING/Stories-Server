import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
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
    let retryCount = 0;
    const MAX_RETRIES = 3;

    while (!fits && retryCount < MAX_RETRIES) {
      console.info(`Attempt ${retryCount + 1}: Checking if schema fits`);
      try {
        const parsedResponse = JSON.parse(chapter_response || "{}");

        const result = z
          .custom<Story["chapters"][0]>()
          .safeParse(parsedResponse);

        if (result.success) {
          fits = true;
          chapterData = result.data;
          await StoryModel.findByIdAndUpdate(data.story_id, {
            initialized: true,
            chapters: [result.data],
          });
          return c.json({ chapterData });
        } else {
          console.warn("Schema validation failed:", result.error);
          chapter_response = await setOriginalStoryChapter({
            ...data,
            retryReason:
              "Invalid schema format. Please ensure proper JSON structure.",
          });
        }
      } catch (error) {
        console.error("JSON Parse error:", error);
        console.error("Invalid response:", chapter_response);

        chapter_response = await setOriginalStoryChapter({
          ...data,
          retryReason:
            "Invalid JSON format. Please provide a properly formatted JSON response.",
        });
      }

      retryCount++;
    }

    if (retryCount >= MAX_RETRIES) {
      console.error(
        "Max retries reached. Could not generate valid chapter data.",
      );
      return c.json(
        {
          error: "Failed to create valid chapter data after multiple attempts",
          lastResponse: chapter_response,
        },
        500,
      );
    }

    return c.json({ error: "Failed to create chapter data" }, 500);
  },
);

export default app;
