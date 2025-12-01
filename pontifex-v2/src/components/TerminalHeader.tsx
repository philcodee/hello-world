type ScreenMode = 'intro' | 'tutorial' | 'gameplay' | 'encrypt' | 'addModulo26' | 'encryptComplete' | 'decrypt' | 'subtractModulo26' | 'decryptComplete';

interface TerminalHeaderProps {
  onRestart: () => void;
  showRestart: boolean;
  currentScreen?: ScreenMode;
  onScreenChange?: (screen: ScreenMode) => void;
}

export function TerminalHeader({ 
  onRestart, 
  showRestart, 
  currentScreen = 'gameplay',
  onScreenChange 
}: TerminalHeaderProps) {
  return (
    <div className="bg-green-500 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-black font-mono">PONTIFEX</span>
      </div>
      <div className="flex items-center gap-3">
        {onScreenChange && (
          <>
            {/* Show status for encryption flow screens */}
            {(currentScreen === 'addModulo26' || currentScreen === 'encryptComplete') && (
              <div className="text-black font-mono text-sm px-3 py-1 bg-green-700 rounded">
                ENCRYPTING...
              </div>
            )}
            {/* Show status for decryption flow screens */}
            {(currentScreen === 'subtractModulo26' || currentScreen === 'decryptComplete') && (
              <div className="text-black font-mono text-sm px-3 py-1 bg-green-700 rounded">
                DECRYPTING...
              </div>
            )}
            {/* Normal navigation buttons */}
            {currentScreen !== 'addModulo26' && currentScreen !== 'encryptComplete' && currentScreen !== 'subtractModulo26' && currentScreen !== 'decryptComplete' && (
              <>
                <button
                  onClick={() => onScreenChange('encrypt')}
                  className={`text-black font-mono text-sm hover:bg-green-600 px-3 py-1 rounded transition-colors ${
                    currentScreen === 'encrypt' ? 'bg-green-700 font-bold' : 'border border-black'
                  }`}
                >
                  [ENCRYPT]
                </button>
                <button
                  onClick={() => onScreenChange('decrypt')}
                  className={`text-black font-mono text-sm hover:bg-green-600 px-3 py-1 rounded transition-colors ${
                    currentScreen === 'decrypt' ? 'bg-green-700 font-bold' : 'border border-black'
                  }`}
                >
                  [DECRYPT]
                </button>
                <button
                  onClick={() => onScreenChange('tutorial')}
                  className={`text-black font-mono text-sm hover:bg-green-600 px-3 py-1 rounded transition-colors ${
                    currentScreen === 'tutorial' ? 'bg-green-700 font-bold' : 'border border-black'
                  }`}
                >
                  [HELP]
                </button>
              </>
            )}
          </>
        )}
        {showRestart && (
          <button
            onClick={onRestart}
            className="text-black font-mono text-sm hover:bg-green-600 px-3 py-1 rounded transition-colors border border-black"
          >
            [RESTART]
          </button>
        )}
        <div className="text-black font-mono text-sm">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}