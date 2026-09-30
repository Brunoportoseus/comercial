import { GoogleAuth } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

const GA_DATA = "https://analyticsdata.googleapis.com/v1beta";
const GA_ADMIN = "https://analyticsadmin.googleapis.com/v1beta";
const GSC = "https://www.googleapis.com/webmasters/v3";
const GSC_INSPECT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

const auth = new GoogleAuth({ scopes: SCOPES });
let clientPromise;

export async function serviceAccountEmail() {
  const creds = await auth.getCredentials();
  return creds.client_email || "";
}

async function call(url, { method = "GET", data } = {}) {
  clientPromise ??= auth.getClient().catch((err) => {
    clientPromise = undefined;
    throw err;
  });
  const client = await clientPromise;
  try {
    const res = await client.request({ url, method, data });
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const apiMsg = err.response?.data?.error?.message || err.message;
    const e = new Error(apiMsg);
    e.status = status;
    throw e;
  }
}

const propertyPath = (id) => `properties/${String(id).replace(/^properties\//, "")}`;

export const ga = {
  accountSummaries: () => call(`${GA_ADMIN}/accountSummaries?pageSize=200`),
  metadata: (propertyId) => call(`${GA_DATA}/${propertyPath(propertyId)}/metadata`),
  runReport: (propertyId, body) =>
    call(`${GA_DATA}/${propertyPath(propertyId)}:runReport`, { method: "POST", data: body }),
  runRealtimeReport: (propertyId, body) =>
    call(`${GA_DATA}/${propertyPath(propertyId)}:runRealtimeReport`, { method: "POST", data: body }),
};

export const gsc = {
  sites: () => call(`${GSC}/sites`),
  searchAnalytics: (siteUrl, body) =>
    call(`${GSC}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, { method: "POST", data: body }),
  inspect: (siteUrl, inspectionUrl) =>
    call(GSC_INSPECT, { method: "POST", data: { siteUrl, inspectionUrl, languageCode: "pt-BR" } }),
};
