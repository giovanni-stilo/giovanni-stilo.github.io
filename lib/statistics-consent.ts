import { site } from "@/lib/site";

export const CONSENT_KEY = "site-statistics-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "statistics-consent-change";
export const PREFERENCES_EVENT = "open-statistics-preferences";
export const STATISTICS_SCRIPT_ID = "consented-statistics";

export type StatisticsChoice = { version: number; accepted: boolean; expiresAt: number };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function consentExpiry(now: number): number {
  const date = new Date(now);
  const day = date.getUTCDate();
  date.setUTCMonth(date.getUTCMonth() + 6, 1);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.getTime();
}

export function parseConsent(raw: string | null, now = Date.now()): StatisticsChoice | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const choice = value as Partial<StatisticsChoice>;
    if (choice.version !== CONSENT_VERSION || typeof choice.accepted !== "boolean" ||
        typeof choice.expiresAt !== "number" || !Number.isFinite(choice.expiresAt) ||
        choice.expiresAt <= now || choice.expiresAt > consentExpiry(now)) return null;
    return choice as StatisticsChoice;
  } catch {
    return null;
  }
}

// Storage failure must never fall back to a previously granted preference.
let unsavedChoice: string | undefined;

export function getConsentSnapshot(): string | null {
  try {
    const raw = unsavedChoice ?? window.localStorage.getItem(CONSENT_KEY);
    return parseConsent(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function disableStatistics() {
  Object.assign(window, { [`ga-disable-${site.gaId}`]: true });
  const domains = ["", ...window.location.hostname.split(".").map((_, i, parts) => parts.slice(i).join("."))];
  const paths = new Set(["/", ...window.location.pathname.split("/").map((_, i, parts) => parts.slice(0, i + 1).join("/") || "/")]);
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains) {
      for (const path of paths) {
        document.cookie = `${name}=; Max-Age=0; Path=${path};${domain ? ` Domain=${domain};` : ""} SameSite=Lax`;
      }
    }
  }
}

export function subscribeToConsent(notify: () => void): () => void {
  let timer: ReturnType<typeof setTimeout>;
  const refresh = () => {
    clearTimeout(timer);
    const choice = parseConsent(getConsentSnapshot());
    if (!choice?.accepted) {
      disableStatistics();
      // A loaded third-party tag cannot be reliably unloaded in place.
      if (unsavedChoice === undefined && document.getElementById(STATISTICS_SCRIPT_ID)) window.location.reload();
    }
    if (choice) timer = setTimeout(refresh, Math.min(choice.expiresAt - Date.now(), 2_147_483_647));
    notify();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      unsavedChoice = undefined;
      refresh();
    }
  };
  window.addEventListener(CONSENT_EVENT, refresh);
  window.addEventListener("storage", storageChanged);
  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", refresh);
  refresh();
  return () => {
    clearTimeout(timer);
    window.removeEventListener(CONSENT_EVENT, refresh);
    window.removeEventListener("storage", storageChanged);
    window.removeEventListener("focus", refresh);
    document.removeEventListener("visibilitychange", refresh);
  };
}

export function saveConsent(accepted: boolean): boolean {
  const choice: StatisticsChoice = { version: CONSENT_VERSION, accepted, expiresAt: consentExpiry(Date.now()) };
  let saved = true;
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
    unsavedChoice = undefined;
  } catch {
    try { window.localStorage.removeItem(CONSENT_KEY); } catch { /* Keep the current document opted out if storage is unavailable. */ }
    unsavedChoice = JSON.stringify({ ...choice, accepted: false });
    saved = false;
  }
  if (!accepted || !saved) disableStatistics();
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return saved;
}

export function enableStatistics() {
  const raw = getConsentSnapshot();
  const choice = parseConsent(raw);
  if (!choice?.accepted || document.getElementById(STATISTICS_SCRIPT_ID)) return;
  try {
    window.localStorage.setItem(CONSENT_KEY, raw!);
  } catch {
    saveConsent(false);
    return;
  }
  Object.assign(window, { [`ga-disable-${site.gaId}`]: false });
  window.dataLayer = window.dataLayer ?? [];
  const gtag: (...args: unknown[]) => void = function () {
    // Google’s command queue expects an arguments object, not an array message.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag = gtag;
  gtag("consent", "default", {
    analytics_storage: "granted", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  gtag("js", new Date());
  gtag("config", site.gaId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: Math.max(1, Math.floor((choice.expiresAt - Date.now()) / 1000)),
    cookie_update: false,
    cookie_path: "/",
    cookie_domain: window.location.hostname,
    cookie_flags: "SameSite=Lax;Secure",
  });
  const script = document.createElement("script");
  script.id = STATISTICS_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${site.gaId}`;
  document.head.append(script);
}
