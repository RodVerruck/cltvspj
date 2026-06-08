# 💰 Guia de Monetização - CLT ou PJ

## ✅ IMPLEMENTADO

### 1. SEO Otimizado
- ✅ Meta tags completas (title, description, keywords)
- ✅ Open Graph para redes sociais
- ✅ Twitter Cards
- ✅ Canonical URL
- ✅ Estrutura preparada para Google AdSense

### 2. Afiliado Ativo: Manassés Contabilidade
- ✅ Link de afiliado oficial: `https://manassescontabilidade.com.br/orcamento/?ref=e150bfec6701708e9e17fdc38a6fc261`
- ✅ Rota de rastreamento interna: `/go/manasses` (com evento GA4 `affiliate_click`)
- ✅ CTA ancorado imediatamente após o Hero Result Card na calculadora
- ✅ CTA final dentro do detalhamento técnico da calculadora
- ✅ CTA no template de todos os posts do blog (`src/pages/blog/[slug]/index.js`)
- ✅ CTA inline nos posts MDX (`vale-pena-pj-isencao-ir-lei-15270-2026.mdx`)
- ✅ Menção textual no post `como-abrir-cnpj-trabalhar-pj.mdx`

### 3. Termos da Parceria (confirmar com Vinícius)
- ✅ Link de afiliado com `?ref=e150bfec6701708e9e17fdc38a6fc261` (token do Anderson Moreira)
- ⏳ Periodicidade de repasse: **mensal** ou **semestral acumulado** — aguardando confirmação do Vinícius
- 🎁 Oferta ao lead: **50% de desconto na primeira mensalidade**
- 🎯 Público alvo: profissionais de TI no Simples Nacional (Fator R)

### 4. Responsável pelo repasse
- **Anderson Moreira** — contato comercial principal
- **Vinícius** — responsável pelos repasses financeiros

---

## 🚀 PRÓXIMOS PASSOS

### PASSO 1: Google AdSense (30 minutos)
1. Acesse: https://www.google.com/adsense/start/
2. Faça login com sua conta Google
3. Adicione o site: `calculadora-cltvspj.vercel.app`
4. Copie o código de verificação que eles fornecerem
5. **Quando aprovado**, substitua `ca-pub-XXXXXXXXXXXXXXXX` em:
   - `src/pages/_app.js` (linha com comentário AdSense)
   - `src/components/AdSense.js`
6. Aguarde aprovação (1-3 dias úteis)

**Ganho estimado**: R$ 200-800/mês com 1.000-5.000 visitas

---

### PASSO 2: Divulgação Gratuita (2 horas)

#### LinkedIn (Copy pronto):
```
🎯 Criei uma calculadora gratuita para quem está em dúvida entre CLT e PJ!

Compare em segundos:
✅ Salário líquido real
✅ Todos os impostos (INSS, IRPF, Simples Nacional)
✅ Benefícios e encargos
✅ Resultado instantâneo

100% gratuito: https://calculadora-cltvspj.vercel.app

#CLT #PJ #Freelancer #Carreira #DesenvolvimentoDeSoftware
```

#### Reddit:
- r/investimentos
- r/brasil
- r/brdev (se for dev)
- r/ConselhosLegais

**Post sugerido**:
```
[Ferramenta] Calculadora CLT x PJ com todos os impostos

Fiz uma calculadora que compara CLT vs PJ considerando:
- INSS, IRPF, Simples Nacional, ISS
- Benefícios (VR, VT, plano de saúde)
- FGTS, 13º, férias

Link: https://calculadora-cltvspj.vercel.app

É gratuita e o código está no GitHub. Aceito sugestões!
```

#### Twitter/X:
```
💰 Dúvida entre CLT e PJ?

Fiz uma calculadora que mostra EXATAMENTE quanto você ganha líquido em cada regime.

Considera todos os impostos, benefícios e encargos.

100% grátis: https://calculadora-cltvspj.vercel.app

#CLT #PJ #Freelancer
```

#### Grupos WhatsApp/Telegram:
```
Pessoal, criei uma calculadora gratuita CLT x PJ!

Ela mostra quanto você ganha líquido em cada regime, considerando todos os impostos e benefícios.

Achei que poderia ser útil pra vocês: https://calculadora-cltvspj.vercel.app

É 100% gratuito 😊
```

---

### PASSO 3: Google Meu Negócio (15 minutos)
1. Acesse: https://www.google.com/business/
2. Crie perfil: "CLT ou PJ - Calculadora"
3. Categoria: "Serviço de consultoria financeira"
4. Adicione o link do site
5. Coloque sua cidade (ex: Florianópolis, SC)

---

## 📊 PROJEÇÃO DE GANHOS (REALISTA)

| Mês | Visitas | AdSense | Manassés (afiliado) | Total/Mês |
|-----|---------|---------|---------------------|-----------|
| 1   | 500     | R$ 50   | R$ 150              | R$ 200    |
| 2   | 2.000   | R$ 200  | R$ 500              | R$ 700    |
| 3   | 5.000   | R$ 500  | R$ 1.100            | R$ 1.600  |
| 6   | 15.000  | R$ 1.500| R$ 2.800            | R$ 4.300  |

---

## 📈 PRÓXIMAS SEMANAS

### Semana 2-4: Conteúdo SEO
Criar página `/blog` com artigos:
1. "Vale a pena virar PJ em 2026?"
2. "Quanto cobrar por hora como PJ? Guia completo"
3. "CLT vs PJ: Vantagens e desvantagens"
4. "Impostos PJ: quanto você realmente paga?"
5. "Como abrir CNPJ em 2026: passo a passo"

### Mês 2: Google Ads
- Investir R$ 5-10/dia
- Palavras-chave: "clt ou pj", "calculadora clt pj", "quanto ganho como pj"
- CPC médio: R$ 0,30-0,80

---

## 🔧 MELHORIAS TÉCNICAS FUTURAS

1. **Analytics**
   - Google Analytics 4 ✅ (já configurado)
   - Hotjar para heatmaps
   - Rastrear conversões de afiliados ✅ (evento `affiliate_click` no GA4)

2. **A/B Testing**
   - Testar diferentes CTAs
   - Testar posicionamento de anúncios
   - Testar cores dos botões

3. **Email Marketing**
   - Capturar emails (oferecer PDF com guia PJ)
   - Newsletter semanal com dicas
   - Sequência de emails automática

---

## 📞 SUPORTE

Dúvidas sobre monetização? Problemas técnicos?
- Revise este documento
- Teste o link: https://manassescontabilidade.com.br/orcamento/?ref=e150bfec6701708e9e17fdc38a6fc261
- Verifique se o site está no ar

**Lembre-se**: Consistência é a chave! Divulgue todo dia por 30 dias.
