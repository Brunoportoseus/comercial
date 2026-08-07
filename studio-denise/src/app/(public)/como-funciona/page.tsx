import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Entenda em etapas simples como funciona o clube de assinatura.",
};

const STEPS = [
  ["Escolha seu plano", "Compare os planos e selecione o que faz mais sentido para a sua rotina e orçamento."],
  ["Faça sua assinatura", "Crie sua conta, aceite o regulamento e conclua o pagamento recorrente com segurança."],
  ["Acumule créditos e benefícios", "A cada mensalidade você recebe créditos acumuláveis, além dos benefícios do plano."],
  ["Solicite uma avaliação", "Um procedimento só acontece após avaliação profissional que confirme a indicação."],
  ["Agende o procedimento", "Escolha datas de preferência; o Studio confirma, sugere outro horário ou pede avaliação."],
  ["Acompanhe tudo pela sua área", "Saldo, histórico, agendamentos e benefícios sempre à mão, no computador ou celular."],
];

export default function ComoFuncionaPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Passo a passo</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-secondary">Como funciona</h1>
        <p className="mt-3 text-muted">
          Da assinatura ao procedimento, com transparência e avaliação profissional em cada etapa.
        </p>
      </div>

      <ol className="mx-auto mt-12 max-w-3xl space-y-4">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="card flex gap-4 p-6">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold text-secondary">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-surface-2/70 p-6 text-sm text-text/80">
        <p className="font-semibold text-secondary">Sobre os créditos</p>
        <p className="mt-2">
          Exemplo: ao pagar R$ 99,00 no mês, você recebe 99 créditos na sua carteira. Ao acumular o
          necessário, pode solicitar um procedimento elegível. Os créditos têm validade e podem ter
          teto de acúmulo conforme o plano — e sua utilização sempre depende de avaliação
          profissional.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link href="/planos" className="btn-primary">
          Ver planos e assinar
        </Link>
      </div>
    </div>
  );
}
