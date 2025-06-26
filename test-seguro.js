const http = require('http');

// Testar com seguro
const testConfig = {
  host: 'localhost',
  port: 3001,
  path: '/api/pdf?ids=143&tipos=seg1',
  method: 'GET'
};

console.log('🧪 Testando campos de seguro...');

const req = http.request(testConfig, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ HTML gerado com sucesso!');
      
      // Verificar se os campos de seguro estão no HTML
      const seguroMensal = data.includes('Seguro Mensal');
      const seguroTotal = data.includes('Seguro Total');
      const tipoProposta = data.includes('Com Seguro');
      
      console.log(`🔍 Seguro Mensal encontrado: ${seguroMensal ? '✅' : '❌'}`);
      console.log(`🔍 Seguro Total encontrado: ${seguroTotal ? '✅' : '❌'}`);
      console.log(`🔍 Tipo "Com Seguro" encontrado: ${tipoProposta ? '✅' : '❌'}`);
      
      // Procurar pela seção de Taxas e Custos
      const taxasIndex = data.indexOf('Taxas e Custos');
      if (taxasIndex !== -1) {
        const taxasSection = data.substring(taxasIndex, taxasIndex + 2000);
        console.log('\n📄 Seção Taxas e Custos:');
        console.log(taxasSection);
      }
      
      // Verificar se há condicionais não processadas
      const unprocessedConditionals = data.match(/\{\{#if[^}]*\}\}/g);
      if (unprocessedConditionals) {
        console.log('\n❌ Condicionais não processadas:');
        unprocessedConditionals.forEach(cond => console.log(`   ${cond}`));
      }
      
    } else {
      console.log('❌ Erro:', res.statusCode);
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
});

req.end(); 