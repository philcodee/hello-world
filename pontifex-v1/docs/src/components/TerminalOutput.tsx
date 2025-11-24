import { useState, useEffect } from "react";

export function TerminalOutput() {
  const fullText = `ABOUT
-----

This program is an output-feedback mode stream cipher.

It generates a stream ("keystream") of numbers between 1 and 26. 
You can either encrypt or decrypt messages using a deck of cards.


ENCRYPTING A MESSAGE
--------------------

Generate the same number of keystream letters as plaintext letters 
and add them modulo 26 to the plaintext letters one at a time to 
create ciphertext.


DECRYPTING A MESSAGE
--------------------

Generate the same keystream and subtract modulo 26 from the 
ciphertext to recover the plaintext.`;

  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // Adjust speed here (lower = faster)

      return () => clearTimeout(timeout);
    } else {
      // Show continue button after typing is complete
      setShowContinue(true);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="text-green-500 font-mono text-sm leading-relaxed">
      <pre className="whitespace-pre-wrap">
        {displayedText}
        {currentIndex < fullText.length && (
          <span className="animate-pulse">_</span>
        )}
      </pre>
      
      {showContinue && (
        <div className="mt-8 flex justify-center">
          <button 
            className="px-6 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors duration-200 font-mono animate-pulse"
            onClick={() => {/* TODO: Navigate to next screen */}}
          >
            [ CONTINUE ]
          </button>
        </div>
      )}
    </div>
  );
}