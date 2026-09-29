#!/usr/bin/env node
/**
 * Copies the code the app shares with the web repository into src/shared/web
 * (ADR 0002). Nothing in that folder is edited by hand: change it in the web
 * repository, commit there, then run `pnpm sync:web`.
 *
 * The web repository is read from ../dolisha, or from DOULISHA_WEB_DIR.
 * It refuses to copy uncommitted changes (use --allow-dirty to try them out),
 * and checks that every library the API types import is installed here.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const webDir = resolve(root, process.env.DOULISHA_WEB_DIR ?? '../dolisha');
const target = join(root, 'src/shared/web');
const allowDirty = process.argv.includes('--allow-dirty');

/** [path in the web repository, path under src/shared/web] */
const files = [
  ['packages/api-types/dist/index.d.ts', 'api-types.d.ts'],
  ['packages/i18n/messages/ar.json', 'i18n/messages/ar.json'],
  ['packages/i18n/messages/fr.json', 'i18n/messages/fr.json'],
  ['packages/i18n/messages/en.json', 'i18n/messages/en.json'],
  ['packages/i18n/src/index.ts', 'i18n/index.ts'],
  ['packages/i18n/src/format.ts', 'i18n/format.ts'],
  ['packages/i18n/src/locales.ts', 'i18n/locales.ts'],
  ['packages/ui-tokens/src/tokens.ts', 'ui-tokens/tokens.ts'],
  ['packages/ui-tokens/src/contrast.ts', 'ui-tokens/contrast.ts'],
  ['packages/validators/src/index.ts', 'validators/index.ts'],
  ['packages/validators/src/common.ts', 'validators/common.ts'],
  ['packages/validators/src/events.ts', 'validators/events.ts'],
];

const HEADER = '// Copied from the Doulisha web repository by `pnpm sync:web`. Do not edit.\n';

function git(...args) {
  return execFileSync('git', ['-C', webDir, ...args], { encoding: 'utf8' }).trim();
}

function fail(message) {
  console.error(`sync:web: ${message}`);
  process.exit(1);
}

if (!existsSync(join(webDir, 'packages'))) {
  fail(`web repository not found at ${webDir} (set DOULISHA_WEB_DIR)`);
}

const sources = files.map(([from]) => from);
const dirty = git('status', '--porcelain', '--', ...sources);
if (dirty && !allowDirty) {
  fail(`uncommitted changes in the web repository:\n${dirty}\nCommit them, or pass --allow-dirty.`);
}
for (const [from] of files) {
  if (!existsSync(join(webDir, from))) fail(`missing ${from} in the web repository`);
}

// Every library the API types import must be installed in this app, or its
// types would silently become `any`.
const bundle = readFileSync(join(webDir, files[0][0]), 'utf8');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const installed = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
]);
const imported = new Set(
  [...bundle.matchAll(/from '([^']+)'/g)].map(([, id]) =>
    id.startsWith('@') ? id.split('/').slice(0, 2).join('/') : id.split('/')[0],
  ),
);
const missing = [...imported].filter((name) => !installed.has(name));
if (missing.length > 0) {
  fail(`the API types import libraries this app does not install: ${missing.join(', ')}`);
}

rmSync(target, { recursive: true, force: true });
for (const [from, to] of files) {
  const destination = join(target, to);
  mkdirSync(dirname(destination), { recursive: true });
  if (to.endsWith('.ts')) {
    writeFileSync(destination, HEADER + readFileSync(join(webDir, from), 'utf8'));
  } else {
    cpSync(join(webDir, from), destination);
  }
}

const source = {
  repository: 'https://github.com/Hedi-Bouhelii/Doulisha',
  commit: git('rev-parse', 'HEAD'),
  branch: git('rev-parse', '--abbrev-ref', 'HEAD'),
  uncommittedChanges: Boolean(dirty),
};
writeFileSync(join(target, 'SOURCE.json'), `${JSON.stringify(source, null, 2)}\n`);
writeFileSync(
  join(target, 'README.md'),
  [
    '# Shared with the web repository',
    '',
    'Copied by `pnpm sync:web` from the commit in `SOURCE.json` (ADR 0002). Do not edit these',
    'files: change them in the web repository, commit there, then run `pnpm sync:web` again.',
    '',
  ].join('\n'),
);

console.log(
  `sync:web: ${files.length} files from ${source.branch} @ ${source.commit.slice(0, 7)}` +
    (source.uncommittedChanges ? ' (with uncommitted changes)' : ''),
);
