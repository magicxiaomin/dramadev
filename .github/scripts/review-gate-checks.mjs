#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, extname } from 'node:path';

const outDir = '.github/review-gate';
mkdirSync(outDir, { recursive: true });

function git(args, fallback = '') {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return fallback;
  }
}

const baseRef = process.env.GITHUB_BASE_REF || 'main';
const baseSha = process.env.GITHUB_BASE_SHA || '';
const headSha = process.env.GITHUB_SHA || 'HEAD';
const remoteBase = `origin/${baseRef}`;

let base = baseSha;
if (!base) {
  base = git(['merge-base', remoteBase, headSha]) || git(['merge-base', baseRef, headSha]) || `${headSha}~1`;
}

const changedFiles = git(['diff', '--name-only', `${base}...${headSha}`])
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const numstat = git(['diff', '--numstat', `${base}...${headSha}`])
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [added, deleted, ...fileParts] = line.split(/\s+/);
    return {
      file: fileParts.join(' '),
      added: added === '-' ? 0 : Number(added || 0),
      deleted: deleted === '-' ? 0 : Number(deleted || 0),
    };
  });

const totalAdded = numstat.reduce((sum, row) => sum + row.added, 0);
const totalDeleted = numstat.reduce((sum, row) => sum + row.deleted, 0);
const totalChanged = totalAdded + totalDeleted;

function addedLinesFor(file) {
  const diff = git(['diff', '--unified=0', '--no-color', `${base}...${headSha}`, '--', file]);
  return diff
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .map((line) => line.slice(1))
    .join('\n');
}

const textExtensions = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.css', '.scss', '.html',
  '.yml', '.yaml', '.toml', '.txt', '.sh', '.env', '.example', '.gitignore', '',
]);

const hardStops = [];
const warnings = [];

function addHardStop(file, rule, detail) {
  hardStops.push({ file, rule, detail });
}

function addWarning(file, rule, detail) {
  warnings.push({ file, rule, detail });
}

for (const file of changedFiles) {
  if (file.startsWith('src/app/api/')) {
    addHardStop(file, 'no-backend-api-routes', 'P0 scaffold must not add Next.js API/backend routes.');
  }

  if (/^\.env(\.|$)/.test(file) && !file.endsWith('.example')) {
    addHardStop(file, 'no-production-secrets', 'Environment secret files must not be added or modified.');
  }

  if (/^(vercel\.json|netlify\.toml|firebase\.json|supabase\/|prisma\/|drizzle\/|migrations\/|\.github\/workflows\/deploy)/.test(file)) {
    addHardStop(file, 'no-production-infra', 'Production deployment/backend/database infrastructure is out of scope.');
  }

  if (!existsSync(file) || !textExtensions.has(extname(file))) continue;
  if (extname(file) === '.md' || extname(file) === '.mdx') continue;
  if (
    file === 'banned-dependency' ||
    file === '.github/workflows/claude-review.yml' ||
    file.startsWith('.github/scripts/')
  ) continue;

  // Scan added lines only. Existing PRD/mock copy may mention non-goals such as
  // payment or Facebook; the hard stop is adding real integrations/infrastructure.
  const text = addedLinesFor(file);
  if (!text) continue;

  const contentRules = [
    ['no-real-payment', /(from\s+['"](@stripe|stripe|paypal|braintree)|require\(['"](@stripe|stripe|paypal|braintree)|checkout\.sessions|paymentintent|stripe\.)/i, 'Real payment/subscription integration is a P0 hard stop.'],
    ['no-real-facebook-api', /(graph\.facebook\.com|facebook-nodejs-business-sdk|FB\.api|fbq\(|Meta Pixel)/i, 'Real Facebook API/pixel/analytics integration is out of scope.'],
    ['no-real-auth', /\b(next-auth|auth0|clerk|supabase\.auth|firebase auth|signIn\()/i, 'Real login/auth integration is out of scope.'],
    ['no-real-database', /(@prisma|prisma\/client|drizzle-orm|typeorm|sequelize|mongodb|\bpg\b|mysql2|@supabase\/supabase-js|firebase\/|\bredis\b)/i, 'Real backend/database integration is out of scope.'],
    ['no-destructive-ops', /(rm\s+-rf|DROP\s+TABLE|TRUNCATE\s+TABLE|DELETE\s+FROM)/i, 'Destructive operations are not allowed in this P0 scaffold.'],
    ['no-dns-cutover', /\b(DNS|CNAME|A\s+record|nameserver|cutover|production deploy|prod deploy)\b/i, 'DNS/cutover/production deployment work is a hard stop.'],
    ['no-competitor-assets', /\b(NetShort|DramaWave|ReelShort|ShortMax|DramaBox)\b/i, 'Do not copy or depend on competitor brands/assets.'],
  ];

  for (const [rule, pattern, detail] of contentRules) {
    if (pattern.test(text)) addHardStop(file, rule, detail);
  }
}

const sizeLimits = {
  changedFiles: Number(process.env.REVIEW_GATE_MAX_FILES || 60),
  changedLines: Number(process.env.REVIEW_GATE_MAX_LINES || 8000),
};

const needsSplit = changedFiles.length > sizeLimits.changedFiles || totalChanged > sizeLimits.changedLines;
if (needsSplit) {
  addWarning('(diff)', 'needs-split', `Diff touches ${changedFiles.length} files and ${totalChanged} changed lines; limit is ${sizeLimits.changedFiles} files / ${sizeLimits.changedLines} lines.`);
}

const result = {
  ok: hardStops.length === 0,
  needsSplit,
  base,
  head: headSha,
  changedFiles,
  stats: { files: changedFiles.length, added: totalAdded, deleted: totalDeleted, changed: totalChanged },
  hardStops,
  warnings,
};

writeFileSync(`${outDir}/checks.json`, `${JSON.stringify(result, null, 2)}\n`);

const md = [
  '### Deterministic hard-stop/path-size checks',
  '',
  `- Base: \`${base}\``,
  `- Changed files: **${changedFiles.length}**`,
  `- Changed lines: **+${totalAdded} / -${totalDeleted}**`,
  `- Hard stops: **${hardStops.length}**`,
  `- Needs split: **${needsSplit ? 'yes' : 'no'}**`,
];

if (hardStops.length) {
  md.push('', '#### Hard stops', '', ...hardStops.map((item) => `- \`${item.file}\` — **${item.rule}**: ${item.detail}`));
}

if (warnings.length) {
  md.push('', '#### Warnings', '', ...warnings.map((item) => `- \`${item.file}\` — **${item.rule}**: ${item.detail}`));
}

writeFileSync(`${outDir}/checks.md`, `${md.join('\n')}\n`);

if (!result.ok) process.exitCode = 1;
