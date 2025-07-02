import puppeteer, { Browser } from 'puppeteer';
import { SimulacaoQuery } from '../types';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

export interface PDFOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  preferCSSPageSize?: boolean;
}

function injectCssIntoHtml(html: string): string {
  const cssPath = path.join(__dirname, '../../public/styles.css');
  let css = '';
  try {
    css = fs.readFileSync(cssPath, 'utf-8');
  } catch (e) {
    console.warn('⚠️ Não foi possível ler o CSS compilado:', e);
  }
  if (css) {
    // Remove qualquer <link rel="stylesheet" ...> existente
    html = html.replace(/<link[^>]*href=["'][^"']*styles\.css["'][^>]*>/g, '');
    // Injeta o CSS no <head>
    return html.replace('</head>', `<style>${css}</style></head>`);
  }
  return html;
}

export class PDFService {
  private browser: Browser | null = null;

  /**
   * Inicializa o browser do Puppeteer
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }
  }

  /**
   * Gera PDF a partir de HTML
   */
  async generatePDF(html: string, options: PDFOptions = {}): Promise<Buffer> {
    await this.initialize();

    if (!this.browser) {
      throw new Error('Browser não inicializado');
    }

    const page = await this.browser.newPage();

    try {
      // Injetar CSS compilado no HTML
      html = injectCssIntoHtml(html);

      // Configurar viewport para melhor renderização
      await page.setViewport({
        width: 950,
        height: 1345,
        deviceScaleFactor: 2
      });

      // Definir conteúdo HTML
      await page.setContent(html, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });

      // Aguardar um pouco para garantir que o CSS seja carregado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Gerar PDF
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        printBackground: options.printBackground !== false,
        preferCSSPageSize: true
      });

      return Buffer.from(pdfBuffer);

    } finally {
      await page.close();
    }
  }

  /**
   * Gera PDF de proposta de consórcio
   */
  async generatePropostaPDF(simulacoes: SimulacaoQuery[], html: string): Promise<Buffer> {
    // Geração antiga (todas as simulações em um HTML só)
    // return this.generatePDF(html, options);
    // Nova abordagem: gerar um PDF por simulação e unir
    const options: PDFOptions = {
      format: 'A4',
      margin: {
        top: '2.5cm',
        right: '0',
        bottom: '0',
        left: '0'
      },
      printBackground: true,
      preferCSSPageSize: false
    };
    // Separar o HTML para cada simulação
    const htmls: string[] = this.splitHtmlBySimulacao(html, simulacoes.length);
    const pdfBuffers: Buffer[] = [];
    for (let i = 0; i < simulacoes.length; i++) {
      pdfBuffers.push(await this.generatePDF(htmls[i], options));
    }
    // Unir todos os PDFs
    return await this.mergePDFs(pdfBuffers);
  }

  // Função para dividir o HTML em partes, uma para cada simulação
  splitHtmlBySimulacao(html: string, count: number): string[] {
    // Supondo que cada simulação está entre um comentário especial
    // <!--SIMULACAO_START--> ... <!--SIMULACAO_END-->
    const parts = html.split('<!--SIMULACAO_START-->').slice(1).map(part => part.split('<!--SIMULACAO_END-->')[0]);
    if (parts.length === count) {
      return parts.map(part => `<!DOCTYPE html><html lang=\"pt-BR\"><head>${html.split('<head>')[1].split('</head>')[0]}</head><body><div class=\"max-w-6xl mx-auto px-4\">${part}</div></body></html>`);
    }
    // fallback: retorna o HTML inteiro para cada simulação (não ideal)
    return Array(count).fill(html);
  }

  // Função para unir múltiplos PDFs em um só
  async mergePDFs(buffers: Buffer[]): Promise<Buffer> {
    const mergedPdf = await PDFDocument.create();
    for (const buffer of buffers) {
      const pdf = await PDFDocument.load(buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedPdfBytes = await mergedPdf.save();
    return Buffer.from(mergedPdfBytes);
  }

  /**
   * Fecha o browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Verifica se o browser está ativo
   */
  isActive(): boolean {
    return this.browser !== null;
  }
}

// Instância singleton
export const pdfService = new PDFService(); 