# Widget App

A full-stack web application where users can create, edit, and delete independent text widgets. Each widget holds its own content — typing and clicking away persists the text to the backend, and refreshing the page restores everything as it was.

## Tech Stack

- **Next.js 15** — App Router, API routes
- **React 19** — client components and hooks
- **TypeScript** — strict mode throughout
- **Vitest + React Testing Library** — unit and component tests
- **Docker** — multi-stage build with standalone Next.js output

## Features

- Add multiple text widgets via a single button
- Each widget is independent with its own editable text area
- Text is persisted to the backend on blur
- Widgets survive page refreshes
- Widgets can be deleted individually
- Textarea auto-resizes to fit content, including on viewport resize

## Prerequisites

- Node.js 20+
- npm 9+

## Running with Docker

```bash
docker build -t widget-app .
docker run -p 3000:3000 widget-app
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

```bash
npm test
```

Runs all unit tests with Vitest, covering:

- In-memory store logic (`store.test.ts`)
- API route handlers (`api.test.ts`)
- Widget component UI (`Widget.test.tsx`)
- Page-level UI (`page.test.tsx`)

## Running with Docker

```bash
docker build -t widget-app .
docker run -p 3000:3000 widget-app
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    api/widgets/          # REST API routes (GET, POST, PUT, DELETE)
    components/Widget.tsx # Widget card component
    hooks/useManageWidgets.ts # React hook — all widget state and CRUD
    page.tsx              # Main page
  lib/
    clients/widgetsClient.ts  # Fetch wrappers (no React)
    store.ts              # In-memory widget store
  utils/
    types.ts              # Shared TypeScript types
  test/                   # Unit tests
```

## Approach

The app uses Next.js App Router with API routes for the backend and React client components for the UI.

**Storage** is a module-level `Record` on the server, attached to `globalThis` so it survives Next.js hot reloads in development. Widgets are created with a UUID and stored by ID.

**API** follows a standard REST structure: `GET /api/widgets`, `POST /api/widgets`, `PUT /api/widgets/:id`, `DELETE /api/widgets/:id`.

**State** is managed in a single `useManageWidgets` hook that fetches on mount and exposes `createWidget`, `updateWidgetText`, and `removeWidget` callbacks. All mutations apply **optimistic updates** — local state is patched immediately so the UI never waits for a server round-trip. The page component is kept thin — it only renders and delegates.

**Persistence** is triggered by `onBlur` on the textarea, so a PUT request fires once when the user finishes editing rather than on every keystroke.

## Complexity

The store is backed by a `Record<string, WidgetContent>` (a plain JS object), giving:

| Operation                          | Time | Space |
| ---------------------------------- | ---- | ----- |
| `GET /api/widgets` (list all)      | O(n) | O(n)  |
| `POST /api/widgets` (create)       | O(1) | O(1)  |
| `PUT /api/widgets/:id` (update)    | O(1) | O(1)  |
| `DELETE /api/widgets/:id` (delete) | O(1) | O(1)  |

The list endpoint includes an O(n log n) sort by `createdAt`. Total storage is O(n) where n is the number of widgets.

## Tradeoffs

**No authentication** — all API routes are open: any client that can reach the server can read, create, update, or delete widgets from the global store. Given the brief made no mention of users or access control, I treated this as acceptable for the scope of the challenge. In a real product this would be the first thing to address, gating every route behind an auth check and scoping widgets to individual users.

**In-memory store instead of a real database** — the brief suggested in-memory storage, and it keeps the setup simple with no external dependencies. The tradeoff is that all data is lost when the server restarts. A document-style store (MongoDB, or even a JSON file) would be the natural next step: widgets are self-contained units with a simple, flexible structure that fits a document model well — a relational table would be unnecessary rigidity here.

**Client-side in-memory cache** — widget data is fetched once on mount and held in React state. This avoids redundant requests on every render, but the client can drift from the server if widgets are modified from another session. For a single-user app this is fine; a multi-tab or collaborative scenario would need proper cache invalidation via SWR, React Query, or a websocket.

**`onBlur` to persist, not on every keystroke** — saving on every input would mean either debouncing (extra complexity) or a flood of PUT requests. Saving on blur is simple and intentional — it maps to the moment the user signals they're done with a widget. The downside is that content typed just before closing the tab without clicking away would be lost.

**TypeScript over JavaScript** — TypeScript adds some initial overhead but provides type-safe contracts across the API, store, and UI layers. Errors are caught at compile time and the shape of data is explicit throughout the codebase.

**Plain textarea over a rich text editor** — the brief asked for plain text input, so a `<textarea>` was the right tool. Reaching for a rich text library (e.g. TipTap, Slate) would have been over-engineering and added a significant dependency for no stated requirement.

## What I Would Do Next

- **Add authentication** — scope widgets to individual users with proper auth so the store and API routes are not publicly accessible.
- **Persist to a real database** — move from the in-memory store to a document database or SQLite so data survives server restarts and scales beyond a single process.
- **Auto-save with debounce** — save as the user types with a short debounce (e.g. 500ms) rather than waiting for blur, so no content is lost if the page is closed mid-edit.
- **Optimistic update rollbacks** — mutations currently apply optimistic updates but don't roll back on failure. A failed delete or update should restore the previous state rather than leaving the UI out of sync with the server.
- **Cursor-based pagination** — the list endpoint currently returns all widgets. Since widgets are ordered by `createdAt`, a cursor-based approach (e.g. `?after=<createdAt timestamp>`) would allow efficient incremental loading without the inconsistency issues of offset pagination.
- **Drag-and-drop reordering** — let users rearrange widgets, which would require adding an `order` field to the data model.
- **End-to-end tests with Playwright** — the current tests cover units and component rendering well, but e2e tests would verify the full create → edit → refresh → persist flow in a real browser.
