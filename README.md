# Widget App

A full-stack web application for creating and managing independent text widgets. Users can add widgets, edit their content, and delete them individually. Text is auto-saved as you type, persisted to a REST API, and restored on page refresh. The text widgets grow to fit content and the UI stays responsive throughout.

## Tech Stack

- **Next.js 15** — App Router, API routes
- **React 19** — client components and hooks
- **TypeScript** — strict mode throughout
- **Vitest + React Testing Library** — unit and component tests
- **Docker** — multi-stage build with standalone Next.js output

## Prerequisites

- Node.js 20+
- npm 9+

## Running with Docker

```bash
npm run docker
```

Or manually:

```bash
docker build -t widget-app .
docker run --rm -p 3000:3000 widget-app
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

- In-memory store logic (`widgetStore.test.ts`)
- API client fetch wrappers (`apiClient.test.ts`)
- API route handlers (`api.test.ts`)
- Widget component UI (`Widget.test.tsx`)
- Page-level UI (`page.test.tsx`)

## Project Structure

```
src/
  app/
    api/widgets/          # REST API routes (GET, POST, PUT, DELETE) + api.test.ts
    components/           # Widget.tsx + Widget.test.tsx
    hooks/                # useManageWidgets.ts
    page.tsx              # Main page + page.test.tsx
  lib/
    clients/              # apiClient.ts + apiClient.test.ts
    widgetStore.ts        # In-memory widget store + widgetStore.test.ts
  utils/
    types.ts              # Shared TypeScript types
  test.setup.ts           # Vitest global setup
```

## Approach

The app uses Next.js App Router with API routes for the backend and React client components for the UI.

**Storage** is a module-level `Record` on the server, attached to `globalThis` so it survives Next.js hot reloads in development. Widgets are created with a UUID and stored by ID.

**API** follows a standard REST structure: `GET /api/widgets`, `POST /api/widgets`, `PUT /api/widgets/:id`, `DELETE /api/widgets/:id`.

**State** is managed in a single `useManageWidgets` hook that acts as the client-side orchestrator — it owns all widget state, coordinates calls to `apiClient`, and exposes a clean interface (`widgets`, `loading`, `error`, `createWidget`, `updateWidgetText`, `removeWidget`) to the UI. All mutations await the server response before updating local state, keeping the client in sync with the backend at all times. The page component is kept thin — it only renders and delegates.

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

**Next.js over a separate frontend/backend** — colocating the API routes and the React UI in a single Next.js app removes the need to run and coordinate two separate services. The tradeoff is that the frontend and backend are coupled in one deployment unit, so you can't scale them independently. For a small widget app this is a non-issue; a larger product with distinct scaling needs would be better served by a dedicated API service and a separate frontend.

**No authentication** — all API routes are open: any client that can reach the server can read, create, update, or delete widgets from the global store. Given the brief made no mention of users or access control, I treated this as acceptable for the scope of the challenge. In a real product this would be the first thing to address, gating every route behind an auth check and scoping widgets to individual users.

**In-memory store instead of a real database** — the brief suggested in-memory storage, and it keeps the setup simple with no external dependencies. The tradeoff is that all data is lost when the server restarts. A document-style store (MongoDB, or even a JSON file) would be the natural next step: widgets are self-contained units with a simple, flexible structure that fits a document model well — a relational table would be unnecessary rigidity here.

**Client-side in-memory cache** — widget data is fetched once on mount and held in React state. This avoids redundant requests on every render, but the client can drift from the server if widgets are modified from another session. For a single-user app this is fine; a multi-tab or collaborative scenario would need proper cache invalidation via SWR, React Query, or a websocket.

**Debounced auto-save over save-on-submit** — text is saved automatically 500ms after the user stops typing, with an immediate flush on blur. This means content is never lost if the tab is closed mid-edit, and no explicit save action is needed. The tradeoff is a steady stream of PUT requests while typing — mitigated by the debounce delay — and slightly more complexity in the component to manage the timer and cancel it on unmount.

**TypeScript over JavaScript** — TypeScript adds some initial overhead but provides type-safe contracts across the API, store, and UI layers. Errors are caught at compile time and the shape of data is explicit throughout the codebase.

**Plain textarea over a rich text editor** — the brief asked for plain text input, so a `<textarea>` was the right tool. Reaching for a rich text library (e.g. TipTap, Slate) would have been over-engineering and added a significant dependency for no stated requirement.

## What I Would Do Next

- **Add authentication** — scope widgets to individual users with proper auth so the store and API routes are not publicly accessible.
- **Persist to a real database** — move from the in-memory store to a document database or SQLite so data survives server restarts and scales beyond a single process.
- **Local cache layer** — introduce a client-side cache (e.g. SQLite via OPFS, or a library like React Query) managed by the `useManageWidgets` orchestrator. The hook would serve reads from cache instantly and sync writes to the API in the background, keeping the UI fast without sacrificing consistency.
- **End-to-end tests** — the current tests cover units and component rendering well, but e2e tests would verify the full create → edit → refresh → persist flow in a real browser.
- **Optimistic updates with rollback** — mutations currently wait for the server before updating state. Adding optimistic updates (patch state immediately, roll back on failure) would make the UI feel more responsive, at the cost of needing to restore the previous state reliably on error.
- **Cursor-based pagination** — the list endpoint currently returns all widgets. Since widgets are ordered by `createdAt`, a cursor-based approach (e.g. `?after=<createdAt timestamp>`) would allow efficient incremental loading without the inconsistency issues of offset pagination.
- **Drag-and-drop reordering** — let users rearrange widgets, which would require adding an `order` field to the data model.
