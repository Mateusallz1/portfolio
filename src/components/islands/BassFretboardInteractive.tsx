import React, { useState, useRef, useEffect, useCallback } from 'react';

type StudyMode = 'naturals' | 'fifth-fret' | 'triad-158' | 'major-scale';
type NotationMode = 'cipher' | 'solfege';
type BpmOption = 60 | 80 | 100;

interface BassStringDef {
  id: 'G' | 'D' | 'A' | 'E';
  number: 1 | 2 | 3 | 4;
  openMidi: number;
  gaugeClass: string;
  accessibleName: string;
}

interface ActiveNoteInfo {
  cipherName: string;
  solfegeName: string;
  octave: number;
  freq: number;
  stringId: BassStringDef['id'];
  stringNumber: number;
  fret: number;
  roleLabel?: string;
}

interface HighlightCell {
  stringId: BassStringDef['id'];
  fret: number;
  badge: string;
  roleLabel: string;
  variant: 'root' | 'fifth' | 'octave' | 'scale' | 'accidental-scale' | 'pair-1' | 'pair-2' | 'pair-3' | 'natural' | 'semitone';
}

const FRETS = Array.from({ length: 13 }, (_, i) => i);
const INLAY_FRETS = new Set([3, 5, 7, 9, 12]);

const BASS_STRINGS: BassStringDef[] = [
  { id: 'G', number: 1, openMidi: 43, gaugeClass: 'h-[2px]', accessibleName: '1ª corda (Sol / G)' },
  { id: 'D', number: 2, openMidi: 38, gaugeClass: 'h-[2.5px]', accessibleName: '2ª corda (Ré / D)' },
  { id: 'A', number: 3, openMidi: 33, gaugeClass: 'h-[3px]', accessibleName: '3ª corda (Lá / A)' },
  { id: 'E', number: 4, openMidi: 28, gaugeClass: 'h-[3.5px]', accessibleName: '4ª corda (Mi / E)' },
];

const CHROMATIC_CIPHER = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const;
const CHROMATIC_SOLFEGE = ['Dó', 'Dó♯', 'Ré', 'Ré♯', 'Mi', 'Fá', 'Fá♯', 'Sol', 'Sol♯', 'Lá', 'Lá♯', 'Si'] as const;
const NATURAL_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const SEMITONE_BOUNDARY_CLASSES = new Set([0, 4, 5, 11]); // B, C, E, F

const TRIAD_ROOTS = ['E', 'F', 'G', 'A', 'B', 'C', 'D'] as const;
type TriadRootKey = (typeof TRIAD_ROOTS)[number];

const SCALE_ROOTS = ['G', 'A', 'B', 'C', 'D'] as const;
type ScaleRootKey = (typeof SCALE_ROOTS)[number];

const TRIAD_ANCHORS: Record<TriadRootKey, { stringId: 'E' | 'A'; fret: number }> = {
  E: { stringId: 'E', fret: 0 },
  F: { stringId: 'E', fret: 1 },
  G: { stringId: 'E', fret: 3 },
  A: { stringId: 'E', fret: 5 },
  B: { stringId: 'A', fret: 2 },
  C: { stringId: 'A', fret: 3 },
  D: { stringId: 'A', fret: 5 },
};

const SCALE_ANCHORS: Record<ScaleRootKey, { stringId: 'E' | 'A'; fret: number }> = {
  G: { stringId: 'E', fret: 3 },
  A: { stringId: 'E', fret: 5 },
  B: { stringId: 'A', fret: 2 },
  C: { stringId: 'A', fret: 3 },
  D: { stringId: 'A', fret: 5 },
};

