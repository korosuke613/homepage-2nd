import type { Meta, StoryObj } from "@storybook/react";
import { CommitHistoryPost } from ".";

const metaData: Meta = {
  title: "CommitHistoryPost",
  component: CommitHistoryPost,
};

export default metaData;

const histories = [
  {
    sha: "main",
    date: "2021-08-01",
    commitMessage: "commit message 1",
  },
  {
    sha: "main",
    date: "2021-07-01",
    commitMessage: "commit message 2",
  },
  {
    sha: "main",
    date: "2021-06-01",
    commitMessage: "commit message 3",
  },
  {
    sha: "main",
    date: "2021-05-01",
    commitMessage: "commit message 4",
  },
  {
    sha: "main",
    date: "2021-04-01",
    commitMessage: "commit message 5",
  },
  {
    sha: "main",
    date: "2021-03-01",
    commitMessage: "commit message 6",
  },
];

export const Default: StoryObj<typeof CommitHistoryPost> = {
  args: {
    collection: "posts",
    id: "2021-08-01",
    histories: histories,
  },
};

export const Empty: StoryObj<typeof CommitHistoryPost> = {
  args: {
    collection: "posts",
    id: "2021-08-01",
    histories: [],
  },
};
