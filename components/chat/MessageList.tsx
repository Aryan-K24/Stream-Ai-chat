import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import TypingIndicator from "./TypingIndicator";

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type MessageListProps = {
  messages: Message[];
  isTyping: boolean;
};

export default function MessageList({
  messages,
  isTyping,
}: MessageListProps) {
  return (
    <div className="message-list">
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage
            key={message.id}
            message={message.content}
            time={message.createdAt}
          />
        ) : (
          <AssistantMessage
            key={message.id}
            message={message.content}
            time={message.createdAt}
          />
        )
      )}

      {isTyping && <TypingIndicator />}
    </div>
  );
}