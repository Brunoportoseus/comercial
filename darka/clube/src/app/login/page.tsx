import Link from "next/link";
import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado visual */}
      <aside className="hidden lg:flex relative bg-darka-brand-green text-white overflow-hidden flex-col p-10 justify-between">
        <div className="absolute inset-0 opacity-50"
             style={{ background: "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(255,255,255,.18) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(0,0,0,.3) 0%, transparent 60%)" }} />
        <div className="relative">
          <Link href="/"><Logo variant="light" size="lg" /></Link>
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display font-extrabold text-4xl leading-tight">
            Seu trabalho merece <span className="text-accent">reconhecimento.</span>
          </h1>
          <p className="text-white/70 mt-4">
            Acesse seu painel, acompanhe seus pontos e descubra novas oportunidades
            no Clube do Pintor Darka.
          </p>
        </div>
        <div className="relative spectrum-strip h-1" />
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h2 className="font-display font-extrabold text-3xl">Entrar no Clube</h2>
          <p className="text-muted mt-1.5">Bem-vindo de volta!</p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
