import { PDFRequest, ValidationResult } from '../types';

/**
 * Valida se os IDs fornecidos são válidos
 */
export function validateIds(ids: string[]): string | null {
  if (!Array.isArray(ids) || ids.length === 0) {
    return 'IDs são obrigatórios';
  }

  if (ids.length > 10) {
    return 'Máximo de 10 simulações por requisição';
  }

  for (const id of ids) {
    if (!id || typeof id !== 'string') {
      return 'IDs devem ser strings válidas';
    }

    const numericId = Number(id);
    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
      return `ID inválido: ${id}`;
    }
  }

  return null;
}

/**
 * Valida nome do cliente
 */
export function validateClientName(name: string): string | null {
  if (!name || typeof name !== 'string') {
    return 'Nome do cliente é obrigatório';
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return 'Nome do cliente deve ter pelo menos 2 caracteres';
  }

  if (trimmedName.length > 100) {
    return 'Nome do cliente deve ter no máximo 100 caracteres';
  }

  // Validar se contém apenas letras, espaços e caracteres especiais comuns
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]+$/;
  if (!nameRegex.test(trimmedName)) {
    return 'Nome do cliente contém caracteres inválidos';
  }

  return null;
}

/**
 * Valida os parâmetros da requisição de PDF
 */
export function validatePDFRequest(request: PDFRequest): ValidationResult {
  const errors: string[] = [];

  // Validar IDs
  if (!request.ids || !Array.isArray(request.ids) || request.ids.length === 0) {
    errors.push('IDs são obrigatórios');
  } else {
    const idValidation = validateIds(request.ids);
    if (idValidation) {
      errors.push(idValidation);
    }
  }

  // Validar tipos
  if (!request.tipos || !Array.isArray(request.tipos)) {
    errors.push('Tipos são obrigatórios e devem ser um array');
  } else if (request.tipos.length === 0) {
    errors.push('Pelo menos um tipo deve ser fornecido');
  } else {
    // Validar se todos os tipos são válidos
    const validTypes = ['seg0', 'seg1'];
    const invalidTypes = request.tipos.filter(tipo => !validTypes.includes(tipo));
    
    if (invalidTypes.length > 0) {
      errors.push(`Tipos inválidos encontrados: ${invalidTypes.join(', ')}. Tipos válidos: ${validTypes.join(', ')}`);
    }
  }

  // Validar se arrays têm o mesmo tamanho
  if (request.ids && request.tipos && request.ids.length !== request.tipos.length) {
    errors.push('IDs e tipos devem ter o mesmo tamanho');
  }

  // Validar clientName (opcional)
  if (request.clientName) {
    const clientNameValidation = validateClientName(request.clientName);
    if (clientNameValidation) {
      errors.push(clientNameValidation);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitiza os dados da requisição
 */
export function sanitizePDFRequest(request: PDFRequest): PDFRequest {
  return {
    ids: request.ids?.map(id => id.toString().trim()).filter(Boolean) || [],
    tipos: request.tipos?.map(tipo => tipo.toString().trim().toLowerCase()).filter(Boolean) || [],
    clientName: request.clientName?.trim() || undefined
  };
}

/**
 * Valida se a requisição não excede limites
 */
export function validateRequestLimits(request: PDFRequest): ValidationResult {
  const errors: string[] = [];

  // Limite de simulações
  if (request.ids.length > 10) {
    errors.push('Máximo de 10 simulações por requisição');
  }

  // Limite de tipos
  if (request.tipos && request.tipos.length > 5) {
    errors.push('Máximo de 5 tipos por requisição');
  }

  // Limite de tamanho do nome do cliente
  if (request.clientName && request.clientName.length > 100) {
    errors.push('Nome do cliente muito longo');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Gera hash para cache baseado nos parâmetros
 */
export function generateCacheKey(request: PDFRequest): string {
  const { ids, tipos, clientName } = request;
  const data = JSON.stringify({ ids, tipos, clientName });
  
  // Hash simples baseado no conteúdo
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `pdf_${Math.abs(hash).toString(36)}`;
} 