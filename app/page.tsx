"use client";

import { useEffect, useState } from "react";
import { Message, continueConversation } from "./actions";
import { ConversionStarters } from "@/components/ui/conversation-starter";
import {
  BotCard,
  CardSkeleton,
  Loader,
  UserCard,
} from "@/components/ui/message";
import { Movies } from "@/components/movie";
import { capitalize } from "@/lib/helpers/string";
import { IconSend } from "@tabler/icons-react";
import { getGreeting } from "@/lib/helpers/time";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const resubmitMessage =
  "Given your own knowledge supplemented with the results from the knowledge base, show 3 relevant items to the last user question. Do not retrieve new information again.";

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createPrompt = async (
    r?: "assistant" | "user",
    systemInput?: string,
    hidden?: boolean
  ) => {
    setInput("");
    setIsLoading(true);
    const { messages } = await continueConversation([
      // exclude React components from being sent back to the server:
      ...conversation.map(({ role, content, result }) => ({
        role,
        content,
        result,
      })),
      {
        role: r ?? "user",
        content: systemInput ?? input,
        hidden: hidden ?? false,
      },
    ]);

    setIsLoading(false);
    setConversation(messages);
  };

  useEffect(() => {
    // After initial load: generate conversation starters
    createPrompt("user", "Starters", true);
  }, []);

  const elements = {
    ConversationStarters: (args: any) => (
      <BotCard>
        <p className="pb-5">
          {getGreeting()}! Let's watch a movie 🎬
          <br />
          Here are some ideas to get you started:
        </p>
        <ConversionStarters
          starters={args.starters}
          submitMessage={(prompt: string) => {
            createPrompt("user", prompt);
          }}
        />
      </BotCard>
    ),
    ItemCard: (args: any) => (
      <BotCard>
        <Movies
          introduction={args.introduction}
          movies={args.movies}
          submitMessage={(prompt: string) => {
            createPrompt("user", prompt);
          }}
        />
      </BotCard>
    ),
  };

  useEffect(() => {
    console.log("Conversation changed: ", conversation);
    const lastMessage = conversation.slice(-1)[0];
    if (lastMessage?.function == "retrieveMostSimilarItems") {
      // Resubmit the last message to the server, in order to get the information
      createPrompt("assistant", resubmitMessage, true);
    }
  }, [conversation]);

  return (
    <div className="flex flex-col w-full max-w-3xl py-24 mx-auto stretch">
      <div className="space-y-4">
        {conversation.map((message, index) => (
          <div key={index}>
            {!message.hidden && (message.content || message.result) && (
              <div>
                <b>{capitalize(message.role)}: </b>
                {message.result && message.result?.type === "component" ? (
                  elements[message.result.name as keyof typeof elements](
                    message.result.args
                  )
                ) : message.content &&
                  !message.content.startsWith('"Results from ') ? (
                  <UserCard>{message.content}</UserCard>
                ) : (
                  "<hidden>"
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        {isLoading && (
          <BotCard>
            <Loader
              msg={
                conversation.slice(-1)[0]?.content || "Getting your movies..."
              }
            />
          </BotCard>
        )}
      </div>

      <div className="fixed bottom-0 w-full max-w-3xl stretch z-20">
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            className="w-full p-4 mb-8 border border-gray-300 rounded-xl shadow-xl"
            placeholder="Start chatting…"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                createPrompt();
              }
            }}
          />
          <button
            className="absolute right-0 p-4"
            onClick={() => createPrompt()}
          >
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  );
}
