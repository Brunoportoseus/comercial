import type { BenefitProduct } from "@/types";

interface Props { product: BenefitProduct; }

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductBenefitCard({ product }: Props) {
  const discount = Math.round(
    ((product.priceOriginal - product.priceBenefit) / product.priceOriginal) * 100
  );

  return (
    <article className="rounded-2xl bg-surface border border-black/5 overflow-hidden flex flex-col hover:shadow-soft transition">
      <div className="relative aspect-square bg-surface-2 flex items-center justify-center">
        <ProductPlaceholder name={product.name} />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-primary text-white">
          -{discount}%
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-accent text-secondary">
          +{product.pointsBonus} pts
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-[10px] uppercase tracking-widest text-muted font-bold">{product.category}</div>
        <h3 className="font-display font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

        <div className="mt-2">
          <div className="text-xs text-muted line-through">{fmt(product.priceOriginal)}</div>
          <div className="font-display text-xl font-extrabold text-primary leading-none">
            {fmt(product.priceBenefit)}
          </div>
          <div className="text-[11px] text-muted mt-0.5">para membros do clube</div>
        </div>

        <a
          // TODO: integração — apontar para PDP da loja virtual Darka
          href="https://tintasdarka.wscommerce.com.br/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 w-full text-center px-3 py-2.5 rounded-lg text-xs font-bold bg-primary text-white hover:brightness-110 transition"
        >
          Ver produto
        </a>
      </div>
    </article>
  );
}

function ProductPlaceholder({ name }: { name: string }) {
  const letter = name.split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
      <defs>
        <linearGradient id={`pg-${letter}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a1220" />
          <stop offset="100%" stopColor="#ff8a3d" />
        </linearGradient>
      </defs>
      <rect x="20" y="10" width="60" height="80" rx="10" fill={`url(#pg-${letter})`} />
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Sora, Inter">
        {letter}
      </text>
    </svg>
  );
}
