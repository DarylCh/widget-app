"use client";
import { useCallback, useEffect, useState } from "react";
import { WidgetContent } from "@/utils/types";
import { apiClient } from "@/lib/clients/apiClient";

export function useManageWidgets() {
  const [widgets, setWidgets] = useState<WidgetContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const data = await apiClient.getWidgets();
        setWidgets(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch widgets",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWidgets();
  }, []);

  const createWidget = useCallback(async () => {
    try {
      const newWidget = await apiClient.postWidget();
      setWidgets((prev) => [newWidget, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create widget");
    }
  }, []);

  const removeWidget = useCallback(async (id: string) => {
    try {
      await apiClient.deleteWidget(id);
      setWidgets((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete widget");
    }
  }, []);

  const updateWidgetText = useCallback(async (id: string, body: string) => {
    try {
      const updated = await apiClient.putWidget(id, body);
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
