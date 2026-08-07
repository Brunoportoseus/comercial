import type {
  PaymentGateway,
  CreateSubscriptionInput,
  CreateSubscriptionResult,
} from "./types";

/**
 * Gateway de SIMULAÇÃO — usado quando não há credenciais do gateway real.
 * Permite demonstrar o fluxo de pagamento de ponta a ponta (o sistema
 * "permite o pagamento"), aprovando a assinatura imediatamente, sem
 * cobrar ninguém de verdade. Basta preencher MP_ACCESS_TOKEN para usar o
 * Mercado Pago real.
 */
export class SimulationGateway implements PaymentGateway {
  readonly name = "simulation";

  async createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResult> {
    return {
      gateway: this.name,
      gatewaySubscriptionId: `sim_${input.subscriptionId}`,
      autoApproved: true,
    };
  }

  async cancelSubscription(): Promise<void> {
    // Nada a fazer no modo simulação.
  }
}
