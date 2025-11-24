export function TerminalHeader({ onRestart, showRestart }: { onRestart: () => void; showRestart: boolean }) {
  return (
    <div className="bg-green-500 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-black font-mono">TERMINAL v1.0</span>
      </div>
      <div className="flex items-center gap-4">
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