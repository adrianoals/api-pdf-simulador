import fs from 'fs';
import path from 'path';
import { SimulacaoQuery } from '../types';

/**
 * Formata valor monetário
 */
function formatCurrency(value: number): string {
  if (!value || isNaN(value)) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formata percentual
 */
function formatPercentage(value: number): string {
  if (!value || isNaN(value)) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value / 100);
}

/**
 * Formata percentual raw (sem multiplicar por 100)
 */
function formatPercentRaw(value: number): string {
  if (!value || isNaN(value)) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
}

/**
 * Formata data
 */
function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString + 'T00:00:00-03:00');
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
}

/**
 * Verifica se é plano reduzido
 */
function isPlanoReduzido(bemDescricao: string, planoDescricao: string): boolean {
  return (
    (bemDescricao === "Imóvel" && ["Sigma 25%", "Ômega 25%", "Gamma 25%", "Ômega 50%", "Delta 50%"].includes(planoDescricao)) ||
    (["Automóvel", "Máquinário", "Embarcação"].includes(bemDescricao) && ["Gamma 30%", "Betha 30%"].includes(planoDescricao))
  );
}

/**
 * Verifica se é plano Alpha
 */
function isPlanoAlpha(bem: any, plano: any): boolean {
  return bem?.descricao === "Imóvel" && plano?.descricao === "Alpha";
}

/**
 * Adiciona números
 */
function add(a: number, b: number): number {
  return (a || 0) + (b || 0);
}

/**
 * Verifica igualdade
 */
function eq(a: any, b: any): boolean {
  return a === b;
}

/**
 * Obtém o valor da parcela baseado no tipo de seguro
 */
function getParcela(tipo: string, resultado: any): number {
  if (!resultado) {
    return 0;
  }
  
  let valor = 0;
  if (tipo === 'seg1') {
    valor = resultado.parcela_com_seguro || 0;
  } else {
    valor = resultado.parcela_sem_seguro || 0;
  }
  
  return valor;
}

/**
 * Obtém o valor da parcela reduzida baseado no tipo de seguro
 */
function getParcelaReduzida(tipo: string, resultado: any): number {
  if (!resultado) {
    return 0;
  }
  
  let valor = 0;
  if (tipo === 'seg1') {
    valor = resultado.parcela_reduzida_com_seguro || 0;
  } else {
    valor = resultado.parcela_reduzida_sem_seguro || 0;
  }
  
  return valor;
}

/**
 * Obtém o valor da primeira parcela baseado no tipo de seguro
 */
function getPrimeiraParcela(tipo: string, resultado: any): number {
  if (!resultado) {
    return 0;
  }
  
  let valor = 0;
  if (tipo === 'seg1') {
    valor = resultado.primeira_parcela_antecipacao_com_seguro || 0;
  } else {
    valor = resultado.primeira_parcela_antecipacao_sem_seguro || 0;
  }
  
  return valor;
}

/**
 * Obtém o valor da parcela atualizada baseado no tipo de seguro
 */
function getParcelaAtualizada(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  if (tipo === 'seg1') {
    return resultado.parcela_atualizada_com_seguro || 0;
  }
  return resultado.parcela_atualizada_sem_seguro || 0;
}

/**
 * Obtém o número de parcelas abatidas baseado no tipo de seguro
 */
function getParcelasAbatidas(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  if (tipo === 'seg1') {
    return resultado.n_parcelas_abatidas_com_seguro || 0;
  }
  return resultado.n_parcelas_abatidas_sem_seguro || 0;
}

/**
 * Obtém o número de parcelas abatidas formatado (mostra "-" se for zero)
 */
function getParcelasAbatidasFormatted(tipo: string, resultado: any): string {
  const value = getParcelasAbatidas(tipo, resultado);
  return formatNumberOrDash(value);
}

/**
 * Obtém o prazo atualizado baseado no tipo de seguro
 */
function getPrazoAtualizado(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  return resultado.prazo_atualizado || 0;
}

/**
 * Obtém o prazo atualizado com abatimento baseado no tipo de seguro
 */
