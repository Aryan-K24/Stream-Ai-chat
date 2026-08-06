import Avatar from "./Avatar";
import Timestamp from "./Timestamp";

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

        <p>{message}</p>

        <Timestamp time={time} />

      </div>

    </div>
  );
}