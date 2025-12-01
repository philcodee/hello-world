# Style Guide
IMPORTANT - DO NOT USE ANY EMOJIS EXPEPT FOR CARD SUIT SYMBOLS

# Solitaire Cipher - Core Functions Documentation

## Overview
This document contains all the core algorithmic functions for the Solitaire cipher, excluding UI and card display functionality.

---

## 1. DECK REPRESENTATION

### Card Data Structure
```javascript
Card Properties:
- suit: Integer 0-5
  * 0 = Clubs (♣)
  * 1 = Diamonds (♦)
  * 2 = Hearts (♥)
  * 3 = Spades (♠)
  * 4 = Joker A
  * 5 = Joker B
- value: Integer 1-13 (Ace through King)
```

### Card Value Conversion Functions

#### getNumber()
Converts a card to its position value (1-53) for algorithm operations.

```javascript
function getNumber(card) {
    if (card.suit === 4 || card.suit === 5) {
        return 53; // Both jokers = 53
    }
    return card.value + (card.suit * 13);
}
```

**Examples:**
- Ace of Clubs: 1 + (0 × 13) = 1
- King of Clubs: 13 + (0 × 13) = 13
- Ace of Diamonds: 1 + (1 × 13) = 14
- King of Spades: 13 + (3 × 13) = 52
- Any Joker: 53

#### getKeystreamValue()
Converts output card to keystream number (1-26) for encryption/decryption.

```javascript
function getKeystreamValue(card) {
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
```

**Examples:**
- Ace of Clubs: 1
- King of Clubs: 13
- Ace of Diamonds: 14
- King of Spades: 26
- Any Joker: -1 (invalid)

---

## 2. DECK INITIALIZATION

### initializeDeck()
Creates a standard 54-card deck in order.

```javascript
function initializeDeck() {
    let deck = [];
    
    // Create 52 regular cards
    for (let suit = 0; suit < 4; suit++) {
        for (let value = 1; value <= 13; value++) {
            deck.push({suit: suit, value: value});
        }
    }
    
    // Add two jokers
    deck.push({suit: 4, value: 0}); // Joker A
    deck.push({suit: 5, value: 0}); // Joker B
    
    return deck;
}
```

**Output Order:**
1. All Clubs (A-K)
2. All Diamonds (A-K)
3. All Hearts (A-K)
4. All Spades (A-K)
5. Joker A
6. Joker B

### shuffleDeck()
Randomizes deck using Fisher-Yates shuffle algorithm.

```javascript
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}
```

**Purpose:** Creates the secret key. Both sender and receiver need identical shuffled decks.

---

## 3. JOKER FINDING

### findJoker()
Locates a joker in the deck by suit number.

```javascript
function findJoker(deck, jokerSuit) {
    return deck.findIndex(card => card.suit === jokerSuit);
}
```

**Parameters:**
- `jokerSuit`: 4 for Joker A, 5 for Joker B

**Returns:** Index position (0-53), or -1 if not found

---

## 4. ALGORITHM STEP 1: MOVE JOKER A

### moveJokerA()
Moves Joker A one position down in the deck.

```javascript
function moveJokerA(deck) {
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
```

**Rules:**
- Normal case: Swap with card immediately below
- Special case: If at bottom of deck, wrap to position 1 (just below top card)

**Example:**
```
Before: [3, A, B, 8, 9]
After:  [3, 8, A, B, 9]
```

---

## 5. ALGORITHM STEP 2: MOVE JOKER B

### moveJokerB()
Moves Joker B two positions down in the deck.

```javascript
function moveJokerB(deck) {
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
```

**Rules:**
- Normal case: Move 2 positions down
- Wrapping: Treat deck as circular
- Special case: If would wrap to top (position 0), go to position 1 instead

**Example:**
```
Before: [3, A, 8, B, 9]
After:  [3, A, 8, 9, B]  (if B was at position 3)
```

---

## 6. ALGORITHM STEP 3: TRIPLE CUT

### tripleCut()
Swaps cards above first joker with cards below second joker.

```javascript
function tripleCut(deck) {
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
```

**Rules:**
- Find first joker (either A or B)
- Find second joker
- Swap top section with bottom section
- Middle section (including both jokers) stays in place

