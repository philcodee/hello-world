import { useState } from 'react';
import { EncryptMode } from './EncryptMode';
import { TerminalHeader } from './TerminalHeader';

export function EncryptDemo() {
  const [step, setStep] = useState<'input' | 'keystream'>('input');
  const [plaintext, setPlaintext] = useState('');
  const [requiredLength, setRequiredLength] = useState(0);

  const handleContinue = (text: string, charCount: number) => {
    setPlaintext(text);
    setRequiredLength(charCount);
    setStep('keystream');
  };

  const handleRestart = () => {
    setStep('input');
    setPlaintext('');
    setRequiredLength(0);
  };

  return (
    <div className="w-full max-w-[1600px] h-[90vh] border-2 border-green-500 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 flex flex-col">
      <TerminalHeader onRestart={handleRestart} showRestart={true} />
      <div className="bg-black flex-1 overflow-hidden">
        {step === 'input' && (
          <EncryptMode onContinue={handleContinue} />
        )}
        {step === 'keystream' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-green-500 font-mono text-center space-y-4">
              <div className="text-2xl">KEYSTREAM GENERATION</div>
              <div className="text-sm opacity-70">
                Plaintext: {plaintext}
              </div>
              <div className="text-sm opacity-70">
                Required keystream length: {requiredLength}
              </div>
              <div className="mt-8 text-xs opacity-50">
                (This would integrate with GameplayCanvas for keystream generation)
              </div>
              <button
                onClick={handleRestart}
                className="mt-4 px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
              >
                [ BACK TO INPUT ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
