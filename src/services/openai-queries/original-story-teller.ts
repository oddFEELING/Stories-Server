import { openai } from "@/services/openai-queries/client.openai";
import { runResults } from "@/services/openai-queries/_docs";

type QueryPromptType = {
  title: string;
  summary: string;
  passage: string;
};

export const setOriginalStoryChapter = async (args: QueryPromptType) => {
  // ~ ======= create thread -->
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: `
           Generate a chapter schema using the following details:
           
           - chapter number is 1
           
           - Story title:
           ${args.title}
           - summary:
           ${args.summary}
           - Bible passage"
           ${args.passage}
           `,
      },
    ],
  });

  // ~ ======= create run  -->
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    model: "gpt-4o-mini",
    assistant_id: Bun.env.ORIGINAL_STORY_CHAPTER_SETTER as string,
  });

  return await runResults(run, openai);
};
