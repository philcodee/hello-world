import { Card, getSuitSymbol, getValueString } from "../utils/deck";

interface AsciiCardProps {
  card: Card;
  isHighlighted?: boolean;
  isDraggable?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  isSelectedTop?: boolean;
  isSelectedBottom?: boolean;
  isSelectedCountCut?: boolean;
  isBottomCardRef?: boolean;
  onTripleCutSwap?: () => void;
}

export function AsciiCard({ 
  card, 
  isHighlighted = false, 
  isDraggable = false,
  isDropTarget = false,
  onDragStart,
  onDragEnd,
  onClick,
  isSelectedTop = false,
  isSelectedBottom = false,
  isSelectedCountCut = false,
  isBottomCardRef = false,
  onTripleCutSwap
}: AsciiCardProps) {
  const suit = getSuitSymbol(card.suit);
  const value = getValueString(card);
  
  // Determine color based on suit
  const isRed = card.suit === 1 || card.suit === 2; // Diamonds or Hearts
  const isJoker = card.suit === 4 || card.suit === 5;
  
  const borderClass = isHighlighted 
    ? "border-yellow-500 shadow-lg shadow-yellow-500/30" 
    : isBottomCardRef
      ? "border-amber-400 shadow-lg shadow-amber-400/30 bg-amber-500/20"
      : isSelectedTop
        ? "border-cyan-400 shadow-lg shadow-cyan-400/30 bg-cyan-500/20"
        : isSelectedBottom
          ? "border-orange-400 shadow-lg shadow-orange-400/30 bg-orange-500/20"
          : isSelectedCountCut
            ? "border-pink-400 shadow-lg shadow-pink-400/30 bg-pink-500/20"
            : "border-green-500";
  
  const textClass = isJoker 
    ? "text-purple-400" 
    : isRed 
      ? "text-red-500" 
      : "text-green-500";

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && onDragStart) {
      onDragStart(e);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <div 
      className={`
        inline-block font-mono text-xs 
        ${textClass} 
        ${isDraggable || onClick ? 'cursor-pointer' : ''}
        select-none
      `}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      <pre className={`
        border ${borderClass} p-1 leading-none 
        transition-all duration-150
        ${isDraggable ? 'hover:border-yellow-400 hover:shadow-md hover:shadow-yellow-400/20 hover:scale-105 active:scale-95' : ''}
        ${onClick ? 'hover:border-yellow-400 hover:shadow-md hover:shadow-yellow-400/20 hover:scale-105 active:scale-95' : ''}
        bg-black/50
      `}>
{`┌─────┐
│${value.padEnd(2)} ${suit.padStart(2)}│
│     │
│${suit.padEnd(2)} ${value.padStart(2)}│
└─────┘`}
      </pre>
    </div>
  );
}