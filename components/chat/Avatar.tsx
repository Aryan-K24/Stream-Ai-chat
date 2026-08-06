type Props = {
  role: "user" | "assistant";
};

export default function Avatar({ role }: Props) {
  return (
    <div className={`avatar ${role}`}>
      {role === "assistant" ? "AI" : "U"}
    </div>
  );
}