import fs from 'fs';
import path from 'path';
import { SimulacaoQuery } from '../types';
import { processTemplate } from '../utils/templateEngine';

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
    
    // Processa o template usando o motor de template
    return processTemplate(template, globalData);
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
    
    // Processa o template usando o motor de template
    return processTemplate(template, globalData);
  } catch (error) {
    throw error;
  }
} 