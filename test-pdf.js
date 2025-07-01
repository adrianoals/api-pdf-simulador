const axios = require('axios');

async function testPDFGeneration() {
  try {
    console.log('🧪 Testando geração de PDF...\n');

    // Teste 1: Gerar HTML
    console.log('1️⃣ Testando geração de HTML...');
    const htmlResponse = await axios.get('http://localhost:3001/api/pdf?ids=1&tipos=seg0');
    console.log('✅ HTML gerado com sucesso!');
    console.log(`📄 Tamanho do HTML: ${htmlResponse.data.length} caracteres\n`);

    // Teste 2: Gerar PDF
    console.log('2️⃣ Testando geração de PDF...');
    const pdfResponse = await axios.get('http://localhost:3001/api/pdf?ids=1&tipos=seg0&format=pdf', {
      responseType: 'arraybuffer'
    });
    console.log('✅ PDF gerado com sucesso!');
    console.log(`📄 Tamanho do PDF: ${pdfResponse.data.length} bytes\n`);

    // Teste 3: Health check
    console.log('3️⃣ Testando health check...');
    const healthResponse = await axios.get('http://localhost:3001/api/pdf/health');
    console.log('✅ Health check OK!');
    console.log('📊 Status do serviço:', healthResponse.data);

    console.log('\n🎉 Todos os testes passaram!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Dados:', error.response.data);
    }
  }
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    await axios.get('http://localhost:3001/health');
    console.log('✅ Servidor está rodando!');
    return true;
  } catch (error) {
    console.error('❌ Servidor não está rodando. Execute: npm run dev');
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando testes de PDF...\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    return;
  }
  
  await testPDFGeneration();
}

main(); 