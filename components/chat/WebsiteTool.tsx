"use client";

import type { WebsiteMetadata } from "@/lib/tools/analyzeWebsite";
import styles from "./WebsiteTool.module.css";

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

export type WebsiteToolPart = {
  type: "tool-analyzeWebsite";
  toolCallId: string;
  state: ToolState;
  input?: { url: string };
  output?: WebsiteMetadata;
  errorText?: string;
};

function hostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function WebsiteTool({ part }: { part: WebsiteToolPart }) {
  if (part.state === "input-streaming") {
    return (
      <div className={`${styles.toolCard} ${styles.toolCardStreaming}`}  aria-live="polite">
        <div className={`${styles.toolIcon} ${styles.toolIconBlue}`} >⌁</div>
        <div className={styles.toolCardCopy}>
          <span className={styles.toolEyebrow}>TOOL · ANALYZE WEBSITE</span>
          <strong>Preparing website analysis</strong>
          <span className={styles.toolMuted}>Receiving the webpage URL…</span>
        </div>
        <div className={styles.toolPulse} aria-hidden="true" />
      </div>
    );
  }

  if (part.state === "input-available") {
    const url = part.input?.url ?? "Waiting for URL";

    return (
      <div className={`${styles.toolCard} ${styles.toolCardRunning}`}  aria-live="polite">
        <div className={`${styles.toolIcon} ${styles.toolIconBlue}`} >↗</div>
        <div className={styles.toolCardCopy}>
          <span className={styles.toolEyebrow}>TOOL · ANALYZE WEBSITE</span>
          <strong>Inspecting webpage</strong>
          <span className={styles.toolUrl}>{url}</span>
        </div>
        <div className={styles.toolSpinner} aria-hidden="true" />
      </div>
    );
  }

  if (part.state === "output-error") {
    return (
      <div className={`${styles.toolCard} ${styles.toolCardError}`}  role="alert">
        <div className={`${styles.toolIcon} ${styles.toolIconRed}`} >!</div>
        <div className={styles.toolCardCopy}>
          <span className={styles.toolEyebrow}>TOOL · ANALYZE WEBSITE</span>
          <strong>Website analysis failed</strong>
          <span className={styles.toolMuted}>
            {part.errorText || "The webpage could not be analyzed."}
          </span>
          {part.input?.url && (
            <span className={styles.toolUrl}>{part.input.url}</span>
          )}
        </div>
      </div>
    );
  }

  const result = part.output;
  if (!result) return null;

  return (
    <div className={styles.toolResultCard}>
      <div className={styles.toolResultTopline}>
        <div>
          <span className={styles.toolEyebrow}>TOOL RESULT · WEBSITE ANALYSIS</span>
          <h3>{result.title || "Untitled webpage"}</h3>
          <span className={styles.toolDomain}>{hostname(result.url)}</span>
        </div>
        <span className={styles.toolSuccessBadge}>✓ Complete</span>
      </div>

      <div className={styles.toolResultGrid}>
        <div>
          <span className={styles.toolFieldLabel}>Description</span>
          <p>{result.description || "No meta description found."}</p>
        </div>
        <div>
          <span className={styles.toolFieldLabel}>HTTP status</span>
          <p>{result.statusCode}</p>
        </div>
      </div>

      {result.image && (
        <div className={styles.toolImageRow}>
          <span className={styles.toolFieldLabel}>Social preview</span>
          <a href={result.image} target="_blank" rel="noreferrer">
            View image ↗
          </a>
        </div>
      )}

      <div className={styles.toolResultUrl}>
        <span>{result.url}</span>
      </div>
    </div>
  );
}
