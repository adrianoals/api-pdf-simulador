const http = require('http');

// Testar IDs que devem ter planos reduzidos (25, 30, 50)
const testIds = ['224', '225', '226']; // Ajuste para IDs que tenham planos reduzidos

console.log('\n🧪 Testando Planos Reduzidos...');

testIds.forEach((testId, index) => {
  const testConfig = {
    host: 'localhost',
    port: 3001,
    path: `/api/pdf?ids=${testId}&tipos=seg0`,
    method: 'GET'
  };

  console.log(`\n📡 Testando ID: ${testId}`);
  console.log(`🔗 URL: http://${testConfig.host}:${testConfig.port}${testConfig.path}`);

  const req = http.request(testConfig, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Sucesso! HTML gerado:');
        
        // Verificar se o campo parcela reduzida está presente
        if (data.includes('Parcela Reduzida:')) {
          console.log('✅ Parcela Reduzida encontrada no HTML!');
        } else {
          console.log('❌ Parcela Reduzida NÃO encontrada no HTML');
        }
        
        // Verificar se é plano reduzido (25, 30, 50)
        if (data.includes('25%') || data.includes('30%') || data.includes('50%')) {
          console.log('✅ Plano Reduzido detectado no HTML');
        } else {
          console.log('❌ Plano Reduzido NÃO detectado no HTML');
        }
        
        // Verificar tipo de bem
        if (data.includes('Imóvel') || data.includes('Automóvel') || data.includes('Máquinário') || data.includes('Embarcação')) {
          console.log('✅ Tipo de Bem detectado no HTML');
        } else {
          console.log('❌ Tipo de Bem NÃO detectado no HTML');
        }
        
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
}); 