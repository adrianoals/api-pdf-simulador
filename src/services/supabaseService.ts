import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { SimulacaoQuery } from '../types';

dotenv.config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para as queries do Supabase (com arrays)
interface SimulacaoRaw {
  id: string;
  valor_credito: number;
  lance_recurso_proprio: number;
  lance_terceiro: number;
  lance_embutido: number;
  mes_contemplacao: number;
  vencimento_proposta?: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
  }[];
  vendedor: {
    nome: string;
    email: string;
    telefone: string;
  }[];
  bem: {
    descricao: string;
    fundo_reserva: number;
  }[];
  plano: {
    descricao: string;
  }[];
  taxa: {
    taxa_administracao: number;
    taxa_antecipacao: number;
    prazo: number;
  }[];
  resultado: {
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
  }[];
}

/**
 * Converte dados do Supabase para o formato da aplicação
 */
function convertSupabaseData(rawData: any): SimulacaoQuery {
  return {
    id: rawData.id,
    valor_credito: rawData.valor_credito,
    lance_recurso_proprio: rawData.lance_recurso_proprio,
    lance_terceiro: rawData.lance_terceiro,
    lance_embutido: rawData.lance_embutido,
    mes_contemplacao: rawData.mes_contemplacao,
    vencimento_proposta: rawData.vencimento_proposta,
    cliente: rawData.cliente?.[0] || { nome: '', email: '', telefone: '' },
    vendedor: rawData.vendedor?.[0] || { nome: '', email: '', telefone: '' },
    bem: rawData.bem?.[0] || { descricao: '', fundo_reserva: 0 },
    plano: rawData.plano?.[0] || { descricao: '' },
    taxa: rawData.taxa?.[0] || { taxa_administracao: 0, taxa_antecipacao: 0, prazo: 0 },
    resultado: rawData.resultado || []
  };
}

/**
 * Converte dados da função obter_detalhes_simulacao para o formato da aplicação
 */
function convertFunctionData(functionData: any): SimulacaoQuery {
  const simulacao = functionData.simulacao;
  const cliente = functionData.cliente;
  const vendedor = functionData.vendedor;
  const taxas = functionData.taxas;
  const resultados = functionData.resultados || [];

  return {
    id: simulacao.id?.toString() || '',
    valor_credito: simulacao.valor_credito || 0,
    lance_recurso_proprio: simulacao.lance_recurso_proprio || 0,
    lance_terceiro: simulacao.lance_terceiro || 0,
    lance_embutido: simulacao.lance_embutido || 0,
    mes_contemplacao: simulacao.mes_contemplacao || 0,
    vencimento_proposta: simulacao.vencimento_proposta,
    cliente: {
      nome: cliente.nome || '',
      email: cliente.email || '',
      telefone: cliente.telefone || ''
    },
    vendedor: {
      nome: vendedor.nome || '',
      email: vendedor.email || '',
      telefone: vendedor.telefone || ''
    },
    bem: { descricao: functionData.bem || '' , fundo_reserva: taxas.fundo_reserva || 0 },
    plano: { descricao: functionData.plano || '' },
    taxa: {
      taxa_administracao: taxas.administracao || 0,
      taxa_antecipacao: taxas.antecipacao || 0,
      prazo: simulacao.prazo || 0
    },
    resultado: resultados
  };
}

/**
 * Busca simulações usando a função personalizada obter_detalhes_simulacao
 */
async function fetchSimulacoesWithFunction(ids: string[]): Promise<SimulacaoQuery[]> {
  try {
    console.log('🔍 Usando função obter_detalhes_simulacao...');
    
    const simulacoes: SimulacaoQuery[] = [];
    
    // A função recebe um ID por vez, então vamos chamar para cada ID
    for (const id of ids) {
      const { data, error } = await supabase
        .rpc('obter_detalhes_simulacao', { 
          p_simulacao_id: Number(id)
        });

      if (error) {
        console.error(`Erro ao chamar obter_detalhes_simulacao para ID ${id}:`, error);
        throw new Error(`Erro na função personalizada para ID ${id}: ${error.message}`);
      }

      if (!data) {
        console.error(`Nenhum dado retornado para ID ${id}`);
        throw new Error(`Simulação ${id} não encontrada`);
      }

      console.log(`✅ Dados retornados para ID ${id}:`, data);
      
      // Converter dados da função para o formato da aplicação
      const simulacao = convertFunctionData(data);
      simulacoes.push(simulacao);
    }

    return simulacoes;

  } catch (error) {
    console.error('Erro no fetchSimulacoesWithFunction:', error);
    throw error;
  }
}

