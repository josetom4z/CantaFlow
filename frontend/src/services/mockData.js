export const INITIAL_CATEGORIES = [
  'Todos',
  'Louvor Congregacional',
  'Coral & Orquestra',
  'Jovens & Adolescentes',
  'Ministério Infantil',
  'Hinos & Harpa Cristã',
  'Playbacks & Ensaios',
  'Especiais & Ceia',
];

export const INITIAL_FOLDERS = [
  {
    _id: 'folder_domingo',
    name: 'Domingo - Culto da Família',
    color: '#8b5cf6',
    icon: 'Music',
    description: 'Músicas para o culto de Domingo à noite (19h)',
    songCount: 2,
  },
  {
    _id: 'folder_jovens',
    name: 'Rede de Jovens - UMADG',
    color: '#ec4899',
    icon: 'Sparkles',
    description: 'Repertório animado e louvores contemporâneos de adoração',
    songCount: 1,
  },
  {
    _id: 'folder_coral',
    name: 'Coral & Orquestra - Santa Ceia',
    color: '#3b82f6',
    icon: 'Users',
    description: 'Arranjos e partituras para o culto de Santa Ceia',
    songCount: 1,
  },
  {
    _id: 'folder_harpa',
    name: 'Harpa Cristã Tradicional',
    color: '#f59e0b',
    icon: 'BookOpen',
    description: 'Hinos clássicos para abertura de cultos e oração',
    songCount: 1,
  },
  {
    _id: 'folder_playbacks',
    name: 'Playbacks de Ensaio & Backing Tracks',
    color: '#10b981',
    icon: 'Headphones',
    description: 'Faixas sem vocal e metrônomo para ensaios individuais',
    songCount: 1,
  },
];

