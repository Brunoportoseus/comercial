import DashboardLayout from "@/components/DashboardLayout";
import ProfileForm from "@/components/ProfileForm";
import ProgressLevel from "@/components/ProgressLevel";
import { mockPainter, levelBenefits } from "@/data/mock";

export default function PerfilPage() {
  return (
    <DashboardLayout title="Meu perfil" subtitle="Atualize seus dados e preferências.">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <div>
          <ProfileForm painter={mockPainter} />
        </div>

        <aside className="rounded-3xl bg-secondary text-white p-6 sticky top-6">
          <div className="text-[10px] uppercase tracking-widest text-white/65 font-bold">Meu nível no clube</div>
          <h3 className="font-display font-extrabold text-3xl mt-1">{mockPainter.level}</h3>
          <p className="text-white/65 text-sm mt-1">
            {mockPainter.points.toLocaleString("pt-BR")} pontos acumulados
          </p>

          <div className="mt-5">
            <ProgressLevel painter={mockPainter} variant="onDark" />
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <h4 className="font-display font-bold text-sm mb-3">Benefícios do nível {mockPainter.level}</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {levelBenefits(mockPainter.level).map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-accent">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>

          {mockPainter.nextLevel && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <h4 className="font-display font-bold text-sm mb-3">Próximo nível — {mockPainter.nextLevel}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {levelBenefits(mockPainter.nextLevel).slice(-2).map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-darka-yellow">★</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </DashboardLayout>
  );
}
