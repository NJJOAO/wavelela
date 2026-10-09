# WAVELELA — Revisão de iconografia (V4)

## Objectivo
Aperfeiçoar a iconografia do website, com foco especial na versão mobile, preservando o design, conteúdos, navegação e funcionalidade de cotações já existentes.

## Alterações implementadas
- Substituição de símbolos tipográficos/emojis por ícones **SVG** de traço uniforme.
- Revisão dos ícones dos **cartões de serviço**:
  - Ship Chandling → âncora
  - Crew Change → equipa / utilizadores
  - Suporte Logístico → embalagem / caixa
- Revisão dos ícones da área **Quem somos / confiança** com linguagem visual consistente.
- Revisão dos ícones de **contacto** (e-mail, telefone, localização).
- Revisão dos ícones de **prova rápida** na hero section (24/7, base em Luanda, ponto de contacto).
- Ajuste de tamanhos, contraste, espaçamentos e alinhamentos, sobretudo no mobile.
- Preservação integral do formulário “Solicitar Cotação” e das respectivas integrações já preparadas.

## Verificações efectuadas
- `npm test` → 8/8 testes aprovados.
- `npm run check` → verificação sintáctica aprovada.
- Validação visual em larguras de referência **desktop, tablet e mobile** através de renderização isolada dos componentes relevantes, dado que o ambiente bloqueia a navegação automatizada para páginas locais.

## Limitações conhecidas
- A validação visual automatizada foi feita por renderização isolada de componentes e não por navegação end-to-end do website hospedado localmente, devido restrições do ambiente.
- Recomenda-se confirmação final em dispositivos físicos antes da publicação em produção.

## Ficheiros úteis
- `previews/icones-mobile-before-after.png`
- `previews/icones-contacto-before-after.png`
