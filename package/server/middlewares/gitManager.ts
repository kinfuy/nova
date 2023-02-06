import { execCommand } from '../shell';

export interface GitCommitAuthor {
  name: string;
  email: string;
}
export interface Reference {
  type: 'hash' | 'issue' | 'pull';
  value: string;
}
export interface TagInfo extends Record<string, string> {
  tag: string;
  date: string;
}
export interface RawGitCommit {
  message: string;
  body: string;
  shortHash: string;
  author: GitCommitAuthor;
  commitDate: string;
}

export interface GitCommit extends RawGitCommit {
  description: string;
  type: string;
  scope: string;
  references: Reference[];
  authors: GitCommitAuthor[];
  isBreaking: boolean;
}

export const getGitCommits = async (from?: string | undefined, to?: string) => {
  if (!to) to = 'HEAD';
  const r = await execCommand('git', ['--no-pager', 'log', `${from ? `${from}...` : ''}${to}`, '--pretty="----%n%s|%h|%an|%ae|%ad']);
  return r
    .split('----\n')
    .splice(1)
    .map((line) => {
      const [firstLine, ..._body] = line.split('\n');
      const [message, shortHash, authorName, authorEmail, commitDate] = firstLine.split('|');
      const r: RawGitCommit = {
        message,
        shortHash,
        author: { name: authorName, email: authorEmail },
        body: _body.join('\n'),
        commitDate
      };
      return r;
    });
};
