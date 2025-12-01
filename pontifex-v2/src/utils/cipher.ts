import { Card } from "./deck";

// Find a joker in the deck by suit number
export function findJoker(deck: Card[], jokerSuit: number): number {
  return deck.findIndex(card => card.suit === jokerSuit);
}

// STEP 1: Move Joker A one position down
export function moveJokerA(deck: Card[]): void {
  const idx = findJoker(deck, 4);
  if (idx === -1) return; // Joker not found
  
  if (idx === deck.length - 1) {
    // Joker is at bottom - move to position 1 (below top card)
    const joker = deck.splice(idx, 1)[0];
    deck.splice(1, 0, joker);
  } else {
    // Swap with next card
    [deck[idx], deck[idx + 1]] = [deck[idx + 1], deck[idx]];
  }
}

// STEP 2: Move Joker B two positions down
export function moveJokerB(deck: Card[]): void {
  let idx = findJoker(deck, 5);
  if (idx === -1) return; // Joker not found
  
  // Remove joker from current position
  const joker = deck.splice(idx, 1)[0];
  
  // Calculate new position (2 positions down, with wrapping)
  idx = (idx + 2) % deck.length;
  
  // Special case: if wrapping to position 0, go to position 1 instead
  if (idx === 0) idx = 1;
  
  // Insert joker at new position
  deck.splice(idx, 0, joker);
}

// STEP 3: Triple Cut - swap cards above first joker with cards below second joker
export function tripleCut(deck: Card[]): Card[] {
  const idxA = findJoker(deck, 4);
  const idxB = findJoker(deck, 5);
  
  // Find first and second joker positions
  const firstJoker = Math.min(idxA, idxB);
  const secondJoker = Math.max(idxA, idxB);
  
  // Split deck into three sections
  const top = deck.slice(0, firstJoker);
  const middle = deck.slice(firstJoker, secondJoker + 1);
  const bottom = deck.slice(secondJoker + 1);
  
  // Reassemble: bottom + middle + top
  return [...bottom, ...middle, ...top];
}

// STEP 4: Count Cut based on bottom card value
export function countCut(deck: Card[]): Card[] {
  const bottomCard = deck[deck.length - 1];
  const cutValue = getNumber(bottomCard);
  
  // Don't cut if bottom card is a joker
  if (cutValue === 53) return deck;
  
  // Split deck into sections
  const topPortion = deck.slice(0, cutValue);
  const middlePortion = deck.slice(cutValue, deck.length - 1);
  const bottomCardArray = [deck[deck.length - 1]];
  
  // Reassemble: middle + top + bottom
  return [...middlePortion, ...topPortion, ...bottomCardArray];
}

// STEP 5: Find output card
export function getOutputCard(deck: Card[]): Card | null {
  const topCard = deck[0];
  const countValue = getNumber(topCard);
  
  // Prevent index out of bounds
  if (countValue >= deck.length) {
    return null;
  }
  
  // Count down and return the NEXT card
  const outputCard = deck[countValue];
  return outputCard;
}

// Get card number (1-53) for algorithm operations
export function getNumber(card: Card): number {
  if (card.suit === 4 || card.suit === 5) {
    return 53; // Both jokers = 53
  }
  return card.value + (card.suit * 13);
}

// Convert output card to keystream number (1-26)
export function getKeystreamValue(card: Card): number {
  if (card.suit === 4 || card.suit === 5) {
    return -1; // Invalid - jokers cannot be output
  }
  
  if (card.suit === 0 || card.suit === 2) {
    // Clubs or Hearts
    return card.value; // 1-13
  }
  
  // Diamonds or Spades
  return card.value + 13; // 14-26
}

// Generate one keystream letter
export function generateKeystreamLetter(deck: Card[]): number | null {
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    // Perform all 4 steps
    moveJokerA(deck);
    moveJokerB(deck);
    const afterTriple = tripleCut(deck);
    deck.length = 0;
    deck.push(...afterTriple);
    const afterCount = countCut(deck);
    deck.length = 0;
    deck.push(...afterCount);
    
    // Get output card
    const outputCard = getOutputCard(deck);
    
    // Check if valid (not a joker)
    if (outputCard && 
        outputCard.suit !== 4 && 
        outputCard.suit !== 5) {
      return getKeystreamValue(outputCard);
    }
    
    // If joker, discard and loop again
    attempts++;
  }
  
  return null; // Failed after max attempts
}

// Generate multiple keystream letters
export function generateKeystream(deck: Card[], length: number): number[] {
  let keystream: number[] = [];
  
  for (let i = 0; i < length; i++) {
    const letter = generateKeystreamLetter(deck);
    if (letter !== null) {
      keystream.push(letter);
    }
  }
  
  return keystream;
}

// Format plaintext for encryption
export function formatPlaintext(text: string): string {
  // Remove non-alphabetic characters and convert to uppercase
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Pad with X to make length divisible by 5
  while (text.length % 5 !== 0) {
    text += 'X';
  }
  
  return text;
}

// Convert text to number array (A=1, B=2, ..., Z=26)
export function textToNumbers(text: string): number[] {
  return text.split('').map(c => c.charCodeAt(0) - 64);
}

// Convert number array to text
export function numbersToText(numbers: number[]): string {
  return numbers.map(n => String.fromCharCode(n + 64)).join('');
}

// Add two numbers with modulo 26 wrapping (for encryption)
export function addModulo26(a: number, b: number): number {
  let result = a + b;
  if (result > 26) {
    result -= 26;
  }
  return result;
}

// Subtract two numbers with modulo 26 wrapping (for decryption)
export function subtractModulo26(a: number, b: number): number {
  let result = a - b;
  if (result < 1) {
    result += 26;
  }
  return result;
}
