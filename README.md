> **Note:** pulled isn't on npm yet, so this demo installs it from `vendor/pulled-0.1.0.tgz` (packed from
> [spy-in-shadows/pulled](https://github.com/spy-in-shadows/pulled)). Once it's published, switch with
> `npm i pulled@latest`, delete `vendor/`, commit and push.

# pulled demo

A small Express app that shows [pulled](https://github.com/spy-in-shadows/pulled) working live. pulled
tells you, right after you pull, what in your local setup is out of sync with the code (dependencies, Node
version, `.env`, the Prisma client, migrations) and the one command that fixes it. It's silent when
everything matches.

**Live:** https://pulled-demo.onrender.com (**pending deploy**: the Render service hasn't been created yet; the URL is what Render will assign if the name is free)

## What the demo shows

The page has a card for each scenario in [`scenarios/`](scenarios). Each one is the same small app
(dayjs, ms, Prisma 6) left in a known state, as if a teammate had pushed something you haven't caught up
with yet. **Run pulled** calls `check()` from `pulled/api` on that folder, live, and shows the result the
way the CLI prints it, plus the raw JSON report.

| Scenario | What your teammate pushed | What pulled says |
|---|---|---|
| [`in-sync`](scenarios/in-sync) | nothing new | nothing (silent, exit 0) |
| [`deps-stale`](scenarios/deps-stale) | dayjs 1.11.10 → 1.11.13, new dependency nanoid | 2 packages differ → `npm install` |
| [`env-missing`](scenarios/env-missing) | two new keys in `.env.example` | Missing in .env: SESSION_SECRET, STRIPE_SECRET_KEY |
| [`node-mismatch`](scenarios/node-mismatch) | an `.nvmrc` pinning Node 18 | Project expects Node 18 → `nvm use` |
| [`prisma-stale`](scenarios/prisma-stale) | a new field in `schema.prisma` | Prisma schema changed → `npx prisma generate` |
| [`everything`](scenarios/everything) | all of the above | all four issues |

Each scenario commits only the files pulled reads (`package.json`, the lockfiles, the Prisma schema and
the generated client's copy of it, `.env.example` and `.env`), taken from real `npm install` and
`prisma generate` runs. The `.env` values are placeholders, not secrets.

The demo app itself uses pulled the normal way: `npm run dev` starts it with `node --import pulled`, so
pulled checks the demo on every start (silently, because it's in sync).

## Deploy

[`render.yaml`](render.yaml) is a Render Blueprint: one free Node web service (`npm ci`, `npm start`,
`NODE_ENV=production`, health check on `/`). In Render: **New → Blueprint → pulled-demo**. `npm start`
runs plain `node server.js` (pulled's import mode is for development); the api checks the scenarios either way.

## Run it locally

Node 20.6 or newer.

```sh
git clone https://github.com/spy-in-shadows/pulled-demo
cd pulled-demo
npm i
npm run dev        # http://localhost:3000
```

| Endpoint | |
|---|---|
| `GET /` | the page |
| `GET /api/scenarios` | the list of scenarios |
| `GET /api/scenarios/:id` | `{ report, text }`: pulled's Report for that scenario, and the same report as CLI text |

## Try it yourself

Check a scenario with the CLI, change something, and check again:

```sh
npm run check -- --cwd scenarios/in-sync      # silent, exit 0

# a teammate adds a key to .env.example…
echo "RESEND_API_KEY=" >> scenarios/in-sync/.env.example
npm run check -- --cwd scenarios/in-sync      # Missing in .env: RESEND_API_KEY

# …you add it to your .env
echo "RESEND_API_KEY=replace-me" >> scenarios/in-sync/.env
npm run check -- --cwd scenarios/in-sync      # silent again
```

Other things to try: add a field to `scenarios/in-sync/prisma/schema.prisma`, put `18` in
`scenarios/in-sync/.nvmrc`, or change a version in `scenarios/in-sync/package-lock.json`.
`git checkout scenarios` puts everything back.

`npm run check` with no `--cwd` checks the demo app itself (silent after `npm i`).

## Transcript

`npx pulled` against the `everything` scenario:

```
$ npx pulled --cwd scenarios/everything
⚠ pulled: your local setup is out of sync with the code
  • Dependencies: 2 packages differ from package-lock.json
      dayjs 1.11.10 → 1.11.13, nanoid (not installed)
      → npm install
  • Project expects Node 18, you're on 26.5.0
      → nvm use
  • Prisma schema changed since the client was generated
      → npx prisma generate
  • Missing in .env: SESSION_SECRET, STRIPE_SECRET_KEY
      → add them to .env (see .env.example)
  Run `npx pulled --fix` to fix what can be fixed automatically.
$ echo $?
1
```

(In this demo, `--fix` would really run `npm install` and `prisma generate` inside the scenario folder,
which changes it. `git checkout scenarios` and `git clean -fd scenarios` put it back.)

## License

MIT
