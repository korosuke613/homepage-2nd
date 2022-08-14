import type { ReactNode } from 'react';

type INavbarProps = {
  children: ReactNode;
};

export const NavbarTwoColumns = (props: INavbarProps) => (
  <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
    {props.children}
  </div>
);

type INavMenuProps = {
  children: ReactNode;
};

export const NavMenu = (props: INavMenuProps) => (
  <nav>
    <ul className="flex gap-x-3 font-medium text-gray-200">{props.children}</ul>
  </nav>
);

type INavMenuItemProps = {
  href: string;
  children: string;
};

export const NavMenuItem = (props: INavMenuItemProps) => (
  <li className="hover:text-white">
    <a href={props.href}>{props.children}</a>
  </li>
);
