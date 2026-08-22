type TypingIndicatorProps = {
  status: "thinking" | "writing";
};

export default function TypingIndicator({
  status,
}: TypingIndicatorProps) {
  const isThinking = status === "thinking";

  return (
    <div className="typing">
      <div className="typing-content">
        <span className="typing-icon">
          {isThinking ? "✨" : "✍️"}
        </span>

        <span className="typing-text">
          {isThinking ? "Thinking..." : "Writing..."}
        </span>

        <span className="typing-dots">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}