# Matriz de rastreabilidade e estado da implementação

| Recomendação | Solução | Critério de aceitação | Estado |
|---|---|---|---|
| Branding alinhado com o logotipo | Dourado/azul-marinho, marca raster fornecida | Marca presente em todas as páginas | Implementado; imagem vectorial definitiva pendente |
| Melhor hierarquia | Hero, 3 serviços, credibilidade, processo, cobertura, FAQ, contacto | Secções visíveis e navegação | Implementado e validado em Chromium isolado; dispositivos físicos pendentes |
| Páginas por serviço | 3 páginas específicas | URL individual e conteúdo relevante | Implementado e testado estruturalmente |
| Navegação | 9 documentos HTML + navegação responsiva | Todos os links internos resolvem | Implementado; validação automatizada parcial |
| Versão inglesa | Conteúdos principais PT/EN | Alternância de idioma persistente | Implementado; necessita revisão linguística nativa |
| Formulário | Validação HTML + endpoint Node + fallback mailto | Entrega efectiva confirmada | Implementado, depende de credenciais e teste real de entrega |
| Antispam | Honeypot, rate-limit simples, limites e origem | Pedidos inválidos rejeitados | Implementado; defesa adicional necessária em produção |
| Contactos | Links e-mail/tel, contactos do site original | Dados iguais ao original | Implementado; validar com a empresa |
| Acessibilidade | Foco visível, skip link, landmarks, labels, reduced motion | Auditoria WCAG 2.2 AA | Implementação parcial; auditoria manual pendente |
| SEO | Titles, descriptions, robots | Indexação e structured data | Parcial: metadados genéricos; domínio/canonical/sitemap pendentes |
| Fotografia corporativa | Novas imagens conceptuais independentes em alta resolução, WebP e recorte mobile | Fotografias oficiais da operação, autorizadas | Implementação conceptual testada — fotografia institucional real pendente |
| Analytics | Sem recolha por defeito | Métricas e consentimento | Não implementado — aprovação pendente |
| Política de privacidade | Página informativa inicial | Política jurídica validada | Parcial — validação jurídica pendente |
| Publicação | Código e instruções para Node e static | Domínio e HTTPS operacional | Não implementado — depende de infraestrutura |

## Inventário de recursos

- **Obrigatórios e gratuitos:** Node.js 20+, navegador, Git, editor de código; projecto sem dependências npm.
- **Alojamento:** GitHub Pages gratuito para estático, mas sem API de envio; servidor Node, pago ou gratuito conforme fornecedor, para API.
- **Envio de e-mail:** Resend ou serviço equivalente, pode ter planos gratuitos com limites; rever condições e preços actuais junto do fornecedor.
- **Domínio personalizado:** recomendado; habitualmente com renovação paga.
- **Fotografias:** preferir fotografia institucional própria; imagens de terceiros carecem de direitos e autorização.

## Estado de validação

Testes automatizados em `tests/site.test.js` verificam páginas, activos, estruturas, estilos responsivos e preparação de backend. **Não** são equivalentes a testes E2E em browsers nem provam envio de e-mails. Consultar `RELATORIO_TESTES.md`.

## Actualização V2.0

Consultar `AUDITORIA_COMPARATIVA_V2.md` para matriz antes/depois e `RELATORIO_TESTES.md` para resultados. A API externa de correio continua dependente de credenciais e não é dada como concluída.
