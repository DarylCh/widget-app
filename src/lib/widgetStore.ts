import { WidgetContent } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";

declare global {
  var __widgetStore: Record<string, WidgetContent> | undefined;
}

// Persist across hot reloads in dev by attaching to globalThis
const store: Record<string, WidgetContent> = globalThis.__widgetStore ?? {};
globalThis.__widgetStore = store;

/**
 * In-memory widget store. Provides CRUD operations over a module-level
 * Record that is attached to `globalThis` so it survives Next.js hot reloads
 * in development. All operations are synchronous and O(1) by widget ID,
 * except `getAll` which is O(n log n) due to sorting.
 */
export const widgetStore = {
  /** Returns all widgets sorted by `createdAt` descending (newest first). */
  getAll(): WidgetContent[] {
    return Object.values(store).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  /** Creates a new widget with a UUID, empty body, and current timestamp. */
  create(): WidgetContent {
    const id = uuidv4();
    const newWidget: WidgetContent = { id, body: "", createdAt: new Date() };
    store[id] = newWidget;
    return newWidget;
  },

  /** Updates the body of an existing widget. Returns `null` if not found. */
  update(id: string, body: string): WidgetContent | null {
    if (!(id in store)) return null;
    store[id] = { ...store[id], body };
    return store[id];
  },

  /** Deletes a widget by ID. Returns the deleted ID, or `null` if not found. */
  remove(id: string): string | null {
    if (!(id in store)) return null;
    delete store[id];
    return id;
  },
};
