# WAVELELA — Análise de desvios V1.0 → V2.0

**Referência:** proposta visual aprovada (homepage marítima em azul-marinho e dourado), identidade original fornecida pelo cliente e funcionalidades da V1.0.

| Dimensão | Evidência observada na V1.0 | Acção concretizada na V2.0 | Validação |
|---|---|---|---|
| Hero | Recorte de 520 × 306 px extraído do mockup, ampliado sobre um hero até 1440 px | Fotografia conceptual independente de 1672 × 941 px e recorte mobile próprio | Ficheiros e renderização verificados |
| Cartões de serviços | Recortes de cerca de 250 × 125 px | Três fotografias independentes a 1280 × 853 px, optimizadas em WebP | Imagens carregadas a 1440/768/390/320 px |
| Cobertura | Recorte ilustrativo Luanda de 260 × 94 px, ampliado | Ilustração vectorial responsiva com Luanda como base, sem representar uma fotografia verdadeira | Renderizada em quatro larguras |
| Logotipo | Wordmark raster pequeno repetido ao lado do texto de navegação | Marca gráfica extraída do logotipo submetido; wordmark recomposto com tipografia; favicon próprio | Renderizado em desktop e mobile |
| Botões | CTAs genéricos e links próximos nos cartões | Gradiente dourado, bordas e alturas consistentes, foco/hover/active; segundo CTA de cotação por serviço | Href verificados; acções de formulário conservadas |
| Hierarquia | Títulos e espaçamentos desiguais entre secções | Titulagem editorial, áreas de respiro e grelhas organizadas | Capturas desktop/tablet/mobile |
| Responsividade | Breakpoints existentes sem revisão visual | Regras actualizadas para 1100, 820, 550 e 370 px e hero dedicado no mobile | Zero overflow em 1440/768/390/320 px |
| Navegação e idiomas | Funcional | Preservada; menu acessível fecha com Escape e aria-expanded actualizado | Interacção testada no navegador isolado |
| FAQ e formulário | FAQ funcional; envio dependente de API | Funcionalidades preservadas; estados e foco aperfeiçoados | Navegador isolado + testes de backend; entrega real pendente |

## Decisões de concepção

- Identidade preservada: azul-marinho (`#0e2335`) e dourado (`#c9a862`), derivados visualmente da proposta e da marca fornecida, não extração colorimétrica oficial.
- Fotografias geradas para fins **conceptuais**, não são registos da equipa, navios, clientes ou operações efectivas da WAVELELA.
- O mapa de Angola é **esquemático, não georreferenciado**. A empresa não está a afirmar cobertura automática de todos os portos.
- A versão anterior não foi apagada: o ZIP da V1.0 entregue anteriormente mantém-se independente.

## Limitações e pendências

1. Fotografias operacionais oficiais autorizadas, caso se pretenda representar a actividade real da empresa.
2. Validação final da marca vectorial e dos códigos cromáticos oficiais pela empresa.
3. Configuração de `RESEND_API_KEY`, `MAIL_FROM` e `MAIL_TO`, com teste real de recepção antes de anunciar envio automático.
4. Aprovação dos contactos e enquadramento jurídico da política de privacidade.
5. Testes em dispositivos físicos, Safari/Firefox e auditoria WCAG 2.2 AA completa; os testes de renderização efectuados usaram Chromium isolado sem navegação de rede.