**Example:**
```
Before: [2, 4, 6, B, 4, 8, 7, 1, A, 3, 9]
         └─top─┘  └───middle────┘  └bot┘

After:  [3, 9, B, 4, 8, 7, 1, A, 2, 4, 6]
        └bot┘  └───middle────┘  └─top─┘
```

---

## 7. ALGORITHM STEP 4: COUNT CUT

### countCut()
Cuts the deck based on the value of the bottom card.

```javascript
function countCut(deck) {
    const bottomCard = deck[deck.length - 1];
    const cutValue = getNumber(bottomCard);
    
    // Don't cut if bottom card is a joker
    if (cutValue === 53) return;
    
    // Split deck into sections
    const topPortion = deck.slice(0, cutValue);
    const middlePortion = deck.slice(cutValue, deck.length - 1);
    const bottomCardArray = [deck[deck.length - 1]];
    
    // Reassemble: middle + top + bottom
    return [...middlePortion, ...topPortion, ...bottomCardArray];
}
```

**Rules:**
1. Look at bottom card
2. Convert to number (1-53)
3. Count that many cards from top
4. Cut after counted card
5. **Bottom card stays at bottom** (important for reversibility)

**Example:**
```
Bottom card = 9 of Clubs = value 9

Before: [7, ...(7 cards)..., 4, 5, ...(remaining)..., 8, 9♣]
         └────── 9 cards ──────┘  └── remaining ──┘

After:  [5, ...(remaining)..., 8, 7, ...(7 cards)..., 4, 9♣]
        └── remaining ──┘  └────── 9 cards ──────┘
```

---

## 8. ALGORITHM STEP 5: FIND OUTPUT CARD

### getOutputCard()
Finds the output card without modifying the deck.

```javascript
function getOutputCard(deck) {
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
```

**Rules:**
1. Look at top card
2. Convert to number (1-53)
3. Count down that many cards (top card = 1)
4. The card AFTER your count is the output
5. **This step does NOT modify the deck**

**Example:**
```
Top card = 5 of Hearts

Deck:  [5♥, 2, 7, 9, 3, K, 8, ...]
        ^1  ^2 ^3 ^4 ^5 ^6
                         ↑
                    Output card is King
```

---

## 9. KEYSTREAM GENERATION

### generateKeystreamLetter()
Generates one keystream letter using the 4-step algorithm.

```javascript
function generateKeystreamLetter(deck) {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        // Perform all 4 steps
        moveJokerA(deck);
        moveJokerB(deck);
        deck = tripleCut(deck);
        deck = countCut(deck);
        
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
```

**Rules:**
- If output card is a joker, restart from Step 1
- Keep looping until non-joker card is found
- Return keystream value (1-26)

### generateKeystream()
Generates multiple keystream letters.

```javascript
function generateKeystream(deck, length) {
    let keystream = [];
    
    for (let i = 0; i < length; i++) {
        const letter = generateKeystreamLetter(deck);
        if (letter !== null) {
            keystream.push(letter);
        }
    }
    
    return keystream;
}
```

**Usage:** Generate keystream matching plaintext length.

---

## 10. TEXT CONVERSION FUNCTIONS

### formatPlaintext()
Formats plaintext for encryption.

```javascript
function formatPlaintext(text) {
    // Remove non-alphabetic characters and convert to uppercase
    text = text.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Pad with X to make length divisible by 5
    while (text.length % 5 !== 0) {
        text += 'X';
    }
    
    return text;
}
```

**Example:**
```
Input:  "DO NOT USE PC"
Output: "DONOTUSEPCXXX"
```

### textToNumbers()
Converts text to number array.

```javascript
function textToNumbers(text) {
    return text.split('').map(c => c.charCodeAt(0) - 64);
}
```

**Example:**
```
Input:  "HELLO"
Output: [8, 5, 12, 12, 15]
```

### numbersToText()
Converts number array to text.

```javascript
function numbersToText(numbers) {
    return numbers.map(n => String.fromCharCode(n + 64)).join('');
}
```

**Example:**
```
Input:  [8, 5, 12, 12, 15]
Output: "HELLO"
```

---

## 11. MODULO 26 ARITHMETIC

