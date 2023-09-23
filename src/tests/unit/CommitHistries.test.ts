import { getCommitHistories } from "@/utils/CommitHistories";

test("getCommitHistries", async () => {
  const actual = await getCommitHistories("src/content/posts/history.mdx");

  actual.forEach((a) => {
    expect(a).toHaveProperty("sha");
    expect(a).toHaveProperty("commitMessage");
    expect(a).toHaveProperty("date");
  });
});
