---
name: API route prefix convention
description: How routes are registered in the Express API server for s-international
---

The Express app in `artifacts/api-server/src/app.ts` mounts all routes at `/api`:
```ts
app.use("/api", router);
```

**Why:** This means route handler files (e.g. `routes/reviews.ts`, `routes/packages.ts`) must define paths WITHOUT the `/api` prefix — e.g. `router.get("/packages/:slug/reviews", ...)` NOT `router.get("/api/packages/:slug/reviews", ...)`.

**How to apply:** Any time you add a new route file to `artifacts/api-server/src/routes/`, start paths from after the `/api` mount point. The full URL will be `/api/<your-path>`.
