# Documentação da Página proposta-v2 - Referência para API de PDF

## 📋 Objetivo deste documento

Este documento detalha a lógica da página `proposta-v2` do Unifisa 2.0 (frontend React) para servir como **referência obrigatória** na validação da API de PDF. O PDF gerado deve replicar **exatamente** as mesmas regras de exibição, campos e condições.

> **⚠️ IMPORTANTE:** Use este documento para comparar campo a campo o PDF gerado com o frontend. Qualquer diferença deve ser corrigida na API de PDF.

---

## 🏗️ Estrutura de Componentes

- **`[ids]/page.tsx`**: Página principal, faz o fetch dos dados, validações e renderiza os componentes.
- **`PropostaCard.tsx`**: Renderiza os detalhes de cada simulação/proposta, aplicando as regras de exibição de acordo com o tipo (seg0/seg1).
- **`SharedProposta.tsx`**: Componente do botão de download do PDF.

---

## 🔄 Fluxo de Dados e Lógica

1. **Recebe os parâmetros `ids` e `tipos` pela URL**:
   - Exemplo: `/proposta-v2/143-144?tipos=seg0-seg1`
   - `ids` = [143, 144]
   - `tipos` = ['seg0', 'seg1']

2. **Busca os dados das simulações no Supabase**:
   - Cada simulação retorna todos os relacionamentos (cliente, vendedor, bem, plano, taxa, resultado).
   - O campo `resultado` é um array, normalmente com um único objeto.

3. **Validações**:
   - Verifica se o número de tipos bate com o número de ids.
   - Valida vencimento da proposta.
   - Valida nome do cliente (se presente na URL).

4. **Renderização**:
   - Para cada simulação, renderiza um `PropostaCard`, passando o tipo correspondente.
   - O tipo define se os valores exibidos são "com seguro" (`seg1`) ou "sem seguro" (`seg0`).

---

## 🎯 Lógica de Exibição de Campos (com/sem seguro)

No componente `PropostaCard`, a lógica é:

```tsx
const comSeguro = tipo === 'seg1';
const parcela = comSeguro ? sim.resultado[0]?.parcela_com_seguro : sim.resultado[0]?.parcela_sem_seguro;
const parcelaReduzida = comSeguro ? sim.resultado[0]?.parcela_reduzida_com_seguro : sim.resultado[0]?.parcela_reduzida_sem_seguro;
const primeiraParcelaAntecipacao = comSeguro ? sim.resultado[0]?.primeira_parcela_antecipacao_com_seguro : sim.resultado[0]?.primeira_parcela_antecipacao_sem_seguro;
const parcelaAtualizada = comSeguro ? sim.resultado[0]?.parcela_atualizada_com_seguro : sim.resultado[0]?.parcela_atualizada_sem_seguro;
const parcelasAbatidas = comSeguro ? sim.resultado[0]?.n_parcelas_abatidas_com_seguro : sim.resultado[0]?.n_parcelas_abatidas_sem_seguro;
const prazoAtualizadoAbatimento = comSeguro ? sim.resultado[0]?.prazo_atualizado_com_abatimento_com_seguro : sim.resultado[0]?.prazo_atualizado_com_abatimento_sem_seguro;
```

- **Com seguro (`seg1`)**: usa sempre os campos `_com_seguro`.
- **Sem seguro (`seg0`)**: usa sempre os campos `_sem_seguro`.

Outros campos, como `valor_seguro_mensal` e `valor_seguro_total`, só aparecem se for "com seguro".

---

## 📊 Estrutura dos Dados (Simulacao/Resultado)

```typescript
interface Simulacao {
  id: number | string;
  valor_credito: number;
  ...
  resultado: Resultado[];
  ...
}

interface Resultado {
  parcela_com_seguro: number;
  parcela_sem_seguro: number;
  parcela_reduzida_com_seguro: number;
  parcela_reduzida_sem_seguro: number;
  primeira_parcela_antecipacao_com_seguro: number;
  primeira_parcela_antecipacao_sem_seguro: number;
  parcela_atualizada_com_seguro: number;
  parcela_atualizada_sem_seguro: number;
  n_parcelas_abatidas_com_seguro: number;
  n_parcelas_abatidas_sem_seguro: number;
  prazo_atualizado_com_abatimento_com_seguro: number;
  prazo_atualizado_com_abatimento_sem_seguro: number;
  valor_seguro_mensal: number;
  valor_seguro_total: number;
  ...
}
```

---

## 🔍 Checklist de Validação - PDF vs Frontend

### ✅ Campos Condicionais (Seguro)

