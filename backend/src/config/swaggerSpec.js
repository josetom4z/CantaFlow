const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CantaFlow API — by PixelLab',
    version: '1.0.0',
    description: `
**CantaFlow API** é a plataforma SaaS de gestão musical, repertório, cifras e radar de igrejas com Google Maps & WhatsApp.
Desenvolvido com excelência visual e arquitetura moderna pela **PixelLab**.

### Recursos:
- 🔐 Autenticação JWT e Gerenciamento de Planos (Free com Anúncios vs PRO sem anúncios).
- 🎵 Upload de áudio (MP3, WAV, M4A, OGG), categorização e transposição de tom.
- 📁 Pastas e escalas para culto de domingo, jovens, coral e harpa cristã.
- ⛪ Diretório georreferenciado das congregações da AD Guaratinguetá e Vale do Paraíba com rotas Google Maps e WhatsApp.
- 📢 Sistema de anúncios contextuais para contas Free.
    `,
    contact: {
      name: 'PixelLab Studio Tech',
      url: 'https://instagram.com/adguaratingueta',
      email: 'suporte@cantaflow.pixellab.app',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor Local de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT retornado no login/registro para autenticar as requisições.',
      },
      PlanHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'x-plan',
        description: 'Plano atual da sessão ("free" ou "pro").',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c0' },
          name: { type: 'string', example: 'Líder de Louvor' },
          email: { type: 'string', example: 'louvor@adguaratingueta.com.br' },
          churchName: { type: 'string', example: 'AD Guaratinguetá — Templo Sede' },
          role: { type: 'string', enum: ['member', 'musician', 'worship_leader', 'admin'], example: 'worship_leader' },
          plan: { type: 'string', enum: ['free', 'pro'], example: 'free' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Song: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c1' },
          title: { type: 'string', example: 'Bondade de Deus' },
          artist: { type: 'string', example: 'Isaías Saad & Ministério de Louvor' },
          category: {
            type: 'string',
            enum: [
              'Louvor Congregacional',
              'Coral & Orquestra',
              'Jovens & Adolescentes',
              'Ministério Infantil',
              'Hinos & Harpa Cristã',
              'Playbacks & Ensaios',
              'Especiais & Ceia',
              'Outros',
            ],
            example: 'Louvor Congregacional',
          },
          folder: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              color: { type: 'string' },
            },
          },
          audioUrl: { type: 'string', example: '/uploads/audio/17097482910-bondade_de_deus.mp3' },
          originalFileName: { type: 'string', example: 'bondade_de_deus.mp3' },
          duration: { type: 'number', example: 295 },
          fileSizeBytes: { type: 'number', example: 4820000 },
          keySignature: { type: 'string', example: 'Ab' },
          bpm: { type: 'number', example: 70 },
          lyrics: { type: 'string', example: 'Te amo Deus, Tua graça nunca falha...' },
          chords: { type: 'string', example: '[Intro] G C G C\n[Verso 1]\nG C\nTe amo Deus...' },
          tags: { type: 'array', items: { type: 'string' }, example: ['Domingo', 'Adoração', 'Guará'] },
          isDemo: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Folder: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c2' },
          name: { type: 'string', example: 'Domingo - Culto da Família' },
          color: { type: 'string', example: '#8b5cf6' },
          icon: { type: 'string', example: 'Music' },
          description: { type: 'string', example: 'Repertório do culto de Domingo à noite' },
          songCount: { type: 'number', example: 4 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Church: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c3' },
          name: { type: 'string', example: 'Assembleia de Deus — Templo Sede Guaratinguetá' },
          neighborhood: { type: 'string', example: 'Centro' },
          address: { type: 'string', example: 'Rua Domingos Rodrigues Alves, 417' },
          city: { type: 'string', example: 'Guaratinguetá' },
          state: { type: 'string', example: 'SP' },
          postalCode: { type: 'string', example: '12500-010' },
          location: {
            type: 'object',
            properties: {
              lat: { type: 'number', example: -22.8164 },
              lng: { type: 'number', example: -45.1953 },
            },
          },
          googleMapsUrl: { type: 'string', example: 'https://maps.google.com/?q=Assembleia+de+Deus+Templo+Sede+Guaratingueta' },
          cultosSchedule: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day: { type: 'string', example: 'Domingo' },
                time: { type: 'string', example: '19:00' },
                name: { type: 'string', example: 'Grande Culto da Família' },
                description: { type: 'string', example: 'Celebração com orquestra e louvor' },
              },
            },
          },
          pastor: { type: 'string', example: 'Pr. Presidente Regional' },
          phone: { type: 'string', example: '(12) 3122-4589' },
          instagram: { type: 'string', example: 'https://www.instagram.com/adguaratingueta/' },
          isSede: { type: 'boolean', example: true },
          distanceKm: { type: 'number', example: 1.2 },
        },
      },
      Ad: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c4' },
          title: { type: 'string', example: 'PixelLab — Apps & SaaS Premium' },
          advertiser: { type: 'string', example: 'PixelLab Creative Studio' },
          tagline: { type: 'string', example: 'Criação de aplicativos e design de alto nível.' },
          ctaText: { type: 'string', example: 'Fale Conosco' },
          targetUrl: { type: 'string', example: 'https://instagram.com/adguaratingueta' },
          position: { type: 'string', enum: ['bottom_banner', 'in_feed', 'interstitial_modal'], example: 'bottom_banner' },
          badgeText: { type: 'string', example: 'Patrocinado • PixelLab' },
          clicks: { type: 'number', example: 15 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Descrição detalhada do erro.' },
        },
      },
    },
  },
  tags: [
    { name: 'Autenticação & Planos', description: 'Registro, login, perfil e upgrade para CantaFlow PRO' },
    { name: 'Músicas & Áudios', description: 'Upload de áudios, cifras, renomear, filtros e exclusão' },
    { name: 'Pastas & Repertórios', description: 'Organização de escalas para cultos, ensaios e ministérios' },
    { name: 'Igrejas & Google Maps', description: 'Radar georreferenciado das congregações e rotas GPS' },
    { name: 'Anúncios & Monetização', description: 'Banners de parceiros e métricas de campanhas publicitárias' },
    { name: 'Sistema', description: 'Status de integridade e métricas do servidor' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificar status e integridade do servidor',
        responses: {
          200: {
            description: 'Servidor operacional',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'CantaFlow — by PixelLab Backend API' },
                    time: { type: 'string', format: 'date-time' },
                    uptime: { type: 'number', example: 124.5 },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Autenticação & Planos'],
        summary: 'Registrar novo usuário no CantaFlow',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Músico AD Guará' },
                  email: { type: 'string', example: 'musico@adguaratingueta.com.br' },
                  password: { type: 'string', example: 'senha123', minLength: 6 },
                  churchName: { type: 'string', example: 'AD Guaratinguetá - Sede' },
                  role: { type: 'string', enum: ['member', 'musician', 'worship_leader', 'admin'], example: 'musician' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário registrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    plan: { type: 'string', example: 'free' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
                  },
                },
              },
            },
          },
          400: {
            description: 'E-mail já cadastrado ou dados inválidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticação & Planos'],
        summary: 'Autenticar usuário e obter token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'louvor@adguaratingueta.com.br' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Autenticado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    plan: { type: 'string', example: 'free' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
                  },
                },
              },
            },
          },
          401: {
            description: 'E-mail ou senha incorretos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/auth/toggle-plan': {
      post: {
        tags: ['Autenticação & Planos'],
        summary: 'Alternar plano (Free vs PRO)',
        description: 'Permite alternar a assinatura da conta para habilitar modo sem anúncios e downloads offline ilimitados.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  targetPlan: { type: 'string', enum: ['free', 'pro'], example: 'pro' },
                  email: { type: 'string', example: 'louvor@adguaratingueta.com.br' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Plano atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    plan: { type: 'string', example: 'pro' },
                    message: { type: 'string', example: 'Plano atualizado com sucesso para PRO' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Autenticação & Planos'],
        summary: 'Obter dados do perfil logado',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Dados do perfil do usuário',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
        },
      },
    },
    '/api/songs': {
      get: {
        tags: ['Músicas & Áudios'],
        summary: 'Listar repertório de músicas com filtros',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filtrar por categoria' },
          { name: 'folderId', in: 'query', schema: { type: 'string' }, description: 'ID da pasta ou "none" para raiz' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Termo de busca (título, cantor, letra)' },
          { name: 'tag', in: 'query', schema: { type: 'string' }, description: 'Filtrar por tag' },
        ],
        responses: {
          200: {
            description: 'Lista de músicas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Song' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Músicas & Áudios'],
        summary: 'Fazer upload de nova música/áudio',
        description: 'Envio de arquivo de áudio via multipart/form-data com metadados musicais.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['audio', 'title'],
                properties: {
                  audio: { type: 'string', format: 'binary', description: 'Arquivo MP3, WAV, M4A, OGG' },
                  title: { type: 'string', example: 'Bondade de Deus' },
                  artist: { type: 'string', example: 'Isaías Saad' },
                  category: { type: 'string', example: 'Louvor Congregacional' },
                  folderId: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c2' },
                  keySignature: { type: 'string', example: 'Ab' },
                  bpm: { type: 'number', example: 70 },
                  lyrics: { type: 'string', example: 'Te amo Deus...' },
                  chords: { type: 'string', example: '[Intro] G C G C' },
                  tags: { type: 'string', example: 'Domingo, Adoração' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Música cadastrada e áudio processado com sucesso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Song' } } },
          },
          400: {
            description: 'Arquivo inválido ou ausente',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/songs/{id}': {
      get: {
        tags: ['Músicas & Áudios'],
        summary: 'Obter detalhes de uma música por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Detalhes da música',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Song' } } },
          },
          404: { description: 'Música não encontrada' },
        },
      },
      put: {
        tags: ['Músicas & Áudios'],
        summary: 'Editar, renomear ou mover música de pasta',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Bondade de Deus (Ao Vivo)' },
                  artist: { type: 'string', example: 'Isaías Saad' },
                  category: { type: 'string', example: 'Louvor Congregacional' },
                  folderId: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c2' },
                  keySignature: { type: 'string', example: 'G' },
                  bpm: { type: 'number', example: 72 },
                  lyrics: { type: 'string' },
                  chords: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Música atualizada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Song' } } },
          },
        },
      },
      delete: {
        tags: ['Músicas & Áudios'],
        summary: 'Excluir música do acervo',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Música removida',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Música removida com sucesso.' } },
                },
              },
            },
          },
        },
      },
    },
    '/api/folders': {
      get: {
        tags: ['Pastas & Repertórios'],
        summary: 'Listar todas as pastas com contagem de músicas',
        responses: {
          200: {
            description: 'Lista de pastas com contagem',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    folders: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Folder' },
                    },
                    unfiledCount: { type: 'number', example: 3 },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Pastas & Repertórios'],
        summary: 'Criar nova pasta / repertório para culto',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Vigília de Jovens — UMADG' },
                  color: { type: 'string', example: '#ec4899' },
                  icon: { type: 'string', example: 'Sparkles' },
                  description: { type: 'string', example: 'Músicas selecionadas para o culto jovem' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Pasta criada com sucesso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Folder' } } },
          },
        },
      },
    },
    '/api/folders/{id}': {
      put: {
        tags: ['Pastas & Repertórios'],
        summary: 'Atualizar dados da pasta',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  color: { type: 'string' },
                  icon: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Pasta atualizada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Folder' } } },
          },
        },
      },
      delete: {
        tags: ['Pastas & Repertórios'],
        summary: 'Excluir pasta (músicas são mantidas na raiz)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Pasta removida',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Pasta removida e músicas movidas para a raiz.' } },
                },
              },
            },
          },
        },
      },
    },
    '/api/churches': {
      get: {
        tags: ['Igrejas & Google Maps'],
        summary: 'Consultar diretório de congregações da AD Guaratinguetá e região',
        description: 'Retorna congregações com horários de cultos, coordenadas geográficas e cálculo de distância via GPS.',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca por bairro, rua ou pastor' },
          { name: 'neighborhood', in: 'query', schema: { type: 'string' }, description: 'Filtrar por bairro' },
          { name: 'city', in: 'query', schema: { type: 'string' }, description: 'Filtrar por cidade' },
          { name: 'day', in: 'query', schema: { type: 'string' }, description: 'Filtrar congregações com culto no dia (ex: Terça-feira, Domingo)' },
          { name: 'userLat', in: 'query', schema: { type: 'number' }, description: 'Latitude do usuário para ordenar por proximidade' },
          { name: 'userLng', in: 'query', schema: { type: 'number' }, description: 'Longitude do usuário para ordenar por proximidade' },
        ],
        responses: {
          200: {
            description: 'Lista de congregações mapeadas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    churches: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Church' },
                    },
                    total: { type: 'number', example: 9 },
                    neighborhoods: { type: 'array', items: { type: 'string' }, example: ['Centro', 'Pedregulho', 'Engenheiro Neiva'] },
                    cities: { type: 'array', items: { type: 'string' }, example: ['Guaratinguetá', 'Aparecida', 'Lorena'] },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Igrejas & Google Maps'],
        summary: 'Cadastrar nova congregação',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Church' },
            },
          },
        },
        responses: {
          201: {
            description: 'Congregação cadastrada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Church' } } },
          },
        },
      },
    },
    '/api/churches/upload-photo': {
      post: {
        tags: ['Igrejas & Google Maps'],
        summary: 'Fazer upload de foto da congregação',
        description: 'Faz upload de imagem (JPG, PNG, WebP) e retorna a URL pública gerada.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['photo'],
                properties: {
                  photo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo de imagem da congregação',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Foto enviada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    filename: { type: 'string', example: 'church-1718000000-sede.jpg' },
                    photoUrl: { type: 'string', example: 'http://localhost:5000/uploads/images/church-1718000000-sede.jpg' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/churches/{id}': {
      get: {
        tags: ['Igrejas & Google Maps'],
        summary: 'Obter detalhes de uma congregação por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Detalhes da congregação',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Church' } } },
          },
        },
      },
      put: {
        tags: ['Igrejas & Google Maps'],
        summary: 'Atualizar congregação, endereço, fotos ou cultos',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Church' },
            },
          },
        },
        responses: {
          200: {
            description: 'Congregação atualizada com sucesso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Church' } } },
          },
        },
      },
      delete: {
        tags: ['Igrejas & Google Maps'],
        summary: 'Excluir congregação do diretório',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Congregação excluída com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Igreja removida com sucesso.' },
                    id: { type: 'string', example: '65e8a1f2b3c4d5e6f7a8b9c3' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/ads': {
      get: {
        tags: ['Anúncios & Monetização'],
        summary: 'Obter anúncios ativos para contas Free',
        parameters: [
          { name: 'position', in: 'query', schema: { type: 'string', enum: ['bottom_banner', 'in_feed', 'interstitial_modal'] } },
        ],
        responses: {
          200: {
            description: 'Lista de anúncios patrocinados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Ad' },
                },
              },
            },
          },
        },
      },
    },
    '/api/ads/{id}/click': {
      post: {
        tags: ['Anúncios & Monetização'],
        summary: 'Registrar clique em anúncio',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Métrica de clique gravada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    clicks: { type: 'number', example: 16 },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
