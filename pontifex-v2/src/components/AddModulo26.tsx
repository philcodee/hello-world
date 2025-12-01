import { useState, useEffect } from 'react';
import { formatPlaintext, textToNumbers, numbersToText, addModulo26 } from '../utils/cipher';

interface AddModulo26Props {
  plaintext: string;
  keystream: number[];
  onBack: () => void;
  onComplete: (ciphertext: string) => void;
}

export function AddModulo26({ plaintext, keystream, onBack, onComplete }: AddModulo26Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step

  // Calculate all values
  const formatted = formatPlaintext(plaintext);
  const plaintextNumbers = textToNumbers(formatted);
  const ciphertextNumbers = plaintextNumbers.map((p, i) => addModulo26(p, keystream[i]));
  const ciphertext = numbersToText(ciphertextNumbers);

  // Format ciphertext into 5-letter groups
  const formattedCiphertext = ciphertext.match(/.{1,5}/g)?.join(' ') || ciphertext;

  // Auto-advance
  useEffect(() => {
    if (!autoPlay) return;
    
    if (currentIndex < plaintextNumbers.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setAutoPlay(false);
    }
  }, [autoPlay, currentIndex, plaintextNumbers.length, speed]);

  const handleNext = () => {
    if (currentIndex < plaintextNumbers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleToggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setAutoPlay(false);
  };

  return (
    <div className="text-green-500 font-mono text-sm leading-relaxed w-full h-full flex flex-col overflow-hidden p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-500 flex-shrink-0">
        <h2 className="text-xl">ENCRYPTION: ADD MODULO 26</h2>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            [ ← BACK TO KEYSTREAM ]
          </button>
        </div>
      </div>

         {/* Instructions */}
      {/* <div className="mb-6 p-4 border border-cyan-500 bg-cyan-500/5 rounded flex-shrink-0">
        <div className="text-cyan-400 mb-2">📊 ENCRYPTION PROCESS</div>
        <div className="text-xs space-y-1 opacity-75">
          <div>• Convert plaintext letters to numbers (A=1, B=2, ..., Z=26)</div>
          <div>• Add corresponding keystream number</div>
          <div>• Apply modulo 26 (if result &gt; 26, subtract 26)</div>
          <div>• Convert result back to letters</div>
        </div>
      </div>
      */}

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Progress */}
        <div className="border border-yellow-500 p-4 rounded">
          <div className="flex justify-between items-center mb-3">
            <div className="text-yellow-400">
              Step {currentIndex + 1} of {plaintextNumbers.length}
            </div>
            <div className="text-xs opacity-75">
              {Math.round((currentIndex + 1) / plaintextNumbers.length * 100)}% complete
            </div>
          </div>
          <div className="w-full bg-black border border-yellow-500 h-2 rounded overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / plaintextNumbers.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current calculation */}
        <div className="border-2 border-green-500 p-6 rounded bg-green-500/5">
          <div className="text-center space-y-4">
            <div className="text-lg">
              Position {currentIndex + 1}: 
              <span className="ml-2 text-cyan-400">{formatted[currentIndex]}</span>
            </div>
            
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center">
                <span className="opacity-75">Plaintext letter:</span>
                <span className="text-cyan-400">{formatted[currentIndex]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-75">Letter → Number:</span>
                <span className="text-green-400">{plaintextNumbers[currentIndex]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-75">Keystream value:</span>
                <span className="text-yellow-400">{keystream[currentIndex]}</span>
              </div>
              
              <div className="border-t border-green-500/30 my-2" />
              
              <div className="flex justify-between items-center">
                <span className="opacity-75">Addition:</span>
                <span>{plaintextNumbers[currentIndex]} + {keystream[currentIndex]} = {plaintextNumbers[currentIndex] + keystream[currentIndex]}</span>
              </div>
              
              {plaintextNumbers[currentIndex] + keystream[currentIndex] > 26 && (
                <div className="flex justify-between items-center text-orange-400">
                  <span className="opacity-75">Modulo 26:</span>
                  <span>{plaintextNumbers[currentIndex] + keystream[currentIndex]} - 26 = {ciphertextNumbers[currentIndex]}</span>
                </div>
              )}
              
              <div className="border-t border-green-500/30 my-2" />
              
              <div className="flex justify-between items-center text-lg">
                <span className="opacity-75">Result:</span>
                <span className="text-green-400">{ciphertextNumbers[currentIndex]}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="opacity-75">Ciphertext letter:</span>
                <span className="text-green-400" style={{ fontWeight: 700, fontSize: '24px' }}>{ciphertext[currentIndex]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complete ciphertext so far */}
        <div className="border border-green-500 p-4 rounded">
          <div className="mb-2 text-xs opacity-75">CIPHERTEXT (so far):</div>
          <div className="font-mono text-lg tracking-wider">
            {ciphertext.substring(0, currentIndex + 1).match(/.{1,5}/g)?.join(' ') || ciphertext.substring(0, currentIndex + 1)}
            <span className="opacity-30">{ciphertext.substring(currentIndex + 1)}</span>
          </div>
        </div>

        {/* Full results (when complete) */}
        {currentIndex === plaintextNumbers.length - 1 && (
          <div className="border-2 border-cyan-500 p-6 rounded bg-cyan-500/10 space-y-4">
            <div className="text-center text-cyan-400 text-lg mb-4">
              ✓ ENCRYPTION COMPLETE
            </div>
            
            <div>
              <div className="text-xs opacity-75 mb-1">PLAINTEXT:</div>
              <div className="font-mono bg-black border border-green-500 p-3 rounded">
                {plaintext}
              </div>
            </div>
            
            <div>
              <div className="text-xs opacity-75 mb-1">FORMATTED PLAINTEXT:</div>
              <div className="font-mono bg-black border border-green-500 p-3 rounded">
                {formatted.match(/.{1,5}/g)?.join(' ')}
              </div>
            </div>
            
            <div>
              <div className="text-xs opacity-75 mb-1">CIPHERTEXT:</div>
              <div className="font-mono text-lg bg-black border border-cyan-500 p-3 rounded text-cyan-400">
                {formattedCiphertext}
              </div>
            </div>

            <button
              onClick={() => onComplete(formattedCiphertext)}
              className="w-full px-4 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors mt-4"
            >
              [ CONTINUE → ]
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 pt-4 border-t border-green-500 flex-shrink-0">
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              [ ← PREV ]
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === plaintextNumbers.length - 1}
              className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              [ NEXT → ]
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors text-xs"
            >
              [ RESET ]
            </button>
            <button
              onClick={handleToggleAutoPlay}
              className={`px-4 py-2 border transition-colors ${
                autoPlay 
                  ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black' 
                  : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black'
              }`}
            >
              [ {autoPlay ? 'PAUSE' : 'AUTO PLAY'} ]
            </button>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="px-3 py-2 bg-black border border-green-500 text-green-500 text-xs"
            >
              <option value={1000}>Slow</option>
              <option value={500}>Normal</option>
              <option value={250}>Fast</option>
              <option value={100}>Very Fast</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
