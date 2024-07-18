"use client";

import { useEffect, useState } from "react";
import { Message, continueConversation } from "./actions";
import { ConversionStarters } from "@/components/ui/conversation-starter";
import { BotCard } from "@/components/ui/message";
import { Movies } from "@/components/movie";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const resubmitMessage =
  "Given your own knowledge supplemented with the results from the knowledge base, show 3 relevant items to the last user question.";

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (r?: "assistant"|"user", systemInput?: string) => {
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
      },
    ]);

    setIsLoading(false);
    setConversation(messages);
  };

  const elements = {
    ConversationStarters: (args: any) => (
      <BotCard>
        <ConversionStarters
          starters={args.starters}
          submitMessage={(prompt: string) => {
            handleSubmit("user", prompt);
          }}
        />
      </BotCard>
    ),
    ItemCard: (args: any) => (
      <BotCard>
        <Movies movies={args.movies} />
      </BotCard>
    ),
  };

  useEffect(() => {
    console.log("Conversation changed: ", conversation);
    const lastMessage = conversation.slice(-1)[0];
    if (lastMessage?.function == "getInformation") {
      // Resubmit the last message to the server, in order to get the information
      handleSubmit("assistant", resubmitMessage);
    }
  }, [conversation]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {conversation.map((message, index) => (
          <div key={index}>
            {message.content && (
              <div>
                <b>{message.role}: </b>
                {message.result && message.result?.type === "component"
                  ? elements[message.result.name as keyof typeof elements](
                      message.result.args
                    )
                  : message.display ?? message.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>{isLoading && <div>Loading...</div>}</div>

      <div>
        <input
          type="text"
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          placeholder="Say something..."
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </div>
    </div>
  );
}
