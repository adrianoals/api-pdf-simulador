/**
 * Formata valor para moeda brasileira
 */
export declare function formatCurrency(value: number | null | undefined): string;
/**
 * Formata percentual com símbolo %
 */
export declare function formatPercent(value: number | null | undefined): string;
/**
 * Formata percentual sem símbolo %
 */
export declare function formatPercentRaw(value: number | null | undefined): string;
/**
 * Formata data para formato brasileiro
 */
export declare function formatDate(date: string | Date): string;
/**
 * Formata telefone brasileiro
 */
export declare function formatTelefone(telefone: string | null | undefined): string;
/**
 * Formata nome do cliente para URL
 */
export declare function formatClientNameForURL(name: string): string;
/**
 * Gera nome do arquivo PDF
 */
export declare function generatePDFFileName(clientName: string, timestamp?: Date): string;
//# sourceMappingURL=formatters.d.ts.map