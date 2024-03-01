import type { ReactNode } from "react";

type ILogoProps = {
  icon: ReactNode;
  name: string;
};

export const Logo: React.FC<ILogoProps> = ({ icon, name }) => (
  <div className="flex items-center bg-gradient-to-br from-violet-600 to-fuchsia-400 bg-clip-text text-xl font-bold text-transparent">
    {icon}
    &nbsp; {/* 半角スペース */}
    {name}
  </div>
);
