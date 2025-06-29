"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pdf_1 = __importDefault(require("./routes/pdf"));
const path_1 = __importDefault(require("path"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Logs de requisição
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Rotas
app.use('/api/pdf', pdf_1.default);
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
// Rota de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Unifisa PDF API'
    });
});
// Rota de erro 404 (deve ser a última rota)
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl
    });
});
// Middleware de erro global
app.use((error, req, res, next) => {
    console.error('Erro na aplicação:', error);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 API PDF rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📄 PDF endpoint: http://localhost:${PORT}/api/pdf/proposta`);
});
//# sourceMappingURL=index.js.map