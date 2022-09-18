import fs from 'node:fs';

export const readYears = async () => {
  const yearsFile = await fs.promises.readFile('./build/years.json');
  const years = JSON.parse(yearsFile.toString()) as {
    [key: string]: number[];
    posts: number[];
    blogs: number[];
  };

  Object.keys(years).forEach((category) => {
    years[category]?.sort((a, b) => b - a);
  });

  return years;
};
