/**
 * Funções de negócio específicas para simulações de crédito/seguro
 */

/**
 * Obtém o valor da parcela baseado no tipo de seguro
 */
export function getParcela(tipo: string, resultado: any): number {
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
export function getParcelaReduzida(tipo: string, resultado: any): number {
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
export function getPrimeiraParcela(tipo: string, resultado: any): number {
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
export function getParcelaAtualizada(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  if (tipo === 'seg1') {
    return resultado.parcela_atualizada_com_seguro || 0;
  }
  return resultado.parcela_atualizada_sem_seguro || 0;
}

/**
 * Obtém o número de parcelas abatidas baseado no tipo de seguro
 */
export function getParcelasAbatidas(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  if (tipo === 'seg1') {
    return resultado.n_parcelas_abatidas_com_seguro || 0;
  }
  return resultado.n_parcelas_abatidas_sem_seguro || 0;
}

/**
 * Obtém o prazo atualizado baseado no tipo de seguro
 */
export function getPrazoAtualizado(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  return resultado.prazo_atualizado || 0;
}

/**
 * Obtém o prazo atualizado com abatimento baseado no tipo de seguro
 */
export function getPrazoAtualizadoAbatimento(tipo: string, resultado: any): number {
  if (!resultado) return 0;
  if (tipo === 'seg1') {
    return resultado.prazo_atualizado_com_abatimento_com_seguro || 0;
  }
  return resultado.prazo_atualizado_com_abatimento_sem_seguro || 0;
}

/**
 * Obtém o ano atual
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Adiciona números
 */
export function add(a: number, b: number): number {
  return (a || 0) + (b || 0);
}

/**
 * Verifica igualdade
 */
export function eq(a: any, b: any): boolean {
  return a === b;
} 