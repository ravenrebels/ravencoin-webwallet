import brandPackJson from "./brand.config.json";
import localPromoConfigJson from "./promo.config.json";

const raw: any = brandPackJson;

export function mediaUrl(ref: string): string {
  const value = String(ref || "").trim();

  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  if (/^ipfs:\/\//i.test(value)) {
    return "https://dweb.link/ipfs/" + value.replace(/^ipfs:\/\//i, "").replace(/^\/+/, "");
  }

  if (/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]+|bafk[a-z0-9]+|bafz[a-z0-9]+)/i.test(value)) {
    return "https://dweb.link/ipfs/" + value;
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

function makeDemoAssets(mainAsset: string, launchAsset: string): Record<string, number> {
  const demo: Record<string, number> = {};
  demo[mainAsset] = 1;

  const sampleChildren: string[] = raw.assetTree?.sampleChildren || [
    mainAsset + "/REWARDS",
    mainAsset + "/REWARDS/POINTS",
    mainAsset + "/REWARDS/VIP",
    mainAsset + "/SWAPS",
    mainAsset + "/SWAPS/CREDITS",
    mainAsset + "/ACCESS",
    mainAsset + "/BADGES",
    launchAsset
  ];

  sampleChildren.forEach((assetName) => {
    demo[assetName] = demoAmount(assetName);
  });

  return demo;
}


function normalizePromoConfig(input: any, fallback: any = {}) {
  const rawPromo = input?.promo || input || {};
  const merged = {
    ...fallback,
    ...rawPromo
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
    updatedAt: merged.updatedAt || ""
  };
}

function cleanHexColor(value: string, fallback: string): string {
  const rawValue = String(value || "").trim();
  const cleaned = rawValue.replace(/^#+/, "#");

  if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
    return cleaned;
  }

  return fallback;
}

const brand = raw.brand || {};
const embeddedPromo = brand.promo || {};
const localPromo = normalizePromoConfig(localPromoConfigJson, embeddedPromo);
const promo = localPromo;
const promoConfigRef = raw.promoConfigRef || brand.promoConfigRef || "";
const mainAsset = raw.mainAsset || raw.assetTree?.root || "MAIN_ASSET";
const brandLaunchAsset = raw.brandLaunchAsset || raw.assetTree?.brandLaunchAsset || mainAsset + "/BRAND";

export const walletBrand = {
  raw,
  name: brand.name || brand.communityName || "Community Wallet",
  poweredBy: raw.poweredBy || "RVN and Raven Rebels",
  mainAsset,
  brandLaunchAsset,
  promoConfigRef,
  logoRef: brand.logoRef || brand.logoUrl || "",
  logoUrl: mediaUrl(brand.logoRef || brand.logoUrl || ""),
  bannerRef: brand.bannerRef || brand.bannerUrl || "",
  bannerUrl: mediaUrl(brand.bannerRef || brand.bannerUrl || ""),
  primaryColor: cleanHexColor(brand.primaryColor, "#f59e0b"),
  accentColor: cleanHexColor(brand.accentColor, "#ff7a18"),
  ctas: brand.ctas || [],
  promo: normalizePromoConfig(promo, embeddedPromo),
  walletPreview: {
    buttons: raw.walletPreview?.buttons || ["Home", "Receive", "Send", "Sign", "Sweep", "History"],
    backendAnnouncement: raw.walletPreview?.backendAnnouncement || "3 incoming transactions since last opened",
    txSinceLastOpened: (raw.walletPreview?.txSinceLastOpened || []).map((tx: any) => ({
      ...tx,
      txidShort: shortTxid(tx.txid)
    }))
  },
  demoAssetTree: true,
  demoAssets: makeDemoAssets(mainAsset, brandLaunchAsset)
};


export function applyWalletBrandCssVars() {
  if (typeof document === "undefined") return;

  document.documentElement.style.setProperty("--rr-brand-primary", walletBrand.primaryColor);
  document.documentElement.style.setProperty("--rr-brand-accent", walletBrand.accentColor);
}

applyWalletBrandCssVars();