const MODE_OPTIONS: { id: StudyMode; label: string; summary: string }[] = [
  {
    id: 'naturals',
    label: 'Notas Naturais',
    summary: 'Mapeia todas as notas sem sustenidos e destaca os semitons naturais E–F e B–C (1 casa de distância).',
  },
  {
    id: 'fifth-fret',
    label: 'Regra da 5ª Casa',
    summary: 'Mostra os 3 pares de afinação em uníssono: a 5ª casa de uma corda grave soa igual à corda de baixo solta.',
  },
  {
    id: 'triad-158',
    label: 'Triângulo 1–5–8',
    summary: 'Desenho universal de Tônica (1), Quinta Justa (5) e Oitava (8) aplicável em qualquer região do braço.',
  },
  {
    id: 'major-scale',
    label: 'Escala Maior',
    summary: 'A mesma fórmula geométrica da harmonia (T–T–S–T–T–T–S) traduzida para 1 oitava simétrica no baixo.',
  },
];

function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function getNoteMeta(midi: number) {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return {
    pitchClass: pc,
    cipher: CHROMATIC_CIPHER[pc],
    solfege: CHROMATIC_SOLFEGE[pc],
    octave,
    freq: midiToFrequency(midi),
    isNatural: NATURAL_PITCH_CLASSES.has(pc),
    isSemitoneBoundary: SEMITONE_BOUNDARY_CLASSES.has(pc),
  };
}

function cellKey(stringId: BassStringDef['id'], fret: number): string {
  return `${stringId}-${fret}`;
}

function getStringIndex(stringId: BassStringDef['id']): number {
  return BASS_STRINGS.findIndex((s) => s.id === stringId);
}

