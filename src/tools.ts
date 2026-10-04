export type Tool = {
  id: string
  name: string
  summary: string
  url: string
  repo: string
  host: 'GitHub Pages' | 'Vercel'
  /** Filtres affichés. Une app peut en avoir plusieurs. */
  groups: string[]
  mark: string
  /** Teinte du monogramme, en hex. */
  tint: string
  adult?: boolean
}

export const GROUPS = [
  'Tout',
  'Outils',
  'Médias',
  'Apprendre',
  'Pro',
  'Jeu',
  '18+',
] as const

export const tools: Tool[] = [
  {
    id: 'repere',
    name: 'Repère',
    summary:
      'Insère des coordonnées GPS, vois le lieu et envoie le lien. Sans publicité, sans compte.',
    url: 'https://tonylapoche.github.io/pos-extraction-pwa/',
    repo: 'https://github.com/TonyLaPoche/pos-extraction-pwa',
    host: 'GitHub Pages',
    groups: ['Outils'],
    mark: 'Re',
    tint: '#f0b429',
  },
  {
    id: 'lnf',
    name: 'LNF Reader',
    summary:
      'Lecteur de light novels EPUB et PDF. La bibliothèque et la page en cours restent sur l’appareil.',
    url: 'https://tonylapoche.github.io/LNF-Reader/',
    repo: 'https://github.com/TonyLaPoche/LNF-Reader',
    host: 'GitHub Pages',
    groups: ['Médias'],
    mark: 'LN',
    tint: '#7eb8a2',
  },
  {
    id: 'noty',
    name: 'Noty Nyto',
    summary:
      'Écoute publique Suno. Scanne un artiste, puis garde en cache seulement ce que tu veux.',
    url: 'https://noty-nyto.vercel.app/',
    repo: 'https://github.com/TonyLaPoche/NotyNyto',
    host: 'Vercel',
    groups: ['Médias'],
    mark: 'Ny',
    tint: '#d4846a',
  },
  {
    id: 'spec',
    name: 'Spec Manager',
    summary:
      'Spec Markdown, aperçu PDF, champs prêts à coller dans un ticket. Le brouillon reste local.',
    url: 'https://tonylapoche.github.io/Spec-Manager/',
    repo: 'https://github.com/TonyLaPoche/Spec-Manager',
    host: 'GitHub Pages',
    groups: ['Outils', 'Pro'],
    mark: 'Sp',
    tint: '#7aa2c4',
  },
  {
    id: 'lpc',
    name: 'CléLPC',
    summary:
      'Apprendre la langue française parlée complétée : clés, zones, mots, avec la caméra.',
    url: 'https://tonylapoche.github.io/LPC-learning/',
    repo: 'https://github.com/TonyLaPoche/LPC-learning',
    host: 'GitHub Pages',
    groups: ['Apprendre'],
    mark: 'LPC',
    tint: '#b19ad4',
  },
  {
    id: 'cambate',
    name: 'CamBate Solo',
    summary:
      'Entraînement solo adulte. Suivi des mains et du visage, score et sessions sur l’appareil.',
    url: 'https://tonylapoche.github.io/CamBateSoloTraining/',
    repo: 'https://github.com/TonyLaPoche/CamBateSoloTraining',
    host: 'GitHub Pages',
    groups: ['18+'],
    mark: 'Cb',
    tint: '#e07a8a',
    adult: true,
  },
  {
    id: 'vap',
    name: 'Quiz Vap’Station',
    summary:
      'Révise les arômes des e-liquides. Quiz, historique sur l’appareil, classement si tu le publies.',
    url: 'https://tonylapoche.github.io/Quizz-VapStation/',
    repo: 'https://github.com/TonyLaPoche/Quizz-VapStation',
    host: 'GitHub Pages',
    groups: ['Apprendre'],
    mark: 'Vs',
    tint: '#8fbf6a',
  },
  {
    id: 'thumb',
    name: 'Check Thumbnail',
    summary:
      'Prévisualise la miniature d’une URL comme sur WhatsApp, X, Reddit, Bluesky et Telegram.',
    url: 'https://tonylapoche.github.io/CheckThumbnail-free/',
    repo: 'https://github.com/TonyLaPoche/CheckThumbnail-free',
    host: 'GitHub Pages',
    groups: ['Outils'],
    mark: 'Og',
    tint: '#e0a15a',
  },
  {
    id: 'planeo',
    name: 'Planéo',
    summary:
      'Planning horaire pour une boutique : équipe, calcul des heures, export PDF.',
    url: 'https://planeo-sable.vercel.app/',
    repo: 'https://github.com/TonyLaPoche/planeo',
    host: 'Vercel',
    groups: ['Pro'],
    mark: 'Pl',
    tint: '#6eb0c9',
  },
  {
    id: 'battle',
    name: 'BattleWeb',
    summary: 'Bataille navale à plusieurs, dans le navigateur.',
    url: 'https://battle-web.vercel.app/',
    repo: 'https://github.com/TonyLaPoche/BattleWeb',
    host: 'Vercel',
    groups: ['Jeu'],
    mark: 'Bw',
    tint: '#c47b6a',
  },
]
