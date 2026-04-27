"use client";
import { useCallback, useEffect, useState } from "react";
import { WidgetContent } from "@/app/types";
import { getWidgets, postWidget, deleteWidget } from "../clients/widgetsClient";

export const sampleData: WidgetContent[] = [
  {
    id: "1",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam.",
    createdAt: new Date("2024-01-03"),
  },
];

export function useManageWidgets() {
  const [widgets, setWidgets] = useState<WidgetContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWidgets()
      .then(setWidgets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const createWidget = useCallback(async (body?: string) => {
    try {
      const newWidget = await postWidget(body ?? "");
      setWidgets((prev) => [newWidget, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create widget");
    }
  }, []);

  const removeWidget = useCallback(async (id: string) => {
    try {
      await deleteWidget(id);
      setWidgets((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete widget");
    }
  }, []);

  return { widgets, loading, error, createWidget, removeWidget };
}
