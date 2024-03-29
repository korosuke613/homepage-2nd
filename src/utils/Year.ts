import fs from "node:fs";
import { AppConfig } from "./AppConfig";

export const readYears = async (filePath = AppConfig.paths.generated.years) => {
  const yearsFile = await fs.promises.readFile(filePath);
  const years = JSON.parse(yearsFile.toString()) as {
    [key: string]: number[];
    posts: number[];
    blogs: number[];
  };

  for (const category of Object.keys(years)) {
    years[category]?.sort((a, b) => b - a);
  }

  return years;
};
