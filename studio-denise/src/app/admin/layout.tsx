import { redirect } from "next/navigation";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";
import type { Role } from "@/lib/domain";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isStaff(user.role as Role)) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminNav name={user.name} role={user.role} />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8">{children}</main>
    </div>
  );
}
