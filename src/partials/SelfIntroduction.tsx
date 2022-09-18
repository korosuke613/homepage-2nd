import path from 'path';

import { GradientText } from '@/components/GradientText';
import { Section } from '@/components/Section';
import { SocialLink } from '@/components/SocialLink';
import { AppConfig } from '@/utils/AppConfig';

import { ExternalLink } from '../components/ExternalLink';

export const SelfIntroduction = () => (
  <Section>
    <div className="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
      <div>
        <h1 className="text-3xl font-bold">
          Hi there, I'm <GradientText>Futa Hirakoba</GradientText> 👋
        </h1>

        <p className="mt-6 text-xl leading-9">
          すべての開発者の生産性を向上したいソフトウェアエンジニアです。
          <ExternalLink
            title="サイボウズ株式会社"
            url="https://cybozu.co.jp/"
          ></ExternalLink>
          で働いています。CI/CD、IaC、Public Cloud 周りの技術が好きです。
        </p>

        <div className="mt-3 flex gap-1">
          <SocialLink
            url="https://github.com/korosuke613"
            imgSrc="/assets/images/shields_github.svg"
            alt="GitHub icon"
          ></SocialLink>
          <SocialLink
            url="https://korosuke613.hatenablog.com/"
            imgSrc="/assets/images/shields_blog.svg"
            alt="Blog icon"
          ></SocialLink>
          <SocialLink
            url="https://zenn.dev/korosuke613"
            imgSrc="/assets/images/shields_zenn.svg"
            alt="Zenn icon"
          ></SocialLink>
          <SocialLink
            url="http://qiita.com/Shitimi_613"
            imgSrc="/assets/images/shields_qiita.svg"
            alt="Qiita icon"
          ></SocialLink>
          <SocialLink
            url="https://twitter.com/Shitimi_613"
            imgSrc="/assets/images/shields_twitter.svg"
            alt="Twitter icon"
          ></SocialLink>
          <SocialLink
            url="https://www.facebook.com/futa.hirakoba.5"
            imgSrc="/assets/images/shields_facebook.svg"
            alt="Facebook icon"
          ></SocialLink>
          <SocialLink
            url="https://www.instagram.com/kwlv613/"
            imgSrc="/assets/images/shields_instagram.svg"
            alt="Instagram icon"
          ></SocialLink>
          <div className="mb-10"></div>
        </div>
      </div>

      <div className="shrink-0">
        <img
          className="h-72 w-72"
          src={path.join(AppConfig.base, '/assets/images/my_icon_2.png')}
          alt="Avatar image"
          loading="lazy"
        />
      </div>
    </div>
  </Section>
);
