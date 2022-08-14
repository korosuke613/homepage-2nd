import path from 'path';

import { Logo } from '@/components/Logo';
import { NavbarTwoColumns, NavMenu, NavMenuItem } from '@/components/Navbar';
import { Section } from '@/components/Section';
import { AppConfig } from '@/utils/AppConfig';

const Navbar = () => (
  <Section>
    <NavbarTwoColumns>
      <a href={path.join(AppConfig.base, '/')}>
        <Logo icon={<>💪</>} name="korosuke613" />
      </a>

      <NavMenu>
        <NavMenuItem href="projects">Projects</NavMenuItem>
        <NavMenuItem href="posts">Posts</NavMenuItem>
        <NavMenuItem href="blogs">Blogs</NavMenuItem>
        <NavMenuItem href="https://github.com/korosuke613">GitHub</NavMenuItem>
        <NavMenuItem href="https://twitter.com/shitimi_613">
          Twitter
        </NavMenuItem>
      </NavMenu>
    </NavbarTwoColumns>
  </Section>
);

export { Navbar };
