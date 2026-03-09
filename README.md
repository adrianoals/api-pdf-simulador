# Unifisa PDF API

> **[Leia em Portugues](./README.pt-BR.md)**

REST API built with Node.js, Express, and TypeScript that generates consortium proposal PDFs for the Unifisa platform. It fetches simulation data from Supabase, renders HTML templates styled with Tailwind CSS, and converts them to PDF using Puppeteer.

## Tech Stack

- **Runtime:** Node.js + Express 5
- **Language:** TypeScript
- **PDF Engine:** Puppeteer
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **PDF Manipulation:** pdf-lib

## How It Works

1. Receives a request with simulation IDs and insurance types
2. Fetches simulation data from Supabase via a custom SQL function (`obter_detalhes_simulacao`)
3. Renders an HTML template with Tailwind CSS using the fetched data
4. Converts the HTML to PDF using Puppeteer and returns it

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | General health check |
| `GET` | `/api/pdf/health` | PDF service health check |
| `GET` | `/api/pdf?ids=1-2&tipos=seg0-seg1` | Generate proposal (HTML by default, PDF with `&format=pdf`) |
| `POST` | `/api/pdf/download` | Download proposal PDF (body: `{ ids, tipos }`) |

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `ids` | Yes | Simulation IDs separated by `-` or `,` |
| `tipos` | No | Insurance types (`seg0` or `seg1`) per ID. Defaults to `seg0` |
| `format` | No | Response format: `html` (default) or `pdf` |
| `clientName` | No | Client name for validation |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# Run in development mode
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `PORT` | Server port (default: `3001`) |
| `NODE_ENV` | Environment (`development` or `production`) |
| `PDF_TIMEOUT` | PDF generation timeout in ms (default: `30000`) |
| `PDF_MEMORY_LIMIT` | PDF memory limit in MB (default: `512`) |

## Project Structure

```
src/
├── index.ts                  # Express server setup
├── routes/
│   └── pdf.ts                # API route handlers
├── services/
│   ├── pdfService.ts         # PDF generation with Puppeteer
│   ├── supabaseService.ts    # Supabase data fetching
│   └── templateService.ts    # HTML template rendering
├── templates/
│   └── proposta.html         # HTML template with Tailwind CSS
├── types/
│   └── index.ts              # TypeScript type definitions
└── utils/
    ├── businessLogic.ts      # Business rules and calculations
    ├── formatters.ts         # Data formatting helpers
    ├── templateEngine.ts     # Template engine (Handlebars-like)
    └── validators.ts         # Input validation
```

## License

Proprietary - Unifisa
