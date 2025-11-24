export interface Card {
  suit: number; // 0-5 (Clubs, Diamonds, Hearts, Spades, Joker A, Joker B)
  value: number; // 1-13 (Ace through King), 0 for Jokers
}

// Initialize a standard 54-card deck in order
export function initializeDeck(): Card[] {
  let deck: Card[] = [];
  
  // Create 52 regular cards
  for (let suit = 0; suit < 4; suit++) {
    for (let value = 1; value <= 13; value++) {
      deck.push({ suit, value });
    }
  }
  
  // Add two jokers
  deck.push({ suit: 4, value: 0 }); // Joker A
  deck.push({ suit: 5, value: 0 }); // Joker B
  
  return deck;
}

// Shuffle deck using Fisher-Yates algorithm
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get card number (1-53) for algorithm operations
export function getNumber(card: Card): number {
  if (card.suit === 4 || card.suit === 5) {
    return 53; // Both jokers = 53
  }
  return card.value + (card.suit * 13);
}

// Get suit symbol
export function getSuitSymbol(suit: number): string {
  const suits = ['♣', '♦', '♥', '♠', 'JA', 'JB'];
  return suits[suit] || '?';
}

// Get value string
export function getValueString(card: Card): string {
  if (card.suit === 4 || card.suit === 5) {
    return 'JK';
  }
  
  const values = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  return values[card.value] || '?';
}

// Get full card name
export function getCardName(card: Card): string {
  if (card.suit === 4) return 'Joker A';
  if (card.suit === 5) return 'Joker B';
  
  const valueStr = getValueString(card);
  const suitNames = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  return `${valueStr} of ${suitNames[card.suit]}`;
}