function getPrazoAtualizadoAbatimento(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  if (tipo === 'seg1') {
    return resultado.prazo_atualizado_com_abatimento_com_seguro || 0;
  }
  return resultado.prazo_atualizado_com_abatimento_sem_seguro || 0;
}

/**
 * Obtém o ano atual
 */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

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
 * Processa condicionais {{#if}} {{/if}}
 */
function processConditionals(template: string, data: any): string {
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
function processLoops(template: string, data: any): string {
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
  
  // isPlanoReduzido(bem.descricao plano.descricao)
  if (condition.includes('isPlanoReduzido')) {
    const match = condition.match(/isPlanoReduzido\s*\(\s*([^)]+)\s+([^)]+)\s*\)/);
    if (match) {
      const [, bemPath, planoPath] = match;
      const bemDescricao = getNestedValue(data, bemPath.trim());
      const planoDescricao = getNestedValue(data, planoPath.trim());
      const result = isPlanoReduzido(bemDescricao, planoDescricao);
      return result;
    }
  }
  
  // isPlanoAlpha(bem.descricao plano.descricao)
  if (condition.includes('isPlanoAlpha')) {
    const match = condition.match(/isPlanoAlpha\s*\(\s*([^)]+)\s+([^)]+)\s*\)/);
    if (match) {
      const [, bemPath, planoPath] = match;
      const bemDescricao = getNestedValue(data, bemPath.trim());
      const planoDescricao = getNestedValue(data, planoPath.trim());
      const result = isPlanoAlpha(bemDescricao, planoDescricao);
      return result;
    }
  }
  
  return false;
}

/**
 * Substitui variáveis no template
 */
function replaceVariables(template: string, data: any): string {
  let result = template;

  // Substitui funções helpers
  result = result.replace(/\{\{formatCurrency\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatCurrency(Number(value) || 0);
  });

  result = result.replace(/\{\{formatPercent\s+([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return formatPercentage(Number(value) || 0);
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
 * Gera HTML para uma simulação
 */
export function generateHtmlForSimulacao(simulacao: SimulacaoQuery): string {
  try {
    const templatePath = path.join(__dirname, '../templates/proposta.html');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // Converte array de resultados para objeto único
    const simulacaoWithResult = {
      ...simulacao,
      resultado: simulacao.resultado?.[0] || {}
    };
    
    // Extrai dados comuns para o contexto global
    const globalData = {
      cliente: simulacaoWithResult.cliente,
      vendedor: simulacaoWithResult.vendedor,
      vencimento_proposta: simulacaoWithResult.vencimento_proposta,
      simulacoes: [simulacaoWithResult]
    };
    
    // Processa o template
    template = processLoops(template, globalData);
    template = processConditionals(template, globalData);
    template = replaceVariables(template, globalData);
    
    return template;
  } catch (error) {
    throw error;
  }
}

/**
 * Gera HTML para múltiplas simulações
 */
export function generateHtmlForMultipleSimulacoes(simulacoes: SimulacaoQuery[]): string {
  try {
    const templatePath = path.join(__dirname, '../templates/proposta.html');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // Forçar conversão de bem e plano para objeto, caso venham como string
    const simulacoesWithResults = simulacoes.map(sim => ({
      ...sim,
      bem: typeof sim.bem === 'string' ? { descricao: sim.bem } : sim.bem,
      plano: typeof sim.plano === 'string' ? { descricao: sim.plano } : sim.plano,
      resultado: sim.resultado?.[0] || {}
    }));

    // DEBUG: Verificar estrutura dos dados enviados ao template
    console.log('DEBUG simulacoesWithResults:', JSON.stringify(simulacoesWithResults, null, 2));
    
    // Extrai dados comuns da primeira simulação para o contexto global
    const firstSimulacao = simulacoesWithResults[0];
    const globalData = {
      cliente: firstSimulacao.cliente,
      vendedor: firstSimulacao.vendedor,
      vencimento_proposta: firstSimulacao.vencimento_proposta,
      simulacoes: simulacoesWithResults
    };
    
    // Processa o template
    template = processLoops(template, globalData);
    template = processConditionals(template, globalData);
    template = replaceVariables(template, globalData);
    
    return template;
  } catch (error) {
    throw error;
  }
} 