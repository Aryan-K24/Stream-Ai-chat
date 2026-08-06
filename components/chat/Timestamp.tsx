type TimestampProps = {
  time: string;
};

export default function Timestamp({
  time,
}: TimestampProps) {
  return (
    <span className="timestamp">
      {time}
    </span>
  );
}