import React from "react";
import { Card } from "../utils/deck";
import { AsciiCard } from "./AsciiCard";
import { motion } from "motion/react";

interface DeckDisplayProps {
  deck: Card[];
  highlightIndices?: number[];
  isDraggable?: boolean;
  onDeckChange?: (newDeck: Card[]) => void;
  draggableIndices?: number[]; // Only these cards can be dragged
  validDropIndices?: number[]; // Only these positions can receive drops
  onCardClick?: (index: number) => void; // For triple cut selection
  selectedTopSection?: number[];
  selectedBottomSection?: number[];
  onTripleCutSwap?: () => void;
  selectedCountCutCards?: number[];
  bottomCardValue?: number | null;
  onCountCutPerform?: () => void;
  bottomCardRefIndex?: number | null;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
}

export function DeckDisplay({ 
  deck, 
  highlightIndices = [], 
  isDraggable = false,
  onDeckChange,
  draggableIndices,
  validDropIndices,
  onCardClick,
  selectedTopSection,
  selectedBottomSection,
  onTripleCutSwap,
  selectedCountCutCards,
  bottomCardValue,
  onCountCutPerform,
  bottomCardRefIndex,
  onDragStart,
  onDragEnd
}: DeckDisplayProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [previewDeck, setPreviewDeck] = React.useState<Card[]>(deck);

  // Update preview deck when hovering
  React.useEffect(() => {
    if (draggedIndex !== null && hoverIndex !== null && draggedIndex !== hoverIndex) {
      const newDeck = [...deck];
      const [draggedCard] = newDeck.splice(draggedIndex, 1);
      const adjustedTarget = draggedIndex < hoverIndex ? hoverIndex - 1 : hoverIndex;
      newDeck.splice(adjustedTarget, 0, draggedCard);
      setPreviewDeck(newDeck);
    } else {
      setPreviewDeck(deck);
    }
  }, [draggedIndex, hoverIndex, deck]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Check if this card is allowed to be dragged
    if (draggableIndices && !draggableIndices.includes(index)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
    if (onDragStart) {
      onDragStart(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoverIndex(null);
    setPreviewDeck(deck);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't allow dropping on self
    if (draggedIndex === index) {
      setHoverIndex(null);
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    // Check if this is a valid drop position
    if (validDropIndices && !validDropIndices.includes(index)) {
      setHoverIndex(null);
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    e.dataTransfer.dropEffect = 'move';
    setHoverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate drop position
    if (validDropIndices && !validDropIndices.includes(targetIndex)) {
      setDraggedIndex(null);
      setHoverIndex(null);
      return;
    }
    
    if (draggedIndex !== null && draggedIndex !== targetIndex && onDeckChange) {
      const newDeck = [...deck];
      const [draggedCard] = newDeck.splice(draggedIndex, 1);
      const adjustedTarget = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
      newDeck.splice(adjustedTarget, 0, draggedCard);
      onDeckChange(newDeck);
    }
    
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  const isCardDraggable = (index: number) => {
    if (!isDraggable) return false;
    if (!draggableIndices) return true;
    return draggableIndices.includes(index);
  };

  const isCardDropTarget = (index: number) => {
    if (!isDraggable) return false;
    if (!validDropIndices) return true;
    return validDropIndices.includes(index);
  };

  // Create a unique key for each card based on suit and value
  const getCardKey = (card: Card) => {
    return `card-${card.suit}-${card.value}`;
  };

  // Find the index of a card in the preview deck
  const getPreviewIndex = (card: Card) => {
    return previewDeck.findIndex(c => c.suit === card.suit && c.value === card.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 text-green-500 font-mono text-xs mb-2">
        <span>DECK ({deck.length} cards)</span>
        <span className="ml-4 opacity-50">[ Top → Bottom ]</span>
        {/* Reserve space for drag hint to prevent layout shift */}
        <span className="ml-4 h-4 min-w-[140px]">
          {isDraggable && (
            <span className="text-yellow-400">[ Drag to reorder ]</span>
          )}
        </span>
      </div>

      {/* Reserve space for action buttons to prevent layout shift */}
      <div className="mb-4 min-h-[44px]">
        {/* Triple Cut Swap Button */}
        {onTripleCutSwap && (selectedTopSection && selectedTopSection.length > 0 || selectedBottomSection && selectedBottomSection.length > 0) && (
          <div className="flex items-center gap-3">
            <button
              onClick={onTripleCutSwap}
              className="px-6 py-2 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors font-bold animate-pulse"
            >
              [ ↔ SWAP SECTIONS ]
            </button>
            <div className="text-xs opacity-75">
              {selectedTopSection && selectedTopSection.length > 0 && (
                <span className="text-cyan-400">Top: {selectedTopSection.length} cards</span>
              )}
              {selectedTopSection && selectedTopSection.length > 0 && selectedBottomSection && selectedBottomSection.length > 0 && (
                <span className="mx-2">•</span>
              )}
              {selectedBottomSection && selectedBottomSection.length > 0 && (
                <span className="text-orange-400">Bottom: {selectedBottomSection.length} cards</span>
              )}
            </div>
          </div>
        )}

        {/* Count Cut Button */}
        {onCountCutPerform && selectedCountCutCards && selectedCountCutCards.length > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={onCountCutPerform}
              className="px-6 py-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-colors font-bold animate-pulse"
            >
              [ ✂ PERFORM CUT ]
            </button>
            <div className="text-xs opacity-75">
              {bottomCardValue !== null && bottomCardValue !== undefined && (
                <span className="text-yellow-400">Bottom card value: {bottomCardValue}</span>
              )}
              {bottomCardValue !== null && bottomCardValue !== undefined && (
                <span className="mx-2">•</span>
              )}
              <span className="text-cyan-400">Cutting {selectedCountCutCards.length - 1} cards</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {deck.map((card, originalIndex) => {
          const canDrag = isCardDraggable(originalIndex);
          const canDrop = isCardDropTarget(originalIndex);
          const isDragging = draggedIndex === originalIndex;
          const isValidDrop = !validDropIndices || validDropIndices.includes(originalIndex);
          const previewIndex = getPreviewIndex(card);
          
          return (
            <motion.div
              key={getCardKey(card)}
              layout
              layoutId={getCardKey(card)}
              initial={false}
              animate={{
                opacity: isDragging ? 0.5 : 1,
              }}
              transition={{
                layout: { 
                  duration: 0.2, 
                  ease: "easeOut",
                },
                opacity: { duration: 0.1 }
              }}
              className={`
                relative
                ${canDrop && draggedIndex !== null && !isDragging && isValidDrop ? 'ring-2 ring-yellow-400/60 rounded' : ''}
              `}
              style={{
                order: previewIndex !== -1 ? previewIndex : originalIndex
              }}
              onDragOver={(e) => handleDragOver(e, originalIndex)}
              onDrop={(e) => handleDrop(e, originalIndex)}
            >
              {/* Position indicator - simple, no preview */}
              <div className="absolute -top-3 left-0 text-[8px] text-green-500/40 font-mono z-10">
                {originalIndex + 1}
              </div>
              
              {/* Drop zone highlight */}
              {canDrop && hoverIndex === originalIndex && draggedIndex !== null && isValidDrop && (
                <div className="absolute inset-0 border-2 border-yellow-400 rounded pointer-events-none z-10" />
              )}
              
              <AsciiCard 
                card={card} 
                isHighlighted={highlightIndices.includes(originalIndex)}
                isDraggable={canDrag}
                isDropTarget={canDrop}
                onDragStart={(e) => handleDragStart(e, originalIndex)}
                onDragEnd={handleDragEnd}
                onClick={() => onCardClick && onCardClick(originalIndex)}
                isSelectedTop={selectedTopSection && selectedTopSection.includes(originalIndex)}
                isSelectedBottom={selectedBottomSection && selectedBottomSection.includes(originalIndex)}
                isSelectedCountCut={selectedCountCutCards && selectedCountCutCards.includes(originalIndex)}
                isBottomCardRef={bottomCardRefIndex !== null && bottomCardRefIndex !== undefined && bottomCardRefIndex === originalIndex}
                onTripleCutSwap={onTripleCutSwap}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}