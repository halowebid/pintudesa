# Agent Development Guide

## Build/Test Commands

- Build: `bun run build` (all apps), `bun run next build` (Next.js apps)
- Test: No test commands found - check individual app requirements
- Lint: `bun run lint` (check), `bun run lint:fix` (fix)
- Format: `bun run format:check` (check), `bun run format:write` (fix)
- Type check: `bun run typecheck`
- Database: `bun run db:push`, `bun run db:migrate`, `bun run db:studio`

## Code Style

- Runtime: Bun (>=1.2.19), Node >=20
- Monorepo with Turbo, workspace packages in `apps/*` and `packages/*`
- TypeScript strict mode, use `type` for type imports
- Database: Drizzle ORM with PostgreSQL
- API: tRPC with zod validation
- Frontend: Next.js 15 with React 19, Tailwind CSS v4
- Error handling: Use `@yopem/try-catch` with `handleTRPCError`
- Imports: Absolute paths with `@/` for app internals, workspace packages via
  `@pintudesa/*`
- Naming: camelCase for functions/variables, PascalCase for components/types
- Functions: Export named functions, use async/await, destructure returns
- Types: Define schemas with zod, export insert/select types from schema files
- File structure: Group by feature, co-locate related files
