type ChatInputProps = {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onSend: () => void;
};

export default function ChatInput({
  prompt,
  setPrompt,
  onSend,
}: ChatInputProps) {
  const handleSend = () => {
    if (!prompt.trim()) return;
    onSend();
  };

  return (
    <div className="chat-input">
      <textarea
        rows={2}
        placeholder="Message StreamAI..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <div className="input-actions">
        <button
          type="button"
          aria-label="Attach file"
          onPointerUp={(e) => {
            e.preventDefault();
          }}
        >
          📎
        </button>

        <button
          type="button"
          aria-label="Voice input"
          onPointerUp={(e) => {
            e.preventDefault();
          }}
        >
          🎤
        </button>

        <button
          type="button"
          aria-label="Send message"
          className="send-btn"
          onPointerUp={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          ➜
        </button>
      </div>
    </div>
  );
}