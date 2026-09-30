# Next.js template

This is a Next.js project organized with Feature-Sliced Design (FSD).

## Project structure

```text
app/                    # Next.js App Router entry points
src/
├── _app/               # Application-wide providers and styles
├── _pages/             # Route-level page slices
└── shared/             # Reusable UI, libraries, and API clients
```

Add `features` and `entities` only when a reusable interaction or domain
boundary is established. The root `app` directory should remain a thin routing
layer that delegates rendering to `src/_pages`.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place UI components in `src/shared/ui`.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/shared/ui/button";
```
