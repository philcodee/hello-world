interface ConversionTableProps {
  onClose: () => void;
}

export function ConversionTable({ onClose }: ConversionTableProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-green-500 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 w-full max-w-[1400px] h-[90vh] flex flex-col text-green-500 font-mono">
        {/* Header */}
        <div className="bg-black border-b-2 border-green-500 p-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl">[ CARD VALUE REFERENCE ]</h2>
          <button 
            onClick={onClose}
            className="px-4 py-1 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            [ ✕ CLOSE ]
          </button>
        </div>

        <div className="p-6 flex gap-6 overflow-hidden flex-1">
          {/* Position Values Table - LEFT SIDE */}
          <div className="flex-1 border border-yellow-500 p-4 rounded bg-yellow-500/5 flex flex-col">
            <h3 className="text-center mb-4 text-yellow-400" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              POSITION VALUES (1-53)
            </h3>
            <div className="text-center mb-4 text-xs opacity-75">
              Used in Steps 4 & 5 for counting
            </div>
            
            <div className="grid grid-cols-4 gap-3 flex-1 overflow-y-auto" style={{ fontSize: '0.8rem' }}>
              {/* Clubs 1-13 */}
              <div className="space-y-1">
                <div className="text-green-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♣ CLUBS</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♣</span>
                    <span className="text-yellow-400" style={{ fontWeight: 700 }}>{i + 1}</span>
                  </div>
                ))}
              </div>

              {/* Diamonds 14-26 */}
              <div className="space-y-1">
                <div className="text-red-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♦ DIAMONDS</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♦</span>
                    <span className="text-yellow-400" style={{ fontWeight: 700 }}>{i + 14}</span>
                  </div>
                ))}
              </div>

              {/* Hearts 27-39 */}
              <div className="space-y-1">
                <div className="text-red-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♥ HEARTS</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♥</span>
                    <span className="text-yellow-400" style={{ fontWeight: 700 }}>{i + 27}</span>
                  </div>
                ))}
              </div>

              {/* Spades 40-52 */}
              <div className="space-y-1">
                <div className="text-green-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♠ SPADES</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♠</span>
                    <span className="text-yellow-400" style={{ fontWeight: 700 }}>{i + 40}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500 rounded text-center flex-shrink-0">
              <span className="text-purple-400" style={{ fontWeight: 700 }}>JA = 53 • JB = 53</span>
            </div>
          </div>

          {/* Keystream Values Table - RIGHT SIDE */}
          <div className="flex-1 border border-cyan-500 p-4 rounded bg-cyan-500/5 flex flex-col">
            <h3 className="text-center mb-4 text-cyan-400" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              KEYSTREAM VALUES (1-26)
            </h3>
            <div className="text-center mb-4 text-xs opacity-75">
              Final output value from Step 5
            </div>

            <div className="grid grid-cols-4 gap-3 flex-1 overflow-y-auto" style={{ fontSize: '0.8rem' }}>
              {/* Clubs 1-13 */}
              <div className="space-y-1">
                <div className="text-green-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♣ CLUBS</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♣</span>
                    <span className="text-cyan-400" style={{ fontWeight: 700 }}>{i + 1}</span>
                  </div>
                ))}
              </div>

              {/* Hearts 1-13 */}
              <div className="space-y-1">
                <div className="text-red-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♥ HEARTS</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♥</span>
                    <span className="text-cyan-400" style={{ fontWeight: 700 }}>{i + 1}</span>
                  </div>
                ))}
              </div>

              {/* Diamonds 14-26 */}
              <div className="space-y-1">
                <div className="text-red-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♦ DIAMONDS</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♦</span>
                    <span className="text-cyan-400" style={{ fontWeight: 700 }}>{i + 14}</span>
                  </div>
                ))}
              </div>

              {/* Spades 14-26 */}
              <div className="space-y-1">
                <div className="text-green-400 mb-2 text-center sticky top-0 bg-black/90 py-1" style={{ fontWeight: 700 }}>♠ SPADES</div>
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((card, i) => (
                  <div key={i} className="flex justify-between p-1.5 bg-black/40 rounded hover:bg-black/60 transition-colors">
                    <span>{card}♠</span>
                    <span className="text-cyan-400" style={{ fontWeight: 700 }}>{i + 14}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded text-center flex-shrink-0">
              <div className="text-red-400" style={{ fontWeight: 700 }}>⚠ JOKERS = INVALID</div>
              <div className="mt-1" style={{ fontSize: '0.7rem', opacity: 0.75 }}>Repeat from Step 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
