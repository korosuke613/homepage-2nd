import path from 'path';
import type { ReactNode } from 'react';

import type { IExternalLinkProps } from '@/partials/ExternalLink';
import { ExternalLink } from '@/partials/ExternalLink';
import { AppConfig } from '@/utils/AppConfig';

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
    <a href={path.join(AppConfig.base, props.href)}>{props.children}</a>
  </li>
);

export const NavMenuExternalLink = (props: IExternalLinkProps) => (
  <li className="hover:text-white">
    <ExternalLink
      title={props.title}
      url={props.url}
      noClass={true}
    ></ExternalLink>
  </li>
);
