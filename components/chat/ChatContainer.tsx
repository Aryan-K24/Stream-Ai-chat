"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

import Header from "../layout/Header";
import MessageList, { Message } from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";
import type { WebsiteToolPart } from "./WebsiteTool";

export default function ChatContainer() {
  const [prompt, setPrompt] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const forceScrollRef = useRef(false);
  const lastPromptRef = useRef("");

  const { messages, sendMessage, status, error } = useChat();

  const formattedMessages: Message[] = useMemo(() => {
    return messages.map((message, index) => {
      const toolParts = message.parts.filter(
        (part) => part.type === "tool-analyzeWebsite",
      ) as unknown as WebsiteToolPart[];

      return {
        id: index,
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join(""),
        toolParts,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 100;
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (!shouldAutoScrollRef.current && !forceScrollRef.current) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
      forceScrollRef.current = false;
    });
  }, [formattedMessages, error]);

  const sendPrompt = async (text: string) => {
    const currentPrompt = text.trim();
    if (!currentPrompt) return;

    if (status === "submitted" || status === "streaming") return;

    shouldAutoScrollRef.current = true;
    forceScrollRef.current = true;
    lastPromptRef.current = currentPrompt;

    await sendMessage({
      text: currentPrompt,
    });
  };

  const handleSend = async () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt) return;

    setPrompt("");
    await sendPrompt(currentPrompt);
  };

  const handleRetry = async () => {
    const failedPrompt = lastPromptRef.current;
    if (!failedPrompt) return;

    await sendPrompt(failedPrompt);
  };

  const typingStatus =
    status === "submitted"
      ? "thinking"
      : status === "streaming"
        ? "writing"
        : null;

  const isRequestRunning =
    status === "submitted" || status === "streaming";

  return (
    <section className="chat-shell">
      <Header />

      <div
        ref={messagesContainerRef}
        className="messages"
        onScroll={handleScroll}
      >
        {formattedMessages.length === 0 ? (
          <EmptyState
            onSuggestionClick={(text) => {
              setPrompt(text);
            }}
          />
        ) : (
          <MessageList
            messages={formattedMessages}
            status={typingStatus}
          />
        )}

        {error && (
          <div className="chat-error" role="alert">
            <div className="chat-error-content">
              <div className="chat-error-icon">⚠️</div>

              <div className="chat-error-text">
                <strong>Something went wrong</strong>
                <span>Your last response could not be completed.</span>
              </div>

              <button
                type="button"
                className="retry-btn"
                onClick={handleRetry}
                disabled={isRequestRunning || !lastPromptRef.current}
              >
                {isRequestRunning ? "Retrying..." : "Retry"}
              </button>
            </div>
          </div>
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
