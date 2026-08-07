import type {
  PaymentGateway,
  CreateSubscriptionInput,
  CreateSubscriptionResult,
} from "./types";

/**
 * Adaptador Mercado Pago (assinaturas / preapproval).
 * Usa a API REST via fetch para evitar dependência pesada. O token vem de
 * MP_ACCESS_TOKEN (sandbox ou produção). NUNCA exponha o token no frontend.
 *
 * Docs: https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post
 */
const MP_API = "https://api.mercadopago.com";

export class MercadoPagoGateway implements PaymentGateway {
  readonly name = "mercadopago";
  constructor(private readonly accessToken: string) {}

  private headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResult> {
    const body = {
      reason: `Clube Studio Denise de Paula — ${input.planName}`,
      external_reference: input.subscriptionId,
      payer_email: input.payerEmail,
      back_url: input.backUrl,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number((input.amountCents / 100).toFixed(2)),
        currency_id: "BRL",
      },
      status: "pending",
    };

    const res = await fetch(`${MP_API}/preapproval`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Mercado Pago: falha ao criar assinatura (${res.status}) ${detail}`);
    }

    const data = (await res.json()) as {
      id: string;
      init_point?: string;
      sandbox_init_point?: string;
    };

    return {
      gateway: this.name,
      gatewaySubscriptionId: data.id,
      checkoutUrl: data.init_point || data.sandbox_init_point,
      autoApproved: false, // aprovação chega via webhook
    };
  }

  async cancelSubscription(gatewaySubscriptionId: string): Promise<void> {
    await fetch(`${MP_API}/preapproval/${gatewaySubscriptionId}`, {
      method: "PUT",
      headers: this.headers(),
      body: JSON.stringify({ status: "cancelled" }),
    });
  }
}
