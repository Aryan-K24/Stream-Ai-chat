"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-error">
      <div className="page-error-card">
        <div className="page-error-icon">⚠️</div>

        <h1>Something went wrong</h1>

        <p>
          StreamAI ran into an unexpected problem.
          Please try again.
        </p>

        <button
          type="button"
          className="retry-btn"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}