| Campo                        | Com Seguro (`seg1`)         | Sem Seguro (`seg0`)         | Aparece no PDF? |
|------------------------------|-----------------------------|-----------------------------|-----------------|
| Valor da Parcela             | parcela_com_seguro          | parcela_sem_seguro          | ⬜ |
| Parcela Reduzida             | parcela_reduzida_com_seguro | parcela_reduzida_sem_seguro | ⬜ |
| 1ª Parcela                   | primeira_parcela_antecipacao_com_seguro | primeira_parcela_antecipacao_sem_seguro | ⬜ |
| Nova Parcela                 | parcela_atualizada_com_seguro | parcela_atualizada_sem_seguro | ⬜ |
| Parcelas Abatidas            | n_parcelas_abatidas_com_seguro | n_parcelas_abatidas_sem_seguro | ⬜ |
| Prazo Atualizado Abatimento  | prazo_atualizado_com_abatimento_com_seguro | prazo_atualizado_com_abatimento_sem_seguro | ⬜ |
| **Seguro Mensal**            | valor_seguro_mensal         | **(não exibe)**             | ⬜ |
| **Seguro Total**             | valor_seguro_total          | **(não exibe)**             | ⬜ |

### ✅ Campos Fixos (Sempre exibidos)

| Campo                        | Valor                       | Aparece no PDF? |
|------------------------------|-----------------------------|-----------------|
| Valor do Crédito             | valor_credito               | ⬜ |
| Lance Recurso Próprio        | lance_recurso_proprio       | ⬜ |
| Lance Embutido               | lance_embutido              | ⬜ |
| Lance Terceiro               | lance_terceiro              | ⬜ |
| Total do Lance               | resultado[0].total_lance    | ⬜ |
| Percentual do Lance          | resultado[0].percentual_lance | ⬜ |
| Crédito Entregue             | resultado[0].credito_entregue | ⬜ |
| Valor Abatido na Parcela     | resultado[0].valor_abatido_parcela | ⬜ |
| Prazo Atualizado             | resultado[0].prazo_atualizado | ⬜ |
| Taxa Efetivo Mensal          | resultado[0].taxa_efetivo_mensal | ⬜ |
| Custo Efetivo Total          | resultado[0].custo_efetivo_total | ⬜ |

### ✅ Informações do Cliente/Vendedor

| Campo                        | Valor                       | Aparece no PDF? |
|------------------------------|-----------------------------|-----------------|
| Nome do Cliente              | cliente.nome                | sim⬜ |
| Email do Cliente             | cliente.email               | ⬜ |
| Telefone do Cliente          | cliente.telefone            | ⬜ |
| Nome do Vendedor             | vendedor.nome               | sim⬜ |
| Email do Vendedor            | vendedor.email              | ⬜ |
| Telefone do Vendedor         | vendedor.telefone           | ⬜ |

### ✅ Informações do Bem/Plano

| Campo                        | Valor                       | Aparece no PDF? |
|------------------------------|-----------------------------|-----------------|
| Descrição do Bem             | bem.descricao               | sim⬜ |
| Fundo de Reserva             | bem.fundo_reserva           | sim ⬜ |
| Descrição do Plano           | plano.descricao             | nao precisa⬜ |
| Prazo                        | taxa.prazo                  | sim⬜ |
| Taxa de Administração        | taxa.taxa_administracao     | sim⬜ |
| Taxa de Antecipação          | taxa.taxa_antecipacao       | sim⬜ |

---

## ⚠️ Diferenças importantes para a API de PDF

### No React:
- O componente recebe o tipo e faz a lógica condicional em tempo real.
- O array de tipos é passado junto com os ids.
- O campo `resultado` é sempre um array, e o componente pega o primeiro item.
- Campos como "Seguro Mensal" só aparecem se for `seg1`.

### Na API de PDF:
- O template deve receber o campo `tipo` para cada simulação.
- Os helpers do template devem usar o campo `tipo` para decidir qual campo mostrar (com/sem seguro).
- O campo `resultado` deve ser um objeto (não array) para facilitar o uso dos helpers.
- Todos os campos condicionais devem ser renderizados conforme o tipo, igual ao React.

---

## 🛠️ Como usar este checklist

1. **Abra a página `proposta-v2`** no Unifisa 2.0 com uma simulação
2. **Gere o PDF** da mesma simulação via API
3. **Compare campo a campo** usando a tabela acima
4. **Marque ✅** se o campo aparece igual no PDF
5. **Marque ❌** se há diferença
6. **Ajuste o template/helpers** da API de PDF até todos ficarem ✅

---

## 📝 Exemplo de teste

```bash
# 1. Abra no navegador
http://localhost:3000/proposta-v2/143?tipos=seg0

# 2. Gere o PDF
curl http://localhost:3001/api/pdf/proposta/143/html?tipos=seg0

# 3. Compare os valores exibidos
```

---

## 🔗 Referência cruzada

- **Frontend:** `src/app/proposta-v2/[ids]/page.tsx`
- **Componente:** `src/components/proposta-v2/PropostaCard.tsx`
- **API de PDF:** `src/templates/proposta.html` e `src/services/templateService.ts`

---

**Lembre-se:** O PDF deve ser **idêntico** ao frontend. Qualquer diferença é um bug que precisa ser corrigido na API de PDF. 