export default function BassFretboardInteractive() {
  const [studyMode, setStudyMode] = useState<StudyMode>('naturals');
  const [notation, setNotation] = useState<NotationMode>('cipher');
  const [triadRoot, setTriadRoot] = useState<TriadRootKey>('G');
  const [scaleRoot, setScaleRoot] = useState<ScaleRootKey>('C');
  const [activeCellKey, setActiveCellKey] = useState<string | null>(null);
  const [lastNote, setLastNote] = useState<ActiveNoteInfo | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  // Metronome state
  const [bpm, setBpm] = useState<BpmOption>(80);
  const [isMetronomeRunning, setIsMetronomeRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sequenceTimeoutsRef = useRef<number[]>([]);
  const metronomeIntervalRef = useRef<number | null>(null);
  const beatCounterRef = useRef<number>(0);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const clearSequenceTimers = useCallback(() => {
    sequenceTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    sequenceTimeoutsRef.current = [];
    setIsPlayingSequence(false);
  }, []);

  // Electric bass pizzicato synthesis (fundamental + 2nd harmonic for laptop/phone audibility)
  const playBassNote = useCallback(
    (midi: number, duration = 0.72) => {
      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const freq = midiToFrequency(midi);
        const now = ctx.currentTime;

        const oscFundamental = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const gainFundamental = ctx.createGain();
        const gainHarmonic = ctx.createGain();
        const masterGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        oscFundamental.type = 'triangle';
        oscFundamental.frequency.setValueAtTime(freq, now);

        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(freq * 2, now);

        gainFundamental.gain.setValueAtTime(0.45, now);
        gainHarmonic.gain.setValueAtTime(0.18, now);

        filter.type = 'lowpass';
        filter.Q.setValueAtTime(1.2, now);
        filter.frequency.setValueAtTime(Math.min(freq * 7, 1400), now);
        filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 2.4, 240), now + 0.18);

        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.exponentialRampToValueAtTime(0.65, now + 0.015);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        oscFundamental.connect(gainFundamental);
        oscHarmonic.connect(gainHarmonic);
        gainFundamental.connect(filter);
        gainHarmonic.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        oscFundamental.start(now);
        oscHarmonic.start(now);
        oscFundamental.stop(now + duration + 0.02);
        oscHarmonic.stop(now + duration + 0.02);
      } catch {
        // Ignore audio errors when playback is restricted
      }
    },
    [getAudioContext]
  );

  // Metronome click synthesis
  const playMetronomeClick = useCallback(
    (isAccent: boolean) => {
      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isAccent ? 1050 : 680, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(isAccent ? 0.3 : 0.18, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      } catch {
        // Ignore click failures
      }
    },
    [getAudioContext]
  );

  // Metronome lifecycle
  useEffect(() => {
    if (!isMetronomeRunning) {
      if (metronomeIntervalRef.current !== null) {
        window.clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
      setCurrentBeat(0);
      beatCounterRef.current = 0;
      return;
    }

    const intervalMs = Math.round(60000 / bpm);

    const tick = () => {
      const nextBeat = (beatCounterRef.current % 4) + 1;
      beatCounterRef.current = nextBeat;
      setCurrentBeat(nextBeat);
      playMetronomeClick(nextBeat === 1);
    };

    tick();
    metronomeIntervalRef.current = window.setInterval(tick, intervalMs);

    return () => {
      if (metronomeIntervalRef.current !== null) {
        window.clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
    };
  }, [isMetronomeRunning, bpm, playMetronomeClick]);

  // Global cleanup on unmount (important with Astro View Transitions)
  useEffect(() => {
    return () => {
      clearSequenceTimers();
      if (metronomeIntervalRef.current !== null) {
        window.clearInterval(metronomeIntervalRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        void audioCtxRef.current.close();
      }
    };
  }, [clearSequenceTimers]);

  // Build highlight map for the active study mode
  const highlightMap = new Map<string, HighlightCell>();

  if (studyMode === 'naturals') {
    for (const s of BASS_STRINGS) {
      for (const fret of FRETS) {
        const meta = getNoteMeta(s.openMidi + fret);
        if (meta.isNatural) {
          const isSemitone = meta.isSemitoneBoundary;
          highlightMap.set(cellKey(s.id, fret), {
            stringId: s.id,
            fret,
            badge: isSemitone ? '½T' : 'NAT',
            roleLabel: isSemitone ? 'Semitom natural (E–F ou B–C)' : 'Nota natural',
            variant: isSemitone ? 'semitone' : 'natural',
          });
        }
      }
    }
  } else if (studyMode === 'fifth-fret') {
    const pairs: HighlightCell[] = [
      { stringId: 'E', fret: 5, badge: 'Par 1', roleLabel: 'A1 (55 Hz) na 4ª corda = A1 solta', variant: 'pair-1' },
      { stringId: 'A', fret: 0, badge: 'Par 1', roleLabel: 'A1 solta (55 Hz) = 4ª corda, casa 5', variant: 'pair-1' },
      { stringId: 'A', fret: 5, badge: 'Par 2', roleLabel: 'D2 (73,4 Hz) na 3ª corda = D2 solta', variant: 'pair-2' },
      { stringId: 'D', fret: 0, badge: 'Par 2', roleLabel: 'D2 solta (73,4 Hz) = 3ª corda, casa 5', variant: 'pair-2' },
      { stringId: 'D', fret: 5, badge: 'Par 3', roleLabel: 'G2 (98 Hz) na 2ª corda = G2 solta', variant: 'pair-3' },
      { stringId: 'G', fret: 0, badge: 'Par 3', roleLabel: 'G2 solta (98 Hz) = 2ª corda, casa 5', variant: 'pair-3' },
    ];
    pairs.forEach((cell) => highlightMap.set(cellKey(cell.stringId, cell.fret), cell));
  } else if (studyMode === 'triad-158') {
    const anchor = TRIAD_ANCHORS[triadRoot];
    const rootIdx = getStringIndex(anchor.stringId);
    const fifthString = BASS_STRINGS[rootIdx - 1];
    const octaveString = BASS_STRINGS[rootIdx - 2];

    highlightMap.set(cellKey(anchor.stringId, anchor.fret), {
      stringId: anchor.stringId,
      fret: anchor.fret,
      badge: '1',
      roleLabel: 'Tônica (Grau 1)',
      variant: 'root',
    });
    if (fifthString) {
      highlightMap.set(cellKey(fifthString.id, anchor.fret + 2), {
        stringId: fifthString.id,
        fret: anchor.fret + 2,
        badge: '5',
        roleLabel: 'Quinta Justa (Grau 5 · +7 semitons)',
        variant: 'fifth',
      });
    }
    if (octaveString) {
      highlightMap.set(cellKey(octaveString.id, anchor.fret + 2), {
        stringId: octaveString.id,
        fret: anchor.fret + 2,
        badge: '8',
        roleLabel: 'Oitava Justa (Grau 8 · +12 semitons)',
        variant: 'octave',
      });
    }
  } else if (studyMode === 'major-scale') {
    const anchor = SCALE_ANCHORS[scaleRoot];
    const rootIdx = getStringIndex(anchor.stringId);
    const s0 = BASS_STRINGS[rootIdx];
    const s1 = BASS_STRINGS[rootIdx - 1];
    const s2 = BASS_STRINGS[rootIdx - 2];

    const scaleSteps: Array<{
      stringDef: BassStringDef | undefined;
      fret: number;
      degree: string;
      roleLabel: string;
      variant: HighlightCell['variant'];
    }> = [
      { stringDef: s0, fret: anchor.fret, degree: 'I', roleLabel: 'Grau I · Tônica', variant: 'root' },
      { stringDef: s0, fret: anchor.fret + 2, degree: 'II', roleLabel: 'Grau II · 2ª Maior', variant: 'scale' },
      { stringDef: s1, fret: anchor.fret - 1, degree: 'III', roleLabel: 'Grau III · 3ª Maior', variant: 'scale' },
      { stringDef: s1, fret: anchor.fret, degree: 'IV', roleLabel: 'Grau IV · 4ª Justa', variant: 'scale' },
      { stringDef: s1, fret: anchor.fret + 2, degree: 'V', roleLabel: 'Grau V · 5ª Justa', variant: 'fifth' },
      { stringDef: s2, fret: anchor.fret - 1, degree: 'VI', roleLabel: 'Grau VI · 6ª Maior', variant: 'scale' },
      { stringDef: s2, fret: anchor.fret + 1, degree: 'VII', roleLabel: 'Grau VII · Sensível', variant: 'accidental-scale' },
      { stringDef: s2, fret: anchor.fret + 2, degree: 'VIII', roleLabel: 'Grau VIII · Oitava', variant: 'octave' },
    ];

    scaleSteps.forEach((step) => {
      if (!step.stringDef || step.fret < 0 || step.fret > 12) return;
      highlightMap.set(cellKey(step.stringDef.id, step.fret), {
        stringId: step.stringDef.id,
        fret: step.fret,
        badge: step.degree,
        roleLabel: step.roleLabel,
        variant: step.variant,
      });
    });
  }

  const triggerCellNote = useCallback(
    (stringDef: BassStringDef, fret: number, duration = 0.72) => {
      const midi = stringDef.openMidi + fret;
      const meta = getNoteMeta(midi);
      const key = cellKey(stringDef.id, fret);
      const highlight = highlightMap.get(key);

      setActiveCellKey(key);
      setLastNote({
        cipherName: meta.cipher,
        solfegeName: meta.solfege,
        octave: meta.octave,
        freq: meta.freq,
        stringId: stringDef.id,
        stringNumber: stringDef.number,
        fret,
        roleLabel: highlight?.roleLabel,
      });

      playBassNote(midi, duration);

      const clearId = window.setTimeout(() => {
        setActiveCellKey((prev) => (prev === key ? null : prev));
      }, Math.min(duration * 700, 480));
      sequenceTimeoutsRef.current.push(clearId);
    },
    [highlightMap, playBassNote]
  );

  const handleCellClick = (stringDef: BassStringDef, fret: number) => {
    clearSequenceTimers();
    triggerCellNote(stringDef, fret);
  };

  const playStepSequence = (
    steps: Array<{ stringId: BassStringDef['id']; fret: number; delayMs: number; duration?: number }>
  ) => {
    clearSequenceTimers();
    if (steps.length === 0) return;

    setIsPlayingSequence(true);

    steps.forEach((step, idx) => {
      const timerId = window.setTimeout(() => {
        const stringDef = BASS_STRINGS.find((s) => s.id === step.stringId);
        if (stringDef) {
          triggerCellNote(stringDef, step.fret, step.duration ?? 0.58);
        }
        if (idx === steps.length - 1) {
          const endTimer = window.setTimeout(() => {
            setIsPlayingSequence(false);
            setActiveCellKey(null);
          }, 520);
          sequenceTimeoutsRef.current.push(endTimer);
        }
      }, step.delayMs);
      sequenceTimeoutsRef.current.push(timerId);
    });
  };

  const handlePlayAction = () => {
    if (isPlayingSequence) {
      clearSequenceTimers();
      setActiveCellKey(null);
      return;
    }

    if (studyMode === 'fifth-fret') {
      playStepSequence([
        { stringId: 'E', fret: 5, delayMs: 0, duration: 0.65 },
        { stringId: 'A', fret: 0, delayMs: 520, duration: 0.65 },
        { stringId: 'A', fret: 5, delayMs: 1300, duration: 0.65 },
        { stringId: 'D', fret: 0, delayMs: 1820, duration: 0.65 },
        { stringId: 'D', fret: 5, delayMs: 2600, duration: 0.65 },
        { stringId: 'G', fret: 0, delayMs: 3120, duration: 0.75 },
      ]);
      return;
    }

    if (studyMode === 'triad-158') {
      const anchor = TRIAD_ANCHORS[triadRoot];
      const rootIdx = getStringIndex(anchor.stringId);
      const fifthId = BASS_STRINGS[rootIdx - 1]?.id ?? anchor.stringId;
      const octaveId = BASS_STRINGS[rootIdx - 2]?.id ?? anchor.stringId;
      const stepMs = Math.round(60000 / bpm);

      playStepSequence([
        { stringId: anchor.stringId, fret: anchor.fret, delayMs: 0, duration: 0.5 },
        { stringId: fifthId, fret: anchor.fret + 2, delayMs: stepMs, duration: 0.45 },
        { stringId: octaveId, fret: anchor.fret + 2, delayMs: stepMs * 2, duration: 0.45 },
        { stringId: fifthId, fret: anchor.fret + 2, delayMs: stepMs * 3, duration: 0.45 },
        { stringId: anchor.stringId, fret: anchor.fret, delayMs: stepMs * 4, duration: 0.85 },
      ]);
      return;
    }

    if (studyMode === 'major-scale') {
      const anchor = SCALE_ANCHORS[scaleRoot];
      const rootIdx = getStringIndex(anchor.stringId);
      const s0 = BASS_STRINGS[rootIdx].id;
      const s1 = BASS_STRINGS[rootIdx - 1].id;
      const s2 = BASS_STRINGS[rootIdx - 2].id;
      const stepMs = 380;

      playStepSequence([
        { stringId: s0, fret: anchor.fret, delayMs: 0, duration: 0.45 },
        { stringId: s0, fret: anchor.fret + 2, delayMs: stepMs, duration: 0.45 },
        { stringId: s1, fret: anchor.fret - 1, delayMs: stepMs * 2, duration: 0.45 },
        { stringId: s1, fret: anchor.fret, delayMs: stepMs * 3, duration: 0.45 },
        { stringId: s1, fret: anchor.fret + 2, delayMs: stepMs * 4, duration: 0.45 },
        { stringId: s2, fret: anchor.fret - 1, delayMs: stepMs * 5, duration: 0.45 },
        { stringId: s2, fret: anchor.fret + 1, delayMs: stepMs * 6, duration: 0.45 },
        { stringId: s2, fret: anchor.fret + 2, delayMs: stepMs * 7, duration: 0.8 },
      ]);
    }
  };

  const handleModeChange = (mode: StudyMode) => {
    clearSequenceTimers();
    setActiveCellKey(null);
    setStudyMode(mode);
  };

  const activeModeInfo = MODE_OPTIONS.find((m) => m.id === studyMode)!;

  const actionButtonLabel =
    studyMode === 'fifth-fret'
      ? 'Ouvir Pares de Uníssono'
      : studyMode === 'triad-158'
      ? `Tocar Groove (${triadRoot}: 1–5–8)`
      : studyMode === 'major-scale'
      ? `Tocar Escala (${scaleRoot} Maior)`
      : null;

  const getCellStyle = (isPlayingNow: boolean, highlight?: HighlightCell, isOpenFret?: boolean) => {
    if (isPlayingNow) {
      return 'bg-primary text-primary-content border-primary ring-2 ring-primary/40 scale-105 z-20 shadow-md';
    }
    if (!highlight) {
      return isOpenFret
        ? 'bg-base-200/80 hover:bg-base-300 text-base-content/75 border-base-content/20'
        : 'bg-base-100/90 hover:bg-base-200 text-base-content/45 hover:text-base-content border-base-content/10';
    }

    switch (highlight.variant) {
      case 'root':
        return 'bg-primary text-primary-content border-primary font-extrabold shadow-sm';
      case 'fifth':
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30 font-bold';
      case 'octave':
        return 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/50 hover:bg-sky-500/30 font-bold';
      case 'accidental-scale':
        return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50 hover:bg-amber-500/30 font-bold';
      case 'scale':
        return 'bg-base-200 text-base-content border-base-content/30 hover:bg-base-300 font-semibold';
      case 'pair-1':
        return 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30 font-bold';
      case 'pair-2':
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30 font-bold';
      case 'pair-3':
        return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50 hover:bg-amber-500/30 font-bold';
      case 'semitone':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/45 hover:bg-amber-500/25 font-bold';
      case 'natural':
      default:
        return 'bg-base-200/85 text-base-content border-base-content/25 hover:bg-base-300 font-semibold';
    }
  };

  return (
    <div className="my-8 not-prose border border-primary/20 rounded-xl bg-base-100 shadow-md overflow-hidden ring-1 ring-primary/10">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-base-200/90 via-base-200/50 to-base-100 border-b border-base-content/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-primary font-mono text-xs font-bold tracking-wider">
              Interativo
            </span>
            <h4 className="text-sm sm:text-base font-bold text-base-content">
              Braço Interativo de Contrabaixo (E – A – D – G)
            </h4>
          </div>

          {/* Notation Toggle */}
          <div className="flex items-center gap-1.5 font-mono text-xs" role="group" aria-label="Sistema de notação musical">
            <button
              type="button"
              aria-pressed={notation === 'cipher'}
              onClick={() => setNotation('cipher')}
              className={`min-h-[32px] px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
                notation === 'cipher'
                  ? 'bg-neutral text-neutral-content border-neutral font-bold'
                  : 'bg-base-200/70 text-base-content/70 border-base-content/15 hover:text-base-content'
              }`}
            >
              Cifra (C D E)
            </button>
            <button
              type="button"
              aria-pressed={notation === 'solfege'}
              onClick={() => setNotation('solfege')}
              className={`min-h-[32px] px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
                notation === 'solfege'
                  ? 'bg-neutral text-neutral-content border-neutral font-bold'
                  : 'bg-base-200/70 text-base-content/70 border-base-content/15 hover:text-base-content'
              }`}
            >
              Solfejo (Dó Ré Mi)
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="group" aria-label="Modo de estudo no braço">
          {MODE_OPTIONS.map((mode) => {
            const isSelected = studyMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleModeChange(mode.id)}
                className={`min-h-[32px] px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-content shadow-sm ring-2 ring-primary/40'
                    : 'bg-base-200/80 hover:bg-base-300 text-base-content/80 border border-base-content/10'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Mode Explanation + Action + Sub-selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-xs text-base-content/75 font-mono leading-relaxed">
            {activeModeInfo.summary}
          </p>

          {actionButtonLabel && (
            <button
              type="button"
              onClick={handlePlayAction}
              className="btn btn-sm btn-primary gap-2 font-mono font-bold shadow-sm shrink-0"
            >
              {isPlayingSequence ? (
                <span>Parar Áudio</span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>{actionButtonLabel}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Root Pickers for Triad / Scale Modes */}
        {studyMode === 'triad-158' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1" role="group" aria-label="Tônica do triângulo 1-5-8">
            <span className="text-xs font-mono font-semibold text-base-content/60 uppercase tracking-wider mr-1">
              Tônica:
            </span>
            {TRIAD_ROOTS.map((root) => {
              const isSelected = triadRoot === root;
              return (
                <button
                  key={root}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    clearSequenceTimers();
                    setTriadRoot(root);
                  }}
                  className={`min-w-[34px] min-h-[32px] px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-content shadow-sm'
                      : 'bg-base-200/80 hover:bg-base-300 text-base-content/80 border border-base-content/10'
                  }`}
                >
                  {root}
                </button>
              );
            })}
          </div>
        )}

        {studyMode === 'major-scale' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1" role="group" aria-label="Tônica da escala maior">
            <span className="text-xs font-mono font-semibold text-base-content/60 uppercase tracking-wider mr-1">
              Tônica:
            </span>
            {SCALE_ROOTS.map((root) => {
              const isSelected = scaleRoot === root;
              return (
                <button
                  key={root}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    clearSequenceTimers();
                    setScaleRoot(root);
                  }}
                  className={`min-w-[34px] min-h-[32px] px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-content shadow-sm'
                      : 'bg-base-200/80 hover:bg-base-300 text-base-content/80 border border-base-content/10'
                  }`}
                >
                  {root}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fretboard Scroller */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="fretboard-scroller pb-2">
          <div className="min-w-[780px] select-none">
            {/* Fret Numbers & Inlays Header */}
            <div className="grid grid-cols-[54px_repeat(13,minmax(50px,1fr))] gap-1.5 items-center mb-2 text-[11px] font-mono text-base-content/55">
              <div className="text-center font-bold uppercase tracking-wider text-[10px]">
                Corda
              </div>
              {FRETS.map((fret) => (
                <div key={fret} className="flex flex-col items-center justify-center gap-0.5">
                  <span className={fret === 0 ? 'font-bold text-base-content/80' : ''}>
                    {fret === 0 ? 'Solta' : fret}
                  </span>
                  <div className="h-2 flex items-center justify-center gap-1" aria-hidden="true">
                    {INLAY_FRETS.has(fret) && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-base-content/35" />
                        {fret === 12 && <span className="w-1.5 h-1.5 rounded-full bg-base-content/35" />}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Strings Rows (G on top -> E on bottom, matching tablature) */}
            <div className="space-y-2 rounded-lg bg-base-200/35 border border-base-content/10 p-2.5">
              {BASS_STRINGS.map((stringItem) => (
                <div
                  key={stringItem.id}
                  className="grid grid-cols-[54px_repeat(13,minmax(50px,1fr))] gap-1.5 items-center relative"
                >
                  {/* String Label */}
                  <div className="flex flex-col items-center justify-center pr-1">
                    <span className="font-mono font-bold text-xs text-base-content">
                      {stringItem.id}
                    </span>
                    <span className="font-mono text-[9px] text-base-content/50">
                      {stringItem.number}ª
                    </span>
                  </div>

                  {/* Fret Buttons */}
                  {FRETS.map((fret) => {
                    const midi = stringItem.openMidi + fret;
                    const meta = getNoteMeta(midi);
                    const key = cellKey(stringItem.id, fret);
                    const highlight = highlightMap.get(key);
                    const isPlayingNow = activeCellKey === key;
                    const displayName = notation === 'cipher' ? meta.cipher : meta.solfege;
                    const fretDesc = fret === 0 ? 'corda solta (casa 0)' : `casa ${fret}`;
                    const accessibleLabel = `${displayName} — ${stringItem.accessibleName}, ${fretDesc}`;

                    return (
                      <div
                        key={key}
                        className={`relative flex items-center justify-center ${
                          fret === 0 ? 'border-r-4 border-base-content/35 pr-1' : 'border-r border-base-content/15 pr-1'
                        }`}
                      >
                        {/* Horizontal string line behind the fret button */}
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 bg-base-content/20 ${stringItem.gaugeClass}`}
                        />

                        <button
                          type="button"
                          onClick={() => handleCellClick(stringItem, fret)}
                          aria-label={accessibleLabel}
                          className={`relative z-10 w-full min-w-[46px] min-h-[36px] px-1 py-1 rounded-md border flex flex-col items-center justify-center leading-none transition-all cursor-pointer active:scale-95 ${getCellStyle(
                            isPlayingNow,
                            highlight,
                            fret === 0
                          )}`}
                        >
                          <span className="font-mono text-xs font-bold tracking-tight">
                            {displayName}
                          </span>
                          {highlight && (
                            <span className="font-mono text-[9px] opacity-80 mt-0.5">
                              {highlight.badge}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend + Last Played Live Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Live Status Display */}
          <div
            aria-live="polite"
            className="p-3 rounded-lg bg-base-200/40 border border-base-content/10 font-mono text-xs flex flex-col justify-center min-h-[64px]"
          >
            {lastNote ? (
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-extrabold text-primary">
                    {notation === 'cipher' ? lastNote.cipherName : lastNote.solfegeName}
                    {lastNote.octave}
                  </span>
                  <span className="text-base-content/60">
                    ({notation === 'cipher' ? lastNote.solfegeName : lastNote.cipherName})
                  </span>
                  <span className="badge badge-xs badge-ghost font-mono">
                    {lastNote.freq.toFixed(1)} Hz
                  </span>
                </div>
                <p className="text-[11px] text-base-content/75">
                  {lastNote.stringNumber}ª corda ({lastNote.stringId}) ·{' '}
                  {lastNote.fret === 0 ? 'Corda solta' : `Casa ${lastNote.fret}`}
                  {lastNote.roleLabel ? ` · ${lastNote.roleLabel}` : ''}
                </p>
              </div>
            ) : (
              <p className="text-base-content/60">
                Clique em qualquer casa do braço acima para ouvir a nota grave sintetizada e inspecionar sua posição.
              </p>
            )}
          </div>

          {/* Integrated Metronome */}
          <div className="p-3 rounded-lg bg-base-200/40 border border-base-content/10 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                  Metrônomo 4/4
                </span>
                {/* 4-beat visual LEDs */}
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {[1, 2, 3, 4].map((beat) => {
                    const isActive = isMetronomeRunning && currentBeat === beat;
                    return (
                      <span
                        key={beat}
                        className={`w-2.5 h-2.5 rounded-full transition-transform ${
                          isActive
                            ? beat === 1
                              ? 'bg-primary scale-125 ring-2 ring-primary/30'
                              : 'bg-emerald-500 scale-110'
                            : 'bg-base-content/20'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-1" role="group" aria-label="Velocidade do metrônomo em BPM">
                {([60, 80, 100] as BpmOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={bpm === option}
                    onClick={() => setBpm(option)}
                    className={`min-h-[28px] px-2 py-0.5 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                      bpm === option
                        ? 'bg-neutral text-neutral-content font-bold'
                        : 'bg-base-100 text-base-content/70 border border-base-content/15 hover:text-base-content'
                    }`}
                  >
                    {option} BPM
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-pressed={isMetronomeRunning}
              onClick={() => setIsMetronomeRunning((prev) => !prev)}
              className={`btn btn-sm font-mono text-xs ${
                isMetronomeRunning ? 'btn-error' : 'btn-outline'
              }`}
            >
              {isMetronomeRunning ? 'Parar Pulso' : 'Iniciar Pulso'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-base-200/40 border-t border-base-content/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-base-content/60 gap-2">
        <span>⚡ Timbre pizzicato com filtro lowpass dinâmico (Web Audio API)</span>
        <span>Deslize o braço lateralmente em telas menores →</span>
      </div>
    </div>
  );
}
