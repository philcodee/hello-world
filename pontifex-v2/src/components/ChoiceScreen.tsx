interface ChoiceScreenProps {
  onEncryptChoice: () => void;
  onDecryptChoice: () => void;
}

export function ChoiceScreen({ onEncryptChoice, onDecryptChoice }: ChoiceScreenProps) {
  return (
    <div className="h-full flex items-center justify-center p-8 font-mono">
      <div className="max-w-4xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl text-green-500">
            ╔═══════════════════════════════════════╗
            <br />
            ║ &nbsp; &nbsp; &nbsp; &nbsp;PONTIFEX CIPHER &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;║
            <br />
            ╚═══════════════════════════════════════╝
          </h1>
          <p className="text-green-500 text-sm opacity-75">
            Select your operation mode
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Encrypt Card */}
          <button
            onClick={onEncryptChoice}
            className="border-2 border-green-500 bg-green-500/5 hover:bg-green-500/10 p-8 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 text-left group"
          >
            <div className="space-y-4">
              <div className="text-3xl text-green-400 group-hover:text-green-300 transition-colors">
                ENCRYPT
              </div>
              <div className="text-green-500 text-sm space-y-2 leading-relaxed">
                <p>Convert plaintext into ciphertext</p>
                <div className="opacity-75 text-xs space-y-1 mt-4">
                  <p>→ Enter your plaintext message</p>
                  <p>→ Shuffle the deck (create key)</p>
                  <p>→ Generate keystream values</p>
                  <p>→ Add modulo 26 to encrypt</p>
                </div>
              </div>
              <div className="text-green-400 text-sm pt-4 border-t border-green-500/30">
                [ CLICK TO START ENCRYPTING ]
              </div>
            </div>
          </button>

          {/* Decrypt Card */}
          <button
            onClick={onDecryptChoice}
            className="border-2 border-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 p-8 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 text-left group"
          >
            <div className="space-y-4">
              <div className="text-3xl text-cyan-400 group-hover:text-cyan-300 transition-colors">
                DECRYPT
              </div>
              <div className="text-green-500 text-sm space-y-2 leading-relaxed">
                <p>Convert ciphertext into plaintext</p>
                <div className="opacity-75 text-xs space-y-1 mt-4">
                  <p>→ Receive encrypted ciphertext</p>
                  <p>→ Pre-keyed deck (matches sender)</p>
                  <p>→ Generate keystream values</p>
                  <p>→ Subtract modulo 26 to decrypt</p>
                </div>
              </div>
              <div className="text-cyan-400 text-sm pt-4 border-t border-cyan-500/30">
                [ CLICK TO START DECRYPTING ]
              </div>
            </div>
          </button>
        </div>

        {/* Info Footer */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-green-500 text-xs opacity-50">
            The Pontifex cipher uses a deck of cards to generate keystream values
          </p>
          <p className="text-yellow-400 text-xs">
            Need help? Click [HELP] in the top navigation
          </p>
        </div>
      </div>
    </div>
  );
}