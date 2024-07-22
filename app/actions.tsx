"use server";

import { Movie } from "@/components/movie";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";
import { BotCard, CardSkeleton } from "@/components/ui/message";
import { ConversionStarters } from "@/components/ui/conversation-starter";
import { fetchImageUrl, getMovieDetails } from "@/lib/data/tmdb.api";

export interface Message {
  role: "user" | "assistant";
  function?: string;
  content: string;
  display?: any;
  result?: any;
}

export async function continueConversation(history: Message[]) {
  const stream = createStreamableValue();

  // console.log("History: ", history);
  const { text, toolResults } = await generateText({
    model: openai("gpt-4o"),
    system: `You are a helpful ${process.env.NEXT_PUBLIC_DOMAIN} recommender.
    Before answering any questions, you check your knowledge base to retrieve some recent items beyond you knowledge cutoff that might (not) be relevant for the query.
    You use this extra information to supplement to your prior knowledge. Do not assume things about items from the knowledge base that are not explicitly stated (e.g. do not assume an actor plays in a movie if not mentioned).
    Also use your own knowledge about less recent items that are not in the knowledge base.
    
    Recommend movies taking into account the user history: [5 stars: Superman, Spider-man Accross the Spider-Verse, The Dark Knight, The Avengers, Iron Man 3; 4 stars: Deadpool, Wall-E, Shrek, Kung-Fu Panda 2; 3 stars: Crazy, Stupid Love].

    If you recommend movies, do not return it as plain text. Instead, call the 'showItems' tool.
    If you don't know with certainty, respond, "Sorry, I don't know."
    Do not engage in a conversation that is not related to the ${process.env.NEXT_PUBLIC_DOMAIN} domain.`,
    messages: history,
    tools: {
      generateConversationStarters: {
        description:
          "Based on the user watching history, recommend some conversation starters centered around themes, actors, directors, countries, ...",
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
      getInformation: {
        description:
          "Get information from your knowledge base to answer questions.",
        parameters: z.object({
          question: z.string().describe("the user's question"),
        }),
        execute: async ({ question }) => {
          stream.append(`Retrieving data to answer "${question}"...`);

          const context = await findRelevantContent(question);
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
          movies: z.array(
            z.object({
              // customizable
              title: z.string().describe("The title of the movie."),
              year: z.number().describe("The year the movie was released."),
            })
          ),
        }),
        execute: async ({ movies }) => {
          stream.append(`Looking up the info...`);

          // Get the item info from the knowledge base
          const moviesWithTmdbData = await Promise.all(
            movies.map(async (movie: any) => {
              return {
                ...movie,
                data: await getMovieDetails(movie.title, movie.year),
              };
            })
          );

          const r = {
            type: "component",
            name: "ItemCard",
            args: {
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
          text || toolResults[0]?.toolName == "getInformation"
            ? JSON.stringify((toolResults[0].result as any).context)
            : "",
        display: stream.value,
        result: toolResults[0].result,
      },
    ],
  };
}
