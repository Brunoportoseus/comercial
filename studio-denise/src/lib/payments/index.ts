import type { PaymentGateway } from "./types";
import { SimulationGateway } from "./simulation";
import { MercadoPagoGateway } from "./mercadopago";

/**
 * Seleciona o gateway ativo. Se MP_ACCESS_TOKEN estiver configurado, usa o
 * Mercado Pago real; caso contrário, cai no modo simulação (demonstração).
 */
export function getGateway(): PaymentGateway {
  const token = process.env.MP_ACCESS_TOKEN?.trim();
  if (token) return new MercadoPagoGateway(token);
  return new SimulationGateway();
}

export * from "./types";