### addModulo26()
Adds two numbers with modulo 26 wrapping.

```javascript
function addModulo26(a, b) {
    let result = a + b;
    if (result > 26) {
        result -= 26;
    }
    return result;
}
```

**Used for:** Encryption

**Example:**
```
15 + 11 = 26 (no wrap needed)
15 + 13 = 28, wrap to 28 - 26 = 2
```

### subtractModulo26()
Subtracts two numbers with modulo 26 wrapping.

```javascript
function subtractModulo26(a, b) {
    let result = a - b;
    if (result < 1) {
        result += 26;
    }
    return result;
}
```

**Used for:** Decryption

**Example:**
```
15 - 11 = 4 (no wrap needed)
5 - 10 = -5, wrap to -5 + 26 = 21
```

---

## 12. ENCRYPTION

### encrypt()
Complete encryption process.

```javascript
function encrypt(plaintext, deck) {
    // Format plaintext
    const formatted = formatPlaintext(plaintext);
    
    // Generate keystream
    const keystream = generateKeystream(deck, formatted.length);
    
    // Convert to numbers
    const plaintextNumbers = textToNumbers(formatted);
    
    // Add keystream modulo 26
    const ciphertextNumbers = plaintextNumbers.map((p, i) => 
        addModulo26(p, keystream[i])
    );
    
    // Convert back to text
    const ciphertext = numbersToText(ciphertextNumbers);
    
    // Format into 5-character groups
    let formattedCipher = '';
    for (let i = 0; i < ciphertext.length; i += 5) {
        formattedCipher += ciphertext.substr(i, 5) + ' ';
    }
    
    return formattedCipher.trim();
}
```

**Process:**
1. Format plaintext (remove spaces, pad with X)
2. Generate keystream (same length as plaintext)
3. Convert both to numbers
4. Add modulo 26
5. Convert to letters
6. Group into 5-character blocks

---

## 13. DECRYPTION

### decrypt()
Complete decryption process.

```javascript
function decrypt(ciphertext, deck) {
    // Remove spaces
    const formatted = ciphertext.replace(/\s/g, '');
    
    // Generate keystream (must use same deck state as encryption)
    const keystream = generateKeystream(deck, formatted.length);
    
    // Convert to numbers
    const ciphertextNumbers = textToNumbers(formatted);
    
    // Subtract keystream modulo 26
    const plaintextNumbers = ciphertextNumbers.map((c, i) => 
        subtractModulo26(c, keystream[i])
    );
    
    // Convert back to text
    const plaintext = numbersToText(plaintextNumbers);
    
    // Format into 5-character groups
    let formattedPlain = '';
    for (let i = 0; i < plaintext.length; i += 5) {
        formattedPlain += plaintext.substr(i, 5) + ' ';
    }
    
    return formattedPlain.trim();
}
```

**Critical:** Deck must be in the EXACT same initial state as used for encryption.

---

## 14. COMPLETE WORKFLOW EXAMPLE

### Example: Encrypting "HELLO"

```javascript
// 1. Initialize and shuffle deck (create key)
let deck = initializeDeck();
deck = shuffleDeck(deck);

// 2. Format plaintext
plaintext = "HELLO"
formatted = "HELLOXXXXX"  // Padded to 10 chars (divisible by 5)

// 3. Convert to numbers
plaintextNumbers = [8, 5, 12, 12, 15, 24, 24, 24, 24, 24]

// 4. Generate keystream (10 letters)
keystream = [7, 11, 3, 19, 8, 2, 15, 9, 1, 13]

// 5. Add modulo 26
ciphertextNumbers = [15, 16, 15, 5, 23, 26, 13, 7, 25, 11]

// 6. Convert to letters
ciphertext = "OPOEW ZMGYK"
```

### Example: Decrypting "OPOEW ZMGYK"

```javascript
// 1. Use same deck (same initial shuffle)
let deck = initializeDeck();
deck = shuffleDeck(deck);  // Same shuffle as encryption!

// 2. Remove spaces
formatted = "OPOEWZMGYK"

// 3. Convert to numbers
ciphertextNumbers = [15, 16, 15, 5, 23, 26, 13, 7, 25, 11]

// 4. Generate keystream (must be identical)
keystream = [7, 11, 3, 19, 8, 2, 15, 9, 1, 13]

// 5. Subtract modulo 26
plaintextNumbers = [8, 5, 12, 12, 15, 24, 24, 24, 24, 24]

// 6. Convert to letters
plaintext = "HELLOXXXXX"
```

