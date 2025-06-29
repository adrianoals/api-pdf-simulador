import { PDFRequest, ValidationResult } from '../types';
/**
 * Valida se os IDs fornecidos são válidos
 */
export declare function validateIds(ids: string[]): string | null;
/**
 * Valida nome do cliente
 */
export declare function validateClientName(name: string): string | null;
/**
 * Valida os parâmetros da requisição de PDF
 */
export declare function validatePDFRequest(request: PDFRequest): ValidationResult;
/**
 * Sanitiza os dados da requisição
 */
export declare function sanitizePDFRequest(request: PDFRequest): PDFRequest;
/**
 * Valida se a requisição não excede limites
 */
export declare function validateRequestLimits(request: PDFRequest): ValidationResult;
/**
 * Gera hash para cache baseado nos parâmetros
 */
export declare function generateCacheKey(request: PDFRequest): string;
//# sourceMappingURL=validators.d.ts.map