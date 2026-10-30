import sharp from 'sharp';
import fs from 'fs';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0d13" />
      <stop offset="100%" stop-color="#08090c" />
    </linearGradient>
    <radialGradient id="subtleGlow" cx="20%" cy="10%" r="60%">
      <stop offset="0%" stop-color="rgba(120, 119, 198, 0.15)" />
      <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#subtleGlow)" />

  <!-- Outer Border Frame -->
  <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5" />

  <!-- Brand Top Bar -->
  <g transform="translate(80, 100)">
    <rect width="44" height="44" rx="10" fill="#181a20" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1" />
    <text x="22" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">M/A</text>
    
    <text x="64" y="28" font-family="monospace" font-size="16" fill="rgba(255, 255, 255, 0.5)">gonzatools.com.br</text>
  </g>

  <!-- Status indicator -->
  <g transform="translate(940, 112)">
    <circle cx="0" cy="0" r="4" fill="#10b981" />
    <text x="14" y="4" font-family="monospace" font-size="13" fill="#10b981">Available for work</text>
  </g>

  <!-- Main Headline -->
  <g transform="translate(80, 260)">
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" fill="#ffffff" letter-spacing="-1.5">
      Mateus Alves
    </text>
    <text x="0" y="55" font-family="monospace" font-size="24" font-weight="500" fill="#a1a1aa">
      Software Engineer · Python (Django &amp; uv) &amp; TypeScript
    </text>
    <text x="0" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="rgba(255, 255, 255, 0.7)" width="800">
      Arquitetura de backend escalável, tooling ágil com uv e interfaces reativas modernas.
    </text>
  </g>

  <!-- Tags / Specializations -->
  <g transform="translate(80, 480)">
    <!-- Tag 1 -->
    <rect x="0" y="0" width="130" height="34" rx="6" fill="#181a20" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <text x="65" y="22" font-family="monospace" font-size="13" fill="#ffffff" text-anchor="middle">Python 3.12+</text>

    <!-- Tag 2 -->
    <rect x="145" y="0" width="140" height="34" rx="6" fill="#181a20" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <text x="215" y="22" font-family="monospace" font-size="13" fill="#ffffff" text-anchor="middle">Django / DRF</text>

    <!-- Tag 3 -->
    <rect x="300" y="0" width="130" height="34" rx="6" fill="#181a20" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <text x="365" y="22" font-family="monospace" font-size="13" fill="#10b981" text-anchor="middle">uv (Astral)</text>

    <!-- Tag 4 -->
    <rect x="445" y="0" width="130" height="34" rx="6" fill="#181a20" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <text x="510" y="22" font-family="monospace" font-size="13" fill="#ffffff" text-anchor="middle">TypeScript</text>

    <!-- Tag 5 -->
    <rect x="590" y="0" width="130" height="34" rx="6" fill="#181a20" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <text x="655" y="22" font-family="monospace" font-size="13" fill="#ffffff" text-anchor="middle">PostgreSQL</text>
  </g>

  <!-- GitHub profile watermark -->
  <g transform="translate(880, 502)">
    <text x="0" y="0" font-family="monospace" font-size="14" fill="rgba(255, 255, 255, 0.4)">github.com/Mateusallz1</text>
  </g>
</svg>
`;

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

await sharp(Buffer.from(svg))
  .png({ quality: 95 })
  .toFile('public/og-image.png');

console.log('og-image.png generated successfully at 1200x630!');
