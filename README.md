# WAVELELA — Website Corporativo V2.0

Redesign multi-page em português e inglês para Ship Chandling, Crew Change e Suporte Logístico. Usa HTML, CSS e JavaScript sem dependências externas, com um servidor Node.js opcional para envio seguro de e-mails.

## Instalação e pré-visualização

- Pré-visualização estática: executar `python -m http.server 8080` nesta pasta e visitar `http://localhost:8080`.
- Ambiente completo com API: requer **Node.js 20+**. Executar `npm start`, depois visitar `http://localhost:3000`.
- Testes: `npm test` e `npm run check`.

## Formulário / funcionamento real

O formulário valida dados no navegador e no servidor. A entrega automática depende de configurar `RESEND_API_KEY`, `MAIL_FROM` (remetente num domínio verificado) e `MAIL_TO` no ambiente do processo Node. Exemplo em `.env.example`; **Node não lê o ficheiro .env automaticamente**, pelo que é preciso exportar as variáveis através da plataforma de alojamento ou `node --env-file=.env server.js` em Node compatível. Nunca colocar credenciais em JavaScript público ou no GitHub.

Em alojamento estático como GitHub Pages, **o endpoint `/api/contact` não existe**: o formulário mostra uma ligação para criar um e-mail na aplicação do visitante. Essa alternativa não confirma a recepção pelo destinatário. Para entrega real, usar o servidor Node com HTTPS, ou migrar a API para uma função serverless equivalente. O servidor impõe validação, campo anti-spam, limite de corpo e limite de 8 pedidos/IP/hora em memória; num contexto de produção com múltiplas instâncias, usar limitação de tráfego partilhada e protecção anti-bot adicional.

## Publicação

**Servidor Node:** escolher um alojamento de Node.js com HTTPS, definir o comando `npm start`, configurar domínio e DNS e adicionar as variáveis de ambiente. Confirmar envio e recepção de um pedido de teste antes de publicar o formulário.

**GitHub Pages:** colocar todos os ficheiros do projecto na raiz de publicação. Se a publicação ocorrer em subdirectório, os links relativos são compatíveis. Recomenda-se associar domínio próprio e rever o caminho de `/api/contact` caso utilize serviço externo.

## Conteúdos e activos

O símbolo dourado da WAVELELA (`wavelela-mark.png`) foi extraído do ficheiro do logotipo disponibilizado pelo utilizador e usado nas áreas institucionais. Para produção recomenda-se o ficheiro vectorial de marca, se existir. As fotografias de porto e serviços foram **geradas de novo em alta resolução** como material ilustrativo, e não são fotografias verificadas da operação da WAVELELA. Substituir por fotografias autorizadas e reais antes do lançamento. Dados de contacto foram transcritos do website original (confirmar que permanecem correctos).

A política de privacidade incluída é texto introdutório e requer revisão jurídica, incluindo base de tratamento, retenção, destinatários e exercício de direitos. Não existem projectos, clientes ou certificações inventados.

## Critérios antes de produção

1. Rever identidade e logotipo definitivo; validar contactos e serviços com a empresa.
2. Substituir imagens conceptuais por fotografias licenciadas/autorizadas.
3. Configurar e testar serviço de e-mail de produção; confirmar domínio de envio.
4. Rever texto e tratamento de dados pessoais, incluindo política de privacidade.
5. Testar visualmente em Chrome, Firefox, Safari e dispositivos físicos; executar auditoria de acessibilidade WCAG 2.2 AA e Lighthouse.
6. Instalar analytics apenas após definir objectivos e tratamento adequado de consentimento/cookies.

## Estrutura

`index.html`, `empresa.html`, `servicos.html`, três páginas por serviço, `contacto.html`, `privacidade.html`, `404.html`, `app.js`, `styles.css`, `assets/`, `server.js`, `tests/`.

## Alterações da versão 2.0

- Novas imagens WebP independentes (hero 1672 × 941, serviços 1280 × 853 px) e imagem de destaque própria para telemóvel.
- Marca dourada com transparência, nova composição do header e favicon.
- Botões e links aprimorados, cartões com CTA específico por serviço, mapa esquemático responsivo e maior consistência visual.
- Capturas completas de desktop, tablet e smartphone na pasta `previews/`.
- Consultar `AUDITORIA_COMPARATIVA_V2.md` e `RELATORIO_TESTES.md`.
