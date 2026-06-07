import assert from 'assert';
import { calculateCLT, calculatePJ, calculateINSS, calculateIRPF, calculatePLR } from './src/lib/calculator.js';

console.log('🧪 Iniciando testes de regressão do motor de cálculo...');

try {
  // Teste 1: INSS CLT
  console.log('  - Testando INSS...');
  const inss1 = calculateINSS(2000); // 1621 * 0.075 + (2000 - 1621) * 0.09 = 121.575 + 34.11 = 155.685
  assert.ok(Math.abs(inss1 - 155.69) < 0.05);

  const inssTeto = calculateINSS(10000); // Teto do INSS
  assert.ok(Math.abs(inssTeto - 988.09) < 0.1); // teto progressivo de ~988.09 em 2026

  // Teste 2: PLR
  console.log('  - Testando cálculo de PLR...');
  const plrIsenta = calculatePLR(5000);
  assert.strictEqual(plrIsenta.irpf, 0);
  assert.strictEqual(plrIsenta.net, 5000);

  const plrTributada = calculatePLR(20000);
  assert.ok(plrTributada.irpf > 0);
  assert.ok(plrTributada.net < 20000);

  // Teste 3: IRPF com dependentes e pensão
  console.log('  - Testando IRPF com dependentes e pensão...');
  const irpfSemDep = calculateIRPF(8000, 0, 0);
  const irpfComDep = calculateIRPF(8000, 2, 0);
  const irpfComPensao = calculateIRPF(8000, 0, 1000);
  assert.ok(irpfComDep <= irpfSemDep, 'Dependentes deveriam reduzir ou manter o IRPF');
  assert.ok(irpfComPensao <= irpfSemDep, 'Pensão deveria reduzir ou manter o IRPF');

  // Teste 4: CLT completo
  console.log('  - Testando calculateCLT...');
  const clt = calculateCLT(8000, { vr: 600, planoSaude: 400 }, 1, 0, 15000);
  assert.ok(clt.gross === 8000);
  assert.ok(clt.plr > 0);
  assert.ok(clt.totalPackage > clt.net);

  // Teste 5: PJ Simples (Fator R e Anexos)
  console.log('  - Testando Fator R no Simples...');
  // Fator R baixo -> Anexo V (inicia em 15.5%)
  const pjAnexoV = calculatePJ(100, 160, 'simples', 0, 'minimo', 0, 3, 0, 0);
  // Fator R alto -> Anexo III (inicia em 6%)
  const pjAnexoIII = calculatePJ(100, 160, 'simples', 0, 'padrao', 0, 3, 0, 0);
  
  assert.ok(pjAnexoIII.net > pjAnexoV.net, 'Anexo III (Fator R >= 28%) deveria render mais líquido que o Anexo V');

  // Teste 6: Lucro Presumido auditável e ISS configurável
  console.log('  - Testando Lucro Presumido e ISS configurável...');
  const lp3 = calculatePJ(100, 160, 'presumido', 0, 'minimo', 0, 3, 0, 0);
  const lp5 = calculatePJ(100, 160, 'presumido', 0, 'minimo', 0, 5, 0, 0);
  
  assert.ok(lp3.lpISS < lp5.lpISS, 'ISS de 3% deveria ser menor que o ISS de 5%');
  assert.ok(lp3.net > lp5.net, 'Líquido com ISS 3% deveria ser maior que com ISS 5%');
  assert.strictEqual(lp3.dividendTax, 0, 'Dividendos devem ser isentos');

  console.log('✅ Todos os testes de regressão do motor passaram com sucesso!');
} catch (error) {
  console.error('❌ Erro nos testes de regressão:', error);
  process.exit(1);
}
