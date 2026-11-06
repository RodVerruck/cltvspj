import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SITE_URL } from '../lib/config';
import { Mail, MessageCircle, ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function Contato() {
  const pageUrl = `${SITE_URL}/contato`;
  const pageTitle = "Contato e Suporte | Calculadora CLT vs PJ";
  const pageDescription = "Entre em contato com a equipe editorial da CLT vs PJ para sugestões, correções técnicas ou assessoria contábil para sua transição profissional.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Head>

      <div className="page-root">
        <Header />

        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          {/* Hero */}
          <section className="border-b border-rule py-16 md:py-20 relative">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-pattern" />
            <div className="max-w-4xl mx-auto px-6 md:px-8 relative">
              <div className="eyebrow mb-6">
                <span className="eyebrow-dot" />
                <span>Atendimento e Transparência Editorial</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink font-bold leading-tight mb-6">
                Fale com a equipe <em className="italic text-money">CLT vs PJ</em>
              </h1>

              <p className="text-lg md:text-xl text-ink-muted leading-relaxed font-sans max-w-2xl">
                Tem dúvidas sobre alguma regra tributária, encontrou uma inconsistência nos cálculos ou quer ajuda especializada para planejar sua migração de carreira? Estamos à disposição.
              </p>
            </div>
          </section>

          {/* Cards de Contato */}
          <section className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6 md:px-8 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                
                {/* Card 1: Consultoria Contábil Parceira (Manassés) */}
                <div className="bg-white border-2 border-money/30 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-money to-[#146b5a]" />
                  
                  <div>
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-money font-bold bg-money/10 px-2.5 py-1 rounded mb-4">
                      <ShieldCheck className="w-3.5 h-3.5 text-money" />
                      Parceria Oficial
                    </div>

                    <h2 className="font-display text-2xl font-bold text-ink mb-3">
                      Assessoria Contábil para PJ & Fator R
                    </h2>

                    <p className="text-sm text-ink-muted leading-relaxed mb-6">
                      Se você recebeu uma proposta PJ e precisa validar o enquadramento no Anexo III do Simples Nacional, emitir notas fiscais ou abrir seu CNPJ com segurança, fale diretamente com nossos parceiros contábeis credenciados.
                    </p>

                    <ul className="text-xs text-ink-muted space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                        <span>Planejamento tributário individualizado</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                        <span>Atendimento consultivo e humanizado via WhatsApp</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                        <span>Cupom exclusivo: <strong>CLTVSPJ50</strong> (50% OFF na 1ª mensalidade)</span>
                      </li>
                    </ul>
                  </div>

                  <a
                    href="/go/manasses"
                    rel="sponsored nofollow"
                    className="inline-flex items-center justify-center gap-2 bg-money hover:bg-[#0a3d33] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow hover:shadow-md text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Falar no WhatsApp com Contador</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Card 2: Editorial & Sugestões */}
                <div className="bg-white border border-rule rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted font-bold bg-paper px-2.5 py-1 rounded mb-4 border border-rule">
                      <Mail className="w-3.5 h-3.5 text-ink-muted" />
                      Equipe Editorial
                    </div>

                    <h2 className="font-display text-2xl font-bold text-ink mb-3">
                      Sugestões e Correções Técnicas
                    </h2>

                    <p className="text-sm text-ink-muted leading-relaxed mb-6">
                      Nosso simulador é atualizado continuamente conforme as notas técnicas da Receita Federal e alterações na CLT. Sugestões de novos comparativos profissionais, correções na fórmula ou parcerias editoriais são muito bem-vindas.
                    </p>

                    <div className="bg-paper border border-rule rounded-xl p-4 mb-6">
                      <span className="font-mono text-xs text-ink-muted block mb-1">E-mail para contato direto:</span>
                      <a 
                        href="mailto:contato@cltvspj.com.br" 
                        className="font-mono text-sm font-bold text-money hover:underline break-all"
                      >
                        contato@cltvspj.com.br
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-rule/60 text-xs text-ink-fade">
                    Respondemos habitualmente em até 24 a 48 horas úteis.
                  </div>
                </div>

              </div>

              {/* Seção de Privacidade e Dados (LGPD) */}
              <div className="bg-paper/70 border border-rule rounded-2xl p-8 text-ink">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-5 h-5 text-money flex-shrink-0" />
                  <h3 className="font-display text-xl font-bold text-ink">Privacidade e Proteção de Dados (LGPD)</h3>
                </div>

                <div className="text-sm text-ink-muted leading-relaxed space-y-3">
                  <p>
                    <strong>Processamento 100% no seu navegador:</strong> Os valores de salários, faturamentos, benefícios e gastos que você digita em nossas simulações são processados exclusivamente na memória do seu dispositivo móvel ou computador.
                  </p>
                  <p>
                    Nós <strong>não armazenamos</strong>, não salvamos em banco de dados e não compartilhamos com terceiros os valores das suas simulações financeiras ou dados bancários.
                  </p>
                  <p>
                    Ao clicar em links patrocinados ou contatar nossa contabilidade parceira via WhatsApp, você é direcionado aos canais externos oficiais das respectivas empresas sob seus próprios termos de atendimento e política de privacidade.
                  </p>
                </div>
              </div>

              {/* CTA Retorno */}
              <div className="mt-16 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-money font-bold hover:underline"
                >
                  ← Voltar para a Calculadora CLT vs PJ
                </Link>
              </div>

            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

