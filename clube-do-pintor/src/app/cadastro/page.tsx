import Link from "next/link";
import Logo from "@/components/Logo";
import RegisterForm from "@/components/RegisterForm";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-black/5 bg-surface">
        <div className="spectrum-strip" />
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/"><Logo size="md" /></Link>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            Já tenho conta
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.16em] uppercase text-primary">
            <span className="w-6 h-px bg-primary" /> Cadastro
          </span>
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl leading-tight mt-3">
            Crie sua conta no Clube do Pintor Darka
          </h1>
          <p className="text-muted mt-2 max-w-xl">
            Em poucos passos você passa a fazer parte do programa e começa a acumular benefícios.
          </p>
        </div>

        <div className="rounded-3xl bg-surface border border-black/5 p-6 lg:p-8">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
