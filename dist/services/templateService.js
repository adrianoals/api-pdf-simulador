"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlForSimulacao = generateHtmlForSimulacao;
exports.generateHtmlForMultipleSimulacoes = generateHtmlForMultipleSimulacoes;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const templateEngine_1 = require("../utils/templateEngine");
/**
 * Gera HTML para uma simulação
 */
function generateHtmlForSimulacao(simulacao) {
    try {
        const templatePath = path_1.default.join(__dirname, '../templates/proposta.html');
        let template = fs_1.default.readFileSync(templatePath, 'utf-8');
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
        return (0, templateEngine_1.processTemplate)(template, globalData);
    }
    catch (error) {
        throw error;
    }
}
/**
 * Gera HTML para múltiplas simulações
 */
function generateHtmlForMultipleSimulacoes(simulacoes) {
    try {
        const templatePath = path_1.default.join(__dirname, '../templates/proposta.html');
        let template = fs_1.default.readFileSync(templatePath, 'utf-8');
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
        return (0, templateEngine_1.processTemplate)(template, globalData);
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=templateService.js.map