import { SimulacaoQuery } from '../types';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
/**
 * Busca simulações por IDs (método principal)
 */
export declare function fetchSimulacoes(ids: string[]): Promise<SimulacaoQuery[]>;
/**
 * Adiciona tipos às simulações baseado nos tipos fornecidos
 */
export declare function addTiposToSimulacoes(simulacoes: SimulacaoQuery[], tipos: string[]): SimulacaoQuery[];
/**
 * Valida se as simulações não expiraram
 */
export declare function validateSimulacoesExpiration(simulacoes: SimulacaoQuery[]): boolean;
/**
 * Valida nome do cliente se fornecido
 */
export declare function validateClientName(simulacoes: SimulacaoQuery[], expectedName?: string): boolean;
//# sourceMappingURL=supabaseService.d.ts.map