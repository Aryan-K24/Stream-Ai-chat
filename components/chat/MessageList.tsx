import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import TypingIndicator from "./TypingIndicator";
import type { WebsiteToolPart } from "./WebsiteTool";

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  toolParts?: WebsiteToolPart[];
};

type MessageListProps = {
  messages: Message[];
  status: "thinking" | "writing" | null;
};

export default function MessageList({ messages, status }: MessageListProps) {
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
            toolParts={message.toolParts}
          />
        ),
      )}
      {status && <TypingIndicator status={status} />}
    </div>
  );
}
