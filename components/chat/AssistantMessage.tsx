import MessageBubble from "./MessageBubble";
import WebsiteTool, { type WebsiteToolPart } from "./WebsiteTool";

type AssistantMessageProps = {
  message: string;
  time: string;
  toolParts?: WebsiteToolPart[];
};

export default function AssistantMessage({
  message,
  time,
  toolParts = [],
}: AssistantMessageProps) {
  return (
    <>
      {message.trim() && (
        <MessageBubble
          role="assistant"
          message={message}
          time={time}
        />
      )}
      {toolParts.map((part) => (
        <WebsiteTool key={part.toolCallId} part={part} />
      ))}
    </>
  );
}
