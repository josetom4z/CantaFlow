const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../../.env' });
const User = require('../models/User');
const Folder = require('../models/Folder');
const Song = require('../models/Song');
const Church = require('../models/Church');
const Ad = require('../models/Ad');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cantaflow';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Folder.deleteMany({});
    await Song.deleteMany({});
    await Church.deleteMany({});
    await Ad.deleteMany({});

    console.log('[Seed] Cleaned existing collections.');

    // 1. Create Default Users
    const user = await User.create({
      name: 'Líder de Louvor AD Guará',
      email: 'louvor@adguaratingueta.com.br',
      password: 'password123',
      churchName: 'AD Guaratinguetá - Sede',
      role: 'worship_leader',
      plan: 'free',
    });

    const proUser = await User.create({
      name: 'Ministério PixelLab Pro',
      email: 'pro@pixellab.com.br',
      password: 'password123',
      churchName: 'AD Guaratinguetá',
      role: 'worship_leader',
      plan: 'pro',
    });

    console.log('[Seed] Created default users (Free & Pro).');

    // 2. Create Folders
    const folderDomingo = await Folder.create({
      name: 'Domingo - Culto da Família',
      color: '#8b5cf6', // Indigo / Purple
      icon: 'Music',
      description: 'Músicas para o culto de Domingo à noite (19h)',
      userId: user._id,
    });

    const folderJovens = await Folder.create({
      name: 'Rede de Jovens - UMADG',
      color: '#ec4899', // Pink
      icon: 'Sparkles',
      description: 'Repertório animado e louvores contemporâneos de adoração',
      userId: user._id,
    });

    const folderCoral = await Folder.create({
      name: 'Coral & Orquestra - Santa Ceia',
      color: '#3b82f6', // Blue
      icon: 'Users',
      description: 'Arranjos e partituras para o culto de Santa Ceia',
      userId: user._id,
    });

    const folderHarpa = await Folder.create({
      name: 'Harpa Cristã Tradicional',
      color: '#f59e0b', // Amber
      icon: 'BookOpen',
      description: 'Hinos clássicos para abertura de cultos e oração',
      userId: user._id,
    });

    const folderPlaybacks = await Folder.create({
      name: 'Playbacks de Ensaio & Backing Tracks',
      color: '#10b981', // Emerald
      icon: 'Headphones',
      description: 'Faixas sem vocal e metrônomo para ensaios individuais',
      userId: user._id,
    });

    console.log('[Seed] Created default folders.');

    // 3. Create Sample Songs
    const sampleAudioUrl1 = 'https://actions.google.com/sounds/v1/ambiences/wind_chimes_short.ogg';
    const sampleAudioUrl2 = 'https://actions.google.com/sounds/v1/science_fiction/scifi_laser_heavy.ogg';
    const sampleAudioUrl3 = 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg';

    await Song.create([
      {
        title: 'Bondade de Deus',
        artist: 'Isaias Saad & Ministério de Louvor',
        category: 'Louvor Congregacional',
        folder: folderDomingo._id,
        audioUrl: sampleAudioUrl1,
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
      },
      {
        title: 'A Ele a Glória',
        artist: 'Gabriela Rocha & Diante do Trono',
        category: 'Louvor Congregacional',
        folder: folderDomingo._id,
        audioUrl: sampleAudioUrl2,
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
      },
      {
        title: 'Porque Ele Vive (Harpa Cristã)',
        artist: 'Harpa Cristã & Orquestra AD',
        category: 'Hinos & Harpa Cristã',
        folder: folderHarpa._id,
        audioUrl: sampleAudioUrl3,
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
A           A7        D
Na cruz pagou por meus pecados
A                   E7                     A
Mas o sepulcro vazio está porque Ele vive!

[Refrão]
A            A7           D
Porque Ele vive, posso crer no amanhã
A                    B7     E  E7
Porque Ele vive, temor não há
A           A7             D
Mas eu bem sei, eu sei que a minha vida
A                     E7                  A
Está nas mãos de meu Jesus que vivo está!`,
        tags: ['Harpa', 'Santa Ceia', 'Tradicional', 'Orquestra'],
        isDemo: true,
      },
      {
        title: 'Ousado Amor (Reckless Love)',
        artist: 'Isaías Saad',
        category: 'Jovens & Adolescentes',
        folder: folderJovens._id,
        audioUrl: sampleAudioUrl1,
        keySignature: 'F#m',
        bpm: 82,
        duration: 315,
        fileSizeBytes: 5200000,
        lyrics: `Antes de eu falar, Tu cantavas sobre mim
Tu tens sido tão, tão bom pra mim
Antes de eu respirar, sopraste Tua vida em mim
Tu tens sido tão, tão bondoso pra mim

Oh, impressionante, infinito e ousado amor de Deus
Oh, que deixa as noventa e nove só pra me encontrar`,
        chords: `[Intro] F#m  E  D  A
[Verso]
F#m          E             D          A
Antes de eu falar, Tu cantavas sobre mim
F#m          E             D          A
Tu tens sido tão, tão bom pra mim
F#m          E             D          A
Antes de eu respirar, sopraste Tua vida em mim
F#m          E             D          A
Tu tens sido tão, tão bondoso pra mim

[Refrão]
F#m           E                   D                A
Oh, impressionante, infinito e ousado amor de Deus
F#m             E               D                 A
Oh, que deixa as noventa e nove só pra me encontrar`,
        tags: ['UMADG', 'Jovens', 'Adoração'],
        isDemo: true,
      },
      {
        title: 'Grandes Coisas Fez o Senhor',
        artist: 'Coral AD Guaratinguetá',
        category: 'Coral & Orquestra',
        folder: folderCoral._id,
        audioUrl: sampleAudioUrl2,
        keySignature: 'Bb',
        bpm: 108,
        duration: 275,
        fileSizeBytes: 4500000,
        lyrics: `Grandes coisas fez o Senhor por nós
Por isso estamos alegres!
Grandes coisas fez o Senhor por nós
Por isso estamos alegres!`,
        chords: `[Intro] Bb  Eb  F  Bb
[Verso]
Bb               Eb
Grandes coisas fez o Senhor por nós
F                Bb
Por isso estamos alegres!`,
        tags: ['Coral', 'Celebração', 'Orquestra'],
        isDemo: true,
      },
      {
        title: 'Playback: Bondade de Deus (Sem Vocal / Click)',
        artist: 'CantaFlow Playbacks HD',
        category: 'Playbacks & Ensaios',
        folder: folderPlaybacks._id,
        audioUrl: sampleAudioUrl3,
        keySignature: 'Ab',
        bpm: 70,
        duration: 295,
        fileSizeBytes: 4820000,
        lyrics: `Faixa de playback com guia e metrônomo para ensaios individuais dos ministros e instrumentistas da AD Guaratinguetá.`,
        chords: `[Instrumental Track - CantaFlow Pro Multitrack Compatible]`,
        tags: ['Playback', 'Ensaio', 'Metrônomo'],
        isDemo: true,
      }
    ]);

    console.log('[Seed] Created sample worship songs.');

    // 4. Create Regional Churches (AD Guaratinguetá & Vale do Paraíba)
    const churchesData = [
      {
        name: 'Assembleia de Deus - Templo Sede Guaratinguetá',
        neighborhood: 'Centro',
        address: 'Rua Domingos Rodrigues Alves, 417',
        city: 'Guaratinguetá',
        state: 'SP',
        postalCode: '12500-010',
        location: { lat: -22.8164, lng: -45.1953 },
        googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Templo+Sede+Guaratingueta+Rua+Domingos+Rodrigues+Alves+417',
        cultosSchedule: [
          { day: 'Terça-feira', time: '19:30', name: 'Culto de Doutrina & Ensino Bíblico', description: 'Estudo aprofundado da Palavra com o Ministério Pastoral' },
          { day: 'Quinta-feira', time: '19:30', name: 'Culto da Vitória & Oração', description: 'Clamor pela família e intercessão' },
          { day: 'Sábado', time: '19:30', name: 'Culto da Juventude (UMADG)', description: 'Adoração jovem, dinâmicas e pregação impactante' },
          { day: 'Domingo', time: '09:00', name: 'Escola Bíblica Dominical (EBD)', description: 'Classes para todas as idades, infantil, jovens e adultos' },
          { day: 'Domingo', time: '19:00', name: 'Grande Culto da Família & Celebração', description: 'Louvor com coral, orquestra e ministração da Palavra' },
        ],
        pastor: 'Pr. Presidente Regional',
        phone: '(12) 3122-4589',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80',
        isSede: true,
      },
      {
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
          { day: 'Sexta-feira', time: '19:30', name: 'Culto nos Lares / Departamentos' },
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
        name: 'AD Congregação Engenheiro Neiva',
        neighborhood: 'Engenheiro Neiva',
        address: 'Rua Prof. José Ferreira, 230',
        city: 'Guaratinguetá',
        state: 'SP',
        postalCode: '12520-000',
        location: { lat: -22.7845, lng: -45.1610 },
        googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Engenheiro+Neiva+Guaratingueta',
        cultosSchedule: [
          { day: 'Terça-feira', time: '19:30', name: 'Culto de Ensino & Doutrina' },
          { day: 'Quinta-feira', time: '19:30', name: 'Culto da Família' },
          { day: 'Domingo', time: '09:00', name: 'EBD' },
          { day: 'Domingo', time: '19:00', name: 'Culto Evangelístico & Louvor' },
        ],
        pastor: 'Pr. Setorial',
        phone: '(12) 3126-3344',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
        isSede: false,
      },
      {
        name: 'AD Congregação Vila Paraíba / Beira Rio',
        neighborhood: 'Vila Paraíba',
        address: 'Rua Visconde de Guaratinguetá, 510',
        city: 'Guaratinguetá',
        state: 'SP',
        postalCode: '12510-100',
        location: { lat: -22.8220, lng: -45.2010 },
        googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Vila+Paraiba+Guaratingueta',
        cultosSchedule: [
          { day: 'Quarta-feira', time: '19:30', name: 'Culto de Adoração & Libertação' },
          { day: 'Sábado', time: '19:30', name: 'Reunião de Jovens' },
          { day: 'Domingo', time: '18:30', name: 'Culto da Família' },
        ],
        pastor: 'Ev. Dirigente',
        phone: '(12) 3122-8899',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80',
        isSede: false,
      },
      {
        name: 'AD Congregação Parque São Francisco',
        neighborhood: 'Parque São Francisco',
        address: 'Rua São Judas Tadeu, 88',
        city: 'Guaratinguetá',
        state: 'SP',
        postalCode: '12505-220',
        location: { lat: -22.8310, lng: -45.1915 },
        googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Parque+Sao+Francisco+Guaratingueta',
        cultosSchedule: [
          { day: 'Quinta-feira', time: '19:30', name: 'Culto de Oração & Milagres' },
          { day: 'Domingo', time: '09:00', name: 'EBD' },
          { day: 'Domingo', time: '19:00', name: 'Culto de Ações de Graças' },
        ],
        pastor: 'Pr. Local',
        phone: '(12) 3125-9000',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
        isSede: false,
      },
      {
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
          { day: 'Sábado', time: '19:30', name: 'Culto Departamental' },
          { day: 'Domingo', time: '19:00', name: 'Culto com a Família' },
        ],
        pastor: 'Ev. Encarregado',
        phone: '(12) 3123-4411',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&w=800&q=80',
        isSede: false,
      },
      {
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
      },
      {
        name: 'AD Regional Potim',
        neighborhood: 'Centro',
        address: 'Av. Miguel Vieira dos Santos, 145',
        city: 'Potim',
        state: 'SP',
        postalCode: '12525-000',
        location: { lat: -22.8420, lng: -45.2510 },
        googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Potim+SP',
        cultosSchedule: [
          { day: 'Quinta-feira', time: '19:30', name: 'Culto da Vitória' },
          { day: 'Domingo', time: '09:00', name: 'EBD' },
          { day: 'Domingo', time: '19:00', name: 'Culto da Família' },
        ],
        pastor: 'Pr. Dirigente Potim',
        phone: '(12) 3112-7788',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1519491058804-7456d6450495?auto=format&fit=crop&w=800&q=80',
        isSede: false,
      },
      {
        name: 'AD Regional Lorena',
        neighborhood: 'Centro',
        address: 'Rua Major Oliveira Borges, 520',
        city: 'Lorena',
        state: 'SP',
        postalCode: '12600-000',
        location: { lat: -22.7330, lng: -45.1210 },
        googleMapsUrl: 'https://maps.google.com/?q=Assembleia+de+Deus+Lorena+SP',
        cultosSchedule: [
          { day: 'Terça-feira', time: '19:30', name: 'Culto de Doutrina' },
          { day: 'Sábado', time: '19:30', name: 'Culto da Mocidade' },
          { day: 'Domingo', time: '19:00', name: 'Culto da Família' },
        ],
        pastor: 'Pr. Regional Lorena',
        phone: '(12) 3153-2211',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80',
        isSede: false,
      }
    ];

    await Church.create(churchesData);
    console.log(`[Seed] Created ${churchesData.length} churches and congregations in Guaratinguetá & region.`);

    // 5. Create Ads (PixelLab sponsors & audio tech ads for Free users)
    await Ad.create([
      {
        title: 'PixelLab — Apps, SaaS & Design Premium',
        advertiser: 'PixelLab Creative Studio',
        tagline: 'Transforme o ministério de sua igreja ou sua empresa com tecnologia de ponta.',
        ctaText: 'Fale Conosco',
        targetUrl: 'https://instagram.com/adguaratingueta',
        position: 'bottom_banner',
        badgeText: 'Anúncio Oficial • PixelLab',
      },
      {
        title: 'CantaFlow PRO — Sem Anúncios & Áudio Offline',
        advertiser: 'CantaFlow by PixelLab',
        tagline: 'Assine o PRO e tenha armazenamento ilimitado, transposição de cifras e stems de áudio!',
        ctaText: 'Assinar PRO por R$ 9,90/mês',
        targetUrl: '#upgrade-pro',
        position: 'in_feed',
        badgeText: 'Destaque CantaFlow',
      },
      {
        title: 'Som & Louvor — Instrumentos & Cabos com 15% OFF',
        advertiser: 'Som & Louvor Equipamentos',
        tagline: 'Microfones sem fio, in-ear monitors e mesas digitais para sua igreja.',
        ctaText: 'Ver Ofertas',
        targetUrl: 'https://instagram.com/adguaratingueta',
        position: 'bottom_banner',
        badgeText: 'Parceiro Louvor',
      },
      {
        title: 'Siga @adguaratingueta no Instagram',
        advertiser: 'AD Guaratinguetá Oficial',
        tagline: 'Acompanhe fotos dos cultos, congressos, eventos e transmissões ao vivo.',
        ctaText: 'Seguir no Instagram',
        targetUrl: 'https://www.instagram.com/adguaratingueta/',
        position: 'in_feed',
        badgeText: 'Igreja Conectada',
      }
    ]);

    console.log('[Seed] Created sample advertising campaigns.');
    console.log('[Seed] Database successfully seeded with all initial data!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
