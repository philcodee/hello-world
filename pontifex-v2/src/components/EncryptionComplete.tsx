import { useState } from 'react';
import { formatPlaintext } from '../utils/cipher';

interface EncryptionCompleteProps {
  plaintext: string;
  ciphertext: string;
  onNewEncryption: () => void;
  onBackToKeystream: () => void;
}

export function EncryptionComplete({ 
  plaintext, 
  ciphertext, 
  onNewEncryption, 
  onBackToKeystream 
}: EncryptionCompleteProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ciphertext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatted = formatPlaintext(plaintext);

  return (
    <div className="text-green-500 font-mono text-sm leading-relaxed w-full h-full flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Success animation */}
        <div className="text-center mb-8 animate-pulse">
          <div className="text-6xl mb-4">[SUCCESS]</div>
          <div className="text-2xl text-green-400">ENCRYPTION COMPLETE</div>
        </div>

        {/* Results box */}
        <div className="border-2 border-green-500 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 text-black px-6 py-3">
            <div className="text-lg">Encryption Results</div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 bg-green-500/5">
            {/* Original plaintext */}
            <div>
              <div className="text-xs opacity-75 mb-2 uppercase">Original Message:</div>
              <div className="bg-black border border-green-500/50 p-4 rounded">
                <div className="text-green-400">{plaintext}</div>
              </div>
            </div>

            {/* Formatted plaintext */}
            <div>
              <div className="text-xs opacity-75 mb-2 uppercase">Formatted Plaintext:</div>
              <div className="bg-black border border-green-500/50 p-4 rounded">
                <div className="text-green-400 font-mono tracking-wider">
                  {formatted.match(/.{1,5}/g)?.join(' ')}
                </div>
              </div>
            </div>

            {/* Arrow indicator */}
            <div className="text-center text-3xl text-cyan-400">
              ↓
            </div>

            {/* Ciphertext */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs opacity-75 uppercase">Encrypted Ciphertext:</div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs"
                >
                  {copied ? 'COPIED!' : '[ COPY ]'}
                </button>
              </div>
              <div className="bg-black border-2 border-cyan-500 p-4 rounded">
                <div className="text-cyan-400 text-xl font-mono tracking-wider">
                  {ciphertext}
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="border border-yellow-500/50 bg-yellow-500/5 p-4 rounded">
              <div className="text-yellow-400 text-xs mb-2">TRANSMISSION INSTRUCTIONS</div>
              <div className="text-xs opacity-75 space-y-1">
                <div>• Send this ciphertext to your recipient</div>
                <div>• Recipient needs the same deck in the same order</div>
                <div>• They will use DECRYPT mode to recover the message</div>
                <div>• Never reuse the same deck order for multiple messages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onNewEncryption}
            className="flex-1 px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            [ ENCRYPT NEW MESSAGE ]
          </button>
          <button
            onClick={onBackToKeystream}
            className="flex-1 px-6 py-3 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors"
          >
            [ BACK TO KEYSTREAM ]
          </button>
        </div>
      </div>
    </div>
  );
}