import fs from "node:fs";

export const readYears = async (filePath = "./build/years.json") => {
  const yearsFile = await fs.promises.readFile(filePath);
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
