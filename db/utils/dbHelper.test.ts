import { describe, expect, test } from "vitest";
import { getQueryData } from "./dbHelper";

const dummyLogger = { log: (_: string) => {} };

describe(getQueryData, () => {
  test("should return empty array if nothing to update", () => {
    const tableName = "Posts";
    const latestData = [
      { linkUrl: "/hoge", click: 2 },
      { linkUrl: "/fuga", click: 0 },
    ];
    const currentData = [
      { linkUrl: "/hoge", click: 2 },
      { linkUrl: "/fuga", click: 0 },
    ];
    const primaryKey = "linkUrl";

    const result = getQueryData(
      tableName,
      latestData,
      currentData,
      primaryKey,
      dummyLogger,
    );

    expect(result.updateData).to.deep.equal([]);
    expect(result.insertData).to.deep.equal([]);
  });

  test("should return data to update", () => {
    const tableName = "Posts";
    const latestData = [
      { linkUrl: "/hoge", click: 5 },
      { linkUrl: "/fuga", click: 0 },
    ];
    const currentData = [
      { linkUrl: "/hoge", click: 2 },
      { linkUrl: "/fuga", click: 0 },
    ];
    const primaryKey = "linkUrl";

    const result = getQueryData(
      tableName,
      latestData,
      currentData,
      primaryKey,
      dummyLogger,
    );

    expect(result.updateData).to.deep.equal([{ linkUrl: "/hoge", click: 5 }]);
    expect(result.insertData).to.deep.equal([]);
  });

  test("should return data to insert", () => {
    const tableName = "Posts";
    const latestData = [
      { linkUrl: "/hoge", click: 2 },
      { linkUrl: "/fuga", click: 0 },
      { linkUrl: "/piyo", click: 1 },
    ];
    const currentData = [
      { linkUrl: "/hoge", click: 2 },
      { linkUrl: "/fuga", click: 0 },
    ];
    const primaryKey = "linkUrl";

    const result = getQueryData(
      tableName,
      latestData,
      currentData,
      primaryKey,
      dummyLogger,
    );

    expect(result.updateData).to.deep.equal([]);
    expect(result.insertData).to.deep.equal([{ linkUrl: "/piyo", click: 1 }]);
  });

  test("should return data to insert and update", () => {
    const tableName = "Posts";
    const latestData = [
      { linkUrl: "/hoge", click: 5 },
      { linkUrl: "/fuga", click: 0 },
      { linkUrl: "/piyo", click: 1 },
    ];
    const currentData = [
      { linkUrl: "/hoge", click: 2 },
      { linkUrl: "/fuga", click: 0 },
    ];
    const primaryKey = "linkUrl";

    const result = getQueryData(
      tableName,
      latestData,
      currentData,
      primaryKey,
      dummyLogger,
    );

    expect(result.updateData).to.deep.equal([{ linkUrl: "/hoge", click: 5 }]);
    expect(result.insertData).to.deep.equal([{ linkUrl: "/piyo", click: 1 }]);
  });
});