---

## 15. KEY MANAGEMENT

### Important Notes on Keys

**Key = Deck Order**
- The "key" is the specific arrangement of the 54 cards
- 54! ≈ 2.31 × 10^71 possible keys
- Extremely large keyspace

**Key Distribution**
1. Sender shuffles deck thoroughly (10+ times)
2. Creates duplicate deck in identical order
3. One deck goes to sender, one to receiver
4. Both parties must maintain exact deck order

**Key Security**
- Never reuse the same deck order for multiple messages
- Keep deck physically secure
- Shuffle thoroughly between messages

---

## 16. ALGORITHM COMPLEXITY

### Time Complexity
- Each keystream letter: O(n) where n = 54 (deck size)
- Each algorithm step: O(n) for array operations
- Message encryption: O(m × n) where m = message length

### Space Complexity
- Deck storage: O(54) = O(1)
- Keystream storage: O(m) where m = message length
- Total: O(m)

---

## 17. COMMON PITFALLS

### Mistakes to Avoid

1. **Joker Movement Order**
   - Always move Joker A first, then Joker B
   - Do NOT move both simultaneously

2. **Triple Cut Confusion**
   - Jokers and cards between them stay in place
   - Only top and bottom sections swap

3. **Count Cut Bottom Card**
   - Bottom card MUST stay at bottom
   - Do not include it in the cut

4. **Output Card Jokers**
   - If output is a joker, discard and start over
   - Do NOT use joker as keystream value

5. **Deck State Synchronization**
   - Sender and receiver must start with identical decks
   - Both decks undergo identical transformations

---

## 18. TESTING FUNCTIONS

### Test Vector 1: Known Output

```javascript
function testEncryption() {
    // Use unshuffled deck for predictable output
    let deck = initializeDeck();
    
    const plaintext = "DONOTUSEPC";
    const expectedKeystream = "KDWUPONOWT";
    const expectedCiphertext = "OSKJJ JGTMW";
    
    // Run encryption
    const result = encrypt(plaintext, deck);
    
    console.log("Expected:", expectedCiphertext);
    console.log("Got:", result);
    console.log("Match:", result === expectedCiphertext);
}
```

### Test Vector 2: Round-trip Test

```javascript
function testRoundTrip() {
    let deck = initializeDeck();
    deck = shuffleDeck(deck);
    const deckCopy = JSON.parse(JSON.stringify(deck));
    
    const plaintext = "HELLO WORLD";
    const ciphertext = encrypt(plaintext, deck);
    
    // Reset deck to original state
    deck = JSON.parse(JSON.stringify(deckCopy));
    
    const decrypted = decrypt(ciphertext, deck);
    
    console.log("Original:", plaintext);
    console.log("Encrypted:", ciphertext);
    console.log("Decrypted:", decrypted);
    console.log("Match:", plaintext === decrypted.replace(/X+$/, ''));
}
```

---

## 19. OPTIMIZATION OPPORTUNITIES

### Potential Improvements

1. **Memoization**
   - Cache card number conversions
   - Store joker positions between operations

2. **Batch Processing**
   - Generate multiple keystream letters in one pass
   - Reduce function call overhead

3. **Array Pre-allocation**
   - Pre-allocate keystream array
   - Avoid dynamic resizing

---

## 20. SECURITY CONSIDERATIONS

### Cryptographic Strength
- Designed by Bruce Schneier
- Suitable for low-security applications
- Not recommended for high-security needs
- Manual implementation increases error risk

### Attack Vectors
- Physical deck compromise
- Implementation errors
- Deck state synchronization failures
- Side-channel attacks (timing, observation)

### Best Practices
- Use high-quality randomness for shuffling
- Protect deck physically
- Verify implementations thoroughly
- Consider using tested cipher for sensitive data

---

## END OF DOCUMENTATION

Total Functions Documented: 20+ core functions
Lines of Documentation: ~800+
Coverage: Complete algorithm implementation