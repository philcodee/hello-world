import { useState, useEffect } from 'react';

interface DecryptModeProps {
  onContinue: (ciphertext: string, charCount: number) => void;
}

export function DecryptMode({ onContinue }: DecryptModeProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Example encrypted message received
  const receivedMessage = "OSKJJ JGTMW T";
  const fullMessage = receivedMessage.replace(/\s/g, '');
  const charCount = fullMessage.length;

  // Typing animation for received message
  useEffect(() => {
    if (showMessage && messageIndex < receivedMessage.length) {
      const timer = setTimeout(() => {
        setMessageIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showMessage, messageIndex, receivedMessage.length]);

  // Auto-start message display on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (messageIndex >= receivedMessage.length) {
        onContinue(receivedMessage, charCount);
      }
    }
  };

  const displayedMessage = receivedMessage.substring(0, messageIndex);
  const isDone = messageIndex >= receivedMessage.length;

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center relative bg-black p-8"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main Content */}
      <div className="w-full max-w-4xl">
        {/* Header */}
        <h1 className="text-green-500 font-mono text-center mb-4" style={{ fontSize: '32px' }}>
          DECRYPT: RECEIVED MESSAGE
        </h1>

        {/* Separator */}
        <div className="border-t-2 border-green-500 mb-8" />

        {/* Info */}
        <div className="border border-cyan-500/50 bg-cyan-500/5 rounded p-4 mb-6">
          <div className="text-cyan-400 font-mono text-sm mb-2">INCOMING TRANSMISSION</div>
          <div className="text-green-500 font-mono text-xs opacity-75 space-y-1">
            <div>• You have received an encrypted message</div>
            <div>• Your deck must be keyed to match the sender's deck</div>
            <div>• Generate keystream from your keyed deck to decrypt</div>
          </div>
        </div>

        {/* Prompt */}
        <p className="text-green-500 font-mono mb-4">
          Encrypted message received:
        </p>

        {/* Message Display */}
        <div className="border-2 border-green-500 rounded p-6 min-h-[150px] bg-black flex items-center justify-center">
          <div className="font-mono text-green-500 text-2xl tracking-wider">
            {displayedMessage}
            {!isDone && <span className="animate-pulse">▮</span>}
          </div>
        </div>

        {/* Message Info */}
        {isDone && (
          <div className="mt-6 space-y-4">
            <div className="border border-yellow-500/50 bg-yellow-500/5 rounded p-4">
              <div className="text-yellow-400 font-mono text-sm mb-2">MESSAGE ANALYSIS</div>
              <div className="text-green-500 font-mono text-sm space-y-1">
                <div>• Characters (with spaces): {receivedMessage.length}</div>
                <div>• Characters (without spaces): {charCount}</div>
                <div>• Keystream numbers required: {charCount}</div>
              </div>
            </div>

            <div className="border border-green-500/50 bg-green-500/5 rounded p-4">
              <div className="text-green-400 font-mono text-sm mb-2">NEXT STEP</div>
              <div className="text-green-500 font-mono text-xs opacity-75">
                You will need to use your keyed deck (matching the sender's deck order) to generate {charCount} keystream numbers.
                The deck has already been shuffled/keyed by the sender - you must use the same deck arrangement.
              </div>
            </div>
          </div>
        )}

        {/* Footer hint */}
        {isDone && (
          <div className="text-center mt-6 text-green-500/70 font-mono text-sm animate-pulse">
            [Press SPACE or ENTER to continue to keystream generation]
          </div>
        )}
      </div>
    </div>
  );
}