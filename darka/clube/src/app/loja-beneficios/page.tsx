import DashboardLayout from "@/components/DashboardLayout";
import ProductBenefitCard from "@/components/ProductBenefitCard";
import { mockBenefitProducts, mockVouchers } from "@/data/mock";

export default function LojaBeneficiosPage() {
  return (
    <DashboardLayout
      title="Loja & descontos"
      subtitle="Produtos com preço exclusivo para membros do Clube do Pintor Darka."
      rightSlot={
        <a
          href="https://tintasdarka.wscommerce.com.br/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-gradient hover:shadow-glow"
        >
          Ir para a loja virtual
        </a>
      }
    >
      {/* Banner de cupons rápidos */}
      <section className="rounded-3xl bg-secondary text-white p-6 lg:p-7 mb-8 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
        <div>
          <h3 className="font-display font-extrabold text-xl">Você tem {mockVouchers.length} cupons ativos</h3>
          <p className="text-white/70 text-sm mt-1">Use no checkout da loja virtual para garantir o desconto.</p>
        </div>
        <a href="/vouchers" className="px-4 py-2.5 rounded-xl bg-accent text-secondary font-extrabold text-sm hover:brightness-110 text-center">
          Ver meus vouchers
        </a>
      </section>

      <h3 className="font-display font-bold text-lg mb-4">Produtos com benefício</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockBenefitProducts.map((p) => <ProductBenefitCard key={p.id} product={p} />)}
      </div>

      <section className="mt-10 rounded-2xl bg-surface border border-black/5 p-6">
        <h3 className="font-display font-bold">Como aplicar seus benefícios</h3>
        <ol className="mt-3 space-y-2 text-sm text-muted list-decimal list-inside">
          <li>Acesse a loja virtual da Darka e faça login com o mesmo CPF do clube.</li>
          <li>O preço de membro será aplicado automaticamente nos produtos elegíveis.</li>
          <li>No carrinho, você ainda pode aplicar vouchers ativos para descontos adicionais.</li>
          <li>Ao finalizar a compra, os pontos são creditados automaticamente em até 48h.</li>
        </ol>
      </section>
    </DashboardLayout>
  );
}
