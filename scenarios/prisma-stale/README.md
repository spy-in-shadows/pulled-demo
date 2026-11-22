# Prisma schema changed

**What your teammate pushed:** A new avatarUrl field on User in prisma/schema.prisma.

**What's on your machine:** A Prisma client generated from the old schema.

**What pulled says:** One issue: the Prisma schema changed since the client was generated → `npx prisma generate`.

```
$ npx pulled --cwd scenarios/prisma-stale
⚠ pulled: your local setup is out of sync with the code
  • Prisma schema changed since the client was generated
      → npx prisma generate
  Run `npx pulled --fix` to fix what can be fixed automatically.
```

Only the files pulled reads are committed here: `package.json`, the lockfiles (`package-lock.json` and npm's
hidden `node_modules/.package-lock.json`), `prisma/schema.prisma` and the generated client's copy of it, and the
`.env` files. They come from real `npm install` and `prisma generate` runs (Prisma 6.19.3).
