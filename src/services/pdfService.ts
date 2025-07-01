import puppeteer, { Browser } from 'puppeteer';
import { SimulacaoQuery } from '../types';
import fs from 'fs';
import path from 'path';

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
        height: 1400,
        deviceScaleFactor: 2 // Melhor qualidade para PDF
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
        margin: options.margin || {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: options.printBackground !== false, // true por padrão
        preferCSSPageSize: options.preferCSSPageSize || false
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
    const options: PDFOptions = {
      format: 'A4',
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: false
    };

    return this.generatePDF(html, options);
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