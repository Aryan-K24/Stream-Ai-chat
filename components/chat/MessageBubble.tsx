import Avatar from "./Avatar";
import Timestamp from "./Timestamp";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  role: "user" | "assistant";
  message: string;
  time: string;
};

export default function MessageBubble({
  role,
  message,
  time,
}: Props) {
  return (
    <div className={`message ${role}`}>
      <Avatar role={role} />

      <div className="bubble">
        {role === "assistant" ? (
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message}
            </ReactMarkdown>
          </div>
        ) : (
          <p>{message}</p>
        )}

        <Timestamp time={time} />
      </div>
    </div>
  );
}