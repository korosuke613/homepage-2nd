import '@/components/Animation.css';

import type { ReactNode } from 'react';

import { GradientText } from '@/components/GradientText';
import { Section } from '@/components/Section';

import { ExternalLink } from '../components/ExternalLink';
import { SocialLinks } from './SocialLinks';

type ISelfIntroductionProps = {
  children: ReactNode;
};

export const SelfIntroduction = (props: ISelfIntroductionProps) => {
  return (
    <Section>
      <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
        <div>
          <h1 className="hidden text-3xl font-bold md:block">
            Hi there, I'm <GradientText>Futa Hirakoba</GradientText> 👋
          </h1>

          <div className="flex flex-row justify-between md:hidden md:gap-x-24">
            {/* スマホ表示用 */}
            <h1 className="text-3xl font-bold">
              Hi there, <br />
              I'm <GradientText>Futa Hirakoba</GradientText> 👋
            </h1>
            <div className="h-20 w-20" id="my-icon-small">
              {props.children}
            </div>
          </div>

          <p className="mt-6 text-xl leading-9">
            すべての開発者の生産性を向上したいソフトウェアエンジニアです。
            <ExternalLink
              title="サイボウズ株式会社"
              url="https://cybozu.co.jp/"
            ></ExternalLink>
            で働いています。CI/CD、IaC、Public Cloud 周りの技術が好きです。
          </p>

          <div className="mt-3 flex flex-wrap gap-1">
            {import.meta.env.PROD && (
              <img
                alt="アクセスカウンター"
                src="https://visitor-badge.glitch.me/badge?page_id=korosuke613.dev.visitor-badge&left_text=You%20are&left_color=Indigo&right_color=DarkSlateGray"
                loading="lazy"
                height={20}
                width={83}
              />
            )}
            <SocialLinks />
          </div>
        </div>

        <div className="hidden shrink-0 md:block">
          <div className="h-72 w-72" id="my-icon-large">
            {props.children}
          </div>
        </div>
      </div>
    </Section>
  );
};
