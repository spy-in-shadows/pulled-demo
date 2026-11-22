# New environment variables

**What your teammate pushed:** Added SESSION_SECRET and STRIPE_SECRET_KEY to .env.example.

**What's on your machine:** Your .env predates them.

**What pulled says:** One issue: `SESSION_SECRET` and `STRIPE_SECRET_KEY` are missing in .env (never auto-fixed).

```
$ npx pulled --cwd scenarios/env-missing
⚠ pulled: your local setup is out of sync with the code
  • Missing in .env: SESSION_SECRET, STRIPE_SECRET_KEY
      → add them to .env (see .env.example)
```

Only the files pulled reads are committed here: `package.json`, the lockfiles (`package-lock.json` and npm's
hidden `node_modules/.package-lock.json`), `prisma/schema.prisma` and the generated client's copy of it, and the
`.env` files. They come from real `npm install` and `prisma generate` runs (Prisma 6.19.3).
