import Logo from "./Logo";
export default function Header() {
  return (
    <header className="header">
      <Logo />

      <div className="status">
        <span className="status-dot"></span>
        <span>Powered by A24</span>
      </div>
    </header>
  );
}