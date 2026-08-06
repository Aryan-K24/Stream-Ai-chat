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
            onSend();
          }
        }}
      />

      <div className="input-actions">
        <button type="button">📎</button>

        <button type="button">🎤</button>

        <button
          type="button"
          className="send-btn"
          onClick={onSend}
        >
          ➜
        </button>
      </div>
    </div>
  );
}