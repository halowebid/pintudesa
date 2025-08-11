# Pintu Desa - Project Context for AI Agents

## Project Overview

Pintu Desa is a comprehensive village administration system built as a monorepo using Bun, TypeScript, and Next.js. The system is designed to digitize and streamline various administrative processes for villages in Indonesia, including:

- Village settings and profile management
- Population and family card administration
- Letter/document generation (birth certificates, death certificates, etc.)
- Financial and development administration
- Social assistance programs
- News and information management

The project follows a monorepo architecture with multiple apps and packages, using Turbo for build orchestration.

## Architecture

### Monorepo Structure
```
pintudesa/
├── apps/
│   ├── panel/          # Admin panel application
│   └── web/            # Public website application
├── packages/
│   ├── api/            # tRPC API routes and procedures
│   ├── auth/           # Authentication logic using Better Auth
│   ├── db/             # Database schema and migrations (Drizzle ORM)
│   ├── env/            # Environment variable management
│   ├── ui/             # Shared UI components
│   ├── utils/          # Shared utilities
└── package.json        # Root workspace configuration
```

### Technology Stack
- **Runtime**: Bun (>=1.2.19) with Node.js compatibility
- **Package Manager**: Bun
- **Build System**: Turbo
- **Frontend**: Next.js 15 with React 19, Tailwind CSS v4
- **Backend**: tRPC with Zod validation
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Monorepo**: Yarn Workspaces-style with Turbo
- **Type Safety**: TypeScript strict mode

## Development Workflow

### Prerequisites
- Bun >=1.2.19
- Node.js >=20
- PostgreSQL database
- Redis (for session management)

### Environment Setup
1. Copy `.env.example` to `.env` and populate required values
2. Install dependencies: `bun install`
3. Set up database: `bun run db:push` or `bun run db:migrate`

### Key Commands
- **Development**: `bun run dev` (starts all apps)
- **Build**: `bun run build` (builds all apps)
- **Linting**: `bun run lint` or `bun run lint:fix`
- **Formatting**: `bun run format:check` or `bun run format:write`
- **Type Check**: `bun run typecheck`
- **Database**: 
  - `bun run db:push` (push schema changes)
  - `bun run db:migrate` (run migrations)
  - `bun run db:studio` (open Drizzle Studio)

### App-Specific Development
- **Panel App** (Admin): `cd apps/panel && bun run dev`
- **Web App** (Public): `cd apps/web && bun run dev`

## Code Conventions

### Import Patterns
- Absolute imports with `@/` for app internals
- Workspace packages via `@pintudesa/*` namespaces
- Type-only imports should use `import type { Type } from 'module'`

### Naming Conventions
- Functions and variables: camelCase
- Components and types: PascalCase
- Files: camelCase.ts/tsx for code, kebab-case for others

### Code Structure
- Feature-based organization
- Related files should be colocated
- Export named functions rather than default exports
- Use async/await consistently
- Destructure return values for clarity

### Type Safety
- All API procedures must use Zod for validation
- Define schemas in the db package
- Export insert/select types from schema files

### Error Handling
- Use `@yopem/try-catch` with `handleTRPCError`
- Always validate inputs with Zod before processing

## Project Status

This is an active development project with ongoing feature implementation. Key areas of focus include:

1. Completing administrative features (Disposisi Surat, Laporan, etc.)
2. Implementing role-based authentication for different user types
3. Adding TRPC file upload functionality
4. Completing various bookkeeping modules for village administration

Refer to README.md for the current status of specific features marked with checkboxes.

## Database Schema

The database uses PostgreSQL with Drizzle ORM. Key models include:
- Village settings and profiles
- Population and family card data
- Administrative books (peraturan, keputusan, inventaris, etc.)
- Letter/document templates and generated documents
- User accounts with role-based permissions

Run `bun run db:studio` to explore the database schema visually.

## API Architecture

The API is built with tRPC and organized by feature modules. Each package in the monorepo contributes to different aspects:
- `@pintudesa/api`: Main API procedures
- `@pintudesa/auth`: Authentication logic
- `@pintudesa/db`: Database schema and queries
- `@pintudesa/env`: Environment variable management

All API routes are exposed through tRPC with strict Zod validation on inputs and outputs.