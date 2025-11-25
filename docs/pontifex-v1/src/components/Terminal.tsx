import { useState, useEffect } from "react";
import { IntroScreen } from "./IntroScreen";
import { TerminalHeader } from "./TerminalHeader";
import { GameplayCanvas } from "./GameplayCanvas";
import { TutorialFlow } from "./TutorialFlow";

export function Terminal() {
  const [showIntro, setShowIntro] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showGameplay, setShowGameplay] = useState(true);

  // Listen for tutorial trigger from help button
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#tutorial') {
        setShowTutorial(true);
        setShowGameplay(false);
        // Clear the hash
        window.history.replaceState(null, '', ' ');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleRestart = () => {
    setShowIntro(true);
    setShowTutorial(false);
    setShowGameplay(false);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowGameplay(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setShowGameplay(true);
  };

  if (showIntro) {
    return (
      <div className="w-full max-w-[1600px] h-[90vh] border-2 border-green-500 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 flex flex-col">
        <TerminalHeader onRestart={handleRestart} showRestart={false} />
        <div className="bg-black p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-black">
          <IntroScreen onContinue={handleIntroComplete} />
        </div>
      </div>
    );
  }

  if (showTutorial) {
    return (
      <div className="w-full max-w-[1600px] h-[90vh] border-2 border-green-500 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 flex flex-col">
        <TerminalHeader onRestart={handleRestart} showRestart={true} />
        <div className="bg-black p-6 flex-1 overflow-hidden">
          <TutorialFlow onComplete={handleTutorialComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] h-[90vh] border-2 border-green-500 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 flex flex-col">
      <TerminalHeader onRestart={handleRestart} showRestart={true} />
      <div className="bg-black p-6 flex-1 overflow-hidden">
        <GameplayCanvas />
      </div>
    </div>
  );
}