import brandPackJson from "./brand.config.json";
import localPromoConfigJson from "./promo.config.json";

const embeddedBrandPack: any = brandPackJson;

const BRAND_STORAGE_KEY = "rr-community-brand";
const BRAND_BASE_STORAGE_KEY = "rr-community-brand-base";
const DEFAULT_BRAND_BASE_URL =
  "https://dyov.io/community-wallet-brands/";

export function mediaUrl(ref: string): string {
  const value = String(ref || "").trim();

  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  if (/^ipfs:\/\//i.test(value)) {
    return (
      "https://ipfs.io/ipfs/" +
      value.replace(/^ipfs:\/\//i, "").replace(/^\/+/, "")
    );
  }

  if (
    /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]+|bafk[a-z0-9]+|bafz[a-z0-9]+)/i.test(
      value
    )
  ) {
    return "https://ipfs.io/ipfs/" + value;
  }

  return "";
}

function shortTxid(txid: string): string {
  const value = String(txid || "");

  if (value.length <= 12) return value;

  return value.slice(0, 4) + "..." + value.slice(-4);
}

function demoAmount(assetName: string): number {
  if (/\/POINTS$/i.test(assetName)) return 2500;
  if (/\/CREDITS$/i.test(assetName)) return 12;

  return 1;
}

function makeDemoAssets(
  rawPack: any,
  mainAsset: string,
  launchAsset: string
): Record<string, number> {
  const demo: Record<string, number> = {};

  demo[mainAsset] = 1;

  const sampleChildren: string[] =
    rawPack.assetTree?.sampleChildren || [
      mainAsset + "/REWARDS",
      mainAsset + "/REWARDS/POINTS",
      mainAsset + "/REWARDS/VIP",
      mainAsset + "/SWAPS",
      mainAsset + "/SWAPS/CREDITS",
      mainAsset + "/ACCESS",
      mainAsset + "/BADGES",
      launchAsset,
    ];

  sampleChildren.forEach((assetName) => {
    demo[assetName] = demoAmount(assetName);
  });

  return demo;
}

function cleanHexColor(value: string, fallback: string): string {
  const rawValue = String(value || "").trim();
  const cleaned = rawValue.replace(/^#+/, "#");

  if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
    return cleaned;
  }

  return fallback;
}

function normalizePromoConfig(input: any, fallback: any = {}) {
  const rawPromo = input?.promo || input || {};
  const merged = {
    ...fallback,
    ...rawPromo,
  };

  return {
    active: merged.active !== false,
    title: merged.title || "Community Promo",
    message: merged.message || "",
    graphicRef: merged.graphicRef || "",
    graphicUrl: mediaUrl(merged.graphicRef || merged.graphicUrl || ""),
    overlayColor: cleanHexColor(merged.overlayColor, "#000000"),
    textColor: cleanHexColor(merged.textColor, "#ffffff"),
    noTint: !!merged.noTint,
    showTextOverlay: merged.showTextOverlay !== false,
    ctaLabel: merged.ctaLabel || "",
    ctaUrl: merged.ctaUrl || "",
    updatedAt: merged.updatedAt || "",
  };
}

function buildWalletBrand(rawPack: any, useLocalPromo: boolean) {
  const raw = rawPack || {};
  const brand = raw.brand || {};
  const embeddedPromo = brand.promo || raw.promo || {};

  const promo = useLocalPromo
    ? normalizePromoConfig(localPromoConfigJson, embeddedPromo)
    : normalizePromoConfig(embeddedPromo, embeddedPromo);

  const promoConfigRef =
    raw.promoConfigRef || brand.promoConfigRef || "";

  const mainAsset =
    raw.mainAsset || raw.assetTree?.root || "MAIN_ASSET";

  const brandLaunchAsset =
    raw.brandLaunchAsset ||
    raw.assetTree?.brandLaunchAsset ||
    mainAsset + "/BRAND";

  return {
    raw,
    name:
      brand.name ||
      brand.communityName ||
      raw.communityName ||
      "Community Wallet",

    poweredBy:
      raw.poweredBy ||
      brand.poweredBy ||
      "RVN and Raven Rebels",

    mainAsset,
    brandLaunchAsset,
    promoConfigRef,

    logoRef: brand.logoRef || brand.logoUrl || "",
    logoUrl: mediaUrl(brand.logoRef || brand.logoUrl || ""),

    bannerRef: brand.bannerRef || brand.bannerUrl || "",
    bannerUrl: mediaUrl(brand.bannerRef || brand.bannerUrl || ""),

    primaryColor: cleanHexColor(
      brand.primaryColor,
      "#f59e0b"
    ),

    accentColor: cleanHexColor(
      brand.accentColor,
      "#ff7a18"
    ),

    ctas: Array.isArray(brand.ctas) ? brand.ctas : [],
    promo,

    walletPreview: {
      buttons:
        raw.walletPreview?.buttons || [
          "Home",
          "Receive",
          "Send",
          "Sign",
          "Sweep",
          "History",
        ],

      backendAnnouncement:
        raw.walletPreview?.backendAnnouncement ||
        "3 incoming transactions since last opened",

      txSinceLastOpened: (
        raw.walletPreview?.txSinceLastOpened || []
      ).map((tx: any) => ({
        ...tx,
        txidShort: shortTxid(tx.txid),
      })),
    },

    demoAssetTree:
      raw.demoAssetTree !== false &&
      raw.assetTree?.demoAssetTree !== false,

    demoAssets: makeDemoAssets(
      raw,
      mainAsset,
      brandLaunchAsset
    ),
  };
}

