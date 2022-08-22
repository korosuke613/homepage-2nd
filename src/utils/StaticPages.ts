import type { MarkdownInstance } from 'astro';
import path from 'path';

import type { IProjectFrontmatter } from '@/types/IProjectFrontmatter';

import { AppConfig } from './AppConfig';

export type StaticPost =
  | MarkdownInstance<IProjectFrontmatter>
  | { frontmatter: IProjectFrontmatter; url: string };

export const DormitoryIntroduction = {
  frontmatter: {
    title: '宮崎大学国際交流宿舎の紹介（２０１７年版）',
    description: '宮崎大学の寮の一つ、国際交流宿舎を紹介するページです。',
    pubDate: '2017-08-21T00:00:00Z',
    order: 4,
    imgSrc: '/assets/images/dormitory/dormitory.webp',
    imgAlt: 'string',
    tags: ['Blog'],
    draft: false,
  },
  url: path.join(AppConfig.base, 'dormitory_introduction'), // src/pages からの相対パス
};
