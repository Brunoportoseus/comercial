import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
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
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Tintas Darka — Seu mundo em cores. Todos os direitos reservados.
      </div>
    </footer>
  );
}
