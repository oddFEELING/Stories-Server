import { openai } from "@/services/openai-queries/client.openai";

export function chunkText(text: string, maxLength: number = 4000): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]; // Split text into sentences
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  for (const sentence of sentences) {
    if (currentChunk.join(" ").length + sentence.length <= maxLength) {
      currentChunk.push(sentence);
    } else {
      chunks.push(currentChunk.join(" "));
      currentChunk = [sentence];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}

export async function generateAudioBuffers(
  chunks: string[],
): Promise<Buffer[]> {
  const buffers: Buffer[] = [];

  // @ts-ignore
  for (const [index, chunk] of chunks.entries()) {
    console.log(`Processing chunk ${index + 1}/${chunks.length}`);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "fable",
      input: chunk,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    buffers.push(buffer);
  }

  return buffers;
}

function mergeBuffers(buffers: Buffer[]): Buffer {
  return Buffer.concat(buffers);
}

export async function createAudio(content: string): Promise<Buffer> {
  const maxLength = 4000;
  const chunks = chunkText(content, maxLength);

  console.log(`Text split into ${chunks.length} chunks.`);

  const audioBuffers = await generateAudioBuffers(chunks);

  console.log("Merging audio buffers...");
  const combinedAudioBuffer = mergeBuffers(audioBuffers);

  console.log("Audio creation complete.");
  return combinedAudioBuffer;
}
