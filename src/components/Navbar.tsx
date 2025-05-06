import path from "node:path";
import type { ReactNode } from "react";

import type { IExternalLinkProps } from "@/components/ExternalLink";
import { ExternalLink } from "@/components/ExternalLink";
import { AppConfig } from "@/utils/AppConfig";

type INavbarProps = {
  children: ReactNode;
};

export const NavbarTwoColumns = (props: INavbarProps) => (
  <div className="fixed top-0 left-0 right-0 bg-gray-900 z-50 py-2 md:py-4">
    <div className="mx-auto max-w-screen-lg w-full flex flex-col xs:flex-row xs:items-center xs:justify-between px-3">
      {props.children}
    </div>
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
  children: ReactNode;
};

export const NavMenuItem = (props: INavMenuItemProps) => (
  <li className="hover:text-white">
    <a href={path.join(AppConfig.base, props.href)}>{props.children}</a>
  </li>
);

export const NavMenuExternalLink = (props: IExternalLinkProps) => (
  <li className="hover:text-white">
    <ExternalLink url={props.url} noClass={true}>
      {props.children}
    </ExternalLink>
  </li>
);
