import { getCommitHistories } from "@/utils/CommitHistories";

test("getCommitHistries", async () => {
  const actual = await getCommitHistories("src/content/posts/history.mdx");

  for (const a of actual) {
    expect(a).toHaveProperty("sha");
    expect(a).toHaveProperty("commitMessage");
    expect(a).toHaveProperty("date");
  }
});
