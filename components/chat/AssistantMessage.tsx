import MessageBubble from "./MessageBubble";

type AssistantMessageProps = {
  message: string;
  time: string;
};

export default function AssistantMessage({
  message,
  time,
}: AssistantMessageProps) {
  return (
    <MessageBubble
      role="assistant"
      message={message}
      time={time}
    />
  );
}