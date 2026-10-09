# WAVELELA V3.0 — Relatório de evolução do formulário

## Diagnóstico antes da intervenção

A V2.0 exigia sempre nome de empresa, apesar de poder haver particulares; tinha destinatário predefinido distinto do e-mail comercial especificado; oferecia um `mailto:` de contingência que não permitia submeter o pedido dentro do website; e não garantia deduplicação no fornecedor de e-mail.

## Correcções implementadas

1. **Formulário comercial completo e contextual:** identificação empresa/particular, campos obrigatórios conforme o tipo, telefone, local e prazo opcionais, serviço/produto predefinido nos links específicos, detalhes e consentimento.
2. **Mensagem corporativa:** layout HTML azul-marinho/dourado e alternativa texto, assunto identificável, dados agrupados, hora de Luanda, referência UUID e Reply-To.
3. **Entrega integrada:** navegador -> endpoint Node `/api/contact` -> API Resend -> `comercial@wavelela.ao`; os endereços e segredos não podem ser alterados através do frontend.
4. **Gestão de erros:** preservação dos dados ao falhar, respostas diferenciadas 422/429/502/503 e confirmação apenas após aceite com ID do prestador; sem abertura de aplicações externas.
5. **Segurança:** limitação de frequência, validação dupla, verificação da origem, honeypot, escaping e idempotência do prestador durante 24 horas.
6. **Preservação visual:** CSS aditivo para o formulário, mantendo o logotipo, fotografias, botões principais, navegação e páginas da V2.0.

## O que falta

- Registar/verificar domínio remetente no fornecedor, configurar chave privada e `MAIL_FROM` no alojamento Node com HTTPS.
- Se mantiver GitHub Pages para a interface, disponibilizar API Node numa origem HTTPS separada e autorizar a origem do website.
- Submeter um pedido real de teste e verificar recepção em `comercial@wavelela.ao` e funcionamento do botão «Responder».
- Testar visualmente o novo formulário em equipamentos reais e concluir verificação de privacidade/acessibilidade.
- Para maior volume/tráfego, adoptar rate-limit distribuído e validação antiautomação adicional.

**Distinção crítica:** os testes de integração utilizam um servidor de e-mail simulado. Não foi realizada uma entrega real na caixa comercial, pois não foram fornecidas credenciais nem acesso ao e-mail. A implementação está pronta para configuração, mas **a funcionalidade de envio real ainda não foi activada**.
