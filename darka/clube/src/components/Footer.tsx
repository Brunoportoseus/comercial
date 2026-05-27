import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <footer className="bg-darka-brand-green text-white/85 mt-16">
      <div className="spectrum-strip" />
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" size="md" />
          <p className="text-sm text-white/65 mt-4 max-w-sm">
            O Clube do Pintor Darka valoriza quem transforma ambientes todos os dias.
            Ganhe pontos, participe de cursos e conquiste benefícios exclusivos.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-white mb-3">Programa</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#como-funciona" className="hover:text-darka-yellow">Como funciona</Link></li>
            <li><Link href="/#beneficios" className="hover:text-darka-yellow">Benefícios</Link></li>
            <li><Link href="/regras" className="hover:text-darka-yellow">Regras do clube</Link></li>
            <li><Link href="/cadastro" className="hover:text-darka-yellow">Cadastre-se</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-white mb-3">Suporte</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/regras" className="hover:text-darka-yellow">Termos de uso</Link></li>
            <li><Link href="/regras" className="hover:text-darka-yellow">Política de privacidade</Link></li>
            <li><a href="https://wa.me/" className="hover:text-darka-yellow">WhatsApp da Darka</a></li>
            <li><a href="https://tintasdarka.wscommerce.com.br/" className="hover:text-darka-yellow">Loja virtual</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <span>© {new Date().getFullYear()} Tintas Darka — Seu mundo em cores. Todos os direitos reservados.</span>
          <a
            href="https://webstorm.com.br/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-white transition"
            aria-label="Desenvolvido por Webstorm"
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              Desenvolvido por
            </span>
            {/* Logo Webstorm em pequeno, com filtro para ficar branca no fundo verde */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${base}/logo-webstorm.svg`}
              alt="Webstorm"
              height={22}
              style={{
                height: "22px",
                width: "auto",
                filter: "brightness(0) invert(1)",
                opacity: 0.85,
              }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
