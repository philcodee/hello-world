import { useState, useRef, useEffect } from "react";

export function TerminalInput({ onSubmit }: { onSubmit: (command: string) => void }) {
  const [command, setCommand] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Focus input on mount and keep focus
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setCommand("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <span className="text-green-500 font-mono text-sm">$</span>
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="bg-transparent text-green-500 font-mono text-sm outline-none w-full caret-transparent"
          autoFocus
        />
        <span
          className={`absolute left-0 top-0 pointer-events-none font-mono text-sm transition-opacity ${
            cursorVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ 
            left: `${command.length * 0.6}em`,
            color: '#22c55e'
          }}
        >
          ▊
        </span>
      </div>
    </form>
  );
}
