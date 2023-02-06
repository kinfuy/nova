import { execCommand } from '../shell';

const GIT_LOG_SEPARATOR = '|';

const EOL_REGEX = /\r\n|\r|\n/g;

export interface GitStash {
  hash: string;
  baseHash: string;
  author: string;
  email: string;
  date: number;
  message: string;
}

export interface GitTagDetails {
  hash: string;
  taggerName: string;
  taggerEmail: string;
  taggerDate: number;
  message: string;
}

export const enum CommitOrdering {
  Date = 'date',
  AuthorDate = 'author-date',
  Topological = 'topo'
}

export const getGitCommits = async (
  branches: string[] | null,
  num: number,
  includeTags: boolean,
  includeRemotes: boolean,
  remotes: string[],
  hideRemotes: string[],
  onlyFollowFirstParent: boolean,
  includeCommitsMentionedByReflogs: boolean,
  order: CommitOrdering
  // stashes?: GitStash[]
) => {
  const gitFormatLog = [
    '%H',
    '%P', // Hash & Parent Information
    '%an',
    '%ae',
    '%at',
    '%B' // Body
  ].join(GIT_LOG_SEPARATOR);
  const args = ['-c', 'log.showSignature=false', 'log', `--max-count=${num}`, `--format=${gitFormatLog}`, `--${order}-order`];
  if (onlyFollowFirstParent) {
    args.push('--first-parent');
  }

  if (branches !== null) {
    for (let i = 0; i < branches.length; i++) {
      args.push(branches[i]);
    }
  } else {
    // Show All
    args.push('--branches');
    if (includeTags) args.push('--tags');
    if (includeCommitsMentionedByReflogs) args.push('--reflog');
    if (includeRemotes) {
      if (hideRemotes.length === 0) {
        args.push('--remotes');
      } else {
        remotes
          .filter((remote) => !hideRemotes.includes(remote))
          .forEach((remote) => {
            args.push(`--glob=refs/remotes/${remote}`);
          });
      }
    }
    // Add the unique list of base hashes of stashes, so that commits only referenced by stashes are displayed
    // const stashBaseHashes = stashes.map((stash) => stash.baseHash);
    // stashBaseHashes.filter((hash, index) => stashBaseHashes.indexOf(hash) === index).forEach((hash) => args.push(hash));

    args.push('HEAD');
  }
  args.push('--');

  const stdio = await execCommand('git', args);

  const lines = stdio.split(EOL_REGEX);
  const commits: any[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].split(GIT_LOG_SEPARATOR);
    if (line.length !== 6) continue;
    commits.push({
      hash: line[0],
      parents: line[1] !== '' ? line[1].split(' ') : [],
      author: line[2],
      email: line[3],
      date: parseInt(line[4]),
      message: line[5]
    });
  }
  return commits;
};
