import { openai } from "@/services/openai-queries/client.openai";
import { runResults } from "@/services/openai-queries/_docs";

interface OriginalStoryProps {
	story_id: string;
	title: string;
	summary: string;
	passage: string;
	retryReason?: string;
}

export const setOriginalStoryChapter = async (props: OriginalStoryProps) => {
	const { title, summary, passage, retryReason } = props;

	// ~ ======= Add retry context to the prompt if available -->
	const retryContext = retryReason
		? `Previous attempt failed: ${retryReason}. Please ensure your response is valid JSON and matches the required schema.`
		: "";

	const prompt = `
		${retryContext}
		Based on the following information:
		Title: ${title}
		Summary: ${summary}
		Passage: ${passage}
		...rest of your prompt
	`;

	// ~ ======= create thread -->
	const thread = await openai.beta.threads.create({
		messages: [
			{
				role: "user",
				content: prompt,
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
