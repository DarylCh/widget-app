"use client";
import { useCallback, useEffect, useState } from "react";
import { WidgetContent } from "@/utils/types";
import {
  getWidgets,
  postWidget,
  deleteWidget,
  putWidget,
} from "@/lib/clients/widgetsClient";

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
    const tempId = `temp-${Date.now()}`;
    const tempWidget: WidgetContent = {
      id: tempId,
      body: "",
      createdAt: new Date(),
    };
    setWidgets((prev) => [tempWidget, ...prev]);
    try {
      const newWidget = await postWidget();
      setWidgets((prev) => prev.map((w) => (w.id === tempId ? newWidget : w)));
    } catch (err) {
      setWidgets((prev) => prev.filter((w) => w.id !== tempId));
      setError(err instanceof Error ? err.message : "Failed to create widget");
    }
  }, []);

  const removeWidget = useCallback(async (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    try {
      await deleteWidget(id);
    } catch (err) {
      getWidgets()
        .then(setWidgets)
        .catch(() => null);
      setError(err instanceof Error ? err.message : "Failed to delete widget");
    }
  }, []);

  const updateWidgetText = useCallback(async (id: string, body: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, body } : w)));
    try {
      const updated = await putWidget(id, body);
      setWidgets((prev) => prev.map((w) => (w.id === id ? updated : w)));
    } catch (err) {
      // Re-fetch to restore accurate state
      getWidgets()
        .then(setWidgets)
        .catch(() => null);
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
