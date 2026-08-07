import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Criar conta" };

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  if (await getSession()) redirect(searchParams.next || "/dashboard");
  return <RegisterForm next={searchParams.next} />;
}
