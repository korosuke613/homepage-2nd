import fs from 'node:fs';

import type { ZennData, ZennJson } from '@/types/IZenn';

export const sortByDateZenn = (articles: ZennJson['articles']) => {
  const arrayArticles: ZennData[] = Object.keys(articles).map((articleId) => {
    const article = articles[articleId];
    if (article === undefined) {
      throw new Error();
    }

    return {
      id: articleId,
      type: 'zenn',
      ogpImageUrl: article.ogpImageUrl,
      url: `https://zenn.dev/korosuke613/articles/${articleId}`,
      title: article.title,
      pubDate: article.pubDate,
    };
  });

  return arrayArticles.sort(
    (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf()
  );
};

export const getSortedZennData = async () => {
  const zennJsonFile = await fs.promises.readFile('./public/assets/zenn.json');
  const zennJson: ZennJson = JSON.parse(zennJsonFile.toString());
  const sortedZenns = sortByDateZenn(zennJson.articles);

  return sortedZenns;
};
