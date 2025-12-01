import { useState, useEffect } from "react";
import { TutorialModal } from "./TutorialModal";
import { DeckDisplay } from "./DeckDisplay";
import { initializeDeck, shuffleDeck, Card } from "../utils/deck";
import { 
  findJoker, 
  moveJokerA, 
  moveJokerB, 
  tripleCut, 
  countCut, 
  getOutputCard,
  getKeystreamValue,
  getNumber
} from "../utils/cipher";
import { ConversionTable } from "./ConversionTable";

interface GameplayCanvasProps {
  encryptPlaintext?: string;
  encryptKeystreamLength?: number;
  decryptCiphertext?: string;
  decryptKeystreamLength?: number;
  onClearEncrypt?: () => void;
  onClearDecrypt?: () => void;
  onProceedToEncryption?: (keystream: number[]) => void;
  onProceedToDecryption?: (keystream: number[]) => void;
  shouldPrekeyDeck?: boolean;
}

export function GameplayCanvas({ 
  encryptPlaintext = '', 
  encryptKeystreamLength = 0,
  decryptCiphertext = '',
  decryptKeystreamLength = 0,
  onClearEncrypt,
  onClearDecrypt,
  onProceedToEncryption,
  onProceedToDecryption,
  shouldPrekeyDeck = false
}: GameplayCanvasProps = {}) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [deck, setDeck] = useState<Card[]>(() => initializeDeck());
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [selectedTopSection, setSelectedTopSection] = useState<number[]>([]);
  const [selectedBottomSection, setSelectedBottomSection] = useState<number[]>([]);
  const [selectedCountCutCards, setSelectedCountCutCards] = useState<number[]>([]);
  const [bottomCardValue, setBottomCardValue] = useState<number | null>(null);
  const [bottomCardRefIndex, setBottomCardRefIndex] = useState<number | null>(null);
  const [outputCard, setOutputCard] = useState<Card | null>(null);
  const [keystreamValue, setKeystreamValue] = useState<number | null>(null);
  const [topCardValue, setTopCardValue] = useState<number | null>(null);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [currentStep, setCurrentStep] = useState<'ready' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5'>('ready');
  const [keystreamValues, setKeystreamValues] = useState<number[]>([]);
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);
  const [initialJokerAPos, setInitialJokerAPos] = useState<number | null>(null);
  const [initialJokerBPos, setInitialJokerBPos] = useState<number | null>(null);
  const [deckHasBeenShuffled, setDeckHasBeenShuffled] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Shuffle deck when entering decryption mode (pre-keyed deck)
  useEffect(() => {
    if (shouldPrekeyDeck) {
      const shuffled = shuffleDeck([...deck]);
      setDeck(shuffled);
      setDeckHasBeenShuffled(true); // Decryption mode gets pre-shuffled
    }
  }, [shouldPrekeyDeck]);

  const handleShuffleDeck = () => {
    setDeck(shuffleDeck(deck));
    setDeckHasBeenShuffled(true);
  };

  const handleResetDeck = () => {
    setDeck(initializeDeck());
    setDeckHasBeenShuffled(false);
    handleResetKeystream();
  };

  const highlightJokers = () => {
    const jokerA = findJoker(deck, 4);
    const jokerB = findJoker(deck, 5);
    setHighlightIndices([jokerA, jokerB].filter(i => i !== -1));
  };

  const handleCardClick = (index: number) => {
    // Step 3: Triple cut selection
    if (currentStep === 'step3') {
      const jokerA = findJoker(deck, 4);
      const jokerB = findJoker(deck, 5);
      const firstJoker = Math.min(jokerA, jokerB);
      const secondJoker = Math.max(jokerA, jokerB);
      
      if (index < firstJoker) {
        const topIndices = Array.from({ length: firstJoker }, (_, i) => i);
        setSelectedTopSection(selectedTopSection.length > 0 ? [] : topIndices);
      } else if (index > secondJoker) {
        const bottomIndices = Array.from(
          { length: deck.length - secondJoker - 1 }, 
          (_, i) => secondJoker + 1 + i
        );
        setSelectedBottomSection(selectedBottomSection.length > 0 ? [] : bottomIndices);
      }
    }
    
    // Step 4: Count cut selection
    if (currentStep === 'step4') {
      const bottomCardIndex = deck.length - 1;
      
      if (index === bottomCardIndex && selectedCountCutCards.length === 0) {
        const bottomCard = deck[bottomCardIndex];
        const cutValue = getNumber(bottomCard);
        setBottomCardValue(cutValue);
        setBottomCardRefIndex(bottomCardIndex);
        setSelectedCountCutCards([bottomCardIndex]);
      } else if (selectedCountCutCards.length === 1 && index !== bottomCardIndex) {
        const cutIndices = Array.from({ length: index + 1 }, (_, i) => i);
        setSelectedCountCutCards([bottomCardIndex, ...cutIndices]);
      } else {
        setSelectedCountCutCards([]);
        setBottomCardValue(null);
        setBottomCardRefIndex(null);
      }
    }
    
    // Step 5: Output card selection
    if (currentStep === 'step5') {
      const output = getOutputCard(deck);
      if (output) {
        const topCard = deck[0];
        const countValue = getNumber(topCard);
        
        if (index === countValue && deck[index] === output) {
          setOutputCard(output);
          const keyValue = getKeystreamValue(output);
          setKeystreamValue(keyValue);
          setTopCardValue(countValue);
          setHighlightIndices([0, countValue]);
        }
      }
    }
  };

  const handleTripleCutSwap = () => {
    if (currentStep !== 'step3') return;
    if (selectedTopSection.length === 0 && selectedBottomSection.length === 0) return;
    
    const newDeck = tripleCut([...deck]);
    setDeck(newDeck);
    setSelectedTopSection([]);
    setSelectedBottomSection([]);
    highlightJokers();
    
    // Auto-advance to step 4
    setTimeout(() => {
      setCurrentStep('step4');
      setHighlightIndices([newDeck.length - 1]);
    }, 500);
  };

  const handleCountCutPerform = () => {
    if (currentStep !== 'step4') return;
    if (selectedCountCutCards.length < 2) return;
    
    const newDeck = countCut([...deck]);
    setDeck(newDeck);
    setSelectedCountCutCards([]);
    setBottomCardValue(null);
    setBottomCardRefIndex(null);
    highlightJokers();
    
    // Auto-advance to step 5
    setTimeout(() => {
      setCurrentStep('step5');
      const topCard = newDeck[0];
      const countValue = getNumber(topCard);
      setTopCardValue(countValue);
      setHighlightIndices([0]);
    }, 500);
  };

  const handleStartKeystream = () => {
    const jokerA = findJoker(deck, 4);
    setInitialJokerAPos(jokerA);
    setStep1Complete(false);
    setCurrentStep('step1');
    highlightJokers();
  };

  const handleStep1Complete = () => {
    if (!step1Complete) {
      return; // Don't allow continue if step not completed
    }
    const jokerB = findJoker(deck, 5);
    setInitialJokerBPos(jokerB);
    setStep2Complete(false);
    setCurrentStep('step2');
    highlightJokers();
  };

  const handleStep2Complete = () => {
    if (!step2Complete) {
      return; // Don't allow continue if step not completed
    }
    setCurrentStep('step3');
    highlightJokers();
  };

  const handleStep3Complete = () => {
    if (selectedTopSection.length > 0 || selectedBottomSection.length > 0) {
      // User has made selections, require them to perform the swap first
      return;
    }
    setCurrentStep('step4');
    setHighlightIndices([deck.length - 1]);
  };

  const handleStep4Complete = () => {
    if (selectedCountCutCards.length > 0) {
      // User has selections, require them to perform the cut first
      return;
    }
    setCurrentStep('step5');
    const topCard = deck[0];
    const countValue = getNumber(topCard);
    setTopCardValue(countValue);
    setHighlightIndices([0]);
  };

  const handleStep5Complete = () => {
    // Save the keystream value to the list
    if (keystreamValue !== null) {
      setKeystreamValues([...keystreamValues, keystreamValue]);
    }
    
    // Reset for next keystream generation
    setCurrentStep('ready');
    setHighlightIndices([]);
    setOutputCard(null);
    setKeystreamValue(null);
    setTopCardValue(null);
  };

  const handleResetKeystreamClick = () => {
    // Show confirmation modal
    setShowResetConfirmation(true);
  };

  const handleConfirmResetKeystream = () => {
    setShowResetConfirmation(false);
    handleResetKeystream();
  };

  const handleCancelResetKeystream = () => {
    setShowResetConfirmation(false);
  };

  const handleResetKeystream = () => {
    setCurrentStep('ready');
    setHighlightIndices([]);
    setSelectedTopSection([]);
    setSelectedBottomSection([]);
    setSelectedCountCutCards([]);
    setBottomCardValue(null);
    setBottomCardRefIndex(null);
    setOutputCard(null);
    setKeystreamValue(null);
    setTopCardValue(null);
    setStep1Complete(false);
    setStep2Complete(false);
    setInitialJokerAPos(null);
    setInitialJokerBPos(null);
  };

  const handleClearKeystreamValues = () => {
    setKeystreamValues([]);
  };

  const copyToClipboard = (text: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => {
        // Fallback method if clipboard API fails
        fallbackCopyToClipboard(text);
      });
    } else {
      // Use fallback method directly
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    // Create temporary textarea
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
      textarea.remove();
    } catch (err) {
      console.error('Failed to copy text: ', err);
      textarea.remove();
    }
  };

  const handleCopyKeystreamValues = () => {
    const text = keystreamValues.join(', ');
    copyToClipboard(text);
  };



  const getValidDropIndices = (): number[] | undefined => {
    if (draggedCardIndex === null) return undefined;
    
    const draggedCard = deck[draggedCardIndex];
    
    // Step 1: Only allow Joker A to move
    if (currentStep === 'step1' && draggedCard.suit !== 4) {
      return [];
    }
    
    // Step 2: Only allow Joker B to move
    if (currentStep === 'step2' && draggedCard.suit !== 5) {
      return [];
    }
    
    // If dragging Joker A (suit 4) - moves 1 position down
    if (draggedCard.suit === 4) {
      const jokerA = draggedCardIndex;
      
      if (jokerA === deck.length - 1) {
        return [1];
      } else {
        if (jokerA + 1 === deck.length - 1) {
          return [jokerA + 1];
        } else {
          return [jokerA + 2];
        }
      }
    }
    
    // If dragging Joker B (suit 5) - moves 2 positions down
    if (draggedCard.suit === 5) {
      const jokerB = draggedCardIndex;
      const deckSizeAfterRemoval = deck.length - 1;
      let targetIndex = (jokerB + 2) % deckSizeAfterRemoval;
      if (targetIndex === 0) targetIndex = 1;
      
      if (jokerB < targetIndex) {
        return [targetIndex + 1];
      } else {
        return [targetIndex];
      }
    }
    
    // For non-jokers during steps 1-2, no movement allowed
    if (currentStep === 'step1' || currentStep === 'step2') {
      return [];
    }
    
    // For non-jokers otherwise, allow free movement
    return undefined;
  };

  const handleDeckChange = (newDeck: Card[]) => {
    setDeck(newDeck);
    
    // Check if step 1 was completed correctly
    if (currentStep === 'step1' && initialJokerAPos !== null) {
      const newJokerAPos = findJoker(newDeck, 4);
      const expectedPos = initialJokerAPos === deck.length - 1 ? 1 : initialJokerAPos + 1;
      
      if (newJokerAPos === expectedPos) {
        setStep1Complete(true);
      }
    }
    
    // Check if step 2 was completed correctly
    if (currentStep === 'step2' && initialJokerBPos !== null) {
      const newJokerBPos = findJoker(newDeck, 5);
      const deckSizeAfterRemoval = deck.length - 1;
      let expectedPos = (initialJokerBPos + 2) % deckSizeAfterRemoval;
      if (expectedPos === 0) expectedPos = 1;
      
      if (newJokerBPos === expectedPos) {
        setStep2Complete(true);
      }
    }
  };

  return (
    <>
      {showConversionTable && (
        <ConversionTable onClose={() => setShowConversionTable(false)} />
      )}

      <div className="text-green-500 font-mono text-sm leading-relaxed w-full h-full flex flex-col overflow-hidden">
        {/* Header with buttons */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-500 flex-shrink-0">
          <h2 className="text-xl">PONTIFEX CIPHER - OPERATIONS</h2>
          <div className="flex gap-2">
            <button
              className="px-4 py-1 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs"
              onClick={() => setShowConversionTable(true)}
            >
              [ CONVERSION TABLES ]
            </button>
            <button
              className="px-4 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors duration-200"
              onClick={() => setShowTutorial(true)}
            >
              [ ? HELP ]
            </button>
          </div>
        </div>

        {/* Encrypt Message Banner */}
        {encryptPlaintext && encryptKeystreamLength > 0 && (
          <div className="mb-4 p-4 border-2 border-yellow-500 bg-yellow-500/10 rounded flex-shrink-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="text-yellow-400 mb-2">
                  ENCRYPTION MODE ACTIVE
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="opacity-75">Plaintext:</span>{' '}
                    <span className="text-green-400">{encryptPlaintext.substring(0, 50)}{encryptPlaintext.length > 50 ? '...' : ''}</span>
                  </div>
                  <div>
                    <span className="opacity-75">Required keystream:</span>{' '}
                    <span className="text-cyan-400">{encryptKeystreamLength} numbers</span>
                  </div>
                  <div>
                    <span className="opacity-75">Generated:</span>{' '}
                    <span className={keystreamValues.length >= encryptKeystreamLength ? 'text-green-400' : 'text-red-400'}>
                      {keystreamValues.length} / {encryptKeystreamLength}
                    </span>
                    {keystreamValues.length >= encryptKeystreamLength && (
                      <span className="ml-2 text-green-400">Ready to encrypt!</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {keystreamValues.length >= encryptKeystreamLength && onProceedToEncryption && (
                  <button
                    onClick={() => onProceedToEncryption(keystreamValues.slice(0, encryptKeystreamLength))}
                    className="px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors whitespace-nowrap animate-pulse"
                  >
                    [ CONTINUE TO ENCRYPTION → ]
                  </button>
                )}
                {onClearEncrypt && (
                  <button
                    onClick={onClearEncrypt}
                    className="px-3 py-1 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors text-xs"
                  >
                    [ CLEAR ]
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Decrypt Message Banner */}
        {decryptCiphertext && decryptKeystreamLength > 0 && (
          <div className="mb-4 p-4 border-2 border-cyan-500 bg-cyan-500/10 rounded flex-shrink-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="text-cyan-400 mb-2">
                  DECRYPTION MODE ACTIVE
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="opacity-75">Received ciphertext:</span>{' '}
                    <span className="text-green-400">{decryptCiphertext.substring(0, 50)}{decryptCiphertext.length > 50 ? '...' : ''}</span>
                  </div>
                  <div>
                    <span className="opacity-75">Required keystream:</span>{' '}
                    <span className="text-cyan-400">{decryptKeystreamLength} numbers</span>
                  </div>
                  <div>
                    <span className="opacity-75">Generated:</span>{' '}
                    <span className={keystreamValues.length >= decryptKeystreamLength ? 'text-green-400' : 'text-red-400'}>
                      {keystreamValues.length} / {decryptKeystreamLength}
                    </span>
                    {keystreamValues.length >= decryptKeystreamLength && (
                      <span className="ml-2 text-green-400">Ready to decrypt!</span>
                    )}
                  </div>
                  <div className="pt-1 border-t border-cyan-500/30 mt-2">
                    <span className="text-cyan-400 text-xs">Note:</span>{' '}
                    <span className="text-cyan-300/75 text-xs">Your deck must match the sender's keyed deck order</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {keystreamValues.length >= decryptKeystreamLength && onProceedToDecryption && (
                  <button
                    onClick={() => onProceedToDecryption(keystreamValues.slice(0, decryptKeystreamLength))}
                    className="px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors whitespace-nowrap animate-pulse"
                  >
                    [ CONTINUE TO DECRYPTION → ]
                  </button>
                )}
                {onClearDecrypt && (
                  <button
                    onClick={onClearDecrypt}
                    className="px-3 py-1 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors text-xs"
                  >
                    [ CLEAR ]
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main gameplay area */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left sidebar - Controls */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-4">
            {/* Keystream Generation Panel */}
            <div className="border border-cyan-500 p-4 rounded flex-shrink-0">
              <h3 className="mb-3 text-cyan-400">KEYSTREAM GENERATION</h3>
              
              {currentStep === 'ready' && (
                <div className="space-y-3">
                  <div className="text-xs opacity-75">
                    Generate keystream values to encrypt/decrypt messages.
                  </div>
                  {encryptPlaintext && encryptKeystreamLength > 0 && !deckHasBeenShuffled && (
                    <div className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500 p-2 rounded">
                      WARNING: You must shuffle the deck before generating keystream in encryption mode
                    </div>
                  )}
                  <button 
                    className="w-full px-4 py-2 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-500"
                    onClick={handleStartKeystream}
                    disabled={encryptPlaintext && encryptKeystreamLength > 0 && !deckHasBeenShuffled}
                    title={
                      encryptPlaintext && encryptKeystreamLength > 0 && !deckHasBeenShuffled
                        ? "Shuffle the deck first to create a random encryption key"
                        : "Start generating keystream values"
                    }
                  >
                    [ START KEYSTREAM ]
                  </button>
                </div>
              )}

              {currentStep === 'step1' && (
                <div className="space-y-3">
                  <div className="text-xs text-yellow-400">STEP 1: MOVE JOKER A</div>
                  <div className="text-xs opacity-75">
                    Drag Joker A (JA) one position down.
                  </div>
                  <button 
                    className="w-full px-4 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-500"
                    onClick={handleStep1Complete}
                    disabled={!step1Complete}
                  >
                    [ VERIFY & CONTINUE ]
                  </button>
                  {!step1Complete && (
                    <div className="text-xs text-red-400 opacity-75">
                      Complete the move to continue
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'step2' && (
                <div className="space-y-3">
                  <div className="text-xs text-yellow-400">STEP 2: MOVE JOKER B</div>
                  <div className="text-xs opacity-75">
                    Drag Joker B (JB) two positions down.
                  </div>
                  <button 
                    className="w-full px-4 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-500"
                    onClick={handleStep2Complete}
                    disabled={!step2Complete}
                  >
                    [ VERIFY & CONTINUE ]
                  </button>
                  {!step2Complete && (
                    <div className="text-xs text-red-400 opacity-75">
                      Complete the move to continue
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'step3' && (
                <div className="space-y-3">
                  <div className="text-xs text-yellow-400">STEP 3: TRIPLE CUT</div>
                  <div className="text-xs opacity-75">
                    Click top section (before first joker) or bottom section (after second joker) to select, then click SWAP.
                  </div>
                  {(selectedTopSection.length > 0 || selectedBottomSection.length > 0) && (
                    <button 
                      className="w-full px-4 py-2 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs"
                      onClick={handleTripleCutSwap}
                    >
                      [ SWAP SECTIONS ]
                    </button>
                  )}
                  {selectedTopSection.length === 0 && selectedBottomSection.length === 0 && (
                    <div className="text-xs text-red-400 opacity-75">
                      Select sections to swap
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'step4' && (
                <div className="space-y-3">
                  <div className="text-xs text-yellow-400">STEP 4: COUNT CUT</div>
                  <div className="text-xs opacity-75">
                    Click bottom card to see value, then click the card at that position, then PERFORM CUT.
                  </div>
                  {bottomCardValue && (
                    <div className="text-sm text-amber-400">
                      Bottom card value: {bottomCardValue}
                    </div>
                  )}
                  {selectedCountCutCards.length >= 2 && (
                    <button 
                      className="w-full px-4 py-2 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs"
                      onClick={handleCountCutPerform}
                    >
                      [ PERFORM CUT ]
                    </button>
                  )}
                  {selectedCountCutCards.length < 2 && (
                    <div className="text-xs text-red-400 opacity-75">
                      {selectedCountCutCards.length === 0 ? 'Click bottom card first' : 'Click the card to cut at'}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'step5' && (
                <div className="space-y-3">
                  <div className="text-xs text-yellow-400">STEP 5: GET OUTPUT</div>
                  <div className="text-xs opacity-75">
                    Top card value: {topCardValue}. Click card at position {topCardValue ? topCardValue + 1 : '?'}.
                  </div>
                  {keystreamValue && (
                    <div className="border border-yellow-500 p-3 bg-yellow-500/10">
                      <div className="text-xs opacity-75 mb-1">KEYSTREAM VALUE:</div>
                      <div className="text-3xl text-yellow-400">{keystreamValue}</div>
                    </div>
                  )}
                  <button 
                    className="w-full px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
                    onClick={handleStep5Complete}
                    disabled={!keystreamValue}
                  >
                    [ GENERATE NEXT ]
                  </button>
                </div>
              )}

              {currentStep !== 'ready' && (
                <button 
                  className="w-full mt-2 px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors text-xs"
                  onClick={handleResetKeystreamClick}
                >
                  [ RESET KEYSTREAM ]
                </button>
              )}
            </div>

            {/* Keystream Values Display */}
            <div className="border border-yellow-500 p-4 rounded flex-shrink-0 bg-yellow-500/5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-yellow-400">KEYSTREAM VALUES</h3>
              </div>
              
              {keystreamValues.length === 0 ? (
                <div className="text-xs opacity-50 text-center py-4">
                  Generated keystream values will appear here
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs opacity-75 mb-2">
                    Count: {keystreamValues.length} values
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-black/50 rounded border border-yellow-500/30">
                    {keystreamValues.map((value, index) => (
                      <div
                        key={index}
                        className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-400 text-sm min-w-[2.5rem] text-center"
                        title={`Position ${index + 1}`}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs opacity-75 mt-2">
                    Use these values to encrypt/decrypt your message
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* Right side - Deck display */}
          <div className="flex-1 border border-green-500 p-4 rounded overflow-y-auto">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3>CURRENT DECK (YOUR SECRET KEY)</h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors text-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-green-500"
                  onClick={handleResetDeck}
                  disabled={keystreamValues.length > 0 || currentStep !== 'ready' || (decryptCiphertext.length > 0 && decryptKeystreamLength > 0)}
                  title={
                    decryptCiphertext.length > 0 && decryptKeystreamLength > 0 
                      ? "Cannot reset deck in decryption mode - deck is pre-keyed" 
                      : keystreamValues.length > 0 || currentStep !== 'ready' 
                        ? "Cannot reset deck while keystream generation is active or values are collected" 
                        : "Reset deck to original order"
                  }
                >
                  [ RESET ]
                </button>
                <button
                  className="px-3 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors text-xs disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-green-500"
                  onClick={handleShuffleDeck}
                  disabled={keystreamValues.length > 0 || currentStep !== 'ready' || (decryptCiphertext.length > 0 && decryptKeystreamLength > 0)}
                  title={
                    decryptCiphertext.length > 0 && decryptKeystreamLength > 0 
                      ? "Cannot shuffle deck in decryption mode - deck is pre-keyed" 
                      : keystreamValues.length > 0 || currentStep !== 'ready' 
                        ? "Cannot shuffle deck while keystream generation is active or values are collected" 
                        : "Shuffle deck randomly"
                  }
                >
                  [ SHUFFLE ]
                </button>
              </div>
            </div>
            <DeckDisplay 
              deck={deck} 
              highlightIndices={highlightIndices}
              isDraggable={true}
              onDeckChange={handleDeckChange}
              onDragStart={(index) => setDraggedCardIndex(index)}
              onDragEnd={() => setDraggedCardIndex(null)}
              validDropIndices={getValidDropIndices()}
              onCardClick={handleCardClick}
              selectedTopSection={selectedTopSection}
              selectedBottomSection={selectedBottomSection}
              onTripleCutSwap={handleTripleCutSwap}
              selectedCountCutCards={selectedCountCutCards}
              bottomCardValue={bottomCardValue}
              onCountCutPerform={handleCountCutPerform}
              bottomCardRefIndex={bottomCardRefIndex}
            />
            <div className="text-xs opacity-75 mt-2">
              The deck order is your encryption key. Both sender and receiver need identical decks.
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal 
          onClose={() => setShowTutorial(false)} 
          onStartTutorial={() => {
            setShowTutorial(false);
            // Signal to parent that we want to show tutorial flow
            window.location.hash = 'tutorial';
          }}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-mono">
          <div className="bg-black border-2 border-red-500 p-6 rounded max-w-md w-full mx-4">
            <h3 className="text-xl text-red-400 mb-4">WARNING: RESET KEYSTREAM?</h3>
            <p className="text-green-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to reset the keystream generation process? 
              <br /><br />
              This will:
              <br />• Clear your current progress (Step {currentStep === 'step1' ? '1' : currentStep === 'step2' ? '2' : currentStep === 'step3' ? '3' : currentStep === 'step4' ? '4' : '5'})
              <br />• Reset the deck state
              <br />• Discard any incomplete keystream value
              <br /><br />
              <span className="text-yellow-400">Already generated keystream values will NOT be lost.</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
                onClick={handleCancelResetKeystream}
              >
                [ CANCEL ]
              </button>
              <button
                className="px-6 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors"
                onClick={handleConfirmResetKeystream}
              >
                [ RESET ]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}