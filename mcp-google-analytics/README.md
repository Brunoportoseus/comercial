# MCP Google Analytics + Search Console

Servidor MCP próprio e gratuito que deixa o Claude **ler** os dados do Google Analytics 4 e do
Google Search Console do site. Ele só tem permissão de leitura: não altera nada nas contas do Google.

| Ferramenta | O que faz |
|---|---|
| `ga4_list_properties` | Lista as propriedades GA4 acessíveis e seus IDs |
| `ga4_run_report` | Relatório do GA4 (sessões, usuários, origens, páginas, conversões…) |
| `ga4_realtime_report` | Visitantes nos últimos 30 minutos |
| `ga4_list_fields` | Todas as dimensões e métricas disponíveis |
| `gsc_list_sites` | Lista as propriedades do Search Console |
| `gsc_search_performance` | Cliques, impressões, CTR e posição por busca, página, país ou aparelho |
| `gsc_inspect_url` | Mostra se uma URL está indexada no Google |

Há dois jeitos de usar:

- **A. No Claude Code do terminal da VM (recomendado).** Modo stdio. Não expõe nada na internet.
- **B. No claude.ai (navegador ou celular).** Modo HTTP, publicado com o Cloudflare Tunnel. É opcional.

---

## 1. Google Cloud: criar a conta de serviço (uma vez)

1. Acesse <https://console.cloud.google.com/> e crie um projeto, por exemplo `mcp-analytics`.
2. Em **APIs e serviços → Biblioteca**, ative as três APIs:
   - Google Analytics Data API
   - Google Analytics Admin API
   - Google Search Console API
3. Em **IAM e administrador → Contas de serviço → Criar conta de serviço**, crie uma conta com o nome `mcp-analytics`.
   Não é preciso dar nenhum papel no projeto.
4. Abra a conta criada → **Chaves → Adicionar chave → Criar nova chave → JSON**. Um arquivo `.json` vai ser baixado.
   Guarde esse arquivo com cuidado: ele é a senha de acesso aos dados.
5. Copie o e-mail da conta de serviço, algo como `mcp-analytics@mcp-analytics.iam.gserviceaccount.com`.

## 2. Dar acesso de leitura à conta de serviço

- **GA4:** Administrador → **Gerenciamento de acesso à propriedade** → **+** → cole o e-mail da conta de serviço → papel **Leitor**.
  Anote também o **ID da propriedade** (Administrador → Detalhes da propriedade). É um número, por exemplo `123456789`.
- **Search Console:** propriedade `terrenoscuritibaeregiao.com.br` → **Configurações → Usuários e permissões → Adicionar usuário** →
  cole o e-mail → permissão **Restrita**.

## 3. Instalar na VM Ubuntu (Oracle)

Pelo terminal da VM (SSH):

```bash
# Node 20 ou mais novo (confira com: node --version). Se não tiver:
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs

# Baixar o projeto (se o repositório já estiver clonado, use: git pull)
git clone https://github.com/Brunoportoseus/comercial.git ~/comercial
cd ~/comercial/mcp-google-analytics
npm ci --omit=dev

# Guardar a chave JSON fora do repositório, com acesso só do seu usuário
mkdir -p ~/.config/mcp-google-analytics
# Envie o arquivo do seu computador para a VM (rode no SEU computador, não na VM):
#   scp caminho/da/chave.json ubuntu@IP_DA_VM:~/.config/mcp-google-analytics/service-account.json
chmod 600 ~/.config/mcp-google-analytics/service-account.json
```

## A. Usar no Claude Code do terminal (recomendado)

Troque `123456789` pelo ID da sua propriedade GA4:

```bash
claude mcp add google-analytics --scope user \
  -e GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/mcp-google-analytics/service-account.json \
  -e GA4_PROPERTY_ID=123456789 \
  -e GSC_SITE_URL=sc-domain:terrenoscuritibaeregiao.com.br \
  -- node $HOME/comercial/mcp-google-analytics/src/server.js --stdio

claude mcp list      # deve mostrar google-analytics como conectado
```

Depois é só abrir o `claude` e pedir, por exemplo:

- "Quantas sessões o site teve nos últimos 28 dias, por origem/mídia?"
- "Quais páginas tiveram mais visualizações ontem?"
- "Quais buscas trouxeram impressões no Google este mês e em que posição?"
- "A página /curitiba/sierra-vista/ está indexada?"

## B. Usar no claude.ai com Cloudflare Tunnel (opcional)

1. No Cloudflare: **Zero Trust → Networks → Tunnels → Create a tunnel** (tipo *Cloudflared*). Dê o nome `mcp` e copie o **token**.
2. No túnel, em **Public Hostname**:
   - subdomínio `mcp`
   - domínio `terrenoscuritibaeregiao.com.br`
   - serviço **HTTP** → `mcp:8080`
3. Na VM, instale o Docker (`curl -fsSL https://get.docker.com | sh`) e rode:

   ```bash
   cd ~/comercial/mcp-google-analytics
   cp .env.example .env
   nano .env    # preencha GA4_PROPERTY_ID, MCP_SECRET_PATH (openssl rand -hex 24) e CLOUDFLARE_TUNNEL_TOKEN
   mkdir -p credentials && cp ~/.config/mcp-google-analytics/service-account.json credentials/
   sudo docker compose up -d --build
   curl -s https://mcp.terrenoscuritibaeregiao.com.br/healthz   # deve responder: ok
   ```

4. No claude.ai: **Configurações → Conectores → Adicionar conector personalizado**, com a URL
   `https://mcp.terrenoscuritibaeregiao.com.br/mcp/SEU_MCP_SECRET_PATH`.

O segredo no final da URL é o que protege o acesso: qualquer pessoa com essa URL consegue **ler** os relatórios.
Não compartilhe a URL. Se ela vazar, gere outro `MCP_SECRET_PATH`, rode `sudo docker compose up -d` e atualize o conector.

## Problemas comuns

- **HTTP 403 / "does not have sufficient permissions"**: o e-mail da conta de serviço não foi adicionado no GA4 ou no Search Console, ou
  a API correspondente não foi ativada no Google Cloud.
- **Search Console sem dados recentes**: os dados têm atraso de 2 a 3 dias. Por isso o período padrão termina 3 dias atrás.
- **Não foi possível criar a chave JSON**: algumas contas de empresa bloqueiam a criação de chaves. Com uma conta Google pessoal, funciona.
