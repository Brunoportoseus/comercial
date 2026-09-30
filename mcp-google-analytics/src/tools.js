import * as z from "zod";
import { ga, gsc, serviceAccountEmail } from "./google.js";

const DEFAULT_PROPERTY = process.env.GA4_PROPERTY_ID || "";
const DEFAULT_SITE = process.env.GSC_SITE_URL || "";
const TZ = process.env.REPORT_TIMEZONE || "America/Sao_Paulo";
const MAX_ROWS = 1000;

const READ_ONLY = { readOnlyHint: true, openWorldHint: true };

const text = (t) => ({ content: [{ type: "text", text: t }] });

async function fail(err) {
  if (err.local) return { content: [{ type: "text", text: err.message }], isError: true };
  let msg = `Erro da API do Google${err.status ? ` (HTTP ${err.status})` : ""}: ${err.message}`;
  if (err.status === 403 || err.status === 401) {
    const email = await serviceAccountEmail().catch(() => "");
    msg +=
      `\n\nVerifique se a conta de serviço${email ? ` ${email}` : ""} foi adicionada como usuária ` +
      "(Leitor no GA4 / usuário no Search Console) e se as APIs estão ativadas no Google Cloud.";
  }
  return { content: [{ type: "text", text: msg }], isError: true };
}

function requireValue(value, envName, label) {
  if (value) return value;
  throw Object.assign(new Error(`Informe ${label} ou defina ${envName} no .env do servidor.`), { local: true });
}

function toTable(headers, rows) {
  if (!rows.length) return "(nenhuma linha)";
  const esc = (v) => String(v ?? "").replace(/\|/g, "\\|");
  return [
    `| ${headers.map(esc).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`),
  ].join("\n");
}

function gaReportToText(data) {
  const dims = (data.dimensionHeaders || []).map((h) => h.name);
  const mets = (data.metricHeaders || []).map((h) => h.name);
  const rows = (data.rows || []).map((r) => [
    ...(r.dimensionValues || []).map((v) => v.value),
    ...(r.metricValues || []).map((v) => v.value),
  ]);
  const out = [toTable([...dims, ...mets], rows)];
  if (data.totals?.[0]?.metricValues) {
    out.push(`\nTotais: ${mets.map((m, i) => `${m}=${data.totals[0].metricValues[i]?.value}`).join(", ")}`);
  }
  out.push(`\nLinhas: ${rows.length}${data.rowCount != null ? ` de ${data.rowCount}` : ""}`);
  return out.join("\n");
}

// "today", "yesterday", "7daysAgo" ou YYYY-MM-DD → YYYY-MM-DD no fuso do relatório
function resolveDate(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const fmt = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
  const ago = value === "today" ? 0 : value === "yesterday" ? 1 : Number((value.match(/^(\d+)daysAgo$/) || [])[1]);
  if (!Number.isFinite(ago)) throw Object.assign(new Error(`Data inválida: ${value}`), { local: true });
  return fmt(new Date(Date.now() - ago * 86400000));
}

const dateField = (def) =>
  z.string().default(def).describe('Data: "YYYY-MM-DD", "today", "yesterday" ou "NdaysAgo" (ex.: "28daysAgo").');

const FILTER_OPS = ["contains", "equals", "notContains", "notEquals", "includingRegex", "excludingRegex"];

