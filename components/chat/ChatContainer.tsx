"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

import Header from "../layout/Header";
import MessageList, { Message } from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";

export default function ChatContainer() {
  const [prompt, setPrompt] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat();

  const formattedMessages: Message[] = useMemo(() => {
    return messages.map((message, index) => ({
      id: index,

      role: message.role === "assistant" ? "assistant" : "user",

      content: message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(""),

      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [formattedMessages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    await sendMessage({
      text: prompt,
    });

    setPrompt("");
  };

  return (
    <section className="chat-shell">
      <Header />

      <div className="messages">
        {formattedMessages.length === 0 ? (
          <EmptyState onSuggestionClick={setPrompt} />
        ) : (
          <>
            <MessageList
              messages={formattedMessages}
              isTyping={status === "streaming"}
            />
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <ChatInput
        prompt={prompt}
        setPrompt={setPrompt}
        onSend={handleSend}
      />
    </section>
  );
}