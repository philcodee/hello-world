import { useState, useEffect } from 'react';
import { formatPlaintext } from '../utils/cipher';

interface EncryptModeProps {
  onContinue: (plaintext: string, charCount: number) => void;
}

export function EncryptMode({ onContinue }: EncryptModeProps) {
  const [userInput, setUserInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showModal) {
      // Modal controls
      if (e.key === ' ') {
        e.preventDefault();
        onContinue(userInput, charCount);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowModal(false);
      }
      return;
    }

    // Normal input mode
    if (e.key === 'Enter') {
      e.preventDefault();
      if (userInput.trim().length > 0) {
        const formatted = formatPlaintext(userInput);
        setCharCount(formatted.length);
        setShowModal(true);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Convert to uppercase and allow any input
    setUserInput(e.target.value.toUpperCase());
  };

  // Word wrap calculation for display
  const displayLines = () => {
    if (!userInput) return [];
    
    const words = userInput.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxCharsPerLine = 60; // Approximate

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length > maxCharsPerLine) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const lines = displayLines();

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center relative bg-black p-8"
    >
      {/* Main Content */}
      <div className="w-full max-w-4xl">
        {/* Header */}
        <h1 className="text-green-500 font-mono text-center mb-4" style={{ fontSize: '32px' }}>
          ENCRYPT: TYPE PLAINTEXT
        </h1>

        {/* Separator */}
        <div className="border-t-2 border-green-500 mb-8" />

        {/* Prompt */}
        <p className="text-green-500 font-mono mb-4">
          Type the message you would like to encrypt...
        </p>

        {/* Input Box */}
        <div className="border border-green-500 rounded p-4 min-h-[200px] relative bg-black">
          {/* Hidden textarea for actual input */}
          <textarea
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 opacity-0 w-full h-full resize-none"
            autoFocus
            spellCheck={false}
          />
          
          {/* Display area with word wrapping */}
          <div className="font-mono text-green-500 text-lg leading-relaxed">
            {lines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            {/* Cursor */}
            {!showModal && (
              <span className={`inline-block w-2 h-5 bg-green-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
            )}
          </div>
        </div>

        {/* Footer hint */}
        {!showModal && (
          <div className="text-center mt-4 text-green-500/70 font-mono text-sm">
            [Press ENTER when ready to continue]
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="border-4 border-green-500 bg-black rounded-lg p-8 max-w-2xl w-full mx-4">
            {/* Double border effect */}
            <div className="border border-green-500 rounded p-6">
              {/* Title */}
              <h2 className="text-green-500 font-mono text-center mb-4" style={{ fontSize: '24px' }}>
                KEYSTREAM REQUIRED
              </h2>

              {/* Separator */}
              <div className="border-t border-green-500 mb-6" />

              {/* Content */}
              <div className="text-center space-y-4">
                <p className="text-green-500 font-mono">
                  Your message contains:
                </p>

                <p className="text-green-500 font-mono" style={{ fontSize: '20px' }}>
                  {charCount} characters
                </p>

                <p className="text-green-500 font-mono text-sm">
                  (after removing spaces and padding)
                </p>

                <div className="pt-4 space-y-2">
                  <p className="text-green-500 font-mono text-sm">
                    You will need {charCount} keystream numbers
                  </p>
                  <p className="text-green-500 font-mono text-sm">
                    to be added (modulo 26) to your plaintext.
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-8 space-y-2 text-center">
                <p className="text-green-500/80 font-mono text-xs">
                  [Press SPACE to continue to keystream generation]
                </p>
                <p className="text-green-500/80 font-mono text-xs">
                  [Press ESC to edit message]
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}