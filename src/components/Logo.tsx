import type { ReactNode } from 'react';

type ILogoProps = {
  icon: ReactNode;
  name: string;
};

const Logo = (props: ILogoProps) => (
  <div className="flex items-center bg-gradient-to-br from-violet-600 to-fuchsia-400 bg-clip-text text-xl font-bold text-transparent">
    {props.icon}
    &nbsp; {/* 半角スペース */}
    {props.name}
  </div>
);

export { Logo };
