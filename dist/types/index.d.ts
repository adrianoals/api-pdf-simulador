export interface PDFRequest {
    ids: string[];
    tipos: string[];
    clientName?: string;
}
export interface PDFResponse {
    success: boolean;
    data?: Buffer;
    error?: string;
    message?: string;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export interface SimulacaoQuery {
    id: string;
    valor_credito: number;
    lance_recurso_proprio: number;
    lance_terceiro: number;
    lance_embutido: number;
    mes_contemplacao: number;
    vencimento_proposta?: string;
    tipo?: string;
    cliente: {
        nome: string;
        email: string;
        telefone: string;
    };
    vendedor: {
        nome: string;
        email: string;
        telefone: string;
    };
    bem: {
        descricao: string;
        fundo_reserva: number;
    };
    plano: {
        descricao: string;
    };
    taxa: {
        taxa_administracao: number;
        taxa_antecipacao: number;
        prazo: number;
    };
    resultado: Array<{
        tipo_plano: string;
        credito_entregue: number;
        total_lance: number;
        percentual_lance: number;
        parcela_com_seguro: number;
        primeira_parcela_antecipacao_com_seguro: number;
        parcela_sem_seguro: number;
        primeira_parcela_antecipacao_sem_seguro: number;
        prazo_atualizado: number;
        valor_abatido_parcela: number;
        parcela_atualizada_com_seguro: number;
        parcela_atualizada_sem_seguro: number;
        n_parcelas_abatidas_com_seguro: number;
        n_parcelas_abatidas_sem_seguro: number;
        prazo_atualizado_com_abatimento_com_seguro: number;
        prazo_atualizado_com_abatimento_sem_seguro: number;
        custo_efetivo_total: number;
        taxa_efetivo_mensal: number;
        valor_seguro_mensal: number;
        valor_seguro_total: number;
        valor_antecipacao: number;
        parcela_reduzida_com_seguro: number;
        parcela_reduzida_sem_seguro: number;
    }>;
}
export interface PropostaLogic {
    comSeguro: boolean;
    isPlanoReduzido: boolean;
    isPlanoAlpha: boolean;
    parcela: number;
    parcelaReduzida: number;
    primeiraParcelaAntecipacao: number;
    parcelaAtualizada: number;
    parcelasAbatidas: number;
    prazoAtualizadoAbatimento: number;
}
export interface FormattedValues {
    valorCredito: string;
    parcela: string;
    parcelaReduzida: string;
    primeiraParcela: string;
    totalLance: string;
    creditoEntregue: string;
    custoEfetivo: string;
    taxaAdm: string;
    taxaAntecipacao: string;
    fundoReserva: string;
    taxaEfetiva: string;
    seguroMensal: string;
    seguroTotal: string;
    percentualLance: string;
    valorAbatido: string;
    novaParcela: string;
    valorAntecipacao: string;
}
export interface PDFConfig {
    format: 'A4' | 'Letter';
    margin: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    printBackground: boolean;
    timeout: number;
}
export interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    data?: any;
}
export interface CacheEntry {
    key: string;
    data: Buffer;
    timestamp: number;
    ttl: number;
}
export interface PDFMetrics {
    generationTime: number;
    fileSize: number;
    simulacoesCount: number;
    timestamp: string;
}
//# sourceMappingURL=index.d.ts.map