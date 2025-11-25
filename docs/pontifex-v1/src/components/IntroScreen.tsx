import { useState, useEffect } from "react";

export function IntroScreen({ onContinue }: { onContinue: () => void }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    // Show prompt after a delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Blinking cursor
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Listen for any key press to continue
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showPrompt) {
        e.preventDefault();
        onContinue();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showPrompt, onContinue]);

  const handleClick = () => {
    if (showPrompt) {
      onContinue();
    }
  };

  return (
    <div 
      className="h-full flex flex-col items-center justify-center text-green-500 font-mono cursor-pointer"
      onClick={handleClick}
    >
      <pre className="text-2xl mb-8 whitespace-pre">
{`
 ██████╗  ██████╗ ███╗   ██╗████████╗██╗███████╗███████╗██╗  ██╗
 ██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██║██╔════╝██╔════╝╚██╗██╔╝
 ██████╔╝██║   ██║██╔██╗ ██║   ██║   ██║█████╗  █████╗   ╚███╔╝ 
 ██╔═══╝ ██║   ██║██║╚██╗██║   ██║   ██║██╔══╝  ██╔══╝   ██╔██╗ 
 ██║     ╚██████╔╝██║ ╚████║   ██║   ██║██║     ███████╗██╔╝ ██╗
 ╚═╝      ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝
`}
      </pre>
      
      {/* Reserve space for button to prevent layout shift */}
      <div className="text-center h-[60px] flex items-center justify-center">
        {showPrompt && (
          <button
            onClick={handleClick}
            className="px-8 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors text-lg font-bold animate-pulse-slow"
          >
            [ START ]
          </button>
        )}
      </div>
    </div>
  );
}