import { getSetting } from "@/lib/settings";
import { StudioSettingsForm, CreditSettingsForm } from "@/components/admin/SettingsForms";

export default async function AdminConfiguracoesPage() {
  const [studio, credits] = await Promise.all([getSetting("studio"), getSetting("credits")]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-secondary">Configurações</h1>
        <p className="text-sm text-muted">
          Tudo que não deve ser fixo no código: dados do Studio e regras de crédito.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StudioSettingsForm studio={studio} />
        <CreditSettingsForm credits={credits} />
      </div>

      <div className="card p-6 text-sm text-muted">
        <p className="font-semibold text-secondary">Gateway de pagamento</p>
        <p className="mt-2">
          O gateway é configurado por variáveis de ambiente (nunca no frontend). Sem
          <code className="mx-1 rounded bg-surface-2 px-1">MP_ACCESS_TOKEN</code> o sistema opera em
          modo simulação (pagamento aprovado automaticamente para demonstração). Ao informar o token
          do Mercado Pago, os pagamentos passam a ser reais (sandbox ou produção).
        </p>
      </div>
    </div>
  );
}
