import { describe, it, expect, beforeEach } from "vitest";
import { widgetStore } from "@/lib/widgetStore";

const {
  getAll: getAllWidgets,
  create: createWidget,
  update: updateWidget,
  remove: removeWidget,
} = widgetStore;

// Reset the global store before each test to ensure isolation
beforeEach(() => {
  const store = globalThis.__widgetStore;
  if (store) {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
  }
});

describe("widgetStore.getAll", () => {
  it("returns an empty array when no widgets exist", () => {
    expect(getAllWidgets()).toEqual([]);
  });

  it("returns all created widgets", () => {
    createWidget();
    createWidget();
    expect(getAllWidgets()).toHaveLength(2);
  });

  it("returns widgets sorted newest first", async () => {
    const first = createWidget();
    // Small delay so createdAt differs
    await new Promise((r) => setTimeout(r, 5));
    const second = createWidget();
    const result = getAllWidgets();
    expect(result[0].id).toBe(second.id);
    expect(result[1].id).toBe(first.id);
  });
});

describe("widgetStore.create", () => {
  it("returns a widget with a unique id, empty body and a createdAt date", () => {
    const widget = createWidget();
    expect(widget.id).toBeTruthy();
    expect(widget.body).toBe("");
    expect(widget.createdAt).toBeInstanceOf(Date);
  });

  it("generates unique ids for each widget", () => {
    const a = createWidget();
    const b = createWidget();
    expect(a.id).not.toBe(b.id);
  });
});

describe("widgetStore.update", () => {
  it("updates the body of an existing widget", () => {
    const { id } = createWidget();
    const updated = updateWidget(id, "new body");
    expect(updated?.body).toBe("new body");
  });

  it("returns null for a non-existent id", () => {
    expect(updateWidget("does-not-exist", "body")).toBeNull();
  });

  it("does not affect other widgets", () => {
    const a = createWidget();
    const b = createWidget();
    updateWidget(a.id, "changed");
    const all = getAllWidgets();
    const bResult = all.find((w) => w.id === b.id);
    expect(bResult?.body).toBe("");
  });
});

describe("widgetStore.remove", () => {
  it("removes an existing widget and returns its id", () => {
    const { id } = createWidget();
    expect(removeWidget(id)).toBe(id);
    expect(getAllWidgets()).toHaveLength(0);
  });

  it("returns null for a non-existent id", () => {
    expect(removeWidget("does-not-exist")).toBeNull();
  });

  it("only removes the targeted widget", () => {
    const a = createWidget();
    const b = createWidget();
    removeWidget(a.id);
    const all = getAllWidgets();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(b.id);
  });
});
