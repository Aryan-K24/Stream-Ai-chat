"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

import Header from "../layout/Header";
import MessageList, { Message } from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";

export default function ChatContainer() {
  const [prompt, setPrompt] = useState("");
  const [mounted, setMounted] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Keeps the chat following the response when the user is near the bottom.
  const shouldAutoScrollRef = useRef(true);

  // Forces the chat to move to the newest message after sending.
  const forceScrollRef = useRef(false);

  const { messages, sendMessage, status } = useChat();

  /*
   * Wait until the component has mounted on the client
   * before generating browser-local timestamps.
   *
   * This prevents the server/client hydration mismatch.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedMessages: Message[] = useMemo(() => {
    return messages.map((message, index) => ({
      id: index,

      role: message.role === "assistant" ? "assistant" : "user",

      content: message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(""),

      createdAt: mounted
        ? new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    }));
  }, [messages, mounted]);

  /*
   * Check whether the user is close to the bottom.
   *
   * If the user manually scrolls upward,
   * automatic scrolling stops.
   */
  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 100;
  };

  /*
   * Automatically follow new content when:
   *
   * - the user is already near the bottom
   * - a new prompt was just sent
   */
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    if (
      !shouldAutoScrollRef.current &&
      !forceScrollRef.current
    ) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });

      forceScrollRef.current = false;
    });
  }, [formattedMessages]);

  const handleSend = async () => {
    const currentPrompt = prompt.trim();

    // Prevent empty messages.
    if (!currentPrompt) return;

    /*
     * A new prompt should always move
     * the conversation to the latest message.
     */
    shouldAutoScrollRef.current = true;
    forceScrollRef.current = true;

    // Clear the input immediately.
    setPrompt("");

    await sendMessage({
      text: currentPrompt,
    });
  };

  /*
   * Convert AI SDK status into our UI states:
   *
   * submitted -> Thinking...
   * streaming -> Writing...
   * ready/error -> nothing
   */
  const typingStatus =
    status === "submitted"
      ? "thinking"
      : status === "streaming"
        ? "writing"
        : null;

  return (
    <section className="chat-shell">
      <Header />

      <div
        ref={messagesContainerRef}
        className="messages"
        onScroll={handleScroll}
      >
        {formattedMessages.length === 0 ? (
          <EmptyState onSuggestionClick={setPrompt} />
        ) : (
          <MessageList
            messages={formattedMessages}
            status={typingStatus}
          />
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