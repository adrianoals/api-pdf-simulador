# API de Geração de PDF - Unifisa

## 📋 O que é este projeto?

Este projeto é um serviço Node.js/Express **paralelo** ao sistema principal Unifisa 2.0 (Next.js/React). Ele **não é o frontend** e **não cria simulações**: sua única função é gerar PDFs de propostas de consórcio, usando um template HTML (`proposta.html`) que deve ser **idêntico** ao design e às regras de exibição da página `proposta-v2` do frontend.

- **Base de dados:** Busca dados prontos do Supabase (via função customizada)
- **Renderização:** Usa Puppeteer para gerar PDF a partir do HTML com Tailwind CSS
- **Fidelidade:** O PDF deve exibir exatamente os mesmos campos, valores e condições (ex: campos de seguro, planos, etc) que a página `proposta-v2` do Unifisa 2.0

> **✅ CORRIGIDO:** O sistema de template engine foi corrigido para processar corretamente a sintaxe Handlebars e todas as funções helpers.

---

## 📚 Documentação complementar

- [README2.md](./README2.md): Documentação detalhada da lógica da página `proposta-v2` do Unifisa 2.0 (frontend React). Use como referência para garantir que o PDF replica exatamente as mesmas regras e campos.

---

## 🏗️ Estrutura do Projeto

```
api-pdf/
├── src/
│   ├── index.ts              # Servidor Express
│   ├── routes/
│   │   └── pdf.ts            # Rotas da API
│   ├── services/
│   │   ├── supabaseService.ts # Conexão com Supabase
│   │   └── templateService.ts # Geração de HTML (CORRIGIDO)
│   ├── templates/
│   │   └── proposta.html     # Template HTML com Tailwind (CORRIGIDO)
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript (ATUALIZADO)
│   └── utils/
│       ├── formatters.ts     # Formatação de dados
│       └── validators.ts     # Validação de entrada
├── package.json
├── tsconfig.json
├── README.md
├── README2.md
├── test-api.js               # Script de teste
└── nodemon.json
```

---

## 🚦 Como funciona

1. **Recebe requisição GET** com os IDs das simulações e tipos de plano (ex: `/api/pdf/proposta/1-2?tipos=seg0-seg1`)
2. **Busca os dados completos** de cada simulação no Supabase (via função SQL customizada)
3. **Renderiza o template HTML** (`proposta.html`) usando os dados e helpers para aplicar as regras de exibição
4. **Gera e retorna o PDF** (ou HTML para debug)

---

## 🔧 Correções Implementadas

### ✅ Template Engine
- **Processamento de condicionais**: `{{#if}}` e `{{/if}}` agora funcionam corretamente
- **Processamento de loops**: `{{#each}}` e `{{/each}}` processam arrays de simulações
- **Funções helpers**: Todas as funções como `getParcela`, `isPlanoReduzido`, etc. implementadas
- **Substituição de variáveis**: Sistema robusto de substituição de variáveis aninhadas

### ✅ Estrutura de Dados
- **Campo tipo**: Adicionado campo `tipo` às simulações para indicar `seg0` ou `seg1`
- **Conversão de dados**: Melhorada a conversão de dados do Supabase
- **Validações**: Validações de segurança e expiração mantidas

### ✅ Template HTML
- **Sintaxe corrigida**: Todas as funções helpers usam sintaxe correta
- **Condicionais funcionais**: Campos condicionais baseados no tipo de seguro
- **Layout responsivo**: Mantido o design responsivo com Tailwind CSS

---

## 🛠️ Como rodar/testar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente** (crie um arquivo `.env`):
   ```env
   SUPABASE_URL=sua_url_do_supabase_aqui
   SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui
   PORT=3001
   NODE_ENV=development
   ```

3. **Rode em modo dev:**
   ```bash
   npm run dev
   ```

4. **Teste a geração de HTML:**
   ```bash
   # Usando o script de teste
   node test-api.js
   
   # Ou usando curl
   curl http://localhost:3001/api/pdf?ids=1&tipos=seg0
   
   # Para múltiplas simulações
   curl http://localhost:3001/api/pdf?ids=1-2-3&tipos=seg0-seg1-seg0
   ```

---

## 🔍 Exemplos de Uso

### Simulação única
```
GET /api/pdf?ids=143&tipos=seg0
```

### Múltiplas simulações
```
GET /api/pdf?ids=143-144&tipos=seg0-seg1
```

### Com validação de cliente
```
GET /api/pdf?ids=143&tipos=seg0&clientName=joao-silva
```

---

## 🔗 Referência cruzada

- **Frontend:** Unifisa 2.0 (`src/app/proposta-v2/[ids]/page.tsx` e componentes)
- **Documentação de lógica:** [README2.md](./README2.md)
- **Template base:** `src/templates/proposta.html`

---

## 📄 Licença

Este projeto é parte do sistema Unifisa 2.0 e segue as mesmas políticas de licenciamento.

---

**Desenvolvido para Unifisa** - Sistema de Consórcios 

## 🔄 Como a API de PDF busca os dados

- A API de PDF **NÃO cria nem altera simulações**.
- Ao receber um pedido (GET) com o(s) ID(s) da simulação, ela faz um **POST para o Supabase** usando uma função SQL customizada (`obter_detalhes_simulacao`).
- Essa função retorna todos os dados necessários (cliente, vendedor, plano, resultados, etc) já prontos para o template.
- A API de PDF então gera o HTML/PDF e retorna para o frontend.

**Fluxo resumido:**
1. Frontend faz GET `/api/pdf?ids=...`
2. API de PDF faz POST `/rest/v1/rpc/obter_detalhes_simulacao` no Supabase
3. Supabase retorna os dados completos
4. API de PDF gera e retorna o PDF/HTML

> **Obs:** O método GET é usado para facilitar download e preview, mas a busca real dos dados é feita via POST interno para o Supabase. 