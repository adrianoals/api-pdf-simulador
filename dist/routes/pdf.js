"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseService_1 = require("../services/supabaseService");
const templateService_1 = require("../services/templateService");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
/**
 * GET /api/pdf
 * Gera PDF de propostas de consórcio
 */
router.get('/', async (req, res) => {
    try {
        console.log('📄 Iniciando geração de PDF...');
        const { ids, tipos, clientName } = req.query;
        if (!ids) {
            return res.status(400).json({
                error: 'Parâmetro "ids" é obrigatório',
                example: '/api/pdf?ids=1-2-3&tipos=seg0-seg1-seg0'
            });
        }
        const idsArray = String(ids).split(/[-,]/).map(id => id.trim()).filter(Boolean);
        const validationError = (0, validators_1.validateIds)(idsArray);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        let tiposArray = [];
        if (tipos) {
            tiposArray = String(tipos).split(/[-,]/).map(t => t.trim()).filter(Boolean);
            if (tiposArray.length !== idsArray.length) {
                return res.status(400).json({
                    error: 'O número de tipos deve ser igual ao número de ids',
                    example: '/api/pdf?ids=1-2-3&tipos=seg0-seg1-seg0'
                });
            }
        }
        else {
            tiposArray = Array(idsArray.length).fill('seg0');
        }
        if (clientName) {
            const clientNameError = (0, validators_1.validateClientName)(String(clientName));
            if (clientNameError) {
                return res.status(400).json({ error: clientNameError });
            }
        }
        console.log(`🔍 Buscando simulações: ${idsArray.join(', ')}`);
        const simulacoes = await (0, supabaseService_1.fetchSimulacoes)(idsArray);
        console.log(`✅ ${simulacoes.length} simulação(ões) encontrada(s)`);
        if (!(0, supabaseService_1.validateSimulacoesExpiration)(simulacoes)) {
            return res.status(400).json({
                error: 'Uma ou mais simulações expiraram',
                expiredSimulations: simulacoes
                    .filter(sim => sim.vencimento_proposta && new Date().toISOString().split('T')[0] > sim.vencimento_proposta)
                    .map(sim => sim.id)
            });
        }
        if (clientName && !(0, supabaseService_1.validateClientName)(simulacoes, String(clientName))) {
            console.log(`⚠️ Nome do cliente não confere, mas continuando...`);
        }
        // Adicionar tipos às simulações
        const simulacoesComTipo = (0, supabaseService_1.addTiposToSimulacoes)(simulacoes, tiposArray);
        console.log('🎨 Gerando HTML...');
        const html = (0, templateService_1.generateHtmlForMultipleSimulacoes)(simulacoesComTipo);
        console.log('✅ HTML gerado com sucesso!');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    }
    catch (error) {
        console.error('❌ Erro na geração de PDF:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
});
/**
 * GET /api/pdf/health
 * Health check específico para o módulo PDF
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'PDF service is healthy',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=pdf.js.map