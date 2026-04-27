import { WidgetContent } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";

declare global {
  var widgetStore: Record<string, WidgetContent> | undefined;
}

// Persist across hot reloads in dev by attaching to globalThis
const store: Record<string, WidgetContent> = globalThis.widgetStore ?? {};
globalThis.widgetStore = store;

export function getAllWidgets(): WidgetContent[] {
  return Object.values(store).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createWidget(): WidgetContent {
  const id = uuidv4();
  const newWidget: WidgetContent = { id, body: "", createdAt: new Date() };
  store[id] = newWidget;
  return newWidget;
}

export function updateWidget(id: string, body: string): WidgetContent | null {
  if (!(id in store)) return null;
  store[id] = { ...store[id], body };
  return store[id];
}

export function removeWidget(id: string): string | null {
  if (!(id in store)) return null;
  delete store[id];
  return id;
}
