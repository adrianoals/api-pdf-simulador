import { Router } from 'express';
import { fetchSimulacoes, validateSimulacoesExpiration, validateClientName, addTiposToSimulacoes } from '../services/supabaseService';
import { generateHtmlForMultipleSimulacoes } from '../services/templateService';
import { pdfService } from '../services/pdfService';
import { validateIds, validateClientName as validateClientNameParam } from '../utils/validators';

const router = Router();

/**
 * GET /api/pdf
 * Gera PDF de propostas de consórcio
 */
router.get('/', async (req: any, res: any) => {
  try {
    console.log('📄 Iniciando geração de PDF...');
    
    const { ids, tipos, clientName, format = 'html' } = req.query;
    
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

    // Retornar HTML ou PDF baseado no parâmetro format
    if (format === 'pdf') {
      console.log('📄 Gerando PDF...');
      
      try {
        const pdfBuffer = await pdfService.generatePropostaPDF(simulacoesComTipo, html);
        
        console.log('✅ PDF gerado com sucesso!');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="proposta-${idsArray.join('-')}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.send(pdfBuffer);
      } catch (pdfError) {
        console.error('❌ Erro na geração do PDF:', pdfError);
        
        // Fallback para HTML em caso de erro no PDF
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      }
    } else {
      // Retorna HTML por padrão
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    }

  } catch (error) {
    console.error('❌ Erro na geração de PDF:', error);
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * POST /api/pdf/download
 * Gera e faz download do PDF de propostas de consórcio
 * Body: { ids: string, tipos: string }
 */
router.post('/download', async (req: any, res: any) => {
  try {
    const { ids, tipos } = req.body;
    if (!ids) {
      return res.status(400).json({ error: 'Parâmetro "ids" é obrigatório' });
    }
    const idsArray = String(ids).split(/[-,]/).map((id: string) => id.trim()).filter(Boolean);
    let tiposArray: string[] = [];
    if (tipos) {
      tiposArray = String(tipos).split(/[-,]/).map((t: string) => t.trim()).filter(Boolean);
      if (tiposArray.length !== idsArray.length) {
        return res.status(400).json({ error: 'O número de tipos deve ser igual ao número de ids' });
      }
    } else {
      tiposArray = Array(idsArray.length).fill('seg0');
    }
    const simulacoes = await fetchSimulacoes(idsArray);
    const simulacoesComTipo = addTiposToSimulacoes(simulacoes, tiposArray);
    const html = generateHtmlForMultipleSimulacoes(simulacoesComTipo);
    const pdfBuffer = await pdfService.generatePropostaPDF(simulacoesComTipo, html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="proposta-${idsArray.join('-')}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ Erro na geração do PDF (download):', error);
    res.status(500).json({ error: 'Erro interno do servidor', message: error instanceof Error ? error.message : 'Erro desconhecido' });
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
    timestamp: new Date().toISOString(),
    pdfService: {
      active: pdfService.isActive(),
      status: pdfService.isActive() ? 'ready' : 'not_initialized'
    }
  });
});

export default router; 