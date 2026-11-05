import React, { useState, useRef } from 'react';

interface NoteItem {
  name: string;
  degree: string;
  intervalName: string;
  distanceInSemitones: number;
  stepToNext?: 'T' | 'S';
  isAccidental?: boolean;
  freq: number;
}

interface ScaleConfig {
  root: string;
  label: string;
  accidentals: string;
  accidentalType: 'none' | 'sharp' | 'flat';
  cycleInfo: string;
  ruleExplanation: string;
  notes: NoteItem[];
}

const SCALES_DATA: Record<string, ScaleConfig> = {
  C: {
    root: 'C',
    label: 'Dó Maior',
    accidentals: 'Nenhum (Todas as notas são naturais)',
    accidentalType: 'none',
    cycleInfo: 'Ponto Zero do Ciclo de Quintas',
    ruleExplanation:
      'A escala de Dó é o padrão de referência da música ocidental. Os semitons naturais (E-F e B-C) caem exatamente nos passos 3-4 e 7-8 da fórmula sem necessidade de nenhum acidente.',
    notes: [
      { name: 'C', degree: 'I', intervalName: 'Tônica', distanceInSemitones: 0, stepToNext: 'T', freq: 261.63 },
      { name: 'D', degree: 'II', intervalName: '2ª Maior', distanceInSemitones: 2, stepToNext: 'T', freq: 293.66 },
      { name: 'E', degree: 'III', intervalName: '3ª Maior', distanceInSemitones: 4, stepToNext: 'S', freq: 329.63 },
      { name: 'F', degree: 'IV', intervalName: '4ª Justa', distanceInSemitones: 5, stepToNext: 'T', freq: 349.23 },
      { name: 'G', degree: 'V', intervalName: '5ª Justa', distanceInSemitones: 7, stepToNext: 'T', freq: 392.00 },
      { name: 'A', degree: 'VI', intervalName: '6ª Maior', distanceInSemitones: 9, stepToNext: 'T', freq: 440.00 },
      { name: 'B', degree: 'VII', intervalName: 'Sensível', distanceInSemitones: 11, stepToNext: 'S', freq: 493.88 },
      { name: 'C', degree: 'VIII', intervalName: 'Oitava', distanceInSemitones: 12, freq: 523.25 },
    ],
  },
  G: {
    root: 'G',
    label: 'Sol Maior',
    accidentals: '1♯ (F♯)',
    accidentalType: 'sharp',
    cycleInfo: '+1ª Quinta (Avanço no sentido horário)',
    ruleExplanation:
      'Ao partir de G, o 7º grau cairia na nota F natural, distando 1 tom inteiro de G. Para satisfazer a regra da sensível (+S / meio tom da oitava), o F é elevado 1 traste para F♯.',
    notes: [
      { name: 'G', degree: 'I', intervalName: 'Tônica', distanceInSemitones: 0, stepToNext: 'T', freq: 392.00 },
      { name: 'A', degree: 'II', intervalName: '2ª Maior', distanceInSemitones: 2, stepToNext: 'T', freq: 440.00 },
      { name: 'B', degree: 'III', intervalName: '3ª Maior', distanceInSemitones: 4, stepToNext: 'S', freq: 493.88 },
      { name: 'C', degree: 'IV', intervalName: '4ª Justa', distanceInSemitones: 5, stepToNext: 'T', freq: 523.25 },
      { name: 'D', degree: 'V', intervalName: '5ª Justa', distanceInSemitones: 7, stepToNext: 'T', freq: 587.33 },
      { name: 'E', degree: 'VI', intervalName: '6ª Maior', distanceInSemitones: 9, stepToNext: 'T', freq: 659.25 },
      { name: 'F♯', degree: 'VII', intervalName: 'Sensível', distanceInSemitones: 11, stepToNext: 'S', isAccidental: true, freq: 739.99 },
      { name: 'G', degree: 'VIII', intervalName: 'Oitava', distanceInSemitones: 12, freq: 783.99 },
    ],
  },
  D: {
    root: 'D',
    label: 'Ré Maior',
    accidentals: '2♯ (F♯, C♯)',
    accidentalType: 'sharp',
    cycleInfo: '+2ª Quinta',
    ruleExplanation:
      'Herda o F♯ da escala de Sol anterior e adiciona um novo sustenido no seu próprio 7º grau (C vira C♯) para criar a atração gravitacional em direção à tônica D.',
    notes: [
      { name: 'D', degree: 'I', intervalName: 'Tônica', distanceInSemitones: 0, stepToNext: 'T', freq: 293.66 },
      { name: 'E', degree: 'II', intervalName: '2ª Maior', distanceInSemitones: 2, stepToNext: 'T', freq: 329.63 },
      { name: 'F♯', degree: 'III', intervalName: '3ª Maior', distanceInSemitones: 4, stepToNext: 'S', isAccidental: true, freq: 369.99 },
      { name: 'G', degree: 'IV', intervalName: '4ª Justa', distanceInSemitones: 5, stepToNext: 'T', freq: 392.00 },
      { name: 'A', degree: 'V', intervalName: '5ª Justa', distanceInSemitones: 7, stepToNext: 'T', freq: 440.00 },
      { name: 'B', degree: 'VI', intervalName: '6ª Maior', distanceInSemitones: 9, stepToNext: 'T', freq: 493.88 },
      { name: 'C♯', degree: 'VII', intervalName: 'Sensível', distanceInSemitones: 11, stepToNext: 'S', isAccidental: true, freq: 554.37 },
      { name: 'D', degree: 'VIII', intervalName: 'Oitava', distanceInSemitones: 12, freq: 587.33 },
    ],
  },
  A: {
    root: 'A',
    label: 'Lá Maior',
    accidentals: '3♯ (F♯, C♯, G♯)',
    accidentalType: 'sharp',
    cycleInfo: '+3ª Quinta',
    ruleExplanation:
      'Herda os acidentes F♯ e C♯ e adiciona o G♯ no 7º grau. A distância entre a tônica A e a sensível G♯ passa a ser o semitom exigido pela fórmula.',
    notes: [
      { name: 'A', degree: 'I', intervalName: 'Tônica', distanceInSemitones: 0, stepToNext: 'T', freq: 220.00 },
      { name: 'B', degree: 'II', intervalName: '2ª Maior', distanceInSemitones: 2, stepToNext: 'T', freq: 246.94 },
      { name: 'C♯', degree: 'III', intervalName: '3ª Maior', distanceInSemitones: 4, stepToNext: 'S', isAccidental: true, freq: 277.18 },
      { name: 'D', degree: 'IV', intervalName: '4ª Justa', distanceInSemitones: 5, stepToNext: 'T', freq: 293.66 },
      { name: 'E', degree: 'V', intervalName: '5ª Justa', distanceInSemitones: 7, stepToNext: 'T', freq: 329.63 },
      { name: 'F♯', degree: 'VI', intervalName: '6ª Maior', distanceInSemitones: 9, stepToNext: 'T', isAccidental: true, freq: 369.99 },
      { name: 'G♯', degree: 'VII', intervalName: 'Sensível', distanceInSemitones: 11, stepToNext: 'S', isAccidental: true, freq: 415.30 },
      { name: 'A', degree: 'VIII', intervalName: 'Oitava', distanceInSemitones: 12, freq: 440.00 },
    ],
  },
  E: {
    root: 'E',
    label: 'Mi Maior',
    accidentals: '4♯ (F♯, C♯, G♯, D♯)',
    accidentalType: 'sharp',
    cycleInfo: '+4ª Quinta',
    ruleExplanation:
      'Quatro acidentes forçados. O novo sustenido surge em D♯ (7º grau). Sem o D♯, a distância até a oitava E seria de 1 tom inteiro e desobedeceria a fórmula T-T-S-T-T-T-S.',
    notes: [
      { name: 'E', degree: 'I', intervalName: 'Tônica', distanceInSemitones: 0, stepToNext: 'T', freq: 329.63 },
      { name: 'F♯', degree: 'II', intervalName: '2ª Maior', distanceInSemitones: 2, stepToNext: 'T', isAccidental: true, freq: 369.99 },
      { name: 'G♯', degree: 'III', intervalName: '3ª Maior', distanceInSemitones: 4, stepToNext: 'S', isAccidental: true, freq: 415.30 },
      { name: 'A', degree: 'IV', intervalName: '4ª Justa', distanceInSemitones: 5, stepToNext: 'T', freq: 440.00 },
      { name: 'B', degree: 'V', intervalName: '5ª Justa', distanceInSemitones: 7, stepToNext: 'T', freq: 493.88 },
      { name: 'C♯', degree: 'VI', intervalName: '6ª Maior', distanceInSemitones: 9, stepToNext: 'T', isAccidental: true, freq: 554.37 },
      { name: 'D♯', degree: 'VII', intervalName: 'Sensível', distanceInSemitones: 11, stepToNext: 'S', isAccidental: true, freq: 622.25 },
      { name: 'E', degree: 'VIII', intervalName: 'Oitava', distanceInSemitones: 12, freq: 659.25 },
    ],
  },
  B: {
    root: 'B',
    label: 'Si Maior',
    accidentals: '5♯ (F♯, C♯, G♯, D♯, A♯)',
    accidentalType: 'sharp',
    cycleInfo: '+5ª Quinta',
    ruleExplanation:
      'Cinco sustenidos acumulados. Quase todas as notas são alteradas, restando apenas B e E naturais. O último sustenido adicionado é A♯.',
    notes: [
      { name: 'B', degree: 'I', intervalName: 'Tônica', distanceInSemitones: 0, stepToNext: 'T', freq: 246.94 },
      { name: 'C♯', degree: 'II', intervalName: '2ª Maior', distanceInSemitones: 2, stepToNext: 'T', isAccidental: true, freq: 277.18 },
      { name: 'D♯', degree: 'III', intervalName: '3ª Maior', distanceInSemitones: 4, stepToNext: 'S', isAccidental: true, freq: 311.13 },
      { name: 'E', degree: 'IV', intervalName: '4ª Justa', distanceInSemitones: 5, stepToNext: 'T', freq: 329.63 },
      { name: 'F♯', degree: 'V', intervalName: '5ª Justa', distanceInSemitones: 7, stepToNext: 'T', isAccidental: true, freq: 369.99 },
      { name: 'G♯', degree: 'VI', intervalName: '6ª Maior', distanceInSemitones: 9, stepToNext: 'T', isAccidental: true, freq: 415.30 },
      { name: 'A♯', degree: 'VII', intervalName: 'Sensível', distanceInSemitones: 11, stepToNext: 'S', isAccidental: true, freq: 466.16 },
      { name: 'B', degree: 'VIII', intervalName: 'Oitava', distanceInSemitones: 12, freq: 493.88 },
    ],
  },
  F: {
    root: 'F',
    label: 'Fá Maior',
    accidentals: '1♭ (B♭)',
    accidentalType: 'flat',
    cycleInfo: 'Ciclo de Quartas / Subdominante',
    ruleExplanation:
      'A única das 7 notas naturais que necessita de um BEMOL. Entre o 3º grau (A) e o 4º grau (B) a distância natural é de 1 Tom (2 casas). Para forçar o Semitom (+S) exigido pela fórmula, recua-se o B em 1 casa para B♭.',
    notes: [
      { name: 'F', degree: 'I', intervalName: 'Tônica', distanceInSemitones: 0, stepToNext: 'T', freq: 349.23 },
      { name: 'G', degree: 'II', intervalName: '2ª Maior', distanceInSemitones: 2, stepToNext: 'T', freq: 392.00 },
      { name: 'A', degree: 'III', intervalName: '3ª Maior', distanceInSemitones: 4, stepToNext: 'S', freq: 440.00 },
      { name: 'B♭', degree: 'IV', intervalName: '4ª Justa', distanceInSemitones: 5, stepToNext: 'T', isAccidental: true, freq: 466.16 },
      { name: 'C', degree: 'V', intervalName: '5ª Justa', distanceInSemitones: 7, stepToNext: 'T', freq: 523.25 },
      { name: 'D', degree: 'VI', intervalName: '6ª Maior', distanceInSemitones: 9, stepToNext: 'T', freq: 587.33 },
      { name: 'E', degree: 'VII', intervalName: 'Sensível', distanceInSemitones: 11, stepToNext: 'S', freq: 659.25 },
      { name: 'F', degree: 'VIII', intervalName: 'Oitava', distanceInSemitones: 12, freq: 698.46 },
    ],
  },
};

