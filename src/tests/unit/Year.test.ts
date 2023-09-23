import { readYears } from "@/utils/Year";

describe("readYears", () => {
  let years: Awaited<ReturnType<typeof readYears>>;

  beforeAll(async () => {
    years = await readYears(`${__dirname}/data/build/years.json`);
  });

  it("should return an object with a posts array", () => {
    expect(years).toHaveProperty("posts");
    expect(years.posts).toBeInstanceOf(Array);
  });

  it("should return an object with a blogs array", () => {
    expect(years).toHaveProperty("blogs");
    expect(years.blogs).toBeInstanceOf(Array);
  });

  it("should return a posts array with more than 3 elements", () => {
    expect(years.posts.length).toBeGreaterThan(3);
  });

  it("should return a blogs array with more than 3 elements", () => {
    expect(years.blogs.length).toBeGreaterThan(3);
  });

  it("should return a blogs array that contains 2021", () => {
    expect(years.blogs).toContain(2021);
  });

  it("should return a blogs array that contains 2020", () => {
    expect(years.blogs).toContain(2020);
  });

  it("should return a blogs array that contains 2019", () => {
    expect(years.blogs).toContain(2019);
  });
});
