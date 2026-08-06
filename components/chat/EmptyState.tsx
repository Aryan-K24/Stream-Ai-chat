type EmptyStateProps = {
  onSuggestionClick: (text: string) => void;
};

export default function EmptyState({
  onSuggestionClick,
}: EmptyStateProps) {
  const suggestions = [
    "Explain React Context",
    "Write a Cover Letter",
    "Plan my Japan Trip",
    "Build a REST API",
  ];

  return (
    <div className="empty-state">

      <div className="welcome-icon">
        ✨
      </div>

      <h2>Welcome to StreamAI</h2>

      <p>
        Ask anything.
        Generate ideas.
        Write code.
        Solve problems.
      </p>

      <div className="suggestions">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

    </div>
  );
}