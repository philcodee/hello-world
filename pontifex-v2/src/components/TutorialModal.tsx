import { useState } from "react";

interface TutorialModalProps {
  onClose: () => void;
  onStartTutorial: () => void;
}

type TutorialSection = 
  | 'menu'
  | 'about'
  | 'encryption'
  | 'decryption'
  | 'examples'
  | 'security';

export function TutorialModal({ onClose, onStartTutorial }: TutorialModalProps) {
  const [currentSection, setCurrentSection] = useState<TutorialSection>('menu');

  const renderMenu = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-2 text-green-400" style={{ fontWeight: 700 }}>PONTIFEX CIPHER TUTORIAL</h2>
        <p className="text-sm opacity-75">Select a topic to learn more</p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
        <button
          onClick={() => setCurrentSection('about')}
          className="p-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-left group"
        >
          <div className="text-lg mb-1" style={{ fontWeight: 700 }}>ABOUT THE CIPHER</div>
          <div className="text-xs opacity-75 group-hover:opacity-100">
            Learn what Pontifex is and how it works
          </div>
        </button>

        <button
          onClick={() => setCurrentSection('encryption')}
          className="p-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-left group"
        >
          <div className="text-lg mb-1" style={{ fontWeight: 700 }}>ENCRYPTION RULES</div>
          <div className="text-xs opacity-75 group-hover:opacity-100">
            How to encrypt plaintext messages
          </div>
        </button>

        <button
          onClick={() => setCurrentSection('decryption')}
          className="p-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-left group"
        >
          <div className="text-lg mb-1" style={{ fontWeight: 700 }}>DECRYPTION RULES</div>
          <div className="text-xs opacity-75 group-hover:opacity-100">
            How to decrypt ciphertext messages
          </div>
        </button>

        <button
          onClick={() => setCurrentSection('examples')}
          className="p-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-left group"
        >
          <div className="text-lg mb-1" style={{ fontWeight: 700 }}>COMPLETE EXAMPLES</div>
          <div className="text-xs opacity-75 group-hover:opacity-100">
            Step-by-step encryption and decryption walkthrough
          </div>
        </button>

        <button
          onClick={() => setCurrentSection('security')}
          className="p-4 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-left group"
        >
          <div className="text-lg mb-1" style={{ fontWeight: 700 }}>SECURITY NOTES</div>
          <div className="text-xs opacity-75 group-hover:opacity-100">
            Important security and key management tips
          </div>
        </button>

        <button
          onClick={onStartTutorial}
          className="p-4 border-2 border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500 hover:text-black transition-colors text-left group mt-4"
        >
          <div className="text-lg mb-1 text-cyan-400 group-hover:text-black" style={{ fontWeight: 700 }}>
            INTERACTIVE KEYSTREAM TUTORIAL
          </div>
          <div className="text-xs opacity-75 group-hover:opacity-100">
            Learn how to generate keystream values step-by-step
          </div>
        </button>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-4">
      <h2 className="text-2xl mb-4 text-green-400" style={{ fontWeight: 700 }}>ABOUT THE CIPHER</h2>
      
      <div className="space-y-3 text-sm">
        <p>
          The Pontifex cipher (also known as Solitaire) is an output-feedback mode 
          stream cipher designed to be implemented by hand using a deck of playing cards.
        </p>

        <div className="border border-green-500 p-4 rounded bg-green-500/5">
          <h3 className="mb-2 text-green-400" style={{ fontWeight: 700 }}>HOW IT WORKS</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>Generates a keystream of numbers between 1 and 26</li>
            <li>Each number corresponds to a letter (A=1, B=2... Z=26)</li>
            <li>Keystream is added to plaintext for encryption</li>
            <li>Keystream is subtracted from ciphertext for decryption</li>
          </ul>
        </div>

        <div className="border border-yellow-500 p-4 rounded bg-yellow-500/5">
          <h3 className="mb-2 text-yellow-400" style={{ fontWeight: 700 }}>WHY USE CARDS?</h3>
          <p>
            A deck of cards is a convenient source of randomness that doesn't 
            require computers or electronics. The order of the deck serves as 
            your secret key, making it perfect for secure communication in 
            situations where digital encryption is unavailable or compromised.
          </p>
        </div>
      </div>
    </div>
  );

  const renderEncryption = () => (
    <div className="space-y-4">
      <h2 className="text-2xl mb-4 text-green-400" style={{ fontWeight: 700 }}>ENCRYPTION RULES</h2>
      
      <div className="space-y-4 text-sm">
        <div className="border border-green-500 p-4 rounded">
          <h3 className="mb-3 text-green-400" style={{ fontWeight: 700 }}>STEP 1: PREPARE MESSAGE</h3>
          <ul className="space-y-1 list-disc list-inside ml-2">
            <li>Convert plaintext to uppercase letters only (A-Z)</li>
            <li>Remove spaces, punctuation, and numbers</li>
            <li>Group into blocks of 5 for readability (optional)</li>
          </ul>
          <div className="mt-3 p-2 bg-black/50 rounded font-mono text-xs">
            <div className="text-cyan-400">Example:</div>
            <div>"Hello, World!" → "HELLOWORLD" → "HELLO WORLD"</div>
          </div>
        </div>

        <div className="border border-green-500 p-4 rounded">
          <h3 className="mb-3 text-green-400" style={{ fontWeight: 700 }}>STEP 2: GENERATE KEYSTREAM</h3>
          <ul className="space-y-1 list-disc list-inside ml-2">
            <li>Generate one keystream value (1-26) for each plaintext letter</li>
            <li>Both sender and receiver must use identical deck order</li>
            <li>Use the interactive tutorial to learn keystream generation</li>
          </ul>
        </div>

        <div className="border border-green-500 p-4 rounded">
          <h3 className="mb-3 text-green-400" style={{ fontWeight: 700 }}>STEP 3: ENCRYPT EACH LETTER</h3>
          <div className="space-y-2">
            <p className="text-yellow-400" style={{ fontWeight: 700 }}>Formula:</p>
            <div className="p-3 bg-black/50 rounded font-mono">
              Ciphertext = (Plaintext + Keystream) mod 26
            </div>
            
            <p className="text-yellow-400 mt-3" style={{ fontWeight: 700 }}>Process:</p>
            <ol className="space-y-1 list-decimal list-inside ml-2">
              <li>Convert plaintext letter to number (A=1, B=2... Z=26)</li>
              <li>Add keystream value to plaintext value</li>
              <li>If sum {'>'} 26, subtract 26</li>
              <li>Convert result back to letter</li>
            </ol>

            <div className="mt-3 p-3 bg-black/50 rounded font-mono text-xs">
              <div className="text-cyan-400 mb-2">Example 1 (no wrap):</div>
              <div>D (4) + 11 = 15 → O</div>
              
              <div className="text-cyan-400 mt-3 mb-2">Example 2 (with wrap):</div>
              <div>W (23) + 8 = 31</div>
              <div>31 - 26 = 5 → E</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDecryption = () => (
    <div className="space-y-4">
      <h2 className="text-2xl mb-4 text-green-400" style={{ fontWeight: 700 }}>DECRYPTION RULES</h2>
      
      <div className="space-y-4 text-sm">
        <div className="border border-green-500 p-4 rounded">
          <h3 className="mb-3 text-green-400" style={{ fontWeight: 700 }}>STEP 1: PREPARE CIPHERTEXT</h3>
          <ul className="space-y-1 list-disc list-inside ml-2">
            <li>Ciphertext should be uppercase letters only</li>
            <li>Remove any spacing or formatting</li>
          </ul>
        </div>

        <div className="border border-green-500 p-4 rounded">
          <h3 className="mb-3 text-green-400" style={{ fontWeight: 700 }}>STEP 2: GENERATE KEYSTREAM</h3>
          <ul className="space-y-1 list-disc list-inside ml-2">
            <li>Use the SAME deck order as encryption</li>
            <li>Generate same number of keystream values as ciphertext letters</li>
          </ul>
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500 rounded text-xs">
            <span className="text-yellow-400" style={{ fontWeight: 700 }}>CRITICAL:</span> Deck order must be identical to encryption!
          </div>
        </div>

        <div className="border border-green-500 p-4 rounded">
          <h3 className="mb-3 text-green-400" style={{ fontWeight: 700 }}>STEP 3: DECRYPT EACH LETTER</h3>
          <div className="space-y-2">
            <p className="text-yellow-400" style={{ fontWeight: 700 }}>Formula:</p>
            <div className="p-3 bg-black/50 rounded font-mono">
              Plaintext = (Ciphertext - Keystream) mod 26
            </div>
            
            <p className="text-yellow-400 mt-3" style={{ fontWeight: 700 }}>Process:</p>
            <ol className="space-y-1 list-decimal list-inside ml-2">
              <li>Convert ciphertext letter to number (A=1, B=2... Z=26)</li>
              <li>Subtract keystream value from ciphertext value</li>
              <li>If result {'<'} 1, add 26</li>
              <li>Convert result back to letter</li>
            </ol>

            <div className="mt-3 p-3 bg-black/50 rounded font-mono text-xs">
              <div className="text-cyan-400 mb-2">Example 1 (no wrap):</div>
              <div>O (15) - 11 = 4 → D</div>
              
              <div className="text-cyan-400 mt-3 mb-2">Example 2 (with wrap):</div>
              <div>E (5) - 8 = -3</div>
              <div>-3 + 26 = 23 → W</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExamples = () => (
    <div className="space-y-4">
      <h2 className="text-2xl mb-4 text-green-400" style={{ fontWeight: 700 }}>COMPLETE EXAMPLES</h2>
      
      <div className="space-y-4 text-sm">
        <div className="border border-cyan-500 p-4 rounded bg-cyan-500/5">
          <h3 className="mb-3 text-cyan-400 text-lg" style={{ fontWeight: 700 }}>ENCRYPTION EXAMPLE</h3>
          
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="text-yellow-400 mb-1">Plaintext:</div>
              <div className="p-2 bg-black/50 rounded">HELLO</div>
            </div>

            <div>
              <div className="text-yellow-400 mb-1">Keystream (from deck):</div>
              <div className="p-2 bg-black/50 rounded">[12, 5, 18, 3, 9]</div>
            </div>

            <div>
              <div className="text-yellow-400 mb-1">Encryption process:</div>
              <div className="p-2 bg-black/50 rounded space-y-1">
                <div>H (8)  + 12 = 20 → T</div>
                <div>E (5)  + 5  = 10 → J</div>
                <div>L (12) + 18 = 30 - 26 = 4 → D</div>
                <div>L (12) + 3  = 15 → O</div>
                <div>O (15) + 9  = 24 → X</div>
              </div>
            </div>

            <div>
              <div className="text-green-400 mb-1" style={{ fontWeight: 700 }}>Ciphertext:</div>
              <div className="p-2 bg-green-500/10 border border-green-500 rounded text-lg">
                TJDOX
              </div>
            </div>
          </div>
        </div>

        <div className="border border-purple-500 p-4 rounded bg-purple-500/5">
          <h3 className="mb-3 text-purple-400 text-lg" style={{ fontWeight: 700 }}>DECRYPTION EXAMPLE</h3>
          
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="text-yellow-400 mb-1">Ciphertext:</div>
              <div className="p-2 bg-black/50 rounded">TJDOX</div>
            </div>

            <div>
              <div className="text-yellow-400 mb-1">Keystream (same deck):</div>
              <div className="p-2 bg-black/50 rounded">[12, 5, 18, 3, 9]</div>
            </div>

            <div>
              <div className="text-yellow-400 mb-1">Decryption process:</div>
              <div className="p-2 bg-black/50 rounded space-y-1">
                <div>T (20) - 12 = 8 → H</div>
                <div>J (10) - 5  = 5 → E</div>
                <div>D (4)  - 18 = -14 + 26 = 12 → L</div>
                <div>O (15) - 3  = 12 → L</div>
                <div>X (24) - 9  = 15 → O</div>
              </div>
            </div>

            <div>
              <div className="text-green-400 mb-1" style={{ fontWeight: 700 }}>Plaintext:</div>
              <div className="p-2 bg-green-500/10 border border-green-500 rounded text-lg">
                HELLO
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-4">
      <h2 className="text-2xl mb-4 text-green-400" style={{ fontWeight: 700 }}>SECURITY NOTES</h2>
      
      <div className="space-y-3 text-sm">
        <div className="border border-red-500 p-4 rounded bg-red-500/5">
          <h3 className="mb-2 text-red-400" style={{ fontWeight: 700 }}>CRITICAL RULES</h3>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>Both parties must start with <span className="text-yellow-400" style={{ fontWeight: 700 }}>identical deck orders</span></li>
            <li><span className="text-yellow-400" style={{ fontWeight: 700 }}>Never reuse</span> the same deck order for different messages</li>
            <li>The deck order is your secret key - <span className="text-yellow-400" style={{ fontWeight: 700 }}>protect it</span>!</li>
          </ul>
        </div>

        <div className="border border-yellow-500 p-4 rounded bg-yellow-500/5">
          <h3 className="mb-2 text-yellow-400" style={{ fontWeight: 700 }}>BEST PRACTICES</h3>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>Write down your deck order before starting encryption</li>
            <li>Store deck orders securely (they are your encryption keys)</li>
            <li>Exchange initial deck order through a secure channel</li>
            <li>After encrypting/decrypting, shuffle for the next message</li>
          </ul>
        </div>

        <div className="border border-cyan-500 p-4 rounded bg-cyan-500/5">
          <h3 className="mb-2 text-cyan-400" style={{ fontWeight: 700 }}>TIPS</h3>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>Practice with the interactive tutorial first</li>
            <li>Start with short messages to build confidence</li>
            <li>Double-check keystream generation steps</li>
            <li>Verify encryption by decrypting your own messages</li>
          </ul>
        </div>

        <div className="border border-purple-500 p-4 rounded bg-purple-500/5">
          <h3 className="mb-2 text-purple-400" style={{ fontWeight: 700 }}>LIMITATIONS</h3>
          <p>
            While Pontifex is a clever manual cipher, it's not suitable for 
            high-security applications. Modern cryptographic algorithms are 
            much stronger. Use Pontifex for learning, fun, or situations where 
            digital encryption is unavailable.
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'menu':
        return renderMenu();
      case 'about':
        return renderAbout();
      case 'encryption':
        return renderEncryption();
      case 'decryption':
        return renderDecryption();
      case 'examples':
        return renderExamples();
      case 'security':
        return renderSecurity();
      default:
        return renderMenu();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col border-2 border-green-500 bg-black rounded-lg overflow-hidden shadow-2xl shadow-green-500/40">
        {/* Modal Header */}
        <div className="bg-green-500 text-black px-4 py-2 flex justify-between items-center font-mono flex-shrink-0">
          <div className="flex items-center gap-3">
            {currentSection !== 'menu' && (
              <button
                onClick={() => setCurrentSection('menu')}
                className="hover:bg-black hover:text-green-500 px-2 transition-colors"
              >
                [ ← BACK ]
              </button>
            )}
            <span style={{ fontWeight: 700 }}>TUTORIAL</span>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-black hover:text-green-500 px-2 transition-colors"
          >
            [ X ]
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-black">
          <div className="text-green-500 font-mono">
            {renderContent()}
          </div>
        </div>

        {/* Footer with quick actions */}
        {currentSection !== 'menu' && (
          <div className="border-t border-green-500 p-4 flex justify-center gap-3 flex-shrink-0">
            <button
              onClick={() => setCurrentSection('menu')}
              className="px-4 py-1 border border-green-500 hover:bg-green-500 hover:text-black transition-colors text-xs"
            >
              [ MENU ]
            </button>
            <button
              onClick={onStartTutorial}
              className="px-4 py-1 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs"
            >
              [ START INTERACTIVE TUTORIAL ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}