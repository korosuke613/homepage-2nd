import { simpleGit } from "simple-git";

export type CommitHistory = {
  sha: string;
  date: string;
  commitMessage: string;
};

const MAX_COUNT = 3;

export const getCommitHistories = async (
  filePath: string,
): Promise<CommitHistory[]> => {
  const git = simpleGit();
  const log = await git.log({
    file: filePath,
    maxCount: MAX_COUNT,
  });

  return log.all.map((l) => ({
    sha: l.hash,
    date: l.date,
    commitMessage: l.message,
  }));
};
