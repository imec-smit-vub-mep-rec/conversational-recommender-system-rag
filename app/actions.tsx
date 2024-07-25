"use server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
import { retrieveMostSimilarItems } from "@/lib/ai/embedding";
import { fetchImageUrl, getMovieDetails } from "@/lib/data/tmdb.api";
import { getPreferences } from "./preferences/actions";

export interface Message {
  role: "user" | "assistant";
  function?: string;
  content: string;
  display?: any;
  result?: any;
  hidden?: boolean;
}

export async function continueConversation(history: Message[]) {
  const stream = createStreamableValue();
  const userPreferences = await getPreferences("dummy");

  // console.log("History: ", history);
  const { text, toolResults } = await generateText({
    model: openai("gpt-4o"),
    temperature: 1.2,
    system: `You are a helpful ${process.env.NEXT_PUBLIC_DOMAIN} recommender.
    Before answering any questions, you check your knowledge base to retrieve some recent items beyond you knowledge cutoff that might (not) be relevant for the query.
    You use this extra information to supplement to your prior knowledge. Do not assume things about items from the knowledge base that are not explicitly stated (e.g. do not assume an actor plays in a movie if not mentioned).
    Also use your own knowledge of items that are not in the knowledge base.
    
    Recommend movies taking into account the user history: ${userPreferences}.

    Do not recommend movies that the user has already seen or if you have recommended them already in the conversation.
    If you recommend movies, do not return it as plain text. Instead, call the 'showItems' tool.
    If you don't know with certainty, respond, "Sorry, I don't know." or ask for clarification.
    Do not engage in a conversation that is not related to the ${process.env.NEXT_PUBLIC_DOMAIN} domain.`,
    messages: history,
    tools: {
      showConversationStarters: {
        description:
          "Based on the user watching history, recommend 4 original conversation starters centered around themes, actors, directors, countries, ...",
        parameters: z.object({
          cards: z.array(
            z.object({
              heading: z
                .string()
                .describe(
                  "Heading of the conversation starter. For example: Comedies for the whole family."
                ),
              subheading: z
                .string()
                .describe(
                  "Short explanation why this topic is recommended to the user. For example: Because you watched Toy Story, Shrek and Ace Ventura."
                ),
              prompt: z
                .string()
                .describe(
                  "A prompt to act as a search in this theme. For example: 'Recommend me 3 comedies for the whole family like Toy Story, Shrek and Ace Ventura.'"
                ),
              image: z.object({
                type: z.union([z.literal("movie"), z.literal("person")]),
                query: z.string().describe("The title of the movie or actor."),
              }),
            })
          ),
        }),
        execute: async ({ cards }) => {
          stream.append(`Generating conversation starters...`);

          const cardsWithImages = await Promise.all(
            cards.map(async (card: any) => {
              const url = await fetchImageUrl(card.image);
              return {
                ...card,
                image: { ...card.image, url },
              };
            })
          );

          const r = {
            type: "component",
            name: "ConversationStarters",
            args: {
              starters: cardsWithImages,
            },
          };
          // stream.done("Done generating conversation starters.");

          return r;
        },
      },
      retrieveMostSimilarItems: {
        description:
          "Get information from your knowledge base to answer questions.",
        parameters: z.object({
          question: z.string().describe("the user's question"),
        }),
        execute: async ({ question }) => {
          stream.append(`Retrieving data to answer "${question}"...`);

          const context = await retrieveMostSimilarItems(question);
          // stream.done("Found information.");
          return {
            type: "retrieval",
            context:
              "Results from similarity search in knowledge base: " +
              JSON.stringify(context),
          };
        },
      },
      showItems: {
        description: "Show the info for given items.",
        parameters: z.object({
          introduction: z
            .string()
            .describe(
              "An introduction to the items, explaining why they fit with the user request."
            ),
          movies: z.array(
            z.object({
              // customizable
              title: z.string().describe("The title of the movie."),
              year: z.number().describe("The year the movie was released."),
              synopsis: z
                .string()
                .describe(
                  "A personalized synopsis of the movie based on the user preferences and watching history."
                ),
              reasons_to_like: z.array(z.string()).optional().nullable(),
              reasons_to_dislike: z.array(z.string()).optional().nullable(),
              themes: z
                .array(
                  z.object({
                    theme: z.string().describe("The theme of the movie."),
                    amount: z.number().describe("The amount of the theme."),
                  })
                )
                .optional()
                .nullable(),
            })
          ),
        }),
        execute: async ({ introduction, movies }) => {
          stream.append(`Looking up the info...`);

          // Get the item info from the knowledge base
          const moviesWithTmdbData = await Promise.all(
            movies.map(async (movie: any) => {
              return {
                ...movie,
                api_data: await getMovieDetails(movie.title, movie.year),
              };
            })
          );

          const r = {
            type: "component",
            name: "ItemCard",
            args: {
              introduction,
              movies: moviesWithTmdbData,
            },
          };
          stream.done("Done looking up the info.");
          return r;
        },
      },
    },
  });

  //console.log("Tool results: ", text, JSON.stringify(toolResults));

  return {
    messages: [
      ...history,
      {
        role: "assistant" as const,
        function: toolResults[0]?.toolName,
        content:
          text || toolResults[0]?.toolName == "retrieveMostSimilarItems"
            ? JSON.stringify((toolResults[0].result as any).context)
            : "",
        display: stream.value,
        result: toolResults[0].result,
      },
    ],
  };
}
