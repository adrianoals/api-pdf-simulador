const http = require('http');

// Dados de teste simulados - testar com seguro
const testData = {
  ids: '143',
  tipos: 'seg1' // Mudando para seg1 para testar campos de seguro
};

// Configuração do teste
const testConfig = {
  host: 'localhost',
  port: 3001,
  path: `/api/pdf?ids=${testData.ids}&tipos=${testData.tipos}`,
  method: 'GET'
};

console.log('🧪 Testando API de PDF com seguro (seg1)...');
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
      
      // Verificar se há variáveis não substituídas
      const unprocessedVars = data.match(/\{\{[^}]+\}\}/g);
      if (unprocessedVars) {
        console.log('❌ Variáveis não processadas encontradas:');
        unprocessedVars.forEach((var_, index) => {
          console.log(`   ${index + 1}. ${var_}`);
        });
      } else {
        console.log('✅ Todas as variáveis foram processadas corretamente!');
      }
      
      // Verificar campos específicos
      const checks = [
        { name: 'Prazo Restante', pattern: /Prazo Restante.*?(\d+)\s+meses/ },
        { name: 'Nova Parcela', pattern: /Nova Parcela.*?R\$/ },
        { name: 'Valor do Crédito', pattern: /Valor do Crédito.*?R\$/ },
        { name: 'Tipo de Proposta', pattern: /Tipo de Proposta.*?(Com|Sem)\s+Seguro/ },
        { name: 'Seguro Mensal', pattern: /Seguro Mensal.*?R\$/ },
        { name: 'Seguro Total', pattern: /Seguro Total.*?R\$/ }
      ];
      
      console.log('\n🔍 Verificando campos específicos:');
      checks.forEach(check => {
        const match = data.match(check.pattern);
        if (match) {
          console.log(`✅ ${check.name}: ${match[0].substring(0, 50)}...`);
        } else {
          console.log(`❌ ${check.name}: Não encontrado`);
        }
      });
      
      console.log('\n📄 Primeiros 1000 caracteres do HTML:');
      console.log(data.substring(0, 1000) + '...');
      
    } else {
      console.log('❌ Erro na resposta:');
      console.log(data);
      
      // Se for erro de expiração, sugerir outros IDs
      if (data.includes('expiraram')) {
        console.log('\n💡 Sugestão: Tente com outros IDs de simulação que não tenham expirado.');
        console.log('   Exemplo: node debug-template.js 143 seg1');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
});

req.end(); 