const ROOT_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F'];

export default function ScaleFormulaInteractive() {
  const [activeRoot, setActiveRoot] = useState<string>('C');
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlayingScale, setIsPlayingScale] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentScale = SCALES_DATA[activeRoot];

  // Helper to init/get AudioContext
  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play a single note frequency
  const playTone = (freq: number, duration = 0.45, onEnd?: () => void) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Warm natural tone
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Smooth envelope attack and release
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      if (onEnd) {
        setTimeout(onEnd, duration * 1000);
      }
    } catch {
      // Audio not supported or blocked
    }
  };

  // Play a note when clicked directly
  const handleNoteClick = (idx: number, freq: number) => {
    setPlayingIndex(idx);
    playTone(freq, 0.4, () => setPlayingIndex(null));
  };

  // Play full scale sequentially
  const handlePlayFullScale = () => {
    if (isPlayingScale) return;
    setIsPlayingScale(true);

    const notes = currentScale.notes;
    notes.forEach((item, idx) => {
      setTimeout(() => {
        setPlayingIndex(idx);
        playTone(item.freq, 0.38, () => {
          if (idx === notes.length - 1) {
            setPlayingIndex(null);
            setIsPlayingScale(false);
          }
        });
      }, idx * 400);
    });
  };

  return (
    <div className="my-8 not-prose border border-primary/20 rounded-xl bg-base-100 shadow-md overflow-hidden ring-1 ring-primary/10">
      {/* Island Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-base-200/90 via-base-200/50 to-base-100 border-b border-base-content/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-primary font-mono text-xs font-bold tracking-wider">
              Interativo
            </span>
            <h4 className="text-sm sm:text-base font-bold text-base-content">
              Simulador da Fórmula Diatônica
            </h4>
          </div>

          <button
            onClick={handlePlayFullScale}
            disabled={isPlayingScale}
            className={`btn btn-sm btn-primary gap-2 font-mono font-bold shadow-sm transition-transform active:scale-95 ${
              isPlayingScale ? 'loading' : ''
            }`}
          >
            {isPlayingScale ? (
              <span>Tocando Escala...</span>
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Ouvir Escala ({currentScale.root})</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-base-content/70 mt-2 font-mono">
          Selecione uma nota fundamental abaixo para deduzir a escala, ver o motivo dos acidentes e tocar com a Web Audio API.
        </p>

        {/* Root Selector Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto pb-1">
          <span className="text-xs font-mono font-semibold text-base-content/50 uppercase tracking-wider mr-1 shrink-0">
            Tônica:
          </span>
          {ROOT_KEYS.map((key) => {
            const isSelected = activeRoot === key;
            const item = SCALES_DATA[key];
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveRoot(key);
                  setPlayingIndex(null);
                }}
                className={`relative px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-primary text-primary-content shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105'
                    : 'bg-base-200/80 hover:bg-base-300 text-base-content/80'
                }`}
              >
                {key}
                {item.accidentalType !== 'none' && (
                  <span className="ml-1 text-[10px] opacity-80">
                    {item.accidentalType === 'sharp' ? '♯' : '♭'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Island Body */}
      <div className="p-4 sm:p-5 space-y-5">
        {/* Active Scale Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-base-200/40 border border-base-content/10">
          <div>
            <span className="text-xs font-mono text-base-content/50 uppercase">Escala Selecionada:</span>
            <div className="text-base font-extrabold text-base-content flex items-center gap-2">
              <span>{currentScale.label}</span>
              <span className="text-xs font-mono font-normal text-base-content/60">
                ({currentScale.cycleInfo})
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-base-content/50 uppercase block sm:text-right">Acidentes:</span>
            <span
              className={`badge font-mono text-xs font-bold ${
                currentScale.accidentalType === 'none'
                  ? 'badge-ghost text-base-content/60'
                  : currentScale.accidentalType === 'sharp'
                  ? 'badge-warning font-bold'
                  : 'badge-info font-bold'
              }`}
            >
              {currentScale.accidentals}
            </span>
          </div>
        </div>

        {/* Visual Ruler / Step Sequence */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-base-content/60 mb-2">
            <span>Passo a Passo da Escala (Clique em uma nota para tocá-la)</span>
            <span className="text-[11px] text-emerald-500 font-semibold">T = 1 Tom (2 trastes) · S = 1 Semitom (1 traste)</span>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-8 gap-2">
            {currentScale.notes.map((note, idx) => {
              const isHighlight = playingIndex === idx;
              const isLast = idx === currentScale.notes.length - 1;

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <button
                    onClick={() => handleNoteClick(idx, note.freq)}
                    className={`w-full py-3 px-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 ${
                      isHighlight
                        ? 'bg-primary text-primary-content border-primary shadow-lg ring-4 ring-primary/30 scale-105 z-10'
                        : note.isAccidental
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/40'
                        : 'bg-base-200/60 hover:bg-base-300 text-base-content border-base-content/15'
                    }`}
                  >
                    <span className="text-[10px] font-mono opacity-60 uppercase font-semibold">
                      Grau {note.degree}
                    </span>
                    <span className="text-base sm:text-lg font-black font-mono tracking-tight my-0.5">
                      {note.name}
                    </span>
                    <span className="text-[9px] font-mono opacity-70 truncate max-w-full">
                      {note.intervalName}
                    </span>
                    <span className="text-[9px] font-mono opacity-50 mt-1">
                      {note.distanceInSemitones}st
                    </span>
                  </button>

                  {/* Interval Step connector */}
                  {!isLast && note.stepToNext && (
                    <div className="mt-1 flex items-center justify-center">
                      <span
                        className={`text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full ${
                          note.stepToNext === 'T'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black ring-1 ring-amber-500/40'
                        }`}
                        title={note.stepToNext === 'T' ? '+1 Tom (2 casas)' : '+1 Semitom (1 casa)'}
                      >
                        +{note.stepToNext}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithm Explanation Box */}
        <div className="p-3.5 rounded-lg bg-base-200/30 border border-base-content/10 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-primary font-bold mb-1">
            <span>⚙️</span>
            <span>Por que essa escala tem esses acidentes?</span>
          </div>
          <p className="text-base-content/80 leading-relaxed">
            {currentScale.ruleExplanation}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-base-200/40 border-t border-base-content/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-base-content/60 gap-2">
        <span>⚡ Áudio sintetizado em tempo real com OscillatorNode (Triangle)</span>
        <span className="text-primary font-medium">Hidratação client:visible no Astro</span>
      </div>
    </div>
  );
}
