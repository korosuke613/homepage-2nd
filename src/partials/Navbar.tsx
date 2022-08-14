import { Logo } from '@/components/Logo';
import { NavbarTwoColumns, NavMenu, NavMenuItem } from '@/components/Navbar';
import { Section } from '@/components/Section';

const Navbar = () => (
  <Section>
    <NavbarTwoColumns>
      <a href="/">
        <Logo icon={<>💪</>} name="korosuke613" />
      </a>

      <NavMenu>
        <NavMenuItem href="/posts">Posts</NavMenuItem>
        <NavMenuItem href="/projects">Projects</NavMenuItem>
        <NavMenuItem href="https://github.com/korosuke613">GitHub</NavMenuItem>
        <NavMenuItem href="https://twitter.com/shitimi_613">
          Twitter
        </NavMenuItem>
      </NavMenu>
    </NavbarTwoColumns>
  </Section>
);

export { Navbar };
