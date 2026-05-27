import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: "red" | "orange" | "yellow" | "green" | "blue" | "purple";
}

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  red:    "from-[#ff3d4d]/90 to-[#ff8a3d]/90",
  orange: "from-[#ff8a3d]/90 to-[#ffd23d]/90",
  yellow: "from-[#ffd23d]/90 to-[#3ddc97]/90",
  green:  "from-[#3ddc97]/90 to-[#3da5ff]/90",
  blue:   "from-[#3da5ff]/90 to-[#a06bff]/90",
  purple: "from-[#a06bff]/90 to-[#ff3d4d]/90",
};

export default function BenefitCard({ icon, title, description, accent = "red" }: Props) {
  return (
    <div className="group rounded-2xl bg-surface border border-black/5 p-5 hover:shadow-soft hover:-translate-y-0.5 transition">
      <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center text-white bg-gradient-to-br ${accentMap[accent]} shadow-soft`}>
        {icon}
      </div>
      <h3 className="font-display text-base font-bold mt-4">{title}</h3>
      <p className="text-sm text-muted mt-1.5 leading-relaxed">{description}</p>
    </div>
  );
}
