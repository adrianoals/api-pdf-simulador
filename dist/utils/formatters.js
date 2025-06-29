"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatPercent = formatPercent;
exports.formatPercentRaw = formatPercentRaw;
exports.formatDate = formatDate;
exports.formatTelefone = formatTelefone;
exports.formatClientNameForURL = formatClientNameForURL;
exports.generatePDFFileName = generatePDFFileName;
/**
 * Formata valor para moeda brasileira
 */
function formatCurrency(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}
/**
 * Formata percentual com símbolo %
 */
function formatPercent(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(value / 100);
}
/**
 * Formata percentual sem símbolo %
 */
function formatPercentRaw(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(value) + '%';
}
/**
 * Formata data para formato brasileiro
 */
function formatDate(date) {
    if (!date)
        return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
        return '-';
    }
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(dateObj);
}
/**
 * Formata telefone brasileiro
 */
function formatTelefone(telefone) {
    if (!telefone)
        return '-';
    // Remove tudo que não é número
    const numbers = telefone.replace(/\D/g, '');
    if (numbers.length === 11) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    else if (numbers.length === 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return telefone;
}
/**
 * Formata nome do cliente para URL
 */
function formatClientNameForURL(name) {
    if (!name)
        return '';
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .trim();
}
/**
 * Gera nome do arquivo PDF
 */
function generatePDFFileName(clientName, timestamp = new Date()) {
    const date = timestamp.toISOString().split('T')[0];
    const time = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
    const formattedName = formatClientNameForURL(clientName);
    return `proposta-${formattedName}-${date}-${time}.pdf`;
}
//# sourceMappingURL=formatters.js.map