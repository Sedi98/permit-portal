const apiBaseUrlValue = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrlValue) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
}

const apiBaseUrl = new URL(apiBaseUrlValue);
const normalizedApiBaseUrl = apiBaseUrl.toString().replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${normalizedApiBaseUrl}/${path.replace(/^\//, "")}`;
}

export function backendAssetUrl(path: string) {
  const sourceUrl = new URL(path, `${apiBaseUrl.origin}/`);
  return new URL(
    `${sourceUrl.pathname}${sourceUrl.search}${sourceUrl.hash}`,
    `${apiBaseUrl.origin}/`,
  ).toString();
}
