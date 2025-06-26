const http = require('http');

// Configuração do teste
const testConfig = {
  host: 'localhost',
  port: 3001,
  path: '/api/pdf?ids=1&tipos=seg0',
  method: 'GET'
};

console.log('🧪 Testando API de PDF...');
console.log(`📡 URL: http://${testConfig.host}:${testConfig.port}${testConfig.path}`);

const req = http.request(testConfig, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Sucesso! HTML gerado:');
      console.log('📄 Primeiros 500 caracteres do HTML:');
      console.log(data.substring(0, 500) + '...');
    } else {
      console.log('❌ Erro na resposta:');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
});

req.end(); 