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
        <h1 className="hidden text-3xl font-bold md:block">
          Hi there, I'm <GradientText>Futa Hirakoba</GradientText> 👋
        </h1>

        <div className="flex flex-row justify-between md:hidden md:gap-x-24">
          {/* スマホ表示用 */}
          <h1 className="text-3xl font-bold">
            Hi there, <br />
            I'm <GradientText>Futa Hirakoba</GradientText> 👋
          </h1>
          <img
            className="h-20 w-20"
            src={path.join(AppConfig.base, '/assets/images/my_icon_2.png')}
            alt="Avatar image"
            loading="lazy"
          />
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
          <SocialLink
            url="https://github.com/korosuke613"
            imgSrc="/assets/images/shields_github.svg"
            alt="GitHub icon"
          />
          <SocialLink
            url="https://twitter.com/Shitimi_613"
            imgSrc="/assets/images/shields_twitter.svg"
            alt="Twitter icon"
          />
          <SocialLink
            url="https://www.facebook.com/futa.hirakoba.5"
            imgSrc="/assets/images/shields_facebook.svg"
            alt="Facebook icon"
          />
          <SocialLink
            url="https://www.instagram.com/kwlv613/"
            imgSrc="/assets/images/shields_instagram.svg"
            alt="Instagram icon"
          />
          <SocialLink
            url="https://korosuke613.hatenablog.com/"
            imgSrc="/assets/images/shields_blog.svg"
            alt="Blog icon"
          />
          <SocialLink
            url="https://zenn.dev/korosuke613"
            imgSrc="/assets/images/shields_zenn.svg"
            alt="Zenn icon"
          />
          <SocialLink
            url="http://qiita.com/Shitimi_613"
            imgSrc="/assets/images/shields_qiita.svg"
            alt="Qiita icon"
          />
          <SocialLink
            url="https://www.slideshare.net/FutaHirakoba/presentations"
            imgSrc="/assets/images/shields_slideshare.svg"
            alt="SlideShare icon"
          />
          <SocialLink
            url="https://speakerdeck.com/korosuke613"
            imgSrc="/assets/images/shields_speakerdeck.svg"
            alt="SpeakerDeck icon"
          />
          <SocialLink
            url="https://www.docswell.com/user/korosuke613"
            imgSrc="/assets/images/shields_docswell.svg"
            alt="Docswell icon"
          />
          {/* https://img.shields.io/static/v1?label=&message=Docswell&color=4B9FD6&style=flat&logoColor=white&logo=data:image/png;base64,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 */}

          {/* 
            アイコンの情報 https://simpleicons.org/
            以下のURLで得られるSVGを保存する
            https://img.shields.io/static/v1?label=&message=${サービス名}&color=${背景のカラーコード}&style=flat&logo=${サービス名}&logoColor=white
          */}
        </div>
      </div>

      <div className="hidden shrink-0 md:block">
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
