const http = require('http');

// Testar apenas o ID 224
const testId = '224';

const testConfig = {
  host: 'localhost',
  port: 3001,
  path: `/api/pdf?ids=${testId}&tipos=seg0`,
  method: 'GET'
};

console.log(`\n🧪 Testando ID: ${testId}`);
console.log(`📡 URL: http://${testConfig.host}:${testConfig.port}${testConfig.path}`);

const req = http.request(testConfig, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Sucesso! HTML gerado:');
      
      // Verificar se o valor de antecipação está presente
      if (data.includes('Valor Antecipação Parcelas 1 à 5:')) {
        console.log('✅ Valor Antecipação encontrado no HTML!');
      } else {
        console.log('❌ Valor Antecipação NÃO encontrado no HTML');
      }
      
      // Verificar se é plano Alpha
      if (data.includes('Alpha')) {
        console.log('✅ Plano Alpha detectado no HTML');
      } else {
        console.log('❌ Plano Alpha NÃO detectado no HTML');
      }
      
      // Verificar se é bem Imóvel
      if (data.includes('Imóvel')) {
        console.log('✅ Bem Imóvel detectado no HTML');
      } else {
        console.log('❌ Bem Imóvel NÃO detectado no HTML');
      }
      
      console.log('📄 Primeiros 1000 caracteres do HTML:');
      console.log(data.substring(0, 1000) + '...');
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