/**
 * Funções de negócio específicas para simulações de crédito/seguro
 */
/**
 * Verifica se é plano reduzido
 */
export declare function isPlanoReduzido(bemDescricao: string, planoDescricao: string): boolean;
/**
 * Obtém o valor da parcela baseado no tipo de seguro
 */
export declare function getParcela(tipo: string, resultado: any): number;
/**
 * Obtém o valor da parcela reduzida baseado no tipo de seguro
 */
export declare function getParcelaReduzida(tipo: string, resultado: any): number;
/**
 * Obtém o valor da primeira parcela baseado no tipo de seguro
 */
export declare function getPrimeiraParcela(tipo: string, resultado: any): number;
/**
 * Obtém o valor da parcela atualizada baseado no tipo de seguro
 */
export declare function getParcelaAtualizada(tipo: string, resultado: any): number;
/**
 * Obtém o número de parcelas abatidas baseado no tipo de seguro
 */
export declare function getParcelasAbatidas(tipo: string, resultado: any): number;
/**
 * Obtém o prazo atualizado baseado no tipo de seguro
 */
export declare function getPrazoAtualizado(tipo: string, resultado: any): number;
/**
 * Obtém o prazo atualizado com abatimento baseado no tipo de seguro
 */
export declare function getPrazoAtualizadoAbatimento(tipo: string, resultado: any): number;
/**
 * Obtém o ano atual
 */
export declare function getCurrentYear(): number;
/**
 * Adiciona números
 */
export declare function add(a: number, b: number): number;
/**
 * Verifica igualdade
 */
export declare function eq(a: any, b: any): boolean;
//# sourceMappingURL=businessLogic.d.ts.map