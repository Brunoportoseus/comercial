/** Contrato do gateway de pagamento — permite trocar de provedor sem tocar no app. */

export type CreateSubscriptionInput = {
  subscriptionId: string; // id interno
  planName: string;
  amountCents: number;
  payerEmail: string;
  payerName: string;
  backUrl: string; // p/ onde o cliente volta após pagar
};

export type CreateSubscriptionResult = {
  gateway: string;
  gatewaySubscriptionId: string;
  /** URL para redirecionar o cliente (checkout do gateway). Ausente no modo simulação. */
  checkoutUrl?: string;
  /** true quando o pagamento já pode ser considerado aprovado (modo simulação). */
  autoApproved: boolean;
};

export interface PaymentGateway {
  readonly name: string;
  createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResult>;
  cancelSubscription(gatewaySubscriptionId: string): Promise<void>;
}
