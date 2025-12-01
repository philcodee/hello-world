# Complete Encryption Flow

## Overview
The Pontifex cipher encryption flow has been fully implemented with seamless navigation between all stages.

## Flow Diagram

```
┌─────────────────┐
│  [ENCRYPT]      │ ← Click in header
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  ENCRYPT MODE                   │
│  - Type plaintext               │
│  - Press ENTER                  │
│  - Modal shows char count       │
│  - Press SPACE to continue      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  KEYSTREAM GENERATION           │
│  (GameplayCanvas)               │
│  - Yellow banner shows target   │
│  - Generate keystream (5 steps) │
│  - Progress: X / Y              │
│  - Button appears when ready    │
└────────┬────────────────────────┘
         │
         ▼ [CONTINUE TO ENCRYPTION →]
         │
┌─────────────────────────────────┐
│  ADD MODULO 26                  │
│  - Step-by-step encryption      │
│  - Shows math for each letter   │
│  - Auto-play feature            │
│  - Speed controls               │
│  - Complete ciphertext display  │
└────────┬────────────────────────┘
         │
         ▼ [CONTINUE →]
         │
┌─────────────────────────────────┐
│  ENCRYPTION COMPLETE            │
│  - Shows original plaintext     │
│  - Shows formatted plaintext    │
│  - Shows final ciphertext       │
│  - Copy to clipboard button     │
│  - Transmission instructions    │
└────────┬────────────────────────┘
         │
         ├──→ [ENCRYPT NEW MESSAGE]
         │
         └──→ [BACK TO KEYSTREAM]
```

## Components Created

### 1. EncryptMode.tsx
**Purpose:** Input screen for plaintext
**Features:**
- Terminal-style typing with blinking cursor
- Automatic uppercase conversion
- Word wrapping display
- Modal showing character count after padding
- Keyboard controls (ENTER, SPACE, ESC)

### 2. AddModulo26.tsx
**Purpose:** Show encryption math step-by-step
**Features:**
- Current calculation highlighted
- Progress bar showing completion
- Detailed breakdown of modulo 26 math
- Auto-play with speed controls (Slow/Normal/Fast/Very Fast)
- Manual navigation (PREV/NEXT)
- Complete ciphertext preview
- Reset button

### 3. EncryptionComplete.tsx
**Purpose:** Final results screen
**Features:**
- Success animation with checkmark
- Original plaintext display
- Formatted plaintext display
- Final ciphertext in highlighted box
- Copy to clipboard functionality
- Transmission instructions
- Options to start new encryption or return

## Data Flow

### State Management (Terminal.tsx)
```typescript
- encryptPlaintext: string       // User's original message
- encryptKeystreamLength: number // Required keystream length
- keystreamValues: number[]      // Generated keystream numbers
- finalCiphertext: string        // Encrypted result
```

### Screen Transitions
```typescript
type ScreenMode = 
  | 'intro'           // Opening screen
  | 'tutorial'        // Help/tutorial
  | 'gameplay'        // Keystream generation
  | 'encrypt'         // Plaintext input
  | 'addModulo26'     // Encryption math
  | 'encryptComplete' // Final results
```

## User Experience Features

### Visual Feedback
- **Yellow banner** in GameplayCanvas shows encryption context
- **Progress indicator** shows keystream generation: "X / Y"
- **Animated button** pulses when ready to proceed
- **Status in header** shows "🔒 ENCRYPTING..." during math steps
- **Success animation** on completion

### Control Flow
- **Clear button** to cancel encryption mode
- **Back buttons** at each step
- **Auto-advance** option in math step
- **Copy button** for final ciphertext

### Error Prevention
- Button only appears when sufficient keystream generated
- Modal prevents accidental continuation
- Clear visual feedback at each stage

## Technical Implementation

### Cipher Functions Used
From `utils/cipher.ts`:
- `formatPlaintext()` - Removes non-letters, pads to multiple of 5
- `textToNumbers()` - Converts A-Z to 1-26
- `addModulo26()` - Adds with wrapping
- `numbersToText()` - Converts back to letters

### Props Flow
```
Terminal
  ├─> EncryptMode (onContinue)
  ├─> GameplayCanvas (encryptPlaintext, encryptKeystreamLength, onProceedToEncryption)
  ├─> AddModulo26 (plaintext, keystream, onBack, onComplete)
  └─> EncryptionComplete (plaintext, ciphertext, onNewEncryption, onBackToKeystream)
```

## Testing the Flow

### Quick Test
1. Click `[ENCRYPT]` in header
2. Type: "HELLO WORLD"
3. Press ENTER → Modal shows 15 characters needed
4. Press SPACE → Navigate to keystream
5. Click `[BEGIN STEP 1]` and complete 5 steps
6. Repeat until 15 keystream values generated
7. Click `[CONTINUE TO ENCRYPTION →]`
8. Watch step-by-step math or use AUTO PLAY
9. See final ciphertext
10. Click COPY to clipboard
11. Start new encryption or return to keystream

## Future Enhancements

Potential additions:
- [ ] Save deck state for later use
- [ ] Export/import keystream
- [ ] Batch processing multiple messages
- [ ] Decryption flow (reverse process)
- [ ] Visual deck state during encryption
- [ ] Animation of cards during keystream generation
- [ ] Sound effects for retro terminal feel
- [ ] History of encrypted messages
