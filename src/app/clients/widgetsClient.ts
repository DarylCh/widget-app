import { WidgetContent } from "@/utils/types";

export async function getWidgets(): Promise<WidgetContent[]> {
  const res = await fetch("/api/widgets");
  if (!res.ok) throw new Error("Failed to fetch widgets");
  return res.json();
}

export async function postWidget(): Promise<WidgetContent> {
  const res = await fetch("/api/widgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create widget");
  return res.json();
}

export async function deleteWidget(id: string): Promise<void> {
  const res = await fetch(`/api/widgets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete widget");
}

export async function putWidget(
  id: string,
  body: string,
): Promise<WidgetContent> {
  const res = await fetch(`/api/widgets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error("Failed to update widget");
  return res.json();
}
