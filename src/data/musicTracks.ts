export type MusicTrackId = 'contrabaixo' | 'teoria-musical';

export interface MusicTrackMeta {
  id: MusicTrackId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  tuningHint?: string;
}

export const MUSIC_TRACKS: Record<MusicTrackId, MusicTrackMeta> = {
  contrabaixo: {
    id: 'contrabaixo',
    order: 1,
    title: 'Trilha de Contrabaixo',
    subtitle: 'Técnica, groove e geometria aplicada ao braço de 4 cordas',
    description:
      'Aulas práticas progressivas focadas em afinação em quartas, controle rítmico, limpeza de notas (abafamento) e construção de linhas de baixo.',
    badge: 'Contrabaixo · 4 Cordas',
    tuningHint: 'Afinação Padrão: E1 – A1 – D2 – G2',
  },
  'teoria-musical': {
    id: 'teoria-musical',
    order: 2,
    title: 'Teoria Musical & Harmonia',
    subtitle: 'Fundamentos algorítmicos de escalas, intervalos e campo harmônico',
    description:
      'Módulos teóricos que explicam a matemática por trás das escalas, formação de tríades/tétrades e gravidade tonal sem decoreba.',
    badge: 'Teoria & Harmonia',
  },
};

export const ORDERED_MUSIC_TRACKS: MusicTrackMeta[] = Object.values(MUSIC_TRACKS).sort(
  (a, b) => a.order - b.order
);

export function toCleanMusicSlug(id: string): string {
  return id.replace(/^(pt\/|en\/)/, '').replace(/\.(md|mdx)$/, '');
}