/**
 * Busca simulações por IDs (método original)
 */
async function fetchSimulacoesWithQuery(ids: string[]): Promise<SimulacaoQuery[]> {
  try {
    // Converter IDs para números
    const numericIds = ids.map(id => Number(id)).filter(id => !isNaN(id));
    
    if (numericIds.length === 0) {
      throw new Error('IDs inválidos fornecidos');
    }

    const { data, error } = await supabase
      .from('simulacao')
      .select(`
        id,
        valor_credito,
        lance_recurso_proprio,
        lance_terceiro,
        lance_embutido,
        mes_contemplacao,
        vencimento_proposta,
        cliente:cliente_id (
          nome,
          email,
          telefone
        ),
        vendedor:vendedor_id (
          nome,
          email,
          telefone
        ),
        bem:bem_id (
          descricao,
          fundo_reserva
        ),
        plano:plano_id (
          descricao
        ),
        taxa:taxa_id (
          taxa_administracao,
          taxa_antecipacao,
          prazo
        ),
        resultado:resultado (
          tipo_plano,
          credito_entregue,
          total_lance,
          percentual_lance,
          parcela_com_seguro,
          primeira_parcela_antecipacao_com_seguro,
          parcela_sem_seguro,
          primeira_parcela_antecipacao_sem_seguro,
          prazo_atualizado,
          valor_abatido_parcela,
          parcela_atualizada_com_seguro,
          parcela_atualizada_sem_seguro,
          n_parcelas_abatidas_com_seguro,
          n_parcelas_abatidas_sem_seguro,
          prazo_atualizado_com_abatimento_com_seguro,
          prazo_atualizado_com_abatimento_sem_seguro,
          custo_efetivo_total,
          taxa_efetivo_mensal,
          valor_seguro_mensal,
          valor_seguro_total,
          valor_antecipacao,
          parcela_reduzida_com_seguro,
          parcela_reduzida_sem_seguro
        )
      `)
      .in('id', numericIds);

    if (error) {
      console.error('Erro ao buscar simulações:', error);
      throw new Error(`Erro ao buscar simulações: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Nenhuma simulação encontrada');
    }

    // Ordenar simulações na mesma ordem dos IDs fornecidos e converter dados
    const orderedSimulacoes = numericIds
      .map(id => data.find(s => Number(s.id) === id))
      .filter(Boolean)
      .map(rawData => convertSupabaseData(rawData));

    return orderedSimulacoes;
  } catch (error) {
    console.error('Erro no fetchSimulacoesWithQuery:', error);
    throw error;
  }
}

/**
 * Busca simulações por IDs (método principal)
 */
export async function fetchSimulacoes(ids: string[]): Promise<SimulacaoQuery[]> {
  try {
    // Primeiro tenta usar a função personalizada
    try {
      return await fetchSimulacoesWithFunction(ids);
    } catch (functionError) {
      console.log('⚠️ Função obter_detalhes_simulacao não disponível, usando query padrão...');
      return await fetchSimulacoesWithQuery(ids);
    }
  } catch (error) {
    console.error('Erro no fetchSimulacoes:', error);
    throw error;
  }
}

/**
 * Adiciona tipos às simulações baseado nos tipos fornecidos
 */
export function addTiposToSimulacoes(simulacoes: SimulacaoQuery[], tipos: string[]): SimulacaoQuery[] {
  return simulacoes.map((simulacao, index) => ({
    ...simulacao,
    tipo: tipos[index] || 'seg0'
  }));
}

/**
 * Valida se as simulações não expiraram
 */
export function validateSimulacoesExpiration(simulacoes: SimulacaoQuery[]): boolean {
  const hoje = new Date().toISOString().split('T')[0];
  
  return simulacoes.every(sim => {
    if (!sim.vencimento_proposta) return true;
    return hoje <= sim.vencimento_proposta;
  });
}

/**
 * Valida nome do cliente se fornecido
 */
export function validateClientName(simulacoes: SimulacaoQuery[], expectedName?: string): boolean {
  if (!expectedName) return true;
  
  const actualName = simulacoes[0]?.cliente?.nome;
  if (!actualName) return false;
  
  // Normalizar nomes para comparação
  const normalizeName = (name: string) => 
    name.toLowerCase().trim().replace(/\s+/g, ' ');
  
  return normalizeName(actualName) === normalizeName(expectedName);
} 