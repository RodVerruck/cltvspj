# 🧠 CLT vs PJ - PROJECT BRAIN (AI CONTEXT)

Este documento é o **índice principal** para a IA manter o contexto deste projeto atualizado e correto ao propor melhorias.

## 🏗️ Arquitetura e Stack
- **Framework**: Next.js 14 (Pages Router)
- **Styling**: Tailwind CSS
- **Pasta Raiz**: Agora usando a convenção `src/` (movemos `pages/`, `components/` e `lib/` para cá).
- **Conteúdo**: Arquivos MDX localizados na raiz `/posts`.

## 📂 Mapa de Documentação

Para aprofundar em tópicos específicos, consulte:

| Assunto | Arquivo |
| :--- | :--- |
| **Matemática e Impostos** | `.ai_context/CALCULATOR_RULES.md` |
| **Design System e Identidade** | `DESIGN_VISUAL.md` e `CONTEXTO_VISUAL_COMPLETO.md` |
| **Estratégia de Monetização** | `MONETIZACAO.md` |
| **Estrutura Original** | `ESTRUTURA_PROJETO.md` |
| **Aprendizados (Log)** | `.ai_context/LEARNING_LOG.md` |

## ⚖️ Regras de Ouro para a IA

1. **Nunca quebre o SEO**: Sempre mantenha as meta tags (`<Head>`) intactas no `_app.js` ou `index.js`.
2. **Cálculos isolados**: A matemática complexa de impostos fica em `src/lib/calculator.js`, separada da UI.
3. **Design Editorial**: Siga o Tailwind configurado (`text-ink`, `text-money`, fontes `Instrument Serif` / `Space Mono`). Nunca use classes Tailwind padrão que quebrem a paleta de cores.
4. **Markdown Compatível**: O blog usa MDX processado via `remark`/`rehype`. Se adicionar features no blog, não quebre o parser do Gray Matter.
5. **Atualização Proativa**: Se descobrir um novo imposto ou regra tributária que afeta a calculadora, documente no `.ai_context/CALCULATOR_RULES.md` e adicione a data no `.ai_context/LEARNING_LOG.md`.

---
*Ponto de Entrada: A IA sempre deve consultar este arquivo antes de implementar novas features maiores.*
