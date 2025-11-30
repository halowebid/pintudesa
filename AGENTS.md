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

## Next.js Patterns

### @dialog Parallel Routes (REQUIRED)

**IMPORTANT**: When creating CRUD pages in the panel app, ALWAYS implement
@dialog parallel routes for modal-based forms.

#### Required Structure

For every feature (e.g., `/surat/surat-keterangan-*`, `/buku/*`), create:

```
feature/
├── layout.tsx                    # Accept dialog slot
├── page.tsx                      # List/table view
├── tambah/
│   ├── page.tsx                  # Full page form (isDialog={false})
│   └── form.tsx                  # Reusable form component
├── edit/
│   └── [id]/
│       ├── page.tsx              # Full page form (isDialog={false})
│       └── form.tsx              # Reusable form component
└── @dialog/
    ├── default.tsx               # Return null
    ├── (.)tambah/
    │   └── page.tsx              # Modal for create (isDialog={true})
    └── (.)edit/
        └── [id]/
            └── page.tsx          # Modal for edit (isDialog={true})
```

#### Implementation Template

1. **layout.tsx** - Accept dialog slot:

```typescript
export default function Layout({
  children,
  dialog,
}: {
  children: React.ReactNode
  dialog: React.ReactNode
}) {
  return (
    <>
      {children}
      {dialog}
    </>
  )
}
```

2. **@dialog/default.tsx** - Default empty state:

```typescript
/**
 * Default slot for @dialog parallel route
 * Returns null when no dialog is active
 */
export default function Default() {
  return null
}
```

3. **@dialog/(.)tambah/page.tsx** - Create modal:

```typescript
import dynamicFn from "next/dynamic"
import DialogWrapper from "@/components/layout/dialog-wrapper"

const FeatureForm = dynamicFn(async () => {
  return await import("../../tambah/form")
})

export const metadata = {
  title: "Buat Feature",
}

export default function FeaturePage() {
  return (
    <DialogWrapper>
      <FeatureForm isDialog />
    </DialogWrapper>
  )
}
```

4. **@dialog/(.)edit/[id]/page.tsx** - Edit modal:

```typescript
import dynamicFn from "next/dynamic"
import DialogWrapper from "@/components/layout/dialog-wrapper"

const FeatureForm = dynamicFn(async () => {
  return await import("../../../edit/[id]/form")
})

export const metadata = {
  title: "Edit Feature",
}

export default function FeaturePage({ params }: { params: { id: string } }) {
  return (
    <DialogWrapper>
      <FeatureForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
```

5. **Form component** - Must accept `isDialog` prop:

```typescript
export default function FeatureForm({
  id,
  isDialog,
}: {
  id?: string
  isDialog: boolean
}) {
  const router = useRouter()

  // On success, handle navigation based on context
  const handleSuccess = () => {
    if (isDialog) {
      router.back() // Close modal
    } else {
      router.push("/feature") // Navigate to list
    }
  }

  // Use inline mode for selects/popovers in modals
  return (
    <form>
      <SelectContent mode={isDialog ? "inline" : "portal"}>
        {/* ... */}
      </SelectContent>
    </form>
  )
}
```

#### Why This Pattern?

- **Better UX**: Quick edits without losing context
- **Performance**: Modal opens instantly, no full page load
- **Flexibility**: Both modal and full-page modes supported
- **Navigation**: Browser back button closes modal naturally
