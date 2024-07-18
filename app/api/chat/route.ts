import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { streamUI } from "ai/rsc";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const domain = "movie";

export async function POST(req: Request) {
  const { messages } = await req.json();
  // console.log("Messages: ", JSON.stringify(messages));

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful ${domain} recommender. Before answering any questions, you check your knowledge base to retrieve relevant recent movies.
    Use this extra information as a supplement to your prior knowledge.
    If you don't know with certainty, respond, "Sorry, I don't know."
    If you recommend movies, do not return it as plain text. Instead, call the displayItem tool.`,
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
      displayItem: tool({
        description: `display ${domain} items.`,
        parameters: z.object({
          movies: z.array(
            z.object({
              title: z.string().describe("the title of the movie"),
              year: z.number().describe("the year the movie was released"),
              directors: z
                .array(z.string())
                .describe("the directors of the movie"),
              actors: z.array(z.string()).describe("the actors in the movie"),
              genres: z.array(z.string()).describe("the genres of the movie"),
            })
          ),
        }),
        execute: async ({ movies }) => {
          return true;
        },
      }),
    },
  });

  return result.toAIStreamResponse();
}
