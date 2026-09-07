# 🎵 CantaFlow — by PixelLab
> **Plataforma SaaS para Gestão de Ministérios de Louvor, Repertório Musical, Cifras e Radar de Igrejas com Google Maps & WhatsApp.**

Desenvolvido com excelência visual e arquitetura moderna pela **PixelLab** — Mobile First & Offline First.

Inspirado e integrado com as congregações da [Assembleia de Deus em Guaratinguetá — SP](https://www.instagram.com/adguaratingueta/) e Vale do Paraíba.

---

## 🚀 Funcionalidades Principais

### 1. 🎼 Gestão Musical Completa
- **Upload de Áudio**: Suporte para MP3, WAV, M4A, OGG, AAC (até 50MB).
- **Organização & Pastas**: Agrupe músicas por culto (ex: *Domingo Família*, *Rede de Jovens*, *Coral & Orquestra*, *Santa Ceia*, *Harpa Cristã*).
- **Renomear & Categorizar**: Edição rápida de título, intérprete, tom original, BPM, categoria e tags.
- **Player de Áudio Flutuante**: Mini-player persistente com scrubber, visualizador waveform animado, controle de velocidade (0.75x a 1.5x) e repetição.
- **Cifrador & Letras em Tela Cheia**: Visualizador com **transposição de tom em tempo real** (+/- semitons) para músicos e ministros durante o culto/ensaio.

### 2. 📲 Compartilhamento no WhatsApp em 1 Clique
- **Compartilhar Música/Louvor**: Mensagem formatada com tom, BPM, trecho da letra e link do CantaFlow.
- **Compartilhar Escala/Pasta**: Exporta a lista completa de músicas do culto diretamente para o grupo de louvor.
- **Compartilhar Endereço de Igreja**: Envia o endereço completo, horários de cultos e link do Google Maps para membros e visitantes.

### 3. 🗺️ Radar de Igrejas & Google Maps
- **Diretório Regional**: Mapeamento de todas as congregações de Guaratinguetá (Templo Sede, Pedregulho, Eng. Neiva, Vila Paraíba, Parque São Francisco, Jardim do Vale, Aparecida, Potim, Lorena).
- **Mapa Interativo (Leaflet / OpenStreetMap)**: Pinos estilizados com identificação de Sede Regional.
- **Abrir Rota no Google Maps**: Botão direto que traça a rota GPS no app nativo do Google Maps ou navegador.
- **Filtros Inteligentes**: Filtre por bairro ou dia do culto (ex: *Culto de Doutrina*, *Culto da Família*, *Culto de Jovens UMADG*).
- **Geolocalização (GPS)**: Calcula a distância em KM até cada congregação.

### 4. 💎 Modelo de Monetização (Free vs PRO)
- **Conta Free**:
  - Exibe banners patrocinados e anúncios personalizáveis da PixelLab Ads.
  - Limite de armazenamento e downloads offline.
- **Conta PRO (R$ 9,90/mês)**:
  - 100% livre de anúncios.
  - Downloads offline ilimitados (tocar sem internet em qualquer lugar).
  - Transposição de tom sem limitações.
  - Criação ilimitada de pastas e escalas.
  - Suporte prioritário da PixelLab.

### 5. ⚡ Mobile-First & Offline-First (PWA)
- Interface otimizada com dock de navegação inferior estilo app nativo.
- Banco local **IndexedDB (via Dexie.js)** para armazenar áudios e cifras no dispositivo, funcionando 100% mesmo sem conexão de internet durante ensaios e cultos.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Leaflet, Canvas Confetti |
| **Offline Storage** | IndexedDB (Dexie.js), Service Worker PWA |
| **Backend API** | Node.js, Express, Multer, JWT, BcryptJS, Morgan |
| **Banco de Dados** | MongoDB 7.0 + Mongoose |
| **Containerização** | Docker & Docker Compose |
| **Identidade Visual** | PixelLab Dark Neon Aesthetics |

---

## 🐳 Como Executar com Docker (Recomendado)

Suba toda a infraestrutura (MongoDB + Backend + Frontend) com apenas um comando:

```bash
docker compose up --build -d
```

- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Documentação Swagger Interativa**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Swagger JSON Spec**: [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json)
- **MongoDB**: `localhost:27017`

Para parar os serviços:
```bash
docker compose down
```

---

## 💻 Como Executar Localmente (Sem Docker)

### 1. Backend (Node.js API)
```bash
cd backend
npm install
npm run seed     # Popula congregações da AD Guaratinguetá e louvores iniciais
npm run dev      # Inicia a API em http://localhost:5000
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev      # Inicia o app em http://localhost:5173
```

---

## 📁 Estrutura de Pastas

```text
CantaFlow/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/ (auth, song, folder, church, ad)
│   │   ├── middleware/ (auth, upload)
│   │   ├── models/ (User, Song, Folder, Church, Ad)
│   │   ├── routes/ (auth, songs, folders, churches, ads)
│   │   ├── seed/seedData.js
│   │   └── server.js
│   ├── uploads/audio/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (HeaderBrand, MobileBottomNav)
│   │   │   ├── music/ (SongCard, SongUploadModal, RenameSongModal, CategoryPills)
│   │   │   ├── folders/ (FolderGrid)
│   │   │   ├── churches/ (ChurchDirectory, ChurchCard, ChurchMap)
│   │   │   ├── player/ (BottomPlayerBar, FullScreenPlayerModal)
│   │   │   └── monetization/ (AdBanner, UpgradeModal)
│   │   ├── context/ (AuthContext, AudioPlayerContext, OfflineContext)
│   │   ├── services/ (api, offlineStorage, whatsappHelper, mockData)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

---

## 🏷️ Créditos & Marca
Desenvolvido por **PixelLab**
Referência Regional: [AD Guaratinguetá (@adguaratingueta)](https://www.instagram.com/adguaratingueta/)
