/**
 * Seed de DEMONSTRAÇÃO — Clube Studio Denise de Paula.
 * Todos os valores (preços, créditos, carências, benefícios) são EXEMPLOS,
 * marcados com isDemo=true, e devem ser revistos/ajustados pela administradora
 * no painel antes de ir ao ar. Nada aqui é oficial.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Comportamento: os PLANOS e PROCEDIMENTOS de exemplo (isDemo=true) são
  // atualizados a cada deploy para refletir os valores deste arquivo. Assim que
  // a administradora finaliza um item e desmarca "dado de exemplo" no painel
  // (isDemo=false), ele deixa de ser sobrescrito. Usuários, assinatura demo,
  // FAQ, depoimentos e textos legais só são criados se ainda não existirem.
  console.log("→ Seeding / atualizando dados de exemplo…");

  // ── Usuários ────────────────────────────────────────────────
  const adminPass = await bcrypt.hash("admin123", 10);
  const clientPass = await bcrypt.hash("cliente123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "denise@studio.exemplo" },
    update: {},
    create: {
      name: "Denise de Paula (Admin)",
      email: "denise@studio.exemplo",
      passwordHash: adminPass,
      role: "ADMIN",
      city: "Curitiba",
      state: "PR",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "cliente@exemplo.com" },
    update: {},
    create: {
      name: "Maria Aparecida (Exemplo)",
      email: "cliente@exemplo.com",
      passwordHash: clientPass,
      role: "CLIENT",
      cpf: "000.000.000-00",
      phone: "(41) 90000-0000",
      whatsapp: "5541900000000",
      birthDate: new Date("1978-08-15"),
      city: "Curitiba",
      state: "PR",
      acceptedMarketing: true,
      termsAcceptedAt: new Date(),
      termsVersion: "1.0",
    },
  });

  // ── Procedimentos (exemplos) ────────────────────────────────
  const procedures = [
    {
      slug: "sobrancelhas-fio-a-fio",
      name: "Micropigmentação de sobrancelha",
      category: "SOBRANCELHAS",
      paymentMode: "FULL_CREDITS",
      creditCost: 500,
      priceCents: 69000,
      description: "Técnica de fios naturais para sobrancelhas harmônicas.",
      sortOrder: 1,
    },
    {
      slug: "micropigmentacao-labial",
      name: "Micropigmentação dos lábios",
      category: "LABIAL",
      paymentMode: "FULL_CREDITS",
      creditCost: 700,
      priceCents: 79000,
      description: "Realce natural do contorno e cor dos lábios.",
      sortOrder: 2,
    },
    {
      slug: "delineado-olhos",
      name: "Micro contorno dos olhos",
      category: "OLHOS",
      paymentMode: "FULL_CREDITS",
      creditCost: 450,
      priceCents: 59000,
      description: "Delineado sutil que valoriza o olhar.",
      sortOrder: 3,
    },
    {
      slug: "remocao-laser",
      name: "Remoção a laser",
      category: "CORRECAO",
      paymentMode: "FULL_CREDITS",
      creditCost: 300,
      priceCents: 30000,
      description: "Remoção de micropigmentação a laser, mediante avaliação.",
      sortOrder: 4,
    },
    {
      slug: "correcao-micropigmentacao",
      name: "Correção",
      category: "CORRECAO",
      paymentMode: "FULL_CREDITS",
      creditCost: 500,
      priceCents: 89000,
      description: "Correção de trabalhos anteriores, mediante avaliação.",
      sortOrder: 5,
    },
    {
      slug: "design-sobrancelhas",
      name: "Design de sobrancelha",
      category: "DESIGN",
      paymentMode: "FULL_CREDITS",
      creditCost: 50,
      priceCents: 12000,
      description: "Design personalizado com mapeamento facial.",
      sortOrder: 6,
    },
  ];

  // Desativa procedimentos de exemplo que saíram da tabela (ex.: retoque).
  await prisma.procedure.updateMany({
    where: { isDemo: true, slug: { notIn: procedures.map((p) => p.slug) } },
    data: { active: false },
  });

  const procMap: Record<string, string> = {};
  for (const p of procedures) {
    const existing = await prisma.procedure.findUnique({ where: { slug: p.slug } });
    let rec = existing;
    if (!existing) {
      rec = await prisma.procedure.create({ data: { ...p, isDemo: true } });
    } else if (existing.isDemo) {
      // Só atualiza enquanto for "dado de exemplo".
      rec = await prisma.procedure.update({ where: { slug: p.slug }, data: { ...p } });
    }
    procMap[p.slug] = rec!.id;
  }

  // ── Planos (exemplos) ───────────────────────────────────────
  const plans = [
    {
      slug: "essencial",
      name: "Essencial",
      tagline: "Para manter o cuidado em dia.",
      monthlyPriceCents: 9900,
      creditsPerCycle: 99,
      recommended: false,
      minCommitmentMonths: 3,
      gracePeriodDays: 30,
      creditValidityDays: 365,
      maxAccumulatedCredits: 1200,
      discountPercent: 10,
      sortOrder: 1,
      benefits: [
        "Pontos mensais acumuláveis para resgatar procedimentos",
        "Descontos exclusivos em procedimentos e procedimentos estéticos para membros do Clube",
        "Benefício no mês do aniversário",
        "Acesso antecipado à agenda e campanhas",
      ],
      rulesText: "Carência de 30 dias. Permanência mínima de 3 meses. Pontos válidos por 12 meses.",
      procedures: ["design-sobrancelhas", "retoque-manutencao", "sobrancelhas-fio-a-fio"],
    },
    {
      slug: "exclusivo",
      name: "Exclusivo",
      tagline: "O favorito de quem quer previsibilidade.",
      monthlyPriceCents: 19900,
      creditsPerCycle: 199,
      recommended: true,
      minCommitmentMonths: 6,
      gracePeriodDays: 30,
      creditValidityDays: 540,
      maxAccumulatedCredits: 2400,
      discountPercent: 15,
      sortOrder: 2,
      benefits: [
        "Mais pontos por mês para resgatar procedimentos",
        "Descontos exclusivos em procedimentos e procedimentos estéticos para membros do Clube",
        "Prioridade no agendamento",
        "Avaliação personalizada",
        "Benefício especial de aniversário",
      ],
      rulesText: "Carência de 30 dias. Permanência mínima de 6 meses. Pontos válidos por 18 meses.",
      procedures: [
        "design-sobrancelhas",
        "retoque-manutencao",
        "sobrancelhas-fio-a-fio",
        "delineado-olhos",
      ],
    },
    {
      slug: "premium",
      name: "Premium",
      tagline: "Cuidado completo, do olhar aos lábios.",
      monthlyPriceCents: 34900,
      creditsPerCycle: 349,
      recommended: false,
      minCommitmentMonths: 6,
      gracePeriodDays: 15,
      creditValidityDays: 730,
      maxAccumulatedCredits: 0,
      discountPercent: 20,
      sortOrder: 3,
      benefits: [
        "Maior quantidade de pontos, sem teto de acúmulo",
        "Descontos exclusivos em procedimentos e procedimentos estéticos para membros do Clube",
        "Pontos válidos para sobrancelhas, lábios e olhos",
        "Condições especiais para correção",
        "Atendimento prioritário",
        "Benefício exclusivo de aniversário",
        "Transferência de 1 benefício para convidada (mediante autorização)",
      ],
      rulesText: "Carência de 15 dias. Permanência mínima de 6 meses. Pontos válidos por 24 meses.",
      procedures: Object.keys(procMap),
    },
  ];

  const planMap: Record<string, string> = {};
  for (const pl of plans) {
    const { procedures: procSlugs, benefits, ...rest } = pl;
    const data = { ...rest, benefits: JSON.stringify(benefits) };

    const existing = await prisma.plan.findUnique({ where: { slug: pl.slug } });
    let rec = existing;
    if (!existing) {
      rec = await prisma.plan.create({ data: { ...data, isDemo: true } });
    } else if (existing.isDemo) {
      rec = await prisma.plan.update({ where: { slug: pl.slug }, data });
    }
    planMap[pl.slug] = rec!.id;

    // Elegibilidade — só (re)define enquanto for "dado de exemplo".
    if (!existing || existing.isDemo) {
      await prisma.planProcedure.deleteMany({ where: { planId: rec!.id } });
      for (const slug of procSlugs) {
        await prisma.planProcedure.create({
          data: { planId: rec!.id, procedureId: procMap[slug] },
        });
      }
    }
  }

  // ── Assinatura + créditos de exemplo p/ a cliente demo ──────
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: client.id },
  });
  if (!existingSub) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const sub = await prisma.subscription.create({
      data: {
        userId: client.id,
        planId: planMap["exclusivo"],
        status: "ACTIVE",
        gateway: "simulation",
        gatewaySubscriptionId: "sim_demo",
        startedAt: now,
        currentPeriodEnd: periodEnd,
        nextBillingAt: periodEnd,
      },
    });

    await prisma.payment.create({
      data: {
        userId: client.id,
        subscriptionId: sub.id,
        amountCents: 19900,
        status: "APPROVED",
        gateway: "simulation",
        gatewayPaymentId: "sim_pay_demo",
        method: "CREDIT_CARD",
        paidAt: now,
      },
    });

    // Dois ciclos de créditos (para demonstrar acúmulo e histórico)
    const exp = new Date();
    exp.setDate(exp.getDate() + 540);
    await prisma.creditTransaction.create({
      data: {
        userId: client.id,
        type: "EARN",
        amount: 199,
        balanceAfter: 199,
        reason: "Créditos do ciclo da assinatura",
        expiresAt: exp,
        subscriptionId: sub.id,
      },
    });
    await prisma.creditTransaction.create({
      data: {
        userId: client.id,
        type: "EARN",
        amount: 199,
        balanceAfter: 398,
        reason: "Créditos do ciclo da assinatura",
        expiresAt: exp,
        subscriptionId: sub.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: client.id,
        type: "PAYMENT",
        title: "Pagamento aprovado ✓",
        body: "Sua assinatura do plano Exclusivo está ativa.",
      },
    });
  }

  // ── FAQ ─────────────────────────────────────────────────────
  const faqs = [
    ["Como funciona o clube?", "Você escolhe um plano, paga uma mensalidade e recebe créditos e benefícios para usar em procedimentos e serviços do Studio, sempre com avaliação profissional."],
    ["Quando posso utilizar meus créditos?", "Após o período de carência do seu plano e mediante avaliação profissional que confirme a indicação do procedimento."],
    ["Os créditos acumulam?", "Sim. Os créditos são acumuláveis e possuem prazo de validade e, em alguns planos, um teto de acúmulo — tudo indicado no plano."],
    ["Existe carência?", "Sim, cada plano tem um período de carência configurado para o início do uso dos créditos."],
    ["Posso cancelar?", "Sim. Respeitando a permanência mínima do plano e a política de cancelamento, você pode solicitar o cancelamento pela área da cliente."],
    ["O que acontece com meus créditos se eu cancelar?", "Depende da política vigente do plano. Por padrão de exemplo, os créditos permanecem válidos até o vencimento; regras finais são definidas pelo Studio."],
    ["Posso transferir meus benefícios?", "Alguns planos permitem transferir um benefício específico para uma convidada, sempre mediante autorização do Studio."],
    ["O retoque está incluído?", "Retoques e manutenções podem estar incluídos ou ter condição especial, conforme o plano contratado."],
    ["Como funciona o agendamento?", "Você solicita pela área da cliente escolhendo datas de preferência. O Studio confirma, sugere outro horário ou solicita avaliação."],
    ["O procedimento depende de avaliação?", "Sim. Ter créditos não autoriza automaticamente o procedimento. Tudo depende de avaliação profissional e do intervalo adequado da pele."],
    ["O que acontece se eu faltar?", "A política de faltas e cancelamentos de agenda define eventuais consequências, informadas no regulamento do clube."],
    ["Como funciona a cobrança recorrente?", "A mensalidade é cobrada automaticamente pelo gateway de pagamento. Você pode atualizar o cartão ou cancelar pela área da cliente."],
  ];
  // Só popula FAQ/depoimentos se ainda não houver (não sobrescreve edições).
  if ((await prisma.faq.count()) === 0) {
    for (let i = 0; i < faqs.length; i++) {
      await prisma.faq.create({
        data: { question: faqs[i][0], answer: faqs[i][1], sortOrder: i },
      });
    }
  }

  // ── Depoimentos (exemplos) ──────────────────────────────────
  const testimonials = [
    ["Regina S.", "Curitiba/PR", "Resultado super natural e atendimento acolhedor. Adorei poder pagar aos poucos.", 5],
    ["Cláudia M.", "Curitiba/PR", "Me senti segura em cada etapa. A avaliação antes do procedimento fez toda a diferença.", 5],
    ["Sônia R.", "São José dos Pinhais/PR", "Sobrancelhas perfeitas e sem exageros. Recomendo de olhos fechados.", 5],
  ];
  if ((await prisma.testimonial.count()) === 0) {
    for (let i = 0; i < testimonials.length; i++) {
      const [author, city, quote, rating] = testimonials[i];
      await prisma.testimonial.create({
        data: { author: author as string, city: city as string, quote: quote as string, rating: rating as number, sortOrder: i },
      });
    }
  }

  // ── Documentos legais (rascunhos de exemplo) ────────────────
  const legal = [
    ["termos", "Termos de Uso"],
    ["regulamento", "Regulamento do Clube"],
    ["privacidade", "Política de Privacidade"],
    ["cancelamento", "Política de Cancelamento"],
    ["agendamento", "Política de Agendamento e Faltas"],
    ["lgpd", "Consentimento LGPD"],
  ];
  for (const [slug, title] of legal) {
    await prisma.legalDocument.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title,
        version: "1.0",
        content:
          `**${title}** — texto de exemplo (rascunho).\n\n` +
          "Este é um documento provisório para demonstração. O conteúdo jurídico " +
          "final deve ser redigido/revisado por profissional e cadastrado pelo Studio. " +
          "Os procedimentos de micropigmentação dependem sempre de avaliação profissional, " +
          "respeitando o intervalo adequado, a condição da pele e as necessidades individuais " +
          "da cliente.",
      },
    });
  }

  // ── Cupom de exemplo ────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "BEMVINDA" },
    update: {},
    create: { code: "BEMVINDA", discountPercent: 10, active: true },
  });

  console.log("✓ Seed concluído.");
  console.log("  Admin:   denise@studio.exemplo / admin123");
  console.log("  Cliente: cliente@exemplo.com / cliente123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
