import { WidgetContent } from "@/utils/types";

/**
 * Client-side fetch wrappers for the widgets REST API.
 * All methods are async and throw on non-OK responses.
 * Import this object in React hooks or components — never in server-side code.
 */
export const apiClient = {
  async getWidgets(): Promise<WidgetContent[]> {
    const res = await fetch("/api/widgets");
    if (!res.ok) throw new Error("Failed to fetch widgets");
    return res.json();
  },

  async postWidget(): Promise<WidgetContent> {
    const res = await fetch("/api/widgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to create widget");
    return res.json();
  },

  async deleteWidget(id: string): Promise<void> {
    const res = await fetch(`/api/widgets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete widget");
  },

  async putWidget(id: string, body: string): Promise<WidgetContent> {
    const res = await fetch(`/api/widgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) throw new Error("Failed to update widget");
    return res.json();
  },
};
