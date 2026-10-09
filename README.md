# WAVELELA — Website Corporativo V3.0

Esta versão mantém o design, as imagens e os conteúdos da V2.0, acrescentando um **pedido de cotação integrado** com backend de envio Resend, destinatário corporativo fixo `comercial@wavelela.ao` e protecções contra abuso/duplicações.

## 1. Executar e testar

Requer **Node.js 20 ou superior**. Sem necessidade de instalar dependências externas.

```bash
npm start
```

Abra `http://localhost:3000` e aceda a «Solicitar cotação». Para verificar a aplicação:

```bash
npm run check
npm test
```

O formulário **não envia e-mails reais sem a configuração segura abaixo**. Em ambiente de pré-visualização não configurado, devolve mensagem de erro, sem limpar os dados. O backend é uma parte obrigatória para o envio; alojamento estático por si só não é suficiente.

## 2. Activar o envio real — instruções exactas

1. Confirmar que a equipa comercial recebe correio no endereço **comercial@wavelela.ao** (configurado externamente ao website).
2. Criar conta num serviço de e-mail transaccional compatível com a API da **Resend**: https://resend.com. Adicionar um domínio ou subdomínio de envio da empresa, validar DNS (SPF/DKIM segundo as instruções do fornecedor) e aguardar estado **verificado**. A caixa de recepção e o endereço de envio são coisas diferentes.
3. Criar uma chave de API apenas para envio de e-mails, com as permissões mínimas aplicáveis. Guardá-la no ambiente secreto do alojamento, nunca em `app.js`, `config.js`, GitHub, páginas públicas ou no ZIP partilhado.
4. Escolher alojamento com execução de **Node.js e HTTPS** (ou adaptar `server.js` a uma função serverless). Configurar estas variáveis **privadas** no painel do alojamento:

   ```ini
   RESEND_API_KEY=re_CHAVE_REAL_PRIVADA
   MAIL_FROM="WAVELELA Comercial <cotacoes@wavelela.ao>"
   NODE_ENV=production
   PORT=3000
   ```

   O domínio de `MAIL_FROM` tem de estar verificado no serviço; o endereço acima é ilustrativo e só será utilizável após a verificação. O destinatário de todas as cotações está fixado no servidor: **comercial@wavelela.ao** (não pode ser substituído pelo browser).
5. Executar `npm start` no servidor. Garantir que o URL público utiliza HTTPS e que `/api/contact` chega ao processo Node.
6. Se o website continuar alojado no **GitHub Pages**, publicar o backend num domínio HTTPS separado e editar apenas a propriedade `quoteApiUrl` no ficheiro público `config.js`, por exemplo:

   ```js
   window.WAVELELA_CONFIG = { quoteApiUrl: 'https://api.seu-dominio-verificado.ao/api/contact' };
   ```

   Configurar também, **apenas no servidor**, `QUOTE_ALLOWED_ORIGINS` com as origens públicas autorizadas, separadas por vírgula (origem é esquema+domínio+porta, sem caminho), por exemplo `https://hugocoldbullet.github.io,https://www.wavelela.ao`. Sem isto o backend rejeitará o pedido feito a partir do domínio GitHub Pages; nunca usar `*`.
7. Testar com uma submissão real aprovada pela empresa e verificar quatro pontos: resposta positiva do serviço Resend com ID; registo de entrega no painel do fornecedor (pode ser posterior à aceitação); recepção efectiva em `comercial@wavelela.ao`, incluindo Spam; e funcionamento do botão «Responder», destinado ao e-mail usado pelo solicitante.

**Importante:** `200 OK` do nosso endpoint significa que o fornecedor **aceitou** processar a mensagem; não prova recepção na caixa de entrada. Verifique a entrega, os registos e eventual necessidade de webhooks de estado antes de tratar a funcionalidade como plenamente operacional em produção.

### Ficheiros `.env`

O ficheiro `.env.example` contém apenas marcadores sem segredo. Pode copiar para `.env` em desenvolvimento e lançar Node 20+ com `node --env-file=.env server.js`, mas **não partilhe esse ficheiro**. `npm start` não lê `.env` automaticamente. O `.gitignore` exclui `.env`.

## 3. Regras do formulário

**Empresas e entidades:** empresa, nome, e-mail, serviço/produto, descrição (10–3000 caracteres) e consentimento obrigatórios. **Particulares:** empresa deixa de ser exigida; os restantes campos continuam obrigatórios. Para «Outro serviço/produto», o nome do serviço é obrigatório. Telefone, local/porto, navio, ETA e prazo pretendido são opcionais.

As ligações de cada serviço preservam a selecção através de `?servico=ship`, `?servico=crew`, `?servico=log`. A equipa recebe um e-mail de marca com assunto `Pedido de Cotação | Serviço | Empresa/Nome`, data e hora de Luanda, corpo HTML e texto, `Reply-To` do solicitante e referência única.

Quando ocorre erro, os dados permanecem preenchidos. Não há recurso a `mailto:` para submeter um pedido.

## 4. Antispam, segurança e duplicações

- Validação de campos no navegador **e no servidor**; sanitação dos cabeçalhos, escaping HTML para o e-mail e limite de 16 KB por pedido.
- Campo anti-bot oculto (honeypot), controlo da origem do pedido e limitação de **8 tentativas por hora por IP**, em memória.
- Identificador UUID por pedido e `Idempotency-Key` enviado à Resend; repetições do mesmo pedido não duplicam o envio quando a plataforma o suporta (janela de 24 h). Respostas do servidor não expõem credenciais.
- Nenhuma confirmação falsa de envio: mensagem de sucesso só após resposta positiva e ID da plataforma Resend.
- Credenciais apenas no ambiente do servidor. Cabeçalhos seguros em ficheiros estáticos.

**Para produção com várias instâncias:** substituir os contadores em memória por Redis ou serviço equivalente, adicionar Turnstile ou outro desafio antiautomação verificado no backend e configurar alertas/webhooks do fornecedor de e-mail. Os mecanismos actuais são uma primeira barreira, não uma solução definitiva contra tráfego automatizado distribuído.

## 5. Conteúdos e limites

- O logotipo dourado e as imagens marítimas da V2.0 foram preservados. As imagens marítimas são conceptuais, não fotografias documentais da empresa.
- Dados institucionais e política de privacidade requerem validação final antes de publicação pública.
- Não são fornecidas credenciais de e-mail nem acesso à caixa `comercial@wavelela.ao`; a recepção efectiva permanece **não testada**.
- A navegação e a responsividade originais foram mantidas. Testes automatizados de API e código incluídos; foi possível validar o formulário num navegador com renderização isolada em três larguras, mas a navegação directa e a verificação visual do site completo foram bloqueadas pelas políticas do ambiente.

Consulte `RELATORIO_COTACAO_V3.md`, `RELATORIO_TESTES.md` e `IMPLEMENTACAO.md`.

## 6. Pré-visualizações

A pasta `previews/` contém capturas V2 do website preservado e capturas **isoladas** do formulário V3 em três larguras (estas últimas são simulações do browser, não capturas de um site publicado).
