# Dependencies changed

**What your teammate pushed:** Bumped dayjs 1.11.10 → 1.11.13 and added nanoid (package.json + package-lock.json).

**What's on your machine:** node_modules still has dayjs 1.11.10 and no nanoid.

**What pulled says:** One issue: 2 packages differ from package-lock.json → `npm install`.

```
$ npx pulled --cwd scenarios/deps-stale
⚠ pulled: your local setup is out of sync with the code
  • Dependencies: 2 packages differ from package-lock.json
      dayjs 1.11.10 → 1.11.13, nanoid (not installed)
      → npm install
  Run `npx pulled --fix` to fix what can be fixed automatically.
```

Only the files pulled reads are committed here: `package.json`, the lockfiles (`package-lock.json` and npm's
hidden `node_modules/.package-lock.json`), `prisma/schema.prisma` and the generated client's copy of it, and the
`.env` files. They come from real `npm install` and `prisma generate` runs (Prisma 6.19.3).
