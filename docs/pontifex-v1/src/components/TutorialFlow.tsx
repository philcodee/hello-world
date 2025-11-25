import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, initializeDeck, shuffleDeck } from "../utils/deck";
import { DeckDisplay } from "./DeckDisplay";
import { ConversionTable } from "./ConversionTable";
import { AsciiCard } from "./AsciiCard";
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

interface TutorialFlowProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: "STEP 0: SHUFFLE DECK",
    description: "The deck order is your secret key. Both sender and receiver must have identical deck orders.\n\nClick the SHUFFLE button to randomize the deck.\n\nOnce shuffled, click NEXT to begin generating keystream.",
    action: null,
    manualOnly: false,
    allowFreeMovement: false,
    showShuffleButton: true,
  },
  {
    title: "STEP 1: MOVE JOKER A DOWN ONE CARD",
    description: "Find Joker A (purple, marked JA) and DRAG it one position down.\n\nIf it's at the bottom, wrap it to position 2 (just below the top card).\n\nOnly Joker A can be moved in this step. Drag it to complete the step.",
    action: "moveJokerA",
    manualOnly: true,
    allowFreeMovement: false,
    showShuffleButton: false,
  },
  {
    title: "STEP 2: MOVE JOKER B DOWN TWO CARDS",
    description: "Find Joker B (purple, marked JB) and DRAG it two positions down.\n\nThe deck wraps around circularly, but if Joker B would land on position 1, place it at position 2 instead.\n\nOnly Joker B can be moved in this step. Drag it to complete the step.",
    action: "moveJokerB",
    manualOnly: true,
    allowFreeMovement: false,
    showShuffleButton: false,
  },
  {
    title: "STEP 3: TRIPLE CUT",
    description: "Swap the cards above the first joker with the cards below the second joker.\n\n1. CLICK the top section (cards above first joker) to select it\n2. CLICK the bottom section (cards below second joker) to select it\n3. Click the SWAP button to perform the triple cut\n\nThe cards between the two jokers (including the jokers themselves) stay in the middle.",
    action: "tripleCut",
    manualOnly: true,
    allowFreeMovement: false,
    showShuffleButton: false,
  },
  {
    title: "STEP 4: COUNT CUT",
    description: "1. CLICK the bottom card to see its value\n2. Count that many cards from the top\n3. CLICK the card you count down to\n4. Click the CUT button to move those cards above the bottom card\n\nThe bottom card must stay at the bottom!\n\nTIP: Use [ CONVERSION TABLES ] to find card values.",
    action: "countCut",
    manualOnly: true,
    allowFreeMovement: false,
    showShuffleButton: false,
  },
  {
    title: "STEP 5: FIND OUTPUT CARD",
    description: "Look at the top card's value. Count down that many cards.\n\nThe card AFTER your count is the output card.\n\nCLICK the output card to reveal its keystream value (1-26).\n\nIf the output is a Joker, discard and repeat from Step 1.",
    action: "getOutput",
    manualOnly: true,
    allowFreeMovement: false,
    showShuffleButton: false,
  },
];