export const INITIAL_SONGS = [
  {
    _id: 'song_1',
    title: 'Bondade de Deus',
    artist: 'Isaias Saad & Ministério de Louvor',
    category: 'Louvor Congregacional',
    folder: { _id: 'folder_domingo', name: 'Domingo - Culto da Família', color: '#8b5cf6' },
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/wind_chimes_short.ogg',
    keySignature: 'Ab',
    bpm: 70,
    duration: 295,
    fileSizeBytes: 4820000,
    lyrics: `Te amo Deus, Tua graça nunca falha
Todos os dias eu estou em Tuas mãos
Desde quando me levanto até eu me deitar
Eu cantarei da bondade de Deus

Pois toda minha vida foste fiel
Toda minha vida foste tão bom
Com todo fôlego que tenho
Eu cantarei da bondade de Deus`,
    chords: `[Intro] G  C  G  C
[Verso 1]
G                 C
Te amo Deus, Tua graça nunca falha
G                 D/F#      Em
Todos os dias eu estou em Tuas mãos
C                   D          Em
Desde quando me levanto até eu me deitar
C         D           G
Eu cantarei da bondade de Deus

[Refrão]
C                         G
Pois toda minha vida foste fiel
C                         G     D/F#
Toda minha vida foste tão, tão bom
C                         Em     D
Com todo fôlego que tenho
C         D           G
Eu cantarei da bondade de Deus`,
    tags: ['Domingo', 'Comunhão', 'Adoração', 'Guará'],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'song_2',
    title: 'A Ele a Glória',
    artist: 'Gabriela Rocha & Diante do Trono',
    category: 'Louvor Congregacional',
    folder: { _id: 'folder_domingo', name: 'Domingo - Culto da Família', color: '#8b5cf6' },
    audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/scifi_laser_heavy.ogg',
    keySignature: 'G',
    bpm: 68,
    duration: 240,
    fileSizeBytes: 3900000,
    lyrics: `Porque d'Ele e por Ele
Para Ele são todas as coisas
Porque d'Ele e por Ele
Para Ele são todas as coisas

A Ele a Glória, a Ele a Glória
A Ele a Glória pra sempre amém!`,
    chords: `[Intro] Em  C  G  D
[Verso]
Em        C
Porque d'Ele e por Ele
G        D
Para Ele são todas as coisas

[Refrão]
C            D
A Ele a Glória!
Em           G/B
A Ele a Glória!
C            D          G
A Ele a Glória pra sempre, amém!`,
    tags: ['Clássico', 'Congregacional', 'Exaltação'],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'song_3',
    title: 'Porque Ele Vive (Harpa Cristã)',
    artist: 'Harpa Cristã & Orquestra AD',
    category: 'Hinos & Harpa Cristã',
    folder: { _id: 'folder_harpa', name: 'Harpa Cristã Tradicional', color: '#f59e0b' },
    audioUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
    keySignature: 'A',
    bpm: 74,
    duration: 210,
    fileSizeBytes: 3400000,
    lyrics: `Deus enviou Seu Filho amado
Para morrer no meu lugar
Na cruz pagou por meus pecados
Mas o sepulcro vazio está porque Ele vive!

Porque Ele vive, posso crer no amanhã
Porque Ele vive, temor não há
Mas eu bem sei, eu sei que a minha vida
Está nas mãos de meu Jesus que vivo está!`,
    chords: `[Intro] A  D  A  E7  A
[Verso]
A           A7        D
Deus enviou Seu Filho amado
A                 B7       E  E7
Para morrer no meu lugar

[Refrão]
A            A7           D
Porque Ele vive, posso crer no amanhã
A                    B7     E  E7
Porque Ele vive, temor não há`,
    tags: ['Harpa', 'Santa Ceia', 'Tradicional'],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'song_4',
    title: 'Ousado Amor (Reckless Love)',
    artist: 'Isaías Saad & UMADG',
    category: 'Jovens & Adolescentes',
    folder: { _id: 'folder_jovens', name: 'Rede de Jovens - UMADG', color: '#ec4899' },
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/wind_chimes_short.ogg',
    keySignature: 'F#m',
    bpm: 82,
    duration: 315,
    fileSizeBytes: 5200000,
    lyrics: `Antes de eu falar, Tu cantavas sobre mim
Tu tens sido tão, tão bom pra mim
Antes de eu respirar, sopraste Tua vida em mim
Tu tens sido tão, tão bondoso pra mim

Oh, impressionante, infinito e ousado amor de Deus!`,
    chords: `[Intro] F#m  E  D  A
[Refrão]
F#m           E                   D                A
Oh, impressionante, infinito e ousado amor de Deus`,
    tags: ['UMADG', 'Jovens', 'Adoração'],
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'song_5',
    title: 'Playback: Bondade de Deus (Com Guia)',
    artist: 'CantaFlow Playbacks HD',
    category: 'Playbacks & Ensaios',
    folder: { _id: 'folder_playbacks', name: 'Playbacks de Ensaio & Backing Tracks', color: '#10b981' },
    audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/scifi_laser_heavy.ogg',
    keySignature: 'Ab',
    bpm: 70,
    duration: 295,
    fileSizeBytes: 4820000,
    lyrics: `Faixa de ensaio com metrônomo para ministros da AD Guaratinguetá.`,
    chords: `[Playback Guide Track - CantaFlow Pro]`,
    tags: ['Playback', 'Ensaio', 'Metrônomo'],
    isDemo: true,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_CHURCHES = [
  {
    _id: 'church_sede',
    name: 'Assembleia de Deus — Templo Sede Guaratinguetá',
    neighborhood: 'Centro',
    address: 'Rua Domingos Rodrigues Alves, 417',
    city: 'Guaratinguetá',
    state: 'SP',
    postalCode: '12500-010',
    location: { lat: -22.8164, lng: -45.1953 },
    googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Templo+Sede+Guaratingueta+Rua+Domingos+Rodrigues+Alves+417',
    cultosSchedule: [
      { day: 'Terça-feira', time: '19:30', name: 'Culto de Doutrina & Ensino Bíblico', description: 'Estudo com o Ministério Pastoral' },
      { day: 'Quinta-feira', time: '19:30', name: 'Culto da Vitória & Oração', description: 'Clamor pelas famílias e curas' },
      { day: 'Sábado', time: '19:30', name: 'Culto da Juventude (UMADG)', description: 'Louvor jovem, comunhão e palavra impactante' },
      { day: 'Domingo', time: '09:00', name: 'Escola Bíblica Dominical (EBD)', description: 'Classes infantil, jovens e adultos' },
      { day: 'Domingo', time: '19:00', name: 'Grande Culto da Família & Celebração', description: 'Coral, orquestra e ministração poderosa' },
    ],
    pastor: 'Pr. Presidente Regional',
    phone: '(12) 3122-4589',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80',
    isSede: true,
  },
  {
    _id: 'church_pedregulho',
    name: 'AD Congregação Pedregulho',
    neighborhood: 'Pedregulho',
    address: 'Av. Juscelino Kubitschek de Oliveira, 1280',
    city: 'Guaratinguetá',
    state: 'SP',
    postalCode: '12515-000',
    location: { lat: -22.8021, lng: -45.1852 },
    googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Pedregulho+Guaratingueta',
    cultosSchedule: [
      { day: 'Quarta-feira', time: '19:30', name: 'Culto de Oração & Edificação' },
      { day: 'Sexta-feira', time: '19:30', name: 'Culto nos Lares' },
      { day: 'Domingo', time: '09:00', name: 'Escola Bíblica Dominical' },
      { day: 'Domingo', time: '19:00', name: 'Culto de Louvor & Adoração' },
    ],
    pastor: 'Pr. Local Dirigente',
    phone: '(12) 3125-1122',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1519491058804-7456d6450495?auto=format&fit=crop&w=800&q=80',
    isSede: false,
  },
  {
    _id: 'church_neiva',
    name: 'AD Congregação Engenheiro Neiva',
    neighborhood: 'Engenheiro Neiva',
    address: 'Rua Prof. José Ferreira, 230',
    city: 'Guaratinguetá',
    state: 'SP',
    postalCode: '12520-000',
    location: { lat: -22.7845, lng: -45.1610 },
    googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Engenheiro+Neiva+Guaratingueta',
    cultosSchedule: [
      { day: 'Terça-feira', time: '19:30', name: 'Culto de Ensino' },
      { day: 'Quinta-feira', time: '19:30', name: 'Culto da Família' },
      { day: 'Domingo', time: '09:00', name: 'EBD' },
      { day: 'Domingo', time: '19:00', name: 'Culto Evangelístico' },
    ],
    pastor: 'Pr. Setorial',
    phone: '(12) 3126-3344',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    isSede: false,
  },
  {
    _id: 'church_beirario',
    name: 'AD Congregação Vila Paraíba / Beira Rio',
    neighborhood: 'Vila Paraíba',
    address: 'Rua Visconde de Guaratinguetá, 510',
    city: 'Guaratinguetá',
    state: 'SP',
    postalCode: '12510-100',
    location: { lat: -22.8220, lng: -45.2010 },
    googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Vila+Paraiba+Guaratingueta',
    cultosSchedule: [
      { day: 'Quarta-feira', time: '19:30', name: 'Culto de Adoração' },
      { day: 'Sábado', time: '19:30', name: 'Culto de Jovens' },
      { day: 'Domingo', time: '18:30', name: 'Culto da Família' },
    ],
    pastor: 'Ev. Dirigente',
    phone: '(12) 3122-8899',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80',
    isSede: false,
  },
  {
    _id: 'church_saofrancisco',
    name: 'AD Congregação Parque São Francisco',
    neighborhood: 'Parque São Francisco',
    address: 'Rua São Judas Tadeu, 88',
    city: 'Guaratinguetá',
    state: 'SP',
    postalCode: '12505-220',
    location: { lat: -22.8310, lng: -45.1915 },
    googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Parque+Sao+Francisco+Guaratingueta',
    cultosSchedule: [
      { day: 'Quinta-feira', time: '19:30', name: 'Culto de Oração' },
      { day: 'Domingo', time: '09:00', name: 'EBD' },
      { day: 'Domingo', time: '19:00', name: 'Culto da Família' },
    ],
    pastor: 'Pr. Local',
    phone: '(12) 3125-9000',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
    isSede: false,
  },
  {
    _id: 'church_jardimvale',
    name: 'AD Congregação Jardim do Vale',
    neighborhood: 'Jardim do Vale',
    address: 'Av. Ministro Salgado Filho, 640',
    city: 'Guaratinguetá',
    state: 'SP',
    postalCode: '12518-300',
    location: { lat: -22.8285, lng: -45.1740 },
    googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Jardim+do+Vale+Guaratingueta',
    cultosSchedule: [
      { day: 'Terça-feira', time: '19:30', name: 'Culto de Ensino' },
      { day: 'Domingo', time: '19:00', name: 'Culto com a Família' },
    ],
    pastor: 'Ev. Encarregado',
    phone: '(12) 3123-4411',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&w=800&q=80',
    isSede: false,
  },
  {
    _id: 'church_aparecida',
    name: 'AD Regional Aparecida (Vale do Paraíba)',
    neighborhood: 'Centro',
    address: 'Av. Getúlio Vargas, 310',
    city: 'Aparecida',
    state: 'SP',
    postalCode: '12570-000',
    location: { lat: -22.8480, lng: -45.2320 },
    googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Aparecida+SP',
    cultosSchedule: [
      { day: 'Quarta-feira', time: '19:30', name: 'Culto de Oração' },
      { day: 'Sábado', time: '19:30', name: 'Culto de Jovens' },
      { day: 'Domingo', time: '19:00', name: 'Culto da Família' },
    ],
    pastor: 'Pr. Regional Aparecida',
    phone: '(12) 3105-1234',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80',
    isSede: false,
  }
];

export const INITIAL_ADS = [
  {
    _id: 'ad_1',
    title: 'PixelLab — Apps, SaaS & Design Premium',
    advertiser: 'PixelLab Creative Studio',
    tagline: 'Criamos aplicativos mobile, plataformas SaaS e identidades visuais de alto nível.',
    ctaText: 'Conhecer a PixelLab',
    targetUrl: 'https://www.instagram.com/adguaratingueta/',
    badgeText: 'Patrocinado • PixelLab Tech',
    position: 'bottom_banner',
  },
  {
    _id: 'ad_2',
    title: 'CantaFlow PRO — Elimine Anúncios & Toque Offline',
    advertiser: 'CantaFlow by PixelLab',
    tagline: 'Músicas e cifras salvas no celular sem precisar de internet nos cultos e ensaios.',
    ctaText: 'Seja PRO por R$ 9,90/mês',
    targetUrl: '#upgrade-pro',
    badgeText: 'Plano Recomendado',
    position: 'in_feed',
  },
  {
    _id: 'ad_3',
    title: 'Som & Louvor — Instrumentos com 15% OFF',
    advertiser: 'Som & Louvor Equipamentos',
    tagline: 'Microfones sem fio, in-ears e mesas digitais para o seu ministério.',
    ctaText: 'Ver Equipamentos',
    targetUrl: 'https://www.instagram.com/adguaratingueta/',
    badgeText: 'Parceiro Louvor',
    position: 'bottom_banner',
  },
];
