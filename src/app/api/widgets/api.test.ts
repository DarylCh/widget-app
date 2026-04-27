import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const {
  mockGetAllWidgets,
  mockCreateWidget,
  mockUpdateWidget,
  mockRemoveWidget,
} = vi.hoisted(() => ({
  mockGetAllWidgets: vi.fn(),
  mockCreateWidget: vi.fn(),
  mockUpdateWidget: vi.fn(),
  mockRemoveWidget: vi.fn(),
}));

vi.mock("@/lib/widgetStore", () => ({
  widgetStore: {
    getAll: mockGetAllWidgets,
    create: mockCreateWidget,
    update: mockUpdateWidget,
    remove: mockRemoveWidget,
  },
}));

const { GET, POST } = await import("./route");
const { PUT, DELETE } = await import("@/app/api/widgets/[id]/route");

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => vi.clearAllMocks());

describe("GET /api/widgets", () => {
  it("returns all widgets as JSON with status 200", async () => {
    const widgets = [{ id: "1", body: "hi", createdAt: new Date() }];
    mockGetAllWidgets.mockReturnValue(widgets);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe("1");
  });
});

describe("POST /api/widgets", () => {
  it("creates a widget and returns 201", async () => {
    const widget = { id: "abc", body: "", createdAt: new Date() };
    mockCreateWidget.mockReturnValue(widget);
    const res = await POST();
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBe("abc");
  });
});

describe("PUT /api/widgets/[id]", () => {
  it("updates a widget and returns it", async () => {
    const updated = { id: "1", body: "updated", createdAt: new Date() };
    mockUpdateWidget.mockReturnValue(updated);
    const req = new NextRequest("http://localhost/api/widgets/1", {
      method: "PUT",
      body: JSON.stringify({ body: "updated" }),
    });
    const res = await PUT(req, makeParams("1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.body).toBe("updated");
  });

  it("returns 404 when widget does not exist", async () => {
    mockUpdateWidget.mockReturnValue(null);
    const req = new NextRequest("http://localhost/api/widgets/missing", {
      method: "PUT",
      body: JSON.stringify({ body: "x" }),
    });
    const res = await PUT(req, makeParams("missing"));
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/widgets/[id]", () => {
  it("deletes a widget and returns 204", async () => {
    mockRemoveWidget.mockReturnValue("1");
    const req = new NextRequest("http://localhost/api/widgets/1", {
      method: "DELETE",
    });
    const res = await DELETE(req, makeParams("1"));
    expect(res.status).toBe(204);
  });

  it("returns 404 when widget does not exist", async () => {
    mockRemoveWidget.mockReturnValue(null);
    const req = new NextRequest("http://localhost/api/widgets/missing", {
      method: "DELETE",
    });
    const res = await DELETE(req, makeParams("missing"));
    expect(res.status).toBe(404);
  });
});
