import { Router } from 'express';
import { fetchSimulacoes, validateSimulacoesExpiration, validateClientName, addTiposToSimulacoes } from '../services/supabaseService';
import { generateHtmlForMultipleSimulacoes } from '../services/templateService';
import { validateIds, validateClientName as validateClientNameParam } from '../utils/validators';

const router = Router();

/**
 * GET /api/pdf
 * Gera PDF de propostas de consórcio
 */
router.get('/', async (req: any, res: any) => {
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
    const validationError = validateIds(idsArray);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    let tiposArray: string[] = [];
    if (tipos) {
      tiposArray = String(tipos).split(/[-,]/).map(t => t.trim()).filter(Boolean);
      if (tiposArray.length !== idsArray.length) {
        return res.status(400).json({
          error: 'O número de tipos deve ser igual ao número de ids',
          example: '/api/pdf?ids=1-2-3&tipos=seg0-seg1-seg0'
        });
      }
    } else {
      tiposArray = Array(idsArray.length).fill('seg0');
    }

    if (clientName) {
      const clientNameError = validateClientNameParam(String(clientName));
      if (clientNameError) {
        return res.status(400).json({ error: clientNameError });
      }
    }

    console.log(`🔍 Buscando simulações: ${idsArray.join(', ')}`);
    
    const simulacoes = await fetchSimulacoes(idsArray);
    console.log(`✅ ${simulacoes.length} simulação(ões) encontrada(s)`);

    if (!validateSimulacoesExpiration(simulacoes)) {
      return res.status(400).json({
        error: 'Uma ou mais simulações expiraram',
        expiredSimulations: simulacoes
          .filter(sim => sim.vencimento_proposta && new Date().toISOString().split('T')[0] > sim.vencimento_proposta)
          .map(sim => sim.id)
      });
    }

    if (clientName && !validateClientName(simulacoes, String(clientName))) {
      console.log(`⚠️ Nome do cliente não confere, mas continuando...`);
    }

    // Adicionar tipos às simulações
    const simulacoesComTipo = addTiposToSimulacoes(simulacoes, tiposArray);

    console.log('🎨 Gerando HTML...');
    
    const html = generateHtmlForMultipleSimulacoes(simulacoesComTipo);
    
    console.log('✅ HTML gerado com sucesso!');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);

  } catch (error) {
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
router.get('/health', (req: any, res: any) => {
  res.json({
    success: true,
    message: 'PDF service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router; 