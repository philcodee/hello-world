import svgPaths from "./svg-txypqugq2n";

export default function BackOfCard() {
  return (
    <div className="relative size-full" data-name="Back of card">
      <div className="absolute bottom-[-2.86%] left-0 right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 864">
          <g filter="url(#filter0_d_68_128)" id="Back of card">
            <rect fill="var(--fill-0, black)" height="840" rx="30" width="600" />
            <rect height="824" rx="22" stroke="var(--stroke-0, #006600)" strokeWidth="16" width="584" x="8" y="8" />
            <path d={svgPaths.p3a27a280} id="Vector 1" stroke="var(--stroke-0, #00FF00)" strokeWidth="5" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="864" id="filter0_d_68_128" width="600" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="24" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_68_128" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_68_128" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}