import DashboardLayout from "@/components/DashboardLayout";
import ProgressLevel from "@/components/ProgressLevel";
import { mockPainter, mockPointHistory } from "@/data/mock";

const wayToEarn = [
  { t: "Compra de produtos participantes", d: "Pontos automáticos a cada compra registrada." },
  { t: "Participação em treinamentos",     d: "Cursos concedem entre 60 e 150 pontos." },
  { t: "Indicação de clientes",            d: "Convertida em vendas, gera pontos extras." },
  { t: "Indicação de produtos",            d: "Indique novidades para outros profissionais." },
  { t: "Campanhas promocionais",           d: "Ações sazonais com pontuação dobrada." },
  { t: "Atualização cadastral",            d: "Mantenha seus dados sempre completos." },
  { t: "Participação em pesquisas",        d: "Sua opinião vale pontos." },
];

export default function PontosPage() {
  const earnedThisMonth = mockPointHistory
    .filter(p => p.points > 0 && new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((s, p) => s + p.points, 0);
  const expiring = 120; // mock

  return (
    <DashboardLayout title="Meus pontos" subtitle="Acompanhe seu saldo, ganhos e histórico.">
      <div className="grid lg:grid-cols-3 gap-5">
        <Big label="Saldo atual" value={mockPainter.points.toLocaleString("pt-BR")} accent />
        <Big label="Acumulados no mês" value={`+${earnedThisMonth}`} />
        <Big label="Expirando em 30 dias" value={expiring.toString()} warning />
      </div>

      <div className="mt-6 rounded-3xl bg-surface border border-black/5 p-6">
        <h3 className="font-display font-bold mb-3">Progresso no clube</h3>
        <ProgressLevel painter={mockPainter} />
      </div>

      <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <section className="rounded-3xl bg-surface border border-black/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-black/5">
            <h3 className="font-display font-bold">Histórico de pontos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="text-left font-bold uppercase tracking-widest text-[10px] px-5 py-3">Data</th>
                  <th className="text-left font-bold uppercase tracking-widest text-[10px] px-5 py-3">Descrição</th>
                  <th className="text-right font-bold uppercase tracking-widest text-[10px] px-5 py-3">Pontos</th>
                  <th className="text-right font-bold uppercase tracking-widest text-[10px] px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {mockPointHistory.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 whitespace-nowrap text-muted">
                      {new Date(p.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3">{p.description}</td>
                    <td className={`px-5 py-3 text-right font-bold ${p.points >= 0 ? "text-success" : "text-danger"}`}>
                      {p.points > 0 ? "+" : ""}{p.points}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-3xl bg-surface border border-black/5 p-5">
          <h3 className="font-display font-bold mb-3">Como ganhar pontos</h3>
          <ul className="space-y-3">
            {wayToEarn.map((w) => (
              <li key={w.t} className="flex gap-3">
                <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-primary" />
                <div>
                  <div className="font-semibold text-sm">{w.t}</div>
                  <div className="text-xs text-muted">{w.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function Big({ label, value, accent, warning }: { label: string; value: string; accent?: boolean; warning?: boolean }) {
  return (
    <div className={[
      "rounded-3xl p-5 border",
      accent
        ? "bg-secondary text-white border-transparent"
        : warning
        ? "bg-warning/10 border-warning/20 text-text"
        : "bg-surface border-black/5",
    ].join(" ")}>
      <div className={`text-xs font-bold uppercase tracking-widest ${accent ? "text-white/65" : "text-muted"}`}>{label}</div>
      <div className={`font-display font-extrabold text-3xl lg:text-4xl mt-2 ${accent ? "" : warning ? "text-warning" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Aprovado": "bg-success/15 text-success",
    "Pendente": "bg-warning/15 text-warning",
    "Utilizado": "bg-black/5 text-muted",
    "Expirado": "bg-danger/15 text-danger",
  };
  return (
    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full ${map[status] || "bg-black/5 text-muted"}`}>
      {status}
    </span>
  );
}
