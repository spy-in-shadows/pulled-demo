# Different Node version

**What your teammate pushed:** An .nvmrc that pins Node 18.

**What's on your machine:** Whatever Node runs this server (never 18: the demo needs ≥ 20.6).

**What pulled says:** One issue: the project expects Node 18 → `nvm use`.

```
$ npx pulled --cwd scenarios/node-mismatch
⚠ pulled: your local setup is out of sync with the code
  • Project expects Node 18, you're on 26.5.0
      → nvm use
```

The Node line shows whatever Node you run it with.

Only the files pulled reads are committed here: `package.json`, the lockfiles (`package-lock.json` and npm's
hidden `node_modules/.package-lock.json`), `prisma/schema.prisma` and the generated client's copy of it, and the
`.env` files. They come from real `npm install` and `prisma generate` runs (Prisma 6.19.3).
