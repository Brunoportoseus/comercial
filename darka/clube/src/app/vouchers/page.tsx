import DashboardLayout from "@/components/DashboardLayout";
import VoucherCard from "@/components/VoucherCard";
import { mockVouchers } from "@/data/mock";

export default function VouchersPage() {
  return (
    <DashboardLayout
      title="Vouchers de desconto"
      subtitle="Use os cupons abaixo na loja virtual da Darka ou diretamente nas lojas parceiras."
    >
      {mockVouchers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockVouchers.map((v) => <VoucherCard key={v.id} voucher={v} />)}
        </div>
      )}

      <section className="mt-10 rounded-3xl bg-surface border border-black/5 p-6">
        <h3 className="font-display font-bold mb-2">Como usar seus vouchers</h3>
        <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
          <li>Copie o código do voucher desejado.</li>
          <li>Acesse a loja virtual da Darka e adicione os produtos ao carrinho.</li>
          <li>Cole o código no campo de cupom durante o checkout.</li>
          <li>O desconto será aplicado automaticamente, respeitando as regras do voucher.</li>
        </ol>
      </section>
    </DashboardLayout>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl bg-surface border border-dashed border-black/15 py-16 text-center">
      <div className="text-4xl">🎟️</div>
      <h3 className="font-display font-bold text-lg mt-3">Nenhum voucher disponível</h3>
      <p className="text-muted text-sm mt-1">Continue acumulando pontos para receber novos cupons.</p>
    </div>
  );
}
