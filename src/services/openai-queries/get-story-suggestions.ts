import { openai } from "@/services/openai-queries/client.openai";
import { runResults } from "@/services/openai-queries/_docs";

export const getStorySuggestions = async (prompt: string) => {
  // ~ ======= create thread
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: `Based on the user prompt: "${prompt}", either:
                1. Create a compelling biblical story adaptation incorporating elements from the prompt, or
                2. Suggest 12 Bible stories, including:
                   - A creative title for each story
                   - The biblical reference/passage
                   - A brief 2-line summary highlighting unique elements
                   - The category/theme it belongs to
                
                The stories should be diverse in nature, spanning different themes like:
                - Personal transformation
                - Divine intervention
                - Family dynamics
                - Tests of faith
                - Leadership challenges
                - Prophecy fulfillment
                
                If there is a user prompt make sure your stories align with the prmpt.
                For each story, focus on surprising narratives that aren't commonly referenced.`,
      },
    ],
  });

  // ~ ======= create run
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    model: "gpt-4o-mini",
    assistant_id: "asst_xA9iRqfUE9VpBVBFJaQKfGxi",
  });

  return await runResults(run, openai);
};