export function registerTools(server) {
  server.registerTool(
    "ga4_list_properties",
    {
      title: "Listar propriedades do GA4",
      description: "Lista as contas e propriedades do Google Analytics 4 que a conta de serviço consegue ler, com os IDs.",
      annotations: READ_ONLY,
    },
    async () => {
      try {
        const data = await ga.accountSummaries();
        const rows = [];
        for (const acc of data.accountSummaries || []) {
          for (const p of acc.propertySummaries || []) {
            rows.push([acc.displayName, p.displayName, p.property.replace("properties/", "")]);
          }
        }
        return text(toTable(["Conta", "Propriedade", "ID"], rows));
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "ga4_run_report",
    {
      title: "Relatório do GA4",
      description:
        "Roda um relatório do Google Analytics 4 (Data API). Exemplos de dimensões: date, pagePath, " +
        "sessionSource, sessionMedium, sessionDefaultChannelGroup, sessionCampaignName, deviceCategory, city, eventName. " +
        "Exemplos de métricas: sessions, activeUsers, newUsers, screenPageViews, engagementRate, " +
        "averageSessionDuration, eventCount, keyEvents, conversions. Use ga4_list_fields para ver todas.",
      inputSchema: {
        property_id: z.string().optional().describe("ID numérico da propriedade GA4. Padrão: GA4_PROPERTY_ID."),
        start_date: dateField("28daysAgo"),
        end_date: dateField("yesterday"),
        dimensions: z.array(z.string()).max(9).default([]).describe("Nomes de dimensões do GA4."),
        metrics: z.array(z.string()).min(1).max(10).describe("Nomes de métricas do GA4."),
        filter_dimension: z.string().optional().describe("Dimensão a filtrar (ex.: pagePath, eventName)."),
        filter_value: z.string().optional().describe("Valor do filtro."),
        filter_match: z
          .enum(["EXACT", "CONTAINS", "BEGINS_WITH", "ENDS_WITH", "FULL_REGEXP"])
          .default("CONTAINS")
          .describe("Tipo de comparação do filtro."),
        order_by: z.string().optional().describe("Métrica ou dimensão para ordenar (decrescente). Padrão: 1ª métrica."),
        limit: z.number().int().min(1).max(MAX_ROWS).default(50),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      try {
        const propertyId = requireValue(a.property_id || DEFAULT_PROPERTY, "GA4_PROPERTY_ID", "property_id");
        const orderField = a.order_by || a.metrics[0];
        const body = {
          dateRanges: [{ startDate: a.start_date, endDate: a.end_date }],
          dimensions: a.dimensions.map((name) => ({ name })),
          metrics: a.metrics.map((name) => ({ name })),
          limit: a.limit,
          metricAggregations: ["TOTAL"],
          orderBys: [
            a.metrics.includes(orderField)
              ? { metric: { metricName: orderField }, desc: true }
              : { dimension: { dimensionName: orderField }, desc: true },
          ],
        };
        if (a.filter_dimension && a.filter_value) {
          body.dimensionFilter = {
            filter: {
              fieldName: a.filter_dimension,
              stringFilter: { matchType: a.filter_match, value: a.filter_value, caseSensitive: false },
            },
          };
        }
        const data = await ga.runReport(propertyId, body);
        return text(`Período: ${a.start_date} a ${a.end_date} · propriedade ${propertyId}\n\n${gaReportToText(data)}`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "ga4_realtime_report",
    {
      title: "Tempo real do GA4",
      description:
        "Usuários ativos nos últimos 30 minutos. Dimensões úteis: unifiedScreenName, city, deviceCategory, eventName. " +
        "Métricas: activeUsers, screenPageViews, eventCount, keyEvents.",
      inputSchema: {
        property_id: z.string().optional().describe("ID da propriedade GA4. Padrão: GA4_PROPERTY_ID."),
        dimensions: z.array(z.string()).max(4).default([]),
        metrics: z.array(z.string()).min(1).max(5).default(["activeUsers"]),
        limit: z.number().int().min(1).max(MAX_ROWS).default(20),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      try {
        const propertyId = requireValue(a.property_id || DEFAULT_PROPERTY, "GA4_PROPERTY_ID", "property_id");
        const data = await ga.runRealtimeReport(propertyId, {
          dimensions: a.dimensions.map((name) => ({ name })),
          metrics: a.metrics.map((name) => ({ name })),
          limit: a.limit,
          metricAggregations: ["TOTAL"],
        });
        return text(`Tempo real (últimos 30 min) · propriedade ${propertyId}\n\n${gaReportToText(data)}`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "ga4_list_fields",
    {
      title: "Dimensões e métricas do GA4",
      description: "Lista as dimensões e métricas disponíveis na propriedade (inclui eventos e dimensões personalizadas).",
      inputSchema: {
        property_id: z.string().optional().describe("ID da propriedade GA4. Padrão: GA4_PROPERTY_ID."),
        search: z.string().optional().describe("Filtra por trecho do nome (ex.: 'session', 'event', 'custom')."),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      try {
        const propertyId = requireValue(a.property_id || DEFAULT_PROPERTY, "GA4_PROPERTY_ID", "property_id");
        const data = await ga.metadata(propertyId);
        const q = (a.search || "").toLowerCase();
        const pick = (list, kind) =>
          (list || [])
            .filter((f) => !q || f.apiName.toLowerCase().includes(q) || (f.uiName || "").toLowerCase().includes(q))
            .map((f) => [kind, f.apiName, f.uiName || ""]);
        const rows = [...pick(data.dimensions, "dimensão"), ...pick(data.metrics, "métrica")];
        return text(toTable(["Tipo", "Nome na API", "Nome no GA4"], rows.slice(0, 400)));
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "gsc_list_sites",
    {
      title: "Listar sites do Search Console",
      description: "Lista as propriedades do Google Search Console que a conta de serviço consegue ler.",
      annotations: READ_ONLY,
    },
    async () => {
      try {
        const data = await gsc.sites();
        const rows = (data.siteEntry || []).map((s) => [s.siteUrl, s.permissionLevel]);
        return text(toTable(["Site", "Permissão"], rows));
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "gsc_search_performance",
    {
      title: "Desempenho na Pesquisa Google",
      description:
        "Cliques, impressões, CTR e posição média na busca do Google (Search Console). " +
        "Dimensões: query, page, date, country, device, searchAppearance. " +
        "Os dados do Search Console têm atraso de 2 a 3 dias.",
      inputSchema: {
        site_url: z
          .string()
          .optional()
          .describe('Propriedade, ex.: "sc-domain:terrenoscuritibaeregiao.com.br". Padrão: GSC_SITE_URL.'),
        start_date: dateField("28daysAgo"),
        end_date: dateField("3daysAgo"),
        dimensions: z
          .array(z.enum(["query", "page", "date", "country", "device", "searchAppearance"]))
          .max(3)
          .default(["query"]),
        search_type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).default("web"),
        filter_dimension: z.enum(["query", "page", "country", "device"]).optional(),
        filter_operator: z.enum(FILTER_OPS).default("contains"),
        filter_value: z.string().optional(),
        limit: z.number().int().min(1).max(MAX_ROWS).default(50),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      try {
        const siteUrl = requireValue(a.site_url || DEFAULT_SITE, "GSC_SITE_URL", "site_url");
        const startDate = resolveDate(a.start_date);
        const endDate = resolveDate(a.end_date);
        const body = { startDate, endDate, dimensions: a.dimensions, type: a.search_type, rowLimit: a.limit };
        if (a.filter_dimension && a.filter_value) {
          body.dimensionFilterGroups = [
            { filters: [{ dimension: a.filter_dimension, operator: a.filter_operator, expression: a.filter_value }] },
          ];
        }
        const data = await gsc.searchAnalytics(siteUrl, body);
        const rows = (data.rows || []).map((r) => [
          ...(r.keys || []),
          r.clicks,
          r.impressions,
          `${(r.ctr * 100).toFixed(1)}%`,
          r.position.toFixed(1),
        ]);
        const headers = [...a.dimensions, "cliques", "impressões", "CTR", "posição"];
        return text(`Período: ${startDate} a ${endDate} · ${siteUrl}\n\n${toTable(headers, rows)}`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "gsc_inspect_url",
    {
      title: "Inspecionar URL no Google",
      description: "Mostra se uma URL está indexada no Google, a última rastreação, a canônica escolhida e problemas.",
      inputSchema: {
        url: z.string().url().describe("URL completa da página."),
        site_url: z.string().optional().describe("Propriedade do Search Console. Padrão: GSC_SITE_URL."),
      },
      annotations: READ_ONLY,
    },
    async (a) => {
      try {
        const siteUrl = requireValue(a.site_url || DEFAULT_SITE, "GSC_SITE_URL", "site_url");
        const data = await gsc.inspect(siteUrl, a.url);
        const r = data.inspectionResult?.indexStatusResult || {};
        const lines = [
          `URL: ${a.url}`,
          `Veredito: ${r.verdict ?? "-"}`,
          `Cobertura: ${r.coverageState ?? "-"}`,
          `Indexação permitida: ${r.indexingState ?? "-"}`,
          `Robots.txt: ${r.robotsTxtState ?? "-"}`,
          `Última rastreação: ${r.lastCrawlTime ?? "-"}`,
          `Canônica declarada: ${r.userCanonical ?? "-"}`,
          `Canônica escolhida pelo Google: ${r.googleCanonical ?? "-"}`,
        ];
        if (data.inspectionResult?.inspectionResultLink) lines.push(`Ver no Search Console: ${data.inspectionResult.inspectionResultLink}`);
        return text(lines.join("\n"));
      } catch (e) {
        return fail(e);
      }
    },
  );
}
