# Relatório de testes — WAVELELA V3.0

Comandos reproduzíveis: `npm run check` e `npm test` (Node.js 20+). Não requerem credenciais nem enviam e-mails reais.

## Casos cobertos

- Presença das nove páginas e carregamento dos scripts e activos originais.
- Preservação de tipografia, CSS, responsividade e identidade visual anterior em ficheiros.
- Presença de campos de cotação e regras condicionais no código.
- Backend sem configuração: erro HTTP 503, sem falsa confirmação.
- Validação de campos, honeypot, origem não autorizada e método HTTP indevido.
- Envio aceite por fornecedor de e-mail **simulado**: validação de `to`, `reply_to`, HTML com caracteres escapados, texto, assunto e cabeçalho `Idempotency-Key`.
- Pedido repetido com a mesma referência: não há segundo envio ao simulador; conteúdo alterado com a mesma referência gera erro 409.
- Falha do fornecedor simulado: backend comunica HTTP 502 sem alegar sucesso.
- Ficheiros privados de configuração não são expostos pelo servidor estático.

## Limites da validação

- Os testes de interface foram complementados por renderização isolada em Chromium a **1440, 768 e 390 px** (sem carregar o website por HTTP). Foram verificados campos condicionais, ausência de transbordamento horizontal, persistência dos dados após resposta de erro simulada e limpeza apenas após sucesso simulado. A navegação directa pelo endereço local continuou bloqueada (`ERR_BLOCKED_BY_ADMINISTRATOR`), pelo que a inspeção visual integrada do website inteiro ficou pendente.
- O envio foi simulado com API local de testes, **não com Resend real**.
- Não existe prova de recepção em `comercial@wavelela.ao`, nem foram validados DNS do domínio ou entregabilidade.
- Testar em alojamento HTTPS, Chrome/Firefox/Safari e dispositivos físicos antes da entrada em produção.
