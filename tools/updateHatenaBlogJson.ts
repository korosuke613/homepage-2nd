import { HatenaBlogDataGenerator } from "./libs/HatenaBlogDataGenerator";

(async () => {
  const jsonConverter = new HatenaBlogDataGenerator();

  const localHatenaBlogJsonPath = "../public/assets/hatena_blog.json";
  await jsonConverter.readExistJson(localHatenaBlogJsonPath);

  const isUpdated = await jsonConverter.update();

  if (isUpdated === false) {
    return;
  }

  await jsonConverter.writeJson(localHatenaBlogJsonPath);
})();
