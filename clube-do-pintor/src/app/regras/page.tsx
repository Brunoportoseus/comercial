import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "Como participar",
    body: "O Clube do Pintor Darka é gratuito e voltado a pintores profissionais maiores de 18 anos. Para participar, basta realizar seu cadastro informando dados pessoais, profissionais e aceitar os termos do programa.",
  },
  {
    title: "Como ganhar pontos",
    body: "Você acumula pontos comprando produtos participantes nas lojas Darka físicas e online, participando de treinamentos e ações do clube, indicando clientes e produtos, e completando ações sugeridas (atualização cadastral, pesquisas, campanhas).",
  },
  {
    title: "Como usar pontos",
    body: "Os pontos podem ser trocados por brindes, ferramentas, uniformes, vouchers, treinamentos avançados e experiências exclusivas. O resgate é feito diretamente pela área 'Prêmios' do portal e tem prazo de processamento de até 15 dias úteis.",
  },
  {
    title: "Validade dos pontos",
    body: "Os pontos têm validade de 12 meses a contar da data de creditação. Notificaremos você previamente quando houver pontos prestes a expirar para que possam ser utilizados.",
  },
  {
    title: "Regras dos vouchers",
    body: "Cada voucher possui regras específicas (valor mínimo, produtos elegíveis, validade). Vouchers não são cumulativos com outras promoções, salvo quando indicado expressamente, e são pessoais e intransferíveis.",
  },
  {
    title: "Regras de resgate",
    body: "Os resgates não podem ser convertidos em dinheiro. A entrega de prêmios físicos é realizada no endereço cadastrado, com prazo médio de 10 a 20 dias úteis. Prêmios sujeitos à disponibilidade de estoque.",
  },
  {
    title: "Política de cancelamento",
    body: "Você pode cancelar sua participação no clube a qualquer momento via área 'Perfil'. O cancelamento implica a perda dos pontos acumulados e benefícios não utilizados.",
  },
  {
    title: "Termos de uso",
    body: "A Tintas Darka se reserva o direito de alterar a mecânica do programa, regras e benefícios mediante comunicação prévia aos participantes. O uso indevido do programa pode resultar em suspensão ou cancelamento da conta.",
  },
  {
    title: "Privacidade",
    body: "Os dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD). Utilizamos suas informações apenas para operar o programa, personalizar comunicações e melhorar a experiência. Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.",
  },
];

export default function RegrasPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.16em] uppercase text-primary">
          <span className="w-6 h-px bg-primary" /> Documentos
        </span>
        <h1 className="font-display font-extrabold text-3xl lg:text-4xl mt-3">Regras do Clube do Pintor Darka</h1>
        <p className="text-muted mt-3">Conheça em detalhes como o programa funciona.</p>

        <div className="mt-10 space-y-5">
          {sections.map((s, i) => (
            <article key={s.title} className="rounded-2xl bg-surface border border-black/5 p-5">
              <h2 className="font-display font-bold text-lg flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-brand-gradient text-white text-xs font-extrabold flex items-center justify-center">
                  {i + 1}
                </span>
                {s.title}
              </h2>
              <p className="text-sm text-muted mt-3 leading-relaxed">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-secondary text-white p-6 text-center">
          <p className="text-white/70 text-sm">Dúvidas sobre o programa?</p>
          <a href="https://wa.me/" className="inline-block mt-3 px-5 py-3 rounded-xl bg-accent text-secondary font-extrabold">
            Falar no WhatsApp da Darka
          </a>
        </div>

        <p className="text-xs text-muted text-center mt-8">
          <Link href="/" className="hover:text-primary">← Voltar ao início</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
