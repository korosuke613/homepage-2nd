import fs from "node:fs";
import { BlogDataJson } from "../../src/types/IBlogData";

export abstract class BlogDataGenerator<T extends BlogDataJson<unknown>> {
  protected updateItemCount: number;
  protected blogDate: T;

  constructor() {
    this.updateItemCount = 0;
  }

  getBlogData(): T {
    return this.blogDate;
  }

  async readExistJson(path: string) {
    console.info(`info: read exist json from ${path}`);
    const file = await fs.promises.readFile(path, "utf8");
    this.blogDate = JSON.parse(file);
  }

  abstract update(): Promise<boolean>;

  async writeJson(path: string) {
    console.info(`info: write json to ${path}`);
    await fs.promises.writeFile(
      path,
      `${JSON.stringify(this.blogDate, null, 2)}\n`,
    );
  }
}
