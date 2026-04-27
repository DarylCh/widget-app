"use client";
import { useCallback, useEffect, useState } from "react";
import { WidgetContent } from "@/utils/types";
import {
  getWidgets,
  postWidget,
  deleteWidget,
  putWidget,
} from "../clients/widgetsClient";

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

  const createWidget = useCallback(async () => {
    try {
      const newWidget = await postWidget();
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

  const updateWidgetText = useCallback(async (id: string, body: string) => {
    try {
      const updated = await putWidget(id, body);
      setWidgets((prev) => prev.map((w) => (w.id === id ? updated : w)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update widget");
    }
  }, []);

  return {
    widgets,
    loading,
    error,
    createWidget,
    removeWidget,
    updateWidgetText,
  };
}
