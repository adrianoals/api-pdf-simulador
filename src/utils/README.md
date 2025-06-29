# Utils - Estrutura Organizada

Esta pasta contém utilitários organizados por responsabilidade para facilitar manutenção e refatoração.

## 📁 Estrutura de Arquivos

### `formatters.ts`
Funções de formatação de dados:
- `formatCurrency()` - Formata valores monetários em Real
- `formatPercent()` - Formata percentuais com símbolo %
- `formatPercentRaw()` - Formata percentuais sem símbolo %
- `formatDate()` - Formata datas para formato brasileiro
- `formatTelefone()` - Formata telefones brasileiros
- `formatClientNameForURL()` - Formata nomes para URLs
- `generatePDFFileName()` - Gera nomes de arquivos PDF

### `validators.ts`
Funções de validação de dados:
- `validateIds()` - Valida arrays de IDs
- `validateClientName()` - Valida nomes de clientes
- `validatePDFRequest()` - Valida requisições de PDF
- `sanitizePDFRequest()` - Sanitiza dados de requisição
- `validateRequestLimits()` - Valida limites de requisição
- `generateCacheKey()` - Gera chaves de cache

### `businessLogic.ts`
Funções específicas do negócio (simulações de crédito/seguro):
- `isPlanoReduzido()` - Verifica se é plano reduzido
- `isPlanoAlpha()` - Verifica se é plano Alpha
- `getParcela()` - Obtém valor da parcela baseado no tipo de seguro
- `getParcelaReduzida()` - Obtém valor da parcela reduzida
- `getPrimeiraParcela()` - Obtém valor da primeira parcela
- `getParcelaAtualizada()` - Obtém valor da parcela atualizada
- `getParcelasAbatidas()` - Obtém número de parcelas abatidas
- `getPrazoAtualizado()` - Obtém prazo atualizado
- `getPrazoAtualizadoAbatimento()` - Obtém prazo com abatimento
- `getCurrentYear()` - Obtém ano atual
- `add()` - Adiciona números
- `eq()` - Verifica igualdade

### `templateEngine.ts`
Motor de template engine personalizado:
- `processTemplate()` - Processa template completo
- `processConditionals()` - Processa condicionais {{#if}}
- `processLoops()` - Processa loops {{#each}}
- `replaceVariables()` - Substitui variáveis no template
- `evaluateCondition()` - Avalia condições
- `evaluateHelperFunction()` - Avalia funções helper
- `getNestedValue()` - Obtém valores aninhados

## 🚀 Benefícios da Refatoração

### ✅ **Separação de Responsabilidades**
- Cada arquivo tem uma responsabilidade específica
- Fácil localização de funcionalidades
- Código mais organizado e legível

### ✅ **Facilita Manutenção**
- Alterações em formatação não afetam lógica de negócio
- Validações isoladas em arquivo próprio
- Motor de template independente

### ✅ **Reutilização**
- Funções podem ser importadas individualmente
- Arquivo `index.ts` facilita importações
- Evita duplicação de código

### ✅ **Testabilidade**
- Cada módulo pode ser testado isoladamente
- Mocks mais fáceis de criar
- Testes mais específicos

## 📝 Como Usar

### Importação Individual
```typescript
import { formatCurrency } from './utils/formatters';
import { validateIds } from './utils/validators';
import { getParcela } from './utils/businessLogic';
import { processTemplate } from './utils/templateEngine';
```

### Importação via Index
```typescript
import { formatCurrency, validateIds, getParcela, processTemplate } from './utils';
```

## 🔄 Migração

O arquivo `templateService.ts` foi refatorado para usar a nova estrutura:
- Removidas funções duplicadas
- Importações organizadas
- Código mais limpo e focado

## 📋 Próximos Passos

1. **Testes Unitários**: Criar testes para cada módulo
2. **Documentação**: Adicionar JSDoc para todas as funções
3. **TypeScript**: Melhorar tipagem onde necessário
4. **Performance**: Otimizar funções críticas se necessário 