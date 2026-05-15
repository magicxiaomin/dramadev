#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const outDir = '.github/review-gate';
mkdirSync(outDir, { recursive: true });

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function readText(path, fallback = '') {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return fallback;
  }
}

const checks = readJson(`${outDir}/checks.json`, {
  ok: false,
  needsSplit: false,
  stats: { files: 0, added: 0, deleted: 0, changed: 0 },
  hardStops: [{ file: '(review gate)', rule: 'missing-check-results', detail: 'Hard-stop check output was not found.' }],
  warnings: [],
});
const gates = readJson(`${outDir}/gate-results.json`, []);
const hasClaudeSecret = process.env.HAS_ANTHROPIC_API_KEY === 'true';
const claudeExitCode = Number(process.env.CLAUDE_REVIEW_EXIT_CODE || '0');
const claudeOutput = readText(`${outDir}/claude-review.md`).trim();
const claudeVerdict = claudeOutput.match(/^###\s+Verdict:\s*(APPROVE|REQUEST_CHANGES)\s*$/im)?.[1] || '';

const failedGates = gates.filter((gate) => gate.status !== 0);
const hardStopCount = checks.hardStops?.length || 0;
const deterministicFailures = hardStopCount > 0 || failedGates.length > 0;

let decision;
let machineState;
let labelsToAdd;
let labelsToRemove = [
  'claude-approved',
  'claude-changes-requested',
  'needs-human-review',
  'needs-human-merge',
  'needs-split',
  'review:claude-approved',
  'review:claude-changes-requested',
  'review:needs-human-review',
  'status:approved',
  'status:changes-requested',
  'status:needs-review',
  'gate:human-required',
];

if (deterministicFailures) {
  decision = 'REQUEST_CHANGES';
  machineState = 'DETERMINISTIC_CHANGES_REQUESTED';
  labelsToAdd = ['claude-changes-requested', 'review:claude-changes-requested', 'status:changes-requested'];
} else if (!hasClaudeSecret) {
  decision = 'REQUEST_CHANGES';
  machineState = 'NEEDS_HUMAN_REVIEW_CLAUDE_SECRET_MISSING';
  labelsToAdd = ['needs-human-review', 'review:needs-human-review', 'status:needs-review', 'gate:human-required'];
} else if (claudeExitCode !== 0 || !claudeVerdict) {
  decision = 'REQUEST_CHANGES';
  machineState = 'NEEDS_HUMAN_REVIEW_CLAUDE_VERDICT_MISSING';
  labelsToAdd = ['needs-human-review', 'review:needs-human-review', 'status:needs-review', 'gate:human-required'];
} else if (claudeVerdict === 'APPROVE') {
  decision = 'APPROVE';
  machineState = 'CLAUDE_APPROVED_NEEDS_HUMAN_MERGE';
  labelsToAdd = ['claude-approved', 'review:claude-approved', 'status:approved', 'needs-human-merge'];
} else {
  decision = 'REQUEST_CHANGES';
  machineState = 'CLAUDE_CHANGES_REQUESTED';
  labelsToAdd = ['claude-changes-requested', 'review:claude-changes-requested', 'status:changes-requested'];
}

if (checks.needsSplit) labelsToAdd.push('needs-split');
labelsToAdd = [...new Set(labelsToAdd)];
labelsToRemove = labelsToRemove.filter((label) => !labelsToAdd.includes(label));

const gateRows = gates.length
  ? gates.map((gate) => `| \`${gate.name}\` | ${gate.status === 0 ? 'PASS' : 'FAIL'} | \`${gate.command}\` |`).join('\n')
  : '| `(none)` | FAIL | gate results missing |';

const checksMd = readText(`${outDir}/checks.md`).trim();
const claudeSection = claudeOutput
  ? `### Claude review output\n\n${claudeOutput}`
  : `### Claude review output\n\nClaude review did not run or did not produce output. This is expected until \`ANTHROPIC_API_KEY\` is configured as a GitHub Actions secret; the PR is labeled \`needs-human-review\` meanwhile.`;
const marker = '<!-- dramadev-novelhub-review-gate -->';
const comment = `${marker}
## NovelHub-style PR Review Gate

\`REVIEW_DECISION: ${decision}\`  
\`REVIEW_STATE: ${machineState}\`  
\`LABELS_ADD: ${labelsToAdd.join(',') || 'none'}\`  
\`LABELS_REMOVE: ${labelsToRemove.join(',') || 'none'}\`

This workflow uses GitHub Actions comments, labels, and status checks instead of submitting a formal self-approval. Claude review secret status: **${hasClaudeSecret ? 'configured' : 'missing'}**.

### Local/CI gates

| Gate | Result | Command |
| --- | --- | --- |
${gateRows}

${checksMd || '### Deterministic hard-stop/path-size checks\n\nNo check details were produced.'}

${claudeSection}

### Machine-parseable verdict

\`\`\`json
${JSON.stringify({
  review_decision: decision,
  review_state: machineState,
  claude_verdict: claudeVerdict || null,
  labels_add: labelsToAdd,
  labels_remove: labelsToRemove,
  has_claude_secret: hasClaudeSecret,
  claude_exit_code: claudeExitCode,
  deterministic_gates: gates,
  hard_stop_count: hardStopCount,
  needs_split: Boolean(checks.needsSplit),
  stats: checks.stats,
}, null, 2)}
\`\`\`
`;

writeFileSync(`${outDir}/comment.md`, comment);
writeFileSync(`${outDir}/labels.json`, `${JSON.stringify({ add: labelsToAdd, remove: labelsToRemove, decision, state: machineState }, null, 2)}\n`);

if (deterministicFailures || (hasClaudeSecret && decision !== 'APPROVE')) process.exitCode = 1;
