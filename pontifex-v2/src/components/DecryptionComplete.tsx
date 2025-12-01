import { useState } from 'react';

interface DecryptionCompleteProps {
  ciphertext: string;
  plaintext: string;
  onNewDecryption: () => void;
  onBackToKeystream: () => void;
}

export function DecryptionComplete({ 
  ciphertext, 
  plaintext, 
  onNewDecryption,
  onBackToKeystream 
}: DecryptionCompleteProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(plaintext).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        fallbackCopy(plaintext);
      });
    } else {
      fallbackCopy(plaintext);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
    textarea.remove();
  };

  return (
    <div className="text-green-500 font-mono w-full h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl border-2 border-green-500 rounded-lg p-8 bg-black">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">DECRYPTION COMPLETE</div>
          <div className="h-px bg-green-500/50 w-1/2 mx-auto mt-4" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Original Ciphertext */}
          <div>
            <div className="text-sm opacity-75 mb-2">ORIGINAL CIPHERTEXT:</div>
            <div className="border border-green-500/30 bg-green-500/5 rounded p-4 font-mono text-sm">
              {ciphertext}
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="text-center text-2xl opacity-50">
            ↓
          </div>

          {/* Decrypted Plaintext */}
          <div>
            <div className="text-sm opacity-75 mb-2">DECRYPTED PLAINTEXT:</div>
            <div className="border-2 border-cyan-500 bg-cyan-500/10 rounded p-4 font-mono text-lg text-cyan-400">
              {plaintext}
            </div>
          </div>

          {/* Info box */}
          <div className="border border-yellow-500/50 bg-yellow-500/5 rounded p-4 text-xs">
            <div className="text-yellow-400 mb-2" style={{ fontWeight: 700 }}>NOTE:</div>
            <div className="opacity-75">
              The decrypted message may contain padding characters (X) added during the original encryption process.
              These can be safely removed from the end of the message.
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={handleCopy}
              className="px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
            >
              {copied ? '✓ COPIED!' : '[ COPY PLAINTEXT ]'}
            </button>
            <button
              onClick={onNewDecryption}
              className="px-6 py-3 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors"
            >
              [ DECRYPT ANOTHER ]
            </button>
            <button
              onClick={onBackToKeystream}
              className="px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
            >
              [ BACK TO KEYSTREAM ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