/*
 * Keep one exported object reference.
 *
 * Existing RR components already import walletBrand directly. Runtime
 * brands update this object in place, so Navigator, Login, Loader and
 * Assets continue using the same shared source without being rewritten.
 */
export const walletBrand: any = buildWalletBrand(
  embeddedBrandPack,
  true
);

export function applyWalletBrandCssVars() {
  if (typeof document === "undefined") return;

  document.documentElement.style.setProperty(
    "--rr-brand-primary",
    walletBrand.primaryColor
  );

  document.documentElement.style.setProperty(
    "--rr-brand-accent",
    walletBrand.accentColor
  );
}

function normalizeBaseUrl(value: string): string {
  const cleaned = String(value || "").trim();

  if (!cleaned) return DEFAULT_BRAND_BASE_URL;

  return cleaned.endsWith("/") ? cleaned : cleaned + "/";
}

function isDefaultBrandRequest(value: string): boolean {
  return /^(default|none|rr|raven-rebels)$/i.test(
    String(value || "").trim()
  );
}

export async function loadWalletBrandFromUrl(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);

  const explicitBrandUrl =
    params.get("brandUrl") || params.get("brand_url") || "";

  const requestedBrand =
    params.get("brand") ||
    localStorage.getItem(BRAND_STORAGE_KEY) ||
    "";

  if (!requestedBrand && !explicitBrandUrl) {
    applyWalletBrandCssVars();
    return false;
  }

  if (isDefaultBrandRequest(requestedBrand)) {
    localStorage.removeItem(BRAND_STORAGE_KEY);
    localStorage.removeItem(BRAND_BASE_STORAGE_KEY);
    applyWalletBrandCssVars();
    return false;
  }

  const requestedBase =
    params.get("brandBase") ||
    params.get("brand_base") ||
    localStorage.getItem(BRAND_BASE_STORAGE_KEY) ||
    DEFAULT_BRAND_BASE_URL;

  const baseUrl = normalizeBaseUrl(requestedBase);

  let brandUrl = explicitBrandUrl;

  if (!brandUrl && /^https?:\/\//i.test(requestedBrand)) {
    brandUrl = requestedBrand;
  }

  if (!brandUrl && requestedBrand) {
    brandUrl =
      baseUrl +
      encodeURIComponent(requestedBrand) +
      ".json";
  }

  if (!brandUrl) {
    applyWalletBrandCssVars();
    return false;
  }

  try {
    const response = await fetch(brandUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Brand request failed with HTTP " + response.status
      );
    }

    const remoteBrandPack = await response.json();

    if (
      !remoteBrandPack ||
      typeof remoteBrandPack !== "object"
    ) {
      throw new Error("Brand package is not a JSON object");
    }

    Object.assign(
      walletBrand,
      buildWalletBrand(remoteBrandPack, false)
    );

    applyWalletBrandCssVars();

    if (requestedBrand && !/^https?:\/\//i.test(requestedBrand)) {
      localStorage.setItem(
        BRAND_STORAGE_KEY,
        requestedBrand
      );

      localStorage.setItem(
        BRAND_BASE_STORAGE_KEY,
        baseUrl
      );
    }

    console.log(
      "RR community brand loaded:",
      requestedBrand || brandUrl
    );

    return true;
  } catch (error) {
    console.warn(
      "Unable to load requested RR community brand; using embedded fallback.",
      error
    );

    applyWalletBrandCssVars();
    return false;
  }
}

applyWalletBrandCssVars();
