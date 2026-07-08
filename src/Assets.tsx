import React from "react";
import { Wallet } from "@ravenrebels/ravencoin-jswallet";
import { getAssetBalanceIncludingMempool } from "./utils";
import { AssetName } from "./AssetName";
import networkInfo from "./networkInfo";
import { formatNumberWith8Decimals } from "./formatNumberWith8Decimals";
import { walletBrand, mediaUrl } from "./brandConfig";

const imageStyle = {
  maxWidth: "42px",
  maxHeight: "42px",
  borderRadius: "8px",
  marginRight: "8px",
  background: "white",
};

interface LinkToIPFSProps {
  wallet: Wallet;
  assetName: string;
}

interface IAssetData {
  ipfs_hash: string;
  assetName: string;
}

interface TreeNode {
  label: string;
  fullName: string;
  balance: number | null;
  children: Record<string, TreeNode>;
}

function createNode(label: string, fullName: string): TreeNode {
  return {
    label,
    fullName,
    balance: null,
    children: {},
  };
}


function promoStyle(promoOverride?: any): React.CSSProperties {
  const promo = promoOverride || walletBrand.promo || {};
  const graphicUrl = promo.graphicUrl || mediaUrl(promo.graphicRef);
  const tintAlpha = graphicUrl && promo.noTint ? 0 : graphicUrl ? 0.22 : 0.58;
  const tint = hexToRgba(promo.overlayColor, tintAlpha);

  if (graphicUrl) {
    return {
      backgroundImage: `linear-gradient(${tint}, ${tint}), url("${graphicUrl}")`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#0f172a",
      color: promo.textColor
    };
  }

  return {
    background: `linear-gradient(135deg, ${hexToRgba(promo.overlayColor, 0.34)}, rgba(0,0,0,.035))`,
    color: promo.textColor
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = String(hex || "").replace("#", "");
  if (clean.length !== 6) return `rgba(0,0,0,${alpha})`;

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

function buildAssetTree(assetBalances: Record<string, number>) {
  const root: Record<string, TreeNode> = {};

  Object.keys(assetBalances)
    .sort()
    .forEach((assetName) => {
      const balance = assetBalances[assetName];

      if (!assetName || balance === 0) {
        return;
      }

      const parts = assetName.split("/");
      let currentLevel = root;
      let currentFullName = "";

      parts.forEach((part, index) => {
        currentFullName = index === 0 ? part : currentFullName + "/" + part;

        if (!currentLevel[part]) {
          currentLevel[part] = createNode(part, currentFullName);
        }

        if (index === parts.length - 1) {
          currentLevel[part].balance = balance;
        }

        currentLevel = currentLevel[part].children;
      });
    });

  return root;
}


function normalizeRuntimePromo(raw: any) {
  const base: any = walletBrand.promo || {};
  const source: any =
    raw && raw.brand && raw.brand.promo ? raw.brand.promo :
    raw && raw.promo ? raw.promo :
    raw || {};

  const graphicRef =
    source.graphicRef ||
    source.graphicCid ||
    source.imageRef ||
    base.graphicRef ||
    "";

  const graphicUrl =
    source.graphicUrl ||
    source.imageUrl ||
    mediaUrl(graphicRef) ||
    "";

  return {
    ...base,
    ...source,
    active: source.active !== false,
    title: source.title || base.title || "",
    message: source.message || base.message || "",
    graphicRef,
    graphicUrl,
    overlayColor: source.overlayColor || base.overlayColor || "#000000",
    textColor: source.textColor || base.textColor || "#ffffff",
    noTint: source.noTint === true,
    showTextOverlay: source.showTextOverlay !== false,
    ctaLabel: source.ctaLabel || base.ctaLabel || "",
    ctaUrl: source.ctaUrl || base.ctaUrl || "",
    updatedAt: source.updatedAt || base.updatedAt || ""
  };
}

export function Assets({ wallet, assets, mempool }) {
  const allAssets = getAssetBalanceIncludingMempool(wallet, assets, mempool);
  const [open, setOpen] = React.useState<Record<string, boolean>>({});
  const [activePromo, setActivePromo] = React.useState(walletBrand.promo);

  React.useEffect(() => {
    const ref = walletBrand.promoConfigRef;
    if (!ref) return;

    const url = mediaUrl(ref) || ref;

    fetch(url, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        const nextPromo = normalizeRuntimePromo(data);
        setActivePromo(nextPromo);
      })
      .catch((error) => {
        setActivePromo(walletBrand.promo);
      });
  }, []);
  const [txOpen, setTxOpen] = React.useState(false);
  const [promoAdminOpen, setPromoAdminOpen] = React.useState(false);

  const filteredAssets: Record<string, number> = {};

  Object.keys(allAssets).forEach((assetName: string) => {
    if (assetName === wallet.baseCurrency) {
      return;
    }

    const balance = allAssets[assetName];

    if (balance === 0) {
      return;
    }

    filteredAssets[assetName] = balance;
  });

  let displayAssets = filteredAssets;
  let isDemoTree = false;

  if (Object.keys(displayAssets).length === 0 && walletBrand.demoAssetTree) {
    displayAssets = walletBrand.demoAssets;
    isDemoTree = true;
  }

  const tree = buildAssetTree(displayAssets);
  const assetCount = Object.keys(displayAssets).length;

  function toggle(fullName: string) {
    setOpen((current) => ({
      ...current,
      [fullName]: current[fullName] === false ? true : false,
    }));
  }

  return (
    <article className="dyov-rr-assets">
      <div className="dyov-rr-assets-head">
        <div>
          <h5>Assets / Tokens</h5>
          <small>{isDemoTree ? "Demo tree preview — no wallet assets found" : "Tree view from scanned wallet assets"}</small>
        </div>
        <strong>{assetCount}</strong>
      </div>

      <div
        className="dyov-rr-brand-hero"
        style={
          walletBrand.bannerUrl
            ? { backgroundImage: `linear-gradient(rgba(2,6,23,.42), rgba(2,6,23,.58)), url("${walletBrand.bannerUrl}")` }
            : {}
        }
        title={walletBrand.bannerRef}
      >
        <div className="dyov-rr-brand-hero-row">
          <div className="dyov-rr-brand-hero-logo">
            {walletBrand.logoUrl ? <img src={walletBrand.logoUrl} alt="" /> : walletBrand.name.charAt(0)}
          </div>
          <div className="dyov-rr-brand-hero-copy">
            <strong>{walletBrand.name}</strong>
            <span>{walletBrand.poweredBy}</span>
          </div>
        </div>

        {walletBrand.ctas && walletBrand.ctas.length > 0 && (
          <div className="dyov-rr-brand-hero-ctas">
            {walletBrand.ctas.map((cta, index) => (
              cta.url ? (
                <a key={index} href={cta.url} target="_blank" rel="noreferrer">
                  {cta.label}
                </a>
              ) : (
                <span key={index}>{cta.label}</span>
              )
            ))}
          </div>
        )}
      </div>

      <div className="dyov-rr-tx-line">
        <span>3 incoming transactions since last opened</span>
        <button type="button" onClick={() => setTxOpen(!txOpen)}>
          {txOpen ? "Hide" : "View"}
        </button>
      </div>

      {txOpen && (
        <div className="dyov-rr-tx-panel">
          {walletBrand.walletPreview.txSinceLastOpened.map((tx) => (
            <div className="dyov-rr-tx-row" key={tx.txid}>
              <strong>{tx.direction}</strong>
              <span>{tx.amount} {tx.asset}</span>
              <code>txid: {tx.txidShort}</code>
              <button type="button">Details</button>
            </div>
          ))}
        </div>
      )}

      <div className="dyov-rr-promo" style={promoStyle(activePromo)}>
        {activePromo.showTextOverlay && (
          <div>
            <strong>{activePromo.title}</strong>
            <span style={{ color: activePromo.textColor }}>{activePromo.message}</span>
          </div>
        )}
      </div>

      {assetCount === 0 ? (
        <p>No assets found in this wallet yet.</p>
      ) : (
        <div className="dyov-rr-asset-tree">
          {Object.keys(tree).map((key) => (
            <AssetTreeNode
              key={tree[key].fullName}
              node={tree[key]}
              wallet={wallet}
              depth={0}
              open={open}
              toggle={toggle}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function AssetTreeNode({
  node,
  wallet,
  depth,
  open,
  toggle,
}: {
  node: TreeNode;
  wallet: Wallet;
  depth: number;
  open: Record<string, boolean>;
  toggle: (fullName: string) => void;
}) {
  const childKeys = Object.keys(node.children).sort();
  const hasChildren = childKeys.length > 0;
  const isOpen = open[node.fullName] !== false;
  const hasBalance = node.balance !== null;

  return (
    <div className="dyov-rr-tree-group">
      <div
        className={[
          "dyov-rr-tree-row",
          hasChildren ? "has-children" : "leaf",
          depth === 0 ? "root" : "",
        ].join(" ")}
        style={{ paddingLeft: 12 + depth * 22 }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="dyov-rr-tree-toggle"
            onClick={() => toggle(node.fullName)}
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? "▾" : "▸"}
          </button>
        ) : (
          <span className="dyov-rr-tree-spacer">◆</span>
        )}

        <span className="dyov-rr-tree-folder">{hasChildren ? "📁" : ""}</span>

        <div className="dyov-rr-tree-name">
          {hasBalance ? (
            <LinkToIPFS wallet={wallet} assetName={node.fullName} />
          ) : (
            <strong>{node.fullName}</strong>
          )}
        </div>

        {hasBalance && (
          <span className="dyov-rr-tree-balance">
            {formatNumberWith8Decimals(node.balance || 0)}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div>
          {childKeys.map((key) => (
            <AssetTreeNode
              key={node.children[key].fullName}
              node={node.children[key]}
              wallet={wallet}
              depth={depth + 1}
              open={open}
              toggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LinkToIPFS({ wallet, assetName }: LinkToIPFSProps) {
  const [assetData, setAssetData] = React.useState<IAssetData | null>(null);

  React.useEffect(() => {
    let alive = true;

    wallet.rpc("getassetdata", [assetName]).then((data) => {
      if (alive) {
        setAssetData(data);
      }
    });

    return () => {
      alive = false;
    };
  }, [wallet, assetName]);

  if (assetData && assetData.ipfs_hash) {
    const url = "https://gateway.pinata.cloud/ipfs/" + assetData.ipfs_hash;
    const directImageURL = "https://dweb.link/ipfs/" + assetData.ipfs_hash;
    const imageURL = networkInfo[wallet.network].getThumbnailURL(assetName);

    return (
      <a
        href={url}
        target="asset"
        className="dyov-rr-asset-link"
        style={{ textDecoration: "none", color: "var(--pico-contrast)" }}
      >
        <img
          src={imageURL}
          data-direct-ipfs-src={directImageURL}
          data-fallback-attempted="0"
          style={imageStyle}
          onError={(event) => {
            const target = event.target as HTMLImageElement;
            const fallback = target.dataset.directIpfsSrc || "";

            if (target.dataset.fallbackAttempted !== "1" && fallback) {
              target.dataset.fallbackAttempted = "1";
              target.src = fallback;
              return;
            }

            target.style.display = "none";
          }}
        />
        <AssetName name={assetName} />
      </a>
    );
  }

  return (
    <span className="dyov-rr-asset-link">
      <span className="dyov-rr-asset-placeholder"></span>
      <AssetName name={assetName} />
    </span>
  );
}
