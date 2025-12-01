import { useState, useEffect } from "react";
import { IntroScreen } from "./IntroScreen";
import { TerminalHeader } from "./TerminalHeader";
import { GameplayCanvas } from "./GameplayCanvas";
import { TutorialFlow } from "./TutorialFlow";
import { EncryptMode } from "./EncryptMode";
import { AddModulo26 } from "./AddModulo26";
import { EncryptionComplete } from "./EncryptionComplete";
import { DecryptMode } from "./DecryptMode";
import { SubtractModulo26 } from "./SubtractModulo26";
import { DecryptionComplete } from "./DecryptionComplete";
import { ChoiceScreen } from "./ChoiceScreen";

type ScreenMode = 'intro' | 'tutorial' | 'gameplay' | 'encrypt' | 'addModulo26' | 'encryptComplete' | 'decrypt' | 'subtractModulo26' | 'decryptComplete';

export function Terminal() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('intro');
  const [encryptPlaintext, setEncryptPlaintext] = useState('');
  const [encryptKeystreamLength, setEncryptKeystreamLength] = useState(0);
  const [keystreamValues, setKeystreamValues] = useState<number[]>([]);
  const [finalCiphertext, setFinalCiphertext] = useState('');
  const [decryptCiphertext, setDecryptCiphertext] = useState('');
  const [decryptKeystreamLength, setDecryptKeystreamLength] = useState(0);
  const [finalPlaintext, setFinalPlaintext] = useState('');
  const [shouldPrekeyDeck, setShouldPrekeyDeck] = useState(false);

  // Listen for tutorial trigger from help button
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#tutorial') {
        setCurrentScreen('tutorial');
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
    setCurrentScreen('intro');
  };

  const handleIntroComplete = () => {
    setCurrentScreen('gameplay');
  };

  const handleTutorialComplete = () => {
    setCurrentScreen('gameplay');
  };

  const handleEncryptContinue = (plaintext: string, charCount: number) => {
    setEncryptPlaintext(plaintext);
    setEncryptKeystreamLength(charCount);
    setKeystreamValues([]);
    setCurrentScreen('gameplay');
  };

  const handleProceedToEncryption = (keystream: number[]) => {
    setKeystreamValues(keystream);
    setCurrentScreen('addModulo26');
  };

  const handleBackToKeystream = () => {
    setCurrentScreen('gameplay');
  };

  const handleEncryptionComplete = (ciphertext: string) => {
    setFinalCiphertext(ciphertext);
    setCurrentScreen('encryptComplete');
  };

  const handleNewEncryption = () => {
    setEncryptPlaintext('');
    setEncryptKeystreamLength(0);
    setKeystreamValues([]);
    setFinalCiphertext('');
    setCurrentScreen('encrypt');
  };

  const handleBackToKeystreamFromComplete = () => {
    setEncryptPlaintext('');
    setEncryptKeystreamLength(0);
    setKeystreamValues([]);
    setFinalCiphertext('');
    setCurrentScreen('gameplay');
  };

  const handleDecryptContinue = (ciphertext: string, charCount: number) => {
    setDecryptCiphertext(ciphertext);
    setDecryptKeystreamLength(charCount);
    setKeystreamValues([]);
    setShouldPrekeyDeck(true);
    setCurrentScreen('gameplay');
    
    // Clear the prekey flag after a short delay
    setTimeout(() => {
      setShouldPrekeyDeck(false);
    }, 1500);
  };

  const handleProceedToDecryption = (keystream: number[]) => {
    setKeystreamValues(keystream);
    setCurrentScreen('subtractModulo26');
  };

  const handleBackToKeystreamFromDecrypt = () => {
    setCurrentScreen('gameplay');
  };

  const handleDecryptionComplete = (plaintext: string) => {
    setFinalPlaintext(plaintext);
    setCurrentScreen('decryptComplete');
  };

  const handleNewDecryption = () => {
    setDecryptCiphertext('');
    setDecryptKeystreamLength(0);
    setKeystreamValues([]);
    setFinalPlaintext('');
    setCurrentScreen('decrypt');
  };

  const handleBackToKeystreamFromDecryptComplete = () => {
    setDecryptCiphertext('');
    setDecryptKeystreamLength(0);
    setKeystreamValues([]);
    setFinalPlaintext('');
    setCurrentScreen('gameplay');
  };

  return (
    <div className="w-full max-w-[1600px] h-[90vh] border-2 border-green-500 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 flex flex-col">
      <TerminalHeader 
        onRestart={handleRestart} 
        showRestart={currentScreen !== 'intro'}
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />
      <div className="bg-black p-6 flex-1 overflow-hidden">
        {currentScreen === 'intro' && (
          <IntroScreen onContinue={handleIntroComplete} />
        )}
        {currentScreen === 'tutorial' && (
          <TutorialFlow onComplete={handleTutorialComplete} />
        )}
        {currentScreen === 'encrypt' && (
          <EncryptMode onContinue={handleEncryptContinue} />
        )}
        {currentScreen === 'decrypt' && (
          <DecryptMode onContinue={handleDecryptContinue} />
        )}
        {currentScreen === 'gameplay' && (
          <>
            {/* Show choice screen if no active encrypt/decrypt task */}
            {!encryptPlaintext && !decryptCiphertext && (
              <ChoiceScreen 
                onEncryptChoice={() => setCurrentScreen('encrypt')}
                onDecryptChoice={() => setCurrentScreen('decrypt')}
              />
            )}
            {/* Show keystream generator if there's an active task */}
            {(encryptPlaintext || decryptCiphertext) && (
              <GameplayCanvas 
                encryptPlaintext={encryptPlaintext}
                encryptKeystreamLength={encryptKeystreamLength}
                decryptCiphertext={decryptCiphertext}
                decryptKeystreamLength={decryptKeystreamLength}
                onClearEncrypt={() => {
                  setEncryptPlaintext('');
                  setEncryptKeystreamLength(0);
                  setKeystreamValues([]);
                }}
                onClearDecrypt={() => {
                  setDecryptCiphertext('');
                  setDecryptKeystreamLength(0);
                  setKeystreamValues([]);
                }}
                onProceedToEncryption={handleProceedToEncryption}
                onProceedToDecryption={handleProceedToDecryption}
                shouldPrekeyDeck={shouldPrekeyDeck}
              />
            )}
          </>
        )}
        {currentScreen === 'addModulo26' && (
          <AddModulo26
            plaintext={encryptPlaintext}
            keystream={keystreamValues}
            onBack={handleBackToKeystream}
            onComplete={handleEncryptionComplete}
          />
        )}
        {currentScreen === 'encryptComplete' && (
          <EncryptionComplete
            plaintext={encryptPlaintext}
            ciphertext={finalCiphertext}
            onNewEncryption={handleNewEncryption}
            onBackToKeystream={handleBackToKeystreamFromComplete}
          />
        )}
        {currentScreen === 'subtractModulo26' && (
          <SubtractModulo26
            ciphertext={decryptCiphertext}
            keystream={keystreamValues}
            onBack={handleBackToKeystreamFromDecrypt}
            onComplete={handleDecryptionComplete}
          />
        )}
        {currentScreen === 'decryptComplete' && (
          <DecryptionComplete
            ciphertext={decryptCiphertext}
            plaintext={finalPlaintext}
            onNewDecryption={handleNewDecryption}
            onBackToKeystream={handleBackToKeystreamFromDecryptComplete}
          />
        )}
      </div>
    </div>
  );
}