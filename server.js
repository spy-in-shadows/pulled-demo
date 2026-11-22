// pulled demo: runs pulled's api against small example projects (scenarios/) and shows the result.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { check } from 'pulled/api';

const here = dirname(fileURLToPath(import.meta.url));

/** The only folders the api will ever check. Request params are matched against these ids. */
const SCENARIOS = [
  {
    id: 'in-sync',
    title: 'Everything in sync',
    pushed: 'Nothing new since your last install.',
    local: 'Dependencies installed, Prisma client generated, .env complete.',
  },
  {
    id: 'deps-stale',
    title: 'Dependencies changed',
    pushed: 'Bumped dayjs 1.11.10 → 1.11.13 and added nanoid (package.json + package-lock.json).',
    local: 'node_modules still has dayjs 1.11.10 and no nanoid.',
  },
  {
    id: 'env-missing',
    title: 'New environment variables',
    pushed: 'Added SESSION_SECRET and STRIPE_SECRET_KEY to .env.example.',
    local: 'Your .env predates them.',
  },
  {
    id: 'node-mismatch',
    title: 'Different Node version',
    pushed: 'An .nvmrc that pins Node 18.',
    local: 'Whatever Node runs this server (never 18: the demo needs ≥ 20.6).',
  },
  {
    id: 'prisma-stale',
    title: 'Prisma schema changed',
    pushed: 'A new avatarUrl field on User in prisma/schema.prisma.',
    local: 'A Prisma client generated from the old schema.',
  },
  {
    id: 'everything',
    title: 'All of it at once',
    pushed: 'The dependency, .nvmrc, Prisma and .env.example changes above.',
    local: 'The old install, the old Prisma client and the old .env.',
  },
];

/** Checks whose fix `npx pulled --fix` can run (same list as pulled's CLI). */
const FIXABLE = new Set(['deps', 'prisma-client', 'migrations']);

/** The report as pulled's CLI prints it (without colors). Empty when in sync, like the CLI. */
function format(report) {
  if (report.issues.length === 0) return '';
  const lines = ['⚠ pulled: your local setup is out of sync with the code'];
  for (const issue of report.issues) {
    lines.push(`  • ${issue.title}`);
    for (const detail of issue.details) lines.push(`      ${detail}`);
    if (issue.fix) lines.push(`      → ${issue.fix}`);
  }
  if (report.issues.some((i) => i.fix && FIXABLE.has(i.id))) {
    lines.push('  Run `npx pulled --fix` to fix what can be fixed automatically.');
  }
  return `${lines.join('\n')}\n`;
}

const app = express();
app.disable('x-powered-by');

app.get('/', (_req, res) => {
  res.sendFile(join(here, 'index.html'));
});

app.get('/api/scenarios', (_req, res) => {
  res.json(SCENARIOS);
});

app.get('/api/scenarios/:id', async (req, res) => {
  const scenario = SCENARIOS.find((s) => s.id === req.params.id);
  if (!scenario) {
    res.status(404).json({ error: 'unknown scenario' });
    return;
  }
  const report = await check({ cwd: join(here, 'scenarios', scenario.id) });
  res.json({ report, text: format(report) });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`pulled demo on http://localhost:${port}`);
});
