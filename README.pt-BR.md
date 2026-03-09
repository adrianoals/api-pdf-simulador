# Unifisa PDF API

> **[Read in English](./README.md)**

API REST construida com Node.js, Express e TypeScript para gerar PDFs de propostas de consorcio da plataforma Unifisa. Busca dados de simulacoes no Supabase, renderiza templates HTML estilizados com Tailwind CSS e converte para PDF usando Puppeteer.

## Tecnologias

- **Runtime:** Node.js + Express 5
- **Linguagem:** TypeScript
- **Motor de PDF:** Puppeteer
- **Banco de Dados:** Supabase (PostgreSQL)
- **Estilizacao:** Tailwind CSS
- **Manipulacao de PDF:** pdf-lib

## Como Funciona

1. Recebe uma requisicao com IDs de simulacoes e tipos de seguro
2. Busca os dados no Supabase via funcao SQL customizada (`obter_detalhes_simulacao`)
3. Renderiza um template HTML com Tailwind CSS usando os dados obtidos
4. Converte o HTML em PDF com Puppeteer e retorna ao cliente

## Endpoints da API

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| `GET` | `/health` | Health check geral |
| `GET` | `/api/pdf/health` | Health check do servico de PDF |
| `GET` | `/api/pdf?ids=1-2&tipos=seg0-seg1` | Gerar proposta (HTML por padrao, PDF com `&format=pdf`) |
| `POST` | `/api/pdf/download` | Download do PDF da proposta (body: `{ ids, tipos }`) |

### Parametros de Query

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `ids` | Sim | IDs das simulacoes separados por `-` ou `,` |
| `tipos` | Nao | Tipos de seguro (`seg0` ou `seg1`) por ID. Padrao: `seg0` |
| `format` | Nao | Formato da resposta: `html` (padrao) ou `pdf` |
| `clientName` | Nao | Nome do cliente para validacao |

## Como Rodar

### Pre-requisitos

- Node.js 18+
- npm

### Configuracao

```bash
# Instalar dependencias
npm install

# Copiar variaveis de ambiente
cp .env.example .env
# Editar .env com seus valores reais

# Rodar em modo desenvolvimento
npm run dev

# Build para producao
npm run build
npm start
```

## Variaveis de Ambiente

| Variavel | Descricao |
|----------|-----------|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_ANON_KEY` | Chave anonima/publica do Supabase |
| `PORT` | Porta do servidor (padrao: `3001`) |
| `NODE_ENV` | Ambiente (`development` ou `production`) |
| `PDF_TIMEOUT` | Timeout da geracao de PDF em ms (padrao: `30000`) |
| `PDF_MEMORY_LIMIT` | Limite de memoria do PDF em MB (padrao: `512`) |

## Estrutura do Projeto

```
src/
├── index.ts                  # Configuracao do servidor Express
├── routes/
│   └── pdf.ts                # Handlers das rotas da API
├── services/
│   ├── pdfService.ts         # Geracao de PDF com Puppeteer
│   ├── supabaseService.ts    # Busca de dados no Supabase
│   └── templateService.ts    # Renderizacao de templates HTML
├── templates/
│   └── proposta.html         # Template HTML com Tailwind CSS
├── types/
│   └── index.ts              # Definicoes de tipos TypeScript
└── utils/
    ├── businessLogic.ts      # Regras de negocio e calculos
    ├── formatters.ts         # Helpers de formatacao de dados
    ├── templateEngine.ts     # Motor de templates (estilo Handlebars)
    └── validators.ts         # Validacao de entrada
```

## Licenca

Proprietario - Unifisa
