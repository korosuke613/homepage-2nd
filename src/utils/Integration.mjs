/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import fs from 'node:fs';
import { unified } from 'unified';
import remarkFrontmatter from 'remark-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import yaml from 'yaml';
import glob from 'glob';

export const ColorTags = {
  SLATE: 'SLATE',
  GRAY: 'GRAY',
  ZINC: 'ZINC',
  NEUTRAL: 'NEUTRAL',
  STONE: 'STONE',
  RED: 'RED',
  ORANGE: 'ORANGE',
  AMBER: 'AMBER',
  YELLOW: 'YELLOW',
  LIME: 'LIME',
  GREEN: 'GREEN',
  EMERALD: 'EMERALD',
  TEAL: 'TEAL',
  CYAN: 'CYAN',
  SKY: 'SKY',
  BLUE: 'BLUE',
  INDIGO: 'INDIGO',
  VIOLET: 'VIOLET',
  PURPLE: 'PURPLE',
  FUCHSIA: 'FUCHSIA',
  PINK: 'PINK',
  ROSE: 'ROSE',
};

export const colorToClassMap = {
  [ColorTags.SLATE]: 'bg-slate-400 text-slate-900',
  [ColorTags.GRAY]: 'bg-gray-400 text-gray-900',
  [ColorTags.ZINC]: 'bg-zinc-400 text-zinc-900',
  [ColorTags.NEUTRAL]: 'bg-neutral-400 text-neutral-900',
  [ColorTags.STONE]: 'bg-stone-400 text-stone-900',
  [ColorTags.RED]: 'bg-red-400 text-red-900',
  [ColorTags.ORANGE]: 'bg-orange-400 text-orange-900',
  [ColorTags.AMBER]: 'bg-amber-400 text-amber-900',
  [ColorTags.YELLOW]: 'bg-yellow-400 text-yellow-900',
  [ColorTags.LIME]: 'bg-lime-400 text-lime-900',
  [ColorTags.GREEN]: 'bg-green-400 text-green-900',
  [ColorTags.EMERALD]: 'bg-emerald-400 text-emerald-900',
  [ColorTags.TEAL]: 'bg-teal-400 text-teal-900',
  [ColorTags.CYAN]: 'bg-cyan-400 text-cyan-900',
  [ColorTags.SKY]: 'bg-sky-400 text-sky-900',
  [ColorTags.BLUE]: 'bg-blue-400 text-blue-900',
  [ColorTags.INDIGO]: 'bg-indigo-400 text-indigo-900',
  [ColorTags.VIOLET]: 'bg-violet-400 text-violet-900',
  [ColorTags.PURPLE]: 'bg-purple-400 text-purple-900',
  [ColorTags.FUCHSIA]: 'bg-fuchsia-400 text-fuchsia-900',
  [ColorTags.PINK]: 'bg-pink-400 text-pink-900',
  [ColorTags.ROSE]: 'bg-rose-400 text-rose-900',
};

/**
 *
 * @param {Values<typeof ColorTags>[]} colors
 * @returns {string}
 */
const pickColor = (colors) => {
  const pickKey = Math.floor(Math.random() * colors.length);
  const color = colorToClassMap[colors[pickKey] || ColorTags.GRAY];
  colors.splice(pickKey, 1);

  return color;
};

const generateTags = (tagNames) => {
  const allColors = Object.values(ColorTags);

  /**
   * @type { import("../utils/Tag").Tags; }
   */
  const tags = {};

  // tagに一意のColorTagsを設定する
  // もしColorTagsが枯渇したら再度ColorTagsの中からcolorを渡す
  tagNames.forEach((tagName) => {
    if (allColors.length === 0) {
      tags[tagName] = pickColor(Object.values(ColorTags));
    } else {
      tags[tagName] = pickColor(allColors);
    }
  });

  return tags;
};

const getMarkdownData = async (pattern) => {
  const mdPaths = glob.sync(pattern);
  let tagNames = [];
  const years = [];
  for (const mdPath of mdPaths) {
    const rawFile = await fs.promises.readFile(mdPath, 'utf-8');
    const parser = await unified()
      .use(remarkParse)
      .use(remarkFrontmatter, [
        {
          type: 'yaml',
          marker: '-',
          anywhere: false, // ファイルの冒頭に Front Matter がある前提で探索する
        },
      ])
      .use(remarkExtractFrontmatter, {
        yaml: yaml.parse,
        name: 'frontMatter', // result.data 配下のキー名を決める
      })
      .use(remarkRehype)
      .use(rehypeStringify);

    const md = await parser.process(rawFile);
    if (md.data.frontMatter.draft === true) {
      // eslint-disable-next-line no-continue
      continue;
    }
    tagNames = tagNames.concat(md.data.frontMatter.tags);

    const year = new Date(md.data.frontMatter.pubDate).getFullYear();
    years.push(year);
  }

  const uniqTagNames = Array.from(new Set(tagNames));
  const uniqYears = Array.from(new Set(years));
  return {
    tags: generateTags(uniqTagNames),
    years: uniqYears,
  };
};

const getBlogData = async () => {
  const rawHatenaBlogJson = await fs.promises.readFile(
    './public/assets/hatena_blog.json',
    'utf-8'
  );

  /**
   * @type { import("../types/IHatena").HatenaJson; }
   */
  const hatenaBlogJson = JSON.parse(rawHatenaBlogJson);

  const rawZennJson = await fs.promises.readFile(
    './public/assets/zenn.json',
    'utf-8'
  );

  /**
   * @type { import("../types/IZenn").ZennJson; }
   */
  const zennJson = JSON.parse(rawZennJson);

  const articles = { ...hatenaBlogJson.articles, ...zennJson.articles };
  /** @type {string[]} */
  let tagNames = [];
  const years = [];
  Object.keys(articles).forEach((a) => {
    if (articles[a].category !== undefined) {
      tagNames = tagNames.concat(articles[a].category);
    }
    const year = new Date(articles[a].pubDate).getFullYear();
    years.push(year);
  });

  const uniqTagNames = Array.from(new Set(tagNames));
  const uniqYears = Array.from(new Set(years));

  const tags = generateTags(uniqTagNames);
  tags.Zenn = 'bg-sky-400 text-neutral-900';
  tags.Hatena = 'bg-rose-400 text-neutral-900';

  return { tags, years: uniqYears };
};

const setupData = async () => {
  const posts = await getMarkdownData('./src/pages/posts/**.md');
  const blogs = await getBlogData();

  if (!fs.existsSync('./build')) {
    await fs.promises.mkdir('./build');
  }
  await fs.promises.writeFile(
    './build/tags.json',
    JSON.stringify({ posts: posts.tags, blogs: blogs.tags }, null, 2)
  );

  await fs.promises.writeFile(
    './build/years.json',
    JSON.stringify({ posts: posts.years, blogs: blogs.years }, null, 2)
  );
};

function setupKorosuke() {
  /**
   * @type { import("astro").AstroIntegration;}
   */
  const integration = {
    name: 'setupKorosuke',
    hooks: {
      'astro:config:setup': async () => {
        await setupData();
      },
    },
  };
  return integration;
}

// eslint-disable-next-line import/prefer-default-export
export { setupKorosuke };
