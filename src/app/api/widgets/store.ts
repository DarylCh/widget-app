import { WidgetContent } from "@/app/types";

// In-memory store — persists for the lifetime of the server process
const store: Record<string, WidgetContent> = {};

export function getAllWidgets(): WidgetContent[] {
  return Object.values(store);
}

export function addWidget(widget: WidgetContent): WidgetContent {
  store[widget.id] = widget;
  return widget;
}

export function removeWidget(id: string): boolean {
  if (!(id in store)) return false;
  delete store[id];
  return true;
}
