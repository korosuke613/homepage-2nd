import { describe, expect, test } from "vitest";
import { GA4DataFetcher } from "./GA4DataFetcher";

describe("getDiffData", () => {
  test("should return new item", () => {
    const latest = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
      { id: 4, name: "Bob" },
    ];
    const current = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
    ];
    const primaryKey = "id";

    const expected: ReturnType<typeof GA4DataFetcher.getDiffData> = {
      newItems: [{ id: 4, name: "Bob" }],
      updateItems: [],
    };
    const result = GA4DataFetcher.getDiffData(latest, current, primaryKey);

    expect(result).toEqual(expected);
  });

  test("should return updated item", () => {
    const latest = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
      { id: 4, name: "UpdateBob" },
    ];
    const current = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
      { id: 4, name: "Bob" },
    ];
    const primaryKey = "id";

    const expected: ReturnType<typeof GA4DataFetcher.getDiffData> = {
      newItems: [],
      updateItems: [{ id: 4, name: "UpdateBob" }],
    };
    const result = GA4DataFetcher.getDiffData(latest, current, primaryKey);

    expect(result).toEqual(expected);
  });

  test("should return new and updated items", () => {
    const latest = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
      { id: 4, name: "UpdateBob" },
      { id: 5, name: "Charlie" },
    ];
    const current = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
      { id: 4, name: "Bob" },
    ];
    const primaryKey = "id";

    const expected: ReturnType<typeof GA4DataFetcher.getDiffData> = {
      newItems: [{ id: 5, name: "Charlie" }],
      updateItems: [{ id: 4, name: "UpdateBob" }],
    };
    const result = GA4DataFetcher.getDiffData(latest, current, primaryKey);

    expect(result).toEqual(expected);
  });

  test("should return empty when no new or updated items", () => {
    const latest = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
    ];
    const current = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Alice" },
    ];
    const primaryKey = "id";

    const expected: ReturnType<typeof GA4DataFetcher.getDiffData> = {
      newItems: [],
      updateItems: [],
    };
    const result = GA4DataFetcher.getDiffData(latest, current, primaryKey);

    expect(result).toEqual(expected);
  });
});
