import MessageBubble from "./MessageBubble";

type UserMessageProps = {
  message: string;
  time: string;
};

export default function UserMessage({
  message,
  time,
}: UserMessageProps) {
  return (
    <MessageBubble
      role="user"
      message={message}
      time={time}
    />
  );
}