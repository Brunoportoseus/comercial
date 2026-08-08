/**
 * Passo de banco no build da Vercel.
 * - Normalmente: `prisma db push` (não destrutivo) — cria/atualiza tabelas.
 * - Se a variável de ambiente DB_RESET === "1": recria o banco do zero
 *   (--force-reset) e repovoa com os dados de exemplo atualizados.
 *
 * Use DB_RESET=1 apenas para uma repopulação pontual (quando NÃO há dados
 * reais). Depois REMOVA a variável para que os deploys seguintes nunca
 * apaguem dados.
 */
import { execSync } from "node:child_process";

const reset = process.env.DB_RESET === "1";
const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (reset) {
  console.log("⚠️  DB_RESET=1 → recriando o banco do zero (dados serão apagados).");
  run("npx prisma db push --force-reset --accept-data-loss --skip-generate");
} else {
  run("npx prisma db push --skip-generate");
}

try {
  run("npx tsx prisma/seed.ts");
} catch (e) {
  console.warn("Seed ignorado/falhou (seguindo o build):", e?.message || e);
}
