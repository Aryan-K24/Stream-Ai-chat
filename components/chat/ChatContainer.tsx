"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

import Header from "../layout/Header";
import MessageList, { Message } from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";

export default function ChatContainer() {
  const [prompt, setPrompt] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Keeps the chat following the response when the user is near the bottom.
  const shouldAutoScrollRef = useRef(true);

  // Forces the chat to move to the newest content after sending/retrying.
  const forceScrollRef = useRef(false);

  // Stores only the most recently submitted prompt.
  // This is what the Retry button will retry.
  const lastPromptRef = useRef("");

  const { messages, sendMessage, status, error } = useChat();

  /*
   * Convert AI SDK messages into the format
   * expected by MessageList.
   */
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

  /*
   * Detect whether the user is close to the bottom.
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
   * Keep the conversation scrolled to the latest content
   * when appropriate.
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
  }, [formattedMessages, error]);

  /*
   * Send a prompt to the AI.
   *
   * Shared by:
   * - normal Send
   * - Retry
   */
  const sendPrompt = async (text: string) => {
    const currentPrompt = text.trim();

    if (!currentPrompt) return;

    // Prevent duplicate requests while one is running.
    if (status === "submitted" || status === "streaming") {
      return;
    }

    shouldAutoScrollRef.current = true;
    forceScrollRef.current = true;

    // Remember this prompt for Retry.
    lastPromptRef.current = currentPrompt;

    await sendMessage({
      text: currentPrompt,
    });
  };

  /*
   * Normal Send button / Enter key.
   */
  const handleSend = async () => {
    const currentPrompt = prompt.trim();

    if (!currentPrompt) return;

    // Clear the input immediately.
    setPrompt("");

    await sendPrompt(currentPrompt);
  };

  /*
   * Retry only the most recently failed prompt.
   */
  const handleRetry = async () => {
    const failedPrompt = lastPromptRef.current;

    if (!failedPrompt) return;

    await sendPrompt(failedPrompt);
  };

  /*
   * Map AI SDK states to our UI states.
   */
  const typingStatus =
    status === "submitted"
      ? "thinking"
      : status === "streaming"
        ? "writing"
        : null;

  const isRequestRunning =
    status === "submitted" ||
    status === "streaming";

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
              <div className="chat-error-icon">
                ⚠️
              </div>

              <div className="chat-error-text">
                <strong>Something went wrong</strong>

                <span>
                  Your last response could not be completed.
                </span>
              </div>

              <button
                type="button"
                className="retry-btn"
                onClick={handleRetry}
                disabled={
                  isRequestRunning ||
                  !lastPromptRef.current
                }
              >
                {isRequestRunning
                  ? "Retrying..."
                  : "Retry"}
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