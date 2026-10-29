import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = './src/assets/articles';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svg = `
<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f1117" />
      <stop offset="100%" stop-color="#090a0f" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bg)" />
  <rect width="1200" height="675" fill="url(#grid)" />

  <!-- Outer frame border -->
  <rect x="30" y="30" width="1140" height="615" rx="12" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />

  <!-- Top bar -->
  <g transform="translate(60, 65)">
    <text x="0" y="16" font-family="monospace" font-size="13" font-weight="bold" fill="#10b981">● SYSTEM BENCHMARK ARCHITECTURE</text>
    <text x="1080" y="16" font-family="monospace" font-size="13" fill="rgba(255, 255, 255, 0.4)" text-anchor="end">ASTRO:ASSETS + SHARP</text>
  </g>
  <line x1="60" y1="95" x2="1140" y2="95" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

  <!-- Content Flow Nodes -->
  <!-- Node 1: Resolution -->
  <g transform="translate(100, 180)">
    <rect width="280" height="260" rx="8" fill="#151821" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <rect x="20" y="20" width="36" height="36" rx="6" fill="#222734" />
    <text x="38" y="44" font-family="monospace" font-size="18" fill="#a1a1aa" text-anchor="middle">01</text>
    <text x="20" y="90" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff">Resolução de Deps</text>
    <text x="20" y="125" font-family="monospace" font-size="12" fill="#71717a">pip / poetry (Python single-thread)</text>
    <text x="20" y="145" font-family="monospace" font-size="13" font-weight="bold" fill="#ef4444">~25s a 45s</text>
    <line x1="20" y1="170" x2="260" y2="170" stroke="rgba(255, 255, 255, 0.08)" />
    <text x="20" y="200" font-family="monospace" font-size="12" fill="#71717a">uv (Rust PubGrub paralelo)</text>
    <text x="20" y="220" font-family="monospace" font-size="14" font-weight="bold" fill="#10b981">~0.4s (100x mais rápido)</text>
  </g>

  <!-- Arrow 1 -> 2 -->
  <g transform="translate(415, 300)">
    <line x1="0" y1="0" x2="50" y2="0" stroke="rgba(255, 255, 255, 0.25)" stroke-width="2" stroke-dasharray="4 4" />
    <polygon points="50,-4 58,0 50,4" fill="rgba(255, 255, 255, 0.5)" />
  </g>

  <!-- Node 2: Cache Layer -->
  <g transform="translate(490, 180)">
    <rect width="280" height="260" rx="8" fill="#151821" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <rect x="20" y="20" width="36" height="36" rx="6" fill="#222734" />
    <text x="38" y="44" font-family="monospace" font-size="18" fill="#a1a1aa" text-anchor="middle">02</text>
    <text x="20" y="90" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff">Armazenamento Cache</text>
    <text x="20" y="125" font-family="monospace" font-size="12" fill="#71717a">Global Content-Addressable</text>
    <text x="20" y="145" font-family="monospace" font-size="13" fill="#a1a1aa">Desduplicação por hash SHA-256</text>
    <line x1="20" y1="170" x2="260" y2="170" stroke="rgba(255, 255, 255, 0.08)" />
    <text x="20" y="200" font-family="monospace" font-size="12" fill="#71717a">Economia de Disco</text>
    <text x="20" y="220" font-family="monospace" font-size="14" font-weight="bold" fill="#38bdf8">Hardlinks instantâneos</text>
  </g>

  <!-- Arrow 2 -> 3 -->
  <g transform="translate(805, 300)">
    <line x1="0" y1="0" x2="50" y2="0" stroke="rgba(255, 255, 255, 0.25)" stroke-width="2" stroke-dasharray="4 4" />
    <polygon points="50,-4 58,0 50,4" fill="rgba(255, 255, 255, 0.5)" />
  </g>

  <!-- Node 3: Runtime Execution -->
  <g transform="translate(880, 180)">
    <rect width="240" height="260" rx="8" fill="#151821" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <rect x="20" y="20" width="36" height="36" rx="6" fill="#222734" />
    <text x="38" y="44" font-family="monospace" font-size="18" fill="#a1a1aa" text-anchor="middle">03</text>
    <text x="20" y="90" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff">Execução Ágil</text>
    <text x="20" y="125" font-family="monospace" font-size="12" fill="#71717a">uv run manage.py</text>
    <text x="20" y="145" font-family="monospace" font-size="13" font-weight="bold" fill="#10b981">Auto-venv on the fly</text>
    <line x1="20" y1="170" x2="220" y2="170" stroke="rgba(255, 255, 255, 0.08)" />
    <text x="20" y="200" font-family="monospace" font-size="12" fill="#71717a">Integração CI/CD</text>
    <text x="20" y="220" font-family="monospace" font-size="14" font-weight="bold" fill="#a855f7">Zero overhead</text>
  </g>

  <!-- Bottom Details -->
  <g transform="translate(60, 540)">
    <text x="0" y="0" font-family="monospace" font-size="13" font-weight="bold" fill="#ffffff">Pipeline de Alta Performance:</text>
    <text x="0" y="24" font-family="monospace" font-size="12" fill="#a1a1aa">uv venv + uv pip sync substituindo fluxos tradicionais no ecossistema Django.</text>
  </g>
</svg>
`;

async function run() {
  const outputPath = path.join(outDir, 'uv-architecture.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log('Generated article asset at:', outputPath);
}

run().catch(console.error);
