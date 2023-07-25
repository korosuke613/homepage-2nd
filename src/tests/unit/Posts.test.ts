import type { IPost } from '@/types/IArticleFrontmatter';
import { getGitHubUrl, sortByDate, sortByOrder } from '@/utils/Posts';

test('sortByDate', () => {
  const testData = ['2023-02-01', '2023-01-01', '2023-04-01', '2023-03-01'].map(
    (d) => {
      return {
        data: {
          pubDate: new Date(d),
        },
      };
    },
  );

  const expected = ['2023-04-01', '2023-03-01', '2023-02-01', '2023-01-01'].map(
    (d) => {
      return {
        data: {
          pubDate: new Date(d),
        },
      };
    },
  );

  const actual = sortByDate(testData as IPost[]);
  expect(actual).toStrictEqual(expected);
});

test('sortByOrder', () => {
  const testData = [3, 2, 12, undefined, 4].map((d) => {
    return {
      data: {
        id: 'hoge',
        order: d,
      },
    };
  });

  const expected = [2, 3, 4, 12, undefined].map((d) => {
    return {
      data: {
        id: 'hoge',
        order: d,
      },
    };
  });

  const actual = sortByOrder(testData as unknown as IPost[]);
  expect(actual).toStrictEqual(expected);
});

describe('getGitHubUrl', () => {
  test('normal', () => {
    const actual = getGitHubUrl(
      'github.com/korosuke613/homepage-2nd',
      'fff',
      'ddd',
    );
    expect(actual).toBe(
      'https://github.com/korosuke613/homepage-2nd/tree/main/src/content/fff/ddd',
    );
  });

  test('dormitory introduction', () => {
    const actual = getGitHubUrl(
      'github.com/korosuke613/homepage-2nd',
      'fff',
      'dormitory_introduction',
    );
    expect(actual).toBe(
      'https://github.com/korosuke613/homepage-2nd/blob/main/src/pages/posts/dormitory_introduction.astro',
    );
  });
});