export function TutorialFlow({ onComplete }: TutorialFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [deck, setDeck] = useState<Card[]>(initializeDeck());
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [outputCard, setOutputCard] = useState<Card | null>(null);
  const [keystreamValue, setKeystreamValue] = useState<number | null>(null);
  const [outputCardNumber, setOutputCardNumber] = useState<number | null>(null);
  const [topCardValue, setTopCardValue] = useState<number | null>(null);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [selectedTopSection, setSelectedTopSection] = useState<number[]>([]);
  const [selectedBottomSection, setSelectedBottomSection] = useState<number[]>([]);
  const [selectedCountCutCards, setSelectedCountCutCards] = useState<number[]>([]);
  const [bottomCardValue, setBottomCardValue] = useState<number | null>(null);
  const [bottomCardRefIndex, setBottomCardRefIndex] = useState<number | null>(null);

  const currentStepData = tutorialSteps[currentStep];

  // Efficient deck comparison utility
  const areDecksEqual = useCallback((deck1: Card[], deck2: Card[]): boolean => {
    if (deck1.length !== deck2.length) return false;
    return deck1.every((card, i) => 
      card.suit === deck2[i].suit && card.value === deck2[i].value
    );
  }, []);

  // Consolidate state reset into a single function
  const resetStepState = useCallback(() => {
    setHasExecuted(false);
    setStepCompleted(false);
    setHighlightIndices([]);
    setOutputCard(null);
    setKeystreamValue(null);
    setSelectedTopSection([]);
    setSelectedBottomSection([]);
    setSelectedCountCutCards([]);
    setBottomCardValue(null);
    setBottomCardRefIndex(null);
  }, []);

  const highlightJokers = useCallback(() => {
    const jokerA = findJoker(deck, 4);
    const jokerB = findJoker(deck, 5);
    setHighlightIndices([jokerA, jokerB].filter(i => i !== -1));
  }, [deck]);

  // Memoize draggable and valid drop indices
  const draggableIndices = useMemo(() => {
    if (currentStepData.allowFreeMovement) {
      return undefined; // All cards draggable
    }
    if (currentStep === 1) {
      // Only Joker A
      const jokerA = findJoker(deck, 4);
      return jokerA !== -1 ? [jokerA] : [];
    }
    if (currentStep === 2) {
      // Only Joker B
      const jokerB = findJoker(deck, 5);
      return jokerB !== -1 ? [jokerB] : [];
    }
    return []; // No cards draggable for other steps
  }, [currentStep, deck, currentStepData.allowFreeMovement]);

  const validDropIndices = useMemo(() => {
    if (currentStepData.allowFreeMovement) {
      return undefined; // Can drop anywhere
    }
    if (currentStep === 1) {
      // Joker A: moves one position down
      const jokerA = findJoker(deck, 4);
      if (jokerA === -1) return [];
      
      if (jokerA === deck.length - 1) {
        // At bottom (last position), wrap to index 1
        // Drop on card at index 1 to place joker there
        return [1];
      } else {
        // Normal case: swap with next card
        // To swap indices i and i+1, we need to drop on i+2
        // Because: remove from i, then insert at (i+2)-1 = i+1
        // But if i+1 is the last card, drop on i+1 itself
        if (jokerA + 1 === deck.length - 1) {
          // Next card is last card, drop on it directly
          return [jokerA + 1];
        } else {
          // Drop on the card after next to achieve swap
          return [jokerA + 2];
        }
      }
    }
    if (currentStep === 2) {
      // Joker B: moves two positions down
      const jokerB = findJoker(deck, 5);
      if (jokerB === -1) return [];
      
      // The algorithm removes jokerB, then inserts it at (jokerB + 2) % 53
      // We need to find what index to drop on to achieve this
      const deckSizeAfterRemoval = deck.length - 1; // 53
      let targetIndex = (jokerB + 2) % deckSizeAfterRemoval;
      if (targetIndex === 0) targetIndex = 1;
      
      // Now convert this to a drop target
      // If jokerB < targetIndex: drop on targetIndex + 1
      // If jokerB >= targetIndex: drop on targetIndex
      if (jokerB < targetIndex) {
        return [targetIndex + 1];
      } else {
        return [targetIndex];
      }
    }
    return undefined;
  }, [currentStep, deck, currentStepData.allowFreeMovement]);

  const handleDeckChange = (newDeck: Card[]) => {
    setDeck(newDeck);
    
    // Check if the manual move was correct
    if (currentStepData.manualOnly) {
      // Verify the move was correct by comparing with expected result
      const expectedDeck = [...deck];
      
      if (currentStep === 1) {
        moveJokerA(expectedDeck);
        // Check if decks match
        const isCorrect = areDecksEqual(newDeck, expectedDeck);
        if (isCorrect) {
          setStepCompleted(true);
          highlightJokers();
        }
      } else if (currentStep === 2) {
        moveJokerB(expectedDeck);
        const isCorrect = areDecksEqual(newDeck, expectedDeck);
        if (isCorrect) {
          setStepCompleted(true);
          highlightJokers();
        }
      } else if (currentStep === 3) {
        const isCorrect = areDecksEqual(newDeck, tripleCut(deck));
        if (isCorrect) {
          setStepCompleted(true);
          highlightJokers();
        }
      } else if (currentStep === 4) {
        const isCorrect = areDecksEqual(newDeck, countCut(deck));
        if (isCorrect) {
          setStepCompleted(true);
          highlightJokers();
        }
      } else if (currentStep === 5) {
        const output = getOutputCard(newDeck);
        if (output) {
          setOutputCard(output);
          const keyValue = getKeystreamValue(output);
          setKeystreamValue(keyValue);
          const topCard = newDeck[0];
          const countValue = output.suit === 4 || output.suit === 5 ? 53 : output.value + (output.suit * 13);
          setHighlightIndices([0, Math.min(countValue, newDeck.length - 1)]);
          setOutputCardNumber(countValue);
          setTopCardValue(topCard.suit === 4 || topCard.suit === 5 ? 53 : topCard.value + (topCard.suit * 13));
        }
        setStepCompleted(true);
      }
    }
  };

  const executeStep = () => {
    let newDeck = [...deck];
    
    switch (currentStepData.action) {        
      case "tripleCut":
        newDeck = tripleCut(newDeck);
        setDeck(newDeck);
        highlightJokers();
        break;
        
      case "countCut":
        newDeck = countCut(newDeck);
        setDeck(newDeck);
        setHighlightIndices([newDeck.length - 1]); // Highlight bottom card
        break;
        
      case "getOutput":
        const output = getOutputCard(newDeck);
        if (output) {
          setOutputCard(output);
          const keyValue = getKeystreamValue(output);
          setKeystreamValue(keyValue);
          const topCard = newDeck[0];
          const countValue = output.suit === 4 || output.suit === 5 ? 53 : output.value + (output.suit * 13);
          setHighlightIndices([0, Math.min(countValue, newDeck.length - 1)]);
          setOutputCardNumber(countValue);
          setTopCardValue(topCard.suit === 4 || topCard.suit === 5 ? 53 : topCard.value + (topCard.suit * 13));
        }
        break;
    }
    
    setHasExecuted(true);
    setStepCompleted(true);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      resetStepState();
      
      // Highlight jokers for joker movement steps
      if (currentStep + 1 <= 2) {
        highlightJokers();
      }
    } else {
      // Tutorial complete
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      resetStepState();
    }
  };

  const handleReset = () => {
    setDeck(initializeDeck());
    setCurrentStep(0);
    resetStepState();
  };

  const handleShuffle = () => {
    const newDeck = shuffleDeck(deck);
    setDeck(newDeck);
    resetStepState();
  };

  // Triple cut selection handlers
  const handleCardClick = (index: number) => {
    // Step 3: Triple cut selection
    if (currentStep === 3) {
      const jokerA = findJoker(deck, 4);
      const jokerB = findJoker(deck, 5);
      const firstJoker = Math.min(jokerA, jokerB);
      const secondJoker = Math.max(jokerA, jokerB);
      
      // Determine which section this card belongs to
      if (index < firstJoker) {
        // Top section - select all cards from 0 to firstJoker-1
        const topIndices = Array.from({ length: firstJoker }, (_, i) => i);
        if (selectedTopSection.length > 0) {
          setSelectedTopSection([]);
        } else {
          setSelectedTopSection(topIndices);
        }
      } else if (index > secondJoker) {
        // Bottom section - select all cards from secondJoker+1 to end
        const bottomIndices = Array.from(
          { length: deck.length - secondJoker - 1 }, 
          (_, i) => secondJoker + 1 + i
        );
        if (selectedBottomSection.length > 0) {
          setSelectedBottomSection([]);
        } else {
          setSelectedBottomSection(bottomIndices);
        }
      }
    }
    
    // Step 4: Count cut selection
    if (currentStep === 4) {
      const bottomCardIndex = deck.length - 1;
      
      // First click: bottom card
      if (index === bottomCardIndex && selectedCountCutCards.length === 0) {
        const bottomCard = deck[bottomCardIndex];
        const cutValue = bottomCard.suit === 4 || bottomCard.suit === 5 
          ? 53 
          : bottomCard.value + (bottomCard.suit * 13);
        setBottomCardValue(cutValue);
        setBottomCardRefIndex(bottomCardIndex);
        setSelectedCountCutCards([bottomCardIndex]);
      }
      // Second click: the card we count down to (from top)
      else if (selectedCountCutCards.length === 1 && index !== bottomCardIndex) {
        // Select all cards from 0 to this index (the cards to be cut)
        const cutIndices = Array.from({ length: index + 1 }, (_, i) => i);
        setSelectedCountCutCards([bottomCardIndex, ...cutIndices]);
      }
      // Click again to deselect
      else {
        setSelectedCountCutCards([]);
        setBottomCardValue(null);
        setBottomCardRefIndex(null);
      }
    }
    
    // Step 5: Output card selection
    if (currentStep === 5) {
      const output = getOutputCard(deck);
      if (output) {
        const topCard = deck[0];
        const countValue = getNumber(topCard);
        
        // Check if clicked card is the correct output card
        if (index === countValue && deck[index] === output) {
          setOutputCard(output);
          const keyValue = getKeystreamValue(output);
          setKeystreamValue(keyValue);
          setOutputCardNumber(getNumber(output));
          setTopCardValue(countValue);
          setHighlightIndices([0, countValue]);
          setStepCompleted(true);
        }
      }
    }
  };

  const handleTripleCutSwap = () => {
    if (currentStep !== 3) return;
    if (selectedTopSection.length === 0 && selectedBottomSection.length === 0) return;
    
    const jokerA = findJoker(deck, 4);
    const jokerB = findJoker(deck, 5);
    const firstJoker = Math.min(jokerA, jokerB);
    const secondJoker = Math.max(jokerA, jokerB);
    
    const topSectionSize = firstJoker;
    const bottomSectionSize = deck.length - secondJoker - 1;
    
    const newDeck = tripleCut([...deck]);
    setDeck(newDeck);
    setStepCompleted(true);
    
    // Keep selections but update indices to reflect new positions
    // After swap: bottom section is now at top, jokers in middle, top section at bottom
    const newTopSection = Array.from({ length: bottomSectionSize }, (_, i) => i);
    const newBottomSection = Array.from({ length: topSectionSize }, (_, i) => deck.length - topSectionSize + i);
    
    setSelectedTopSection(newTopSection);
    setSelectedBottomSection(newBottomSection);
    
    highlightJokers();
  };

  const handleCountCutPerform = () => {
    if (currentStep !== 4) return;
    if (selectedCountCutCards.length < 2) return;
    
    const cutCardsCount = selectedCountCutCards.length - 1; // Exclude bottom card from count
    
    const newDeck = countCut([...deck]);
    setDeck(newDeck);
    setStepCompleted(true);
    
    // Keep the cut cards highlighted in their new positions
    // After cut: middle portion is at start, then cut cards, then bottom card
    const middlePortionSize = deck.length - cutCardsCount - 1;
    const newCutIndices = Array.from({ length: cutCardsCount }, (_, i) => middlePortionSize + i);
    const bottomCardNewIndex = deck.length - 1;
    
    // Only highlight the cut cards, not the bottom card
    setSelectedCountCutCards(newCutIndices);
    // Keep the bottom card reference highlighted separately
    setBottomCardRefIndex(bottomCardNewIndex);
    
    highlightJokers();
  };

  // Highlight jokers on initial load and step changes
  useEffect(() => {
    if (currentStep === 0 || currentStep === 1 || currentStep === 2) {
      highlightJokers();
    }
    
    // Auto-show top card info for Step 5
    if (currentStep === 5) {
      const topCard = deck[0];
      const countValue = getNumber(topCard);
      setTopCardValue(countValue);
      setHighlightIndices([0]); // Highlight the top card
    }
  }, [currentStep, deck]);

  return (
    <div className="text-green-500 font-mono text-sm leading-relaxed w-full h-full flex flex-col overflow-hidden">
      {/* Conversion Table Modal */}
      {showConversionTable && (
        <ConversionTable onClose={() => setShowConversionTable(false)} />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-500">
        <h2 className="text-xl">KEYSTREAM GENERATION TUTORIAL</h2>
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-1 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors text-xs"
            onClick={() => setShowConversionTable(true)}
          >
            [ CONVERSION TABLES ]
          </button>
          <div className="text-sm">
            STEP {currentStep + 1} / {tutorialSteps.length}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left sidebar - Fixed instructions */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          {/* Instruction panel - retro speech bubble style */}
          <div className="relative flex-shrink-0">
            <div className="border-2 border-green-500 p-3 rounded bg-black/90 shadow-lg shadow-green-500/20 h-[280px] flex flex-col">
              {/* Top border decoration */}
              <div className="absolute -top-3 left-4 bg-black px-2 text-green-500 text-xs">
                ┌─ {currentStepData.title} ─┐
              </div>
              
              {/* Instruction text - no scroll needed with taller height */}
              <div className="text-xs leading-relaxed opacity-90 whitespace-pre-wrap flex-1">
                {currentStepData.description}
              </div>
              
              {/* Show completion status for manual steps - fixed position */}
              <div className="mt-2 h-4 text-xs flex-shrink-0">
                {currentStepData.manualOnly && stepCompleted && (
                  <div className="text-yellow-400">
                    {'>'} Correct! Click NEXT to continue.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Count Cut info display (for step 4) - fixed height */}
          <div className={`border p-3 rounded flex-shrink-0 transition-all duration-300 ${
            currentStep === 4 && bottomCardValue !== null 
              ? 'border-amber-500 bg-amber-500/10 opacity-100' 
              : 'border-transparent bg-transparent opacity-0 pointer-events-none h-0 p-0'
          }`}>
            {currentStep === 4 && bottomCardValue !== null && (
              <>
                <h3 className="text-sm mb-2 text-amber-400">BOTTOM CARD</h3>
                <div className="flex items-center gap-3">
                  <div className="border border-amber-500/50 p-2 rounded bg-black/50">
                    <div className="text-[10px] opacity-75 mb-1">VALUE:</div>
                    <div className="text-2xl text-amber-400 font-bold">{bottomCardValue}</div>
                  </div>
                  <div className="flex-1 text-[10px] opacity-90 leading-tight">
                    Count {bottomCardValue} cards from top, then click to select cut section
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Output display (for step 5) - fixed height */}
          <div className={`border p-3 rounded flex-shrink-0 transition-all duration-300 ${
            currentStep === 5 && topCardValue !== null
              ? 'border-cyan-500 bg-cyan-500/10 opacity-100'
              : 'border-transparent bg-transparent opacity-0 pointer-events-none h-0 p-0'
          }`}>
            {currentStep === 5 && topCardValue !== null && (
              <>
                <h3 className="text-sm mb-2 text-cyan-400">TOP CARD</h3>
                <div className="flex items-center gap-3">
                  <div className="border border-cyan-500/50 p-2 rounded bg-black/50">
                    <div className="text-[10px] opacity-75 mb-1">VALUE:</div>
                    <div className="text-2xl text-cyan-400 font-bold">{topCardValue}</div>
                  </div>
                  <div className="flex-1 text-[10px] opacity-90 leading-tight">
                    Count {topCardValue} cards from top. Click the NEXT card (card at position {topCardValue + 1})
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Output result display (after clicking) */}
          <div className={`border p-3 rounded flex-shrink-0 transition-all duration-300 ${
            outputCard && keystreamValue !== null
              ? 'border-yellow-500 bg-yellow-500/10 opacity-100'
              : 'border-transparent bg-transparent opacity-0 pointer-events-none h-0 p-0'
          }`}>
            {outputCard && keystreamValue !== null && (
              <>
                <h3 className="text-sm mb-2 text-yellow-400">OUTPUT</h3>
                <div className="flex items-center gap-3">
                  <div className="border border-yellow-500/50 p-2 rounded bg-black/50">
                    <div className="text-[10px] opacity-75 mb-1">KEYSTREAM:</div>
                    <div className="text-2xl text-yellow-400 font-bold">{keystreamValue}</div>
                  </div>
                  <div className="flex-1 text-[10px] opacity-90 leading-tight">
                    Letter value for encryption
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side - Deck display */}
        <div className="flex-1 border border-green-500 p-4 rounded overflow-y-auto">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3>DECK STATE</h3>
            <button
              className="px-3 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors text-xs"
              onClick={handleReset}
            >
              [ RESTART TUTORIAL ]
            </button>
          </div>
          <DeckDisplay 
            deck={deck} 
            highlightIndices={highlightIndices} 
            isDraggable={true}
            onDeckChange={handleDeckChange}
            draggableIndices={draggableIndices}
            validDropIndices={validDropIndices}
            onCardClick={handleCardClick}
            selectedTopSection={selectedTopSection}
            selectedBottomSection={selectedBottomSection}
            onTripleCutSwap={handleTripleCutSwap}
            selectedCountCutCards={selectedCountCutCards}
            bottomCardValue={bottomCardValue}
            onCountCutPerform={handleCountCutPerform}
            bottomCardRefIndex={bottomCardRefIndex}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4 pt-4 border-t border-green-500">
        <button
          className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          [ ← PREVIOUS ]
        </button>

        {currentStepData.action && !currentStepData.manualOnly ? (
          <button
            className="px-6 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50"
            onClick={executeStep}
            disabled={hasExecuted}
          >
            [ EXECUTE ]
          </button>
        ) : null}

        {currentStepData.showShuffleButton && (
          <button
            className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50"
            onClick={handleShuffle}
          >
            [ SHUFFLE ]
          </button>
        )}

        <button
          className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50"
          onClick={handleNext}
          disabled={currentStepData.manualOnly && !stepCompleted}
        >
          {currentStep === tutorialSteps.length - 1 
            ? "[ COMPLETE TUTORIAL ]" 
            : "[ NEXT ]"}
        </button>
      </div>
    </div>
  );
}