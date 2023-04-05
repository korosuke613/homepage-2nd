import { listSimilarities } from '@/utils/TextSimilarity';

test('listSimilarities', () => {
  const base = 'イーハトーヴォ';
  const search = [
    { meta: { name: 'hoge' }, content: 'あのイーハトーヴォのすきとおった風' },
    { meta: { name: 'fuga' }, content: '夏でも底に冷たさをもつ青いそら' },
    { meta: { name: 'foo' }, content: 'うつくしい森で飾られたモリーオ市' },
    { meta: { name: 'bar' }, content: '郊外のぎらぎらひかる草の波' },
  ];

  const expected = [
    {
      meta: { name: 'hoge' },
      score: '0.80',
    },
    {
      meta: { name: 'fuga' },
      score: '0.00',
    },
    {
      meta: { name: 'foo' },
      score: '0.00',
    },
    { meta: { name: 'bar' }, score: '0.00' },
  ];

  const actual = listSimilarities(base, search).map((s) => ({
    ...s,
    score: s.score.toFixed(2),
  }));
  expect(actual).toStrictEqual(expected);
});
