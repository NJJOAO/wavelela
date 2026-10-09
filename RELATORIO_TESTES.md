# WAVELELA V2.0 — Relatório de verificação

**Data:** 08/10/2026

## Resultados

- Sintaxe `app.js` e `server.js`: PASSOU (`npm run check`).
- Testes integrados `npm test`: PASSOU (consultar saída de execução).
- Renderização isolada Chromium nas larguras **1440, 768, 390 e 320 px**: PASSOU, sem overflow horizontal.
- Imagens locais: cinco elementos `<img>` da homepage descodificados (marca inicial/final e três serviços), além dos fundos fotográficos CSS; tamanhos e carregamento confirmados.
- Navegação mobile: menu abre/fecha, tecla Escape fecha, `aria-expanded` acompanha o estado: PASSOU.
- Alternância PT/EN: PASSOU no navegador isolado.
- Perguntas frequentes: expansão com `<details>`: PASSOU.
- Formulário: rejeição de campos vazios via validação nativa: PASSOU.
- Renderização das 9 rotas, erro 404 e integridade dos links internos: PASSOU.
- Erros JavaScript durante as verificações: nenhum registado.

## Teste HTTP local adicional

- `GET /index.html`: **200** — HTML entregue.
- `GET /ship-chandling.html`: **200** — página de serviço entregue.
- `GET /assets/service-supply.webp`: **200**, 234 282 bytes.
- `POST /api/contact` com pedido inválido: **422**, com mensagem de validação.
- `POST /api/contact` com dados válidos e sem credenciais: **503**, sem confirmação indevida de envio.

## Limitações

O Chromium usado para o ensaio bloqueia a navegação para URLs HTTP locais; para validação visual foi injectado o HTML/CSS/JS da aplicação num documento isolado com os activos locais embebidos, sem pedidos de rede. Isto verifica layout e interacções mas não substitui ensaio E2E da aplicação publicada num domínio real.

**Envio de e-mails em produção não testado:** credenciais e domínio autorizado em falta. A presença de formulário/API não é comprovativo de entrega. Não foi executada auditoria WCAG 2.2 AA completa, Lighthouse real ou testes físicos de Safari/Firefox.
