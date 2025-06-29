import { formatCurrency, formatPercent, formatPercentRaw, formatDate } from './formatters';
import { 
  getParcela, 
  getParcelaReduzida, 
  getPrimeiraParcela,
  getParcelaAtualizada,
  getParcelasAbatidas,
  getPrazoAtualizado,
  getPrazoAtualizadoAbatimento,
  getCurrentYear,
  add,
  eq
} from './businessLogic';

/**
 * Formata valor mostrando "-" se for zero
 */
function formatValueOrDash(value: number): string {
  return value === 0 ? '-' : formatCurrency(value);
}

/**
 * Formata número mostrando "-" se for zero
 */
function formatNumberOrDash(value: number): string {
  return value === 0 ? '-' : String(value);
}

/**
 * Obtém o número de parcelas abatidas formatado (mostra "-" se for zero)
 */
function getParcelasAbatidasFormatted(tipo: string, resultado: any): string {
  const value = getParcelasAbatidas(tipo, resultado);
  return formatNumberOrDash(value);
}

/**
 * Obtém valor aninhado de um objeto
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
}

/**
 * Avalia uma condição
 */
function evaluateCondition(condition: string, data: any): boolean {
  condition = condition.trim();
  
  // Verifica se é uma função helper
  if (condition.includes('(') && condition.includes(')')) {
    return evaluateHelperFunction(condition, data);
  }
  
  // Verifica se é uma comparação simples
  if (condition.includes('eq')) {
    const match = condition.match(/eq\s+([^)]+)\s+([^)]+)/);
    if (match) {
      const [, value1, value2] = match;
      const val1 = getNestedValue(data, value1.trim().replace(/['"]/g, ''));
      const val2 = value2.trim().replace(/['"]/g, '');
      return val1 === val2;
    }
  }
  
  // Verifica se o valor existe e é truthy
  const value = getNestedValue(data, condition);
  return Boolean(value);
}

/**
 * Avalia uma função helper
 */
function evaluateHelperFunction(condition: string, data: any): boolean {
  // eq(tipo "seg1")
  if (condition.includes('eq') && condition.includes('tipo')) {
    const match = condition.match(/eq\s*\(\s*([^)]+)\s+([^)]+)\s*\)/);
    if (match) {
      const [, value1, value2] = match;
      const val1 = getNestedValue(data, value1.trim());
      const val2 = value2.trim().replace(/['"]/g, '');
      return val1 === val2;
    }
  }
  
  return false;
}

/**
 * Processa condicionais {{#if}} {{/if}}
 */
export function processConditionals(template: string, data: any): string {
  // Processa {{#if condition}} ... {{/if}}
  const ifRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  
  return template.replace(ifRegex, (match, condition, content) => {
    const isTrue = evaluateCondition(condition, data);
    return isTrue ? content : '';
  });
}

/**
 * Processa loops {{#each}} {{/each}}
 */
export function processLoops(template: string, data: any): string {
  // Processa {{#each simulacoes}} ... {{/each}}
  const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  
  return template.replace(eachRegex, (match, arrayName, content) => {
    const array = getNestedValue(data, arrayName);
    if (!Array.isArray(array)) return '';
    
    return array.map((item, index) => {
      let itemContent = content;
      
      // Substitui {{add @index 1}} por index + 1
      itemContent = itemContent.replace(/\{\{add\s+@index\s+1\}\}/g, String(index + 1));
      
      // Substitui variáveis do item
      itemContent = replaceVariables(itemContent, item);
      
      // Processa condicionais dentro do loop
      itemContent = processConditionals(itemContent, item);
      
      return itemContent;
    }).join('');
  });
}

/**
 * Substitui variáveis no template
 */
export function replaceVariables(template: string, data: any): string {
  let result = template;

  // Substitui funções helpers
  result = result.replace(/\{\{formatCurrency\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatCurrency(Number(value) || 0);
  });

  result = result.replace(/\{\{formatPercent\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatPercent(Number(value) || 0);
  });

  result = result.replace(/\{\{formatPercentRaw\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatPercentRaw(Number(value) || 0);
  });

  result = result.replace(/\{\{formatDate\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatDate(String(value) || '');
  });

  result = result.replace(/\{\{getParcela\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return formatCurrency(getParcela(tipoValue, resultadoValue));
  });

  result = result.replace(/\{\{getParcelaReduzida\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return formatCurrency(getParcelaReduzida(tipoValue, resultadoValue));
  });

  result = result.replace(/\{\{getPrimeiraParcela\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return formatCurrency(getPrimeiraParcela(tipoValue, resultadoValue));
  });

  result = result.replace(/\{\{getParcelaAtualizada\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return formatCurrency(getParcelaAtualizada(tipoValue, resultadoValue));
  });

  result = result.replace(/\{\{getParcelasAbatidas\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return String(getParcelasAbatidas(tipoValue, resultadoValue));
  });

  result = result.replace(/\{\{getParcelasAbatidasFormatted\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return getParcelasAbatidasFormatted(tipoValue, resultadoValue);
  });

  result = result.replace(/\{\{getPrazoAtualizadoAbatimento\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return String(getPrazoAtualizadoAbatimento(tipoValue, resultadoValue));
  });

  result = result.replace(/\{\{getPrazoAtualizado\s+([^}]+)\s+([^}]+)\}\}/g, (match, tipo, resultado) => {
    const tipoValue = getNestedValue(data, tipo);
    const resultadoValue = getNestedValue(data, resultado);
    return String(getPrazoAtualizado(tipoValue, resultadoValue));
  });

  result = result.replace(/\{\{formatValueOrDash\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatValueOrDash(Number(value) || 0);
  });

  result = result.replace(/\{\{formatNumberOrDash\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatNumberOrDash(Number(value) || 0);
  });

  result = result.replace(/\{\{getCurrentYear\}\}/g, String(getCurrentYear()));

  // Substitui variáveis simples
  const simpleReplacements: { [key: string]: any } = {
    '{{cliente.nome}}': data.cliente?.nome || '',
    '{{cliente.email}}': data.cliente?.email || '',
    '{{cliente.telefone}}': data.cliente?.telefone || '',
    '{{vendedor.nome}}': data.vendedor?.nome || '',
    '{{vendedor.email}}': data.vendedor?.email || '',
    '{{vendedor.telefone}}': data.vendedor?.telefone || '',
    '{{bem.descricao}}': data.bem?.descricao || '',
    '{{plano.descricao}}': data.plano?.descricao || '',
    '{{valor_credito}}': data.valor_credito || 0,
    '{{lance_recurso_proprio}}': data.lance_recurso_proprio || 0,
    '{{lance_terceiro}}': data.lance_terceiro || 0,
    '{{lance_embutido}}': data.lance_embutido || 0,
    '{{mes_contemplacao}}': data.mes_contemplacao || 0,
    '{{vencimento_proposta}}': data.vencimento_proposta || '',
    '{{taxa.prazo}}': data.taxa?.prazo || 0,
    '{{taxa.taxa_administracao}}': data.taxa?.taxa_administracao || 0,
    '{{taxa.taxa_antecipacao}}': data.taxa?.taxa_antecipacao || 0,
    '{{bem.fundo_reserva}}': data.bem?.fundo_reserva || 0,
    '{{tipo}}': data.tipo || 'seg0'
  };

  // Aplicar substituições simples
  Object.entries(simpleReplacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
  });

  // Substitui variáveis aninhadas do resultado
  if (data.resultado) {
    Object.entries(data.resultado).forEach(([key, value]) => {
      const placeholder = `{{resultado.${key}}}`;
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value || ''));
    });
  }

  return result;
}

/**
 * Processa um template completo
 */
export function processTemplate(template: string, data: any): string {
  let result = template;
  
  // Processa loops primeiro
  result = processLoops(result, data);
  
  // Processa condicionais
  result = processConditionals(result, data);
  
  // Substitui variáveis
  result = replaceVariables(result, data);
  
  return result;
} 