import { execCommand } from '../shell';

const GIT_LOG_SEPARATOR = '|';

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
    '%cn',
    '%ce',
    '%s%n%b' // Body
  ].join(GIT_LOG_SEPARATOR);
  const args = ['-c', 'log.showSignature=false', 'log', `--max-count=${num}`, `--format=----%n${gitFormatLog}`, `--${order}-order`];
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

  const commits = stdio
    .split('----\n')
    .splice(1)
    .map((line) => {
      const [firstLine, ..._body] = line.split('\n');
      const [hash, parents, author, email, date, cauthor, cemail, message] = firstLine.split('|');
      return {
        hash,
        parents: parents ? parents.split(' ') : [],
        author: {
          author,
          email
        },
        committer: {
          author: cauthor,
          email: cemail
        },
        date: parseInt(date),
        body: _body.filter(Boolean).join('\n'),
        message
      };
    });
  return commits;
};
