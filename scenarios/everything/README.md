# All of it at once

**What your teammate pushed:** The dependency, .nvmrc, Prisma and .env.example changes above.

**What's on your machine:** The old install, the old Prisma client and the old .env.

**What pulled says:** Four issues: dependencies, Node version, Prisma client and .env.

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
```

The Node line shows whatever Node you run it with.

Only the files pulled reads are committed here: `package.json`, the lockfiles (`package-lock.json` and npm's
hidden `node_modules/.package-lock.json`), `prisma/schema.prisma` and the generated client's copy of it, and the
`.env` files. They come from real `npm install` and `prisma generate` runs (Prisma 6.19.3).
