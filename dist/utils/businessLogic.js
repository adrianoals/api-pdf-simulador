"use strict";
/**
 * Funções de negócio específicas para simulações de crédito/seguro
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlanoReduzido = isPlanoReduzido;
exports.getParcela = getParcela;
exports.getParcelaReduzida = getParcelaReduzida;
exports.getPrimeiraParcela = getPrimeiraParcela;
exports.getParcelaAtualizada = getParcelaAtualizada;
exports.getParcelasAbatidas = getParcelasAbatidas;
exports.getPrazoAtualizado = getPrazoAtualizado;
exports.getPrazoAtualizadoAbatimento = getPrazoAtualizadoAbatimento;
exports.getCurrentYear = getCurrentYear;
exports.add = add;
exports.eq = eq;
/**
 * Verifica se é plano reduzido
 */
function isPlanoReduzido(bemDescricao, planoDescricao) {
    return ((bemDescricao === "Imóvel" && ["Sigma 25%", "Ômega 25%", "Gamma 25%", "Ômega 50%", "Delta 50%"].includes(planoDescricao)) ||
        (["Automóvel", "Máquinário", "Embarcação"].includes(bemDescricao) && ["Gamma 30%", "Betha 30%"].includes(planoDescricao)));
}
/**
 * Obtém o valor da parcela baseado no tipo de seguro
 */
function getParcela(tipo, resultado) {
    if (!resultado) {
        return 0;
    }
    let valor = 0;
    if (tipo === 'seg1') {
        valor = resultado.parcela_com_seguro || 0;
    }
    else {
        valor = resultado.parcela_sem_seguro || 0;
    }
    return valor;
}
/**
 * Obtém o valor da parcela reduzida baseado no tipo de seguro
 */
function getParcelaReduzida(tipo, resultado) {
    if (!resultado) {
        return 0;
    }
    let valor = 0;
    if (tipo === 'seg1') {
        valor = resultado.parcela_reduzida_com_seguro || 0;
    }
    else {
        valor = resultado.parcela_reduzida_sem_seguro || 0;
    }
    return valor;
}
/**
 * Obtém o valor da primeira parcela baseado no tipo de seguro
 */
function getPrimeiraParcela(tipo, resultado) {
    if (!resultado) {
        return 0;
    }
    let valor = 0;
    if (tipo === 'seg1') {
        valor = resultado.primeira_parcela_antecipacao_com_seguro || 0;
    }
    else {
        valor = resultado.primeira_parcela_antecipacao_sem_seguro || 0;
    }
    return valor;
}
/**
 * Obtém o valor da parcela atualizada baseado no tipo de seguro
 */
function getParcelaAtualizada(tipo, resultado) {
    if (!resultado)
        return 0;
    if (tipo === 'seg1') {
        return resultado.parcela_atualizada_com_seguro || 0;
    }
    return resultado.parcela_atualizada_sem_seguro || 0;
}
/**
 * Obtém o número de parcelas abatidas baseado no tipo de seguro
 */
function getParcelasAbatidas(tipo, resultado) {
    if (!resultado)
        return 0;
    if (tipo === 'seg1') {
        return resultado.n_parcelas_abatidas_com_seguro || 0;
    }
    return resultado.n_parcelas_abatidas_sem_seguro || 0;
}
/**
 * Obtém o prazo atualizado baseado no tipo de seguro
 */
function getPrazoAtualizado(tipo, resultado) {
    if (!resultado)
        return 0;
    return resultado.prazo_atualizado || 0;
}
/**
 * Obtém o prazo atualizado com abatimento baseado no tipo de seguro
 */
function getPrazoAtualizadoAbatimento(tipo, resultado) {
    if (!resultado)
        return 0;
    if (tipo === 'seg1') {
        return resultado.prazo_atualizado_com_abatimento_com_seguro || 0;
    }
    return resultado.prazo_atualizado_com_abatimento_sem_seguro || 0;
}
/**
 * Obtém o ano atual
 */
function getCurrentYear() {
    return new Date().getFullYear();
}
/**
 * Adiciona números
 */
function add(a, b) {
    return (a || 0) + (b || 0);
}
/**
 * Verifica igualdade
 */
function eq(a, b) {
    return a === b;
}
//# sourceMappingURL=businessLogic.js.map