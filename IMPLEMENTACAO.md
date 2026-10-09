# Matriz de implementação — WAVELELA V3.0

| Requisito | Estado | Observação / prova |
|---|---|---|
| Preservar V2.0 e permitir recuperação | **Guardado** | `WAVELELA_BACKUP_V2_ANTES_COTACAO.zip`, entregue separadamente |
| Manter identidade, serviços, navegação e imagens | **Implementado** | Reutilização dos ficheiros da V2.0, CSS novo apenas para formulário |
| Empresa / particular com campos condicionais | **Implementado, testes de código** | Tipo de solicitante e campo empresa condicionado |
| Nome, e-mail, telefone, serviço/produto, especificações, local, prazo | **Implementado, testes de código** | Obrigatórios sinalizados; opcionais definidos |
| Pedido iniciado pelo serviço com selecção prévia | **Implementado, testes de código** | `?servico=ship|crew|log` e página de serviço |
| E-mail corporativo formatado e assunto personalizado | **Implementado e testado com fornecedor simulado** | HTML+texto, referência, hora de Luanda e escaping HTML |
| Entrega dirigida a comercial@wavelela.ao | **Implementado e testado com fornecedor simulado** | Destinatário fixo no backend, não controlado pelo browser |
| Reply-To do solicitante | **Implementado e testado com fornecedor simulado** | Propriedade `reply_to` validada |
| Sem mailto e sem falsas confirmações | **Implementado e testado localmente** | Sucesso só com resposta positiva e ID do fornecedor |
| Preservar dados em caso de falha | **Implementado; teste de browser pendente** | O formulário é limpo só após sucesso confirmado |
| Protecção anti-bot e duplicações | **Implementado com limitações** | Honeypot, rate limit em memória, UUID e idempotência Resend |
| Envio real por fornecedor | **Implementado, dependente de credenciais e alojamento** | API Resend integrada; falta `RESEND_API_KEY` + `MAIL_FROM` verificado |
| Confirmação de entrega na caixa | **Não testado** | Necessário envio real aprovado pela empresa e acesso à caixa/painel |
| Testes visuais do formulário desktop/mobile/tablet | **Parcialmente testados** | Chromium isolado a 1440, 768 e 390 px, com simulação de falha e sucesso; navegação HTTP real bloqueada |

## Alterações relevantes

- `app.js`: UI de cotação, campos adaptativos, integração fetch, estados, restauro/preservação de campos.
- `styles.css`: estilo do novo formulário, validação visual, áreas condicionais, legibilidade mobile.
- `server.js`: API segura e envio Resend, origem permitida, limite de pedidos, deduplicação, formatação do e-mail.
- `config.js`: endereço público e configurável do backend (sem segredos).
- `.env.example`, `tests/`, `README.md`: configuração, testes e instruções.

O resto do website permanece estruturalmente inalterado.
