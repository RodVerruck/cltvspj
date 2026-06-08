# Mapa de Conteúdo SEO — CLT vs PJ

Estratégia: **pilares** (alta concorrência) + **cauda longa em escala** (comparativos, profissões, cidades).

## Camadas do site

| Camada | URL | Função |
|--------|-----|--------|
| Hub principal | `/` | Calculadora — conversão e autoridade |
| Blog pilares | `/blog/{slug}` | Artigos MDX (guias, keywords amplas) |
| Comparativos | `/blog/comparativo/{slug}` | Cauda longa **gerada da calculadora** |
| Índice comparativos | `/blog/comparativos` | Internal linking |

## Comparativos (implementado)

**Faixas salariais** — editar `src/data/comparativos/salary-bands.js`:

- CLT 3.000 … 12.000 (passo 1.000)
- PJ padrão = CLT × 1,5 (proposta típica TI)

**Estudos de caso** — editar `src/data/comparativos/case-studies.js`:

- CLT 5k vs PJ 8k, 8k vs 12k, 10k vs 15k, 15k vs 25k

**Adicionar nova faixa:** incluir valor em `salary-bands.js` → deploy. Página, SEO e sitemap saem automáticos.

## Próximas séries (a implementar)

### Semana A — Profissões TI

Arquivo futuro: `src/data/comparativos/professions.js`

| Slug sugerido | Keyword |
|---------------|---------|
| `clt-ou-pj-analista-suporte` | CLT ou PJ analista suporte |
| `clt-ou-pj-qa` | CLT ou PJ QA |
| `clt-ou-pj-product-owner` | CLT ou PJ product owner |
| `clt-ou-pj-ux-designer` | CLT ou PJ UX |
| `clt-ou-pj-cientista-dados` | CLT ou PJ cientista de dados |
| `clt-ou-pj-analista-bi` | CLT ou PJ analista BI |

Salários médios por profissão no config → mesmo template de comparativo.

### Semana B — Localização

Arquivo futuro: `src/data/comparativos/locations.js`

| Slug | Keyword |
|------|---------|
| `desenvolvedor-pj-florianopolis` | dev PJ Florianópolis |
| `desenvolvedor-pj-sao-paulo` | dev PJ São Paulo |
| `clt-ou-pj-ti-santa-catarina` | CLT PJ TI SC |

Conteúdo: parágrafo local + comparativo numérico padrão.

## Blog MDX (2/semana)

Artigos editoriais que **linkam** para `/` e `/blog/comparativos`:

| Semana | Temas |
|--------|-------|
| 2 | Quanto ganho PJ/hora · Fator R prático |
| 3 | Dev salário 100/h · Simples vs Presumido |
| 4 | Pejotização 2026 · Avaliar proposta PJ |

## Ritmo recomendado

| Ação | Frequência |
|------|------------|
| Post MDX editorial | 2/semana |
| Novas faixas comparativo | lote semanal (5–10 linhas no JS) |
| Indexação GSC | 1 URL/dia |
| LinkedIn / Reddit | 1 post social por artigo |

## O que NÃO fazer

- Publicar 10 MDX genéricos idênticos (thin content)
- Canibalizar: 1 keyword principal por URL
- Esquecer link para calculadora em todo conteúdo

## Comandos úteis

```bash
npm run build   # gera todas as páginas comparativo + sitemap
```

## Arquivos-chave

- `src/data/comparativos/` — catálogo de cenários
- `src/lib/comparativo/scenario.js` — engine + copy dinâmico
- `src/pages/blog/comparativo/[slug].js` — template visual
- `src/components/seo/PostSEO.js` — SEO automático
- `posts/*.mdx` — artigos pilares
