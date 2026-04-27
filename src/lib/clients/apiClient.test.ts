import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "./apiClient";

// stub the fetch module
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const mockWidget = { id: "1", body: "hello", createdAt: new Date() };

// mock responses
const okResponse = (data: unknown) =>
  ({ ok: true, json: () => Promise.resolve(data) }) as Response;
const errorResponse = () => ({ ok: false }) as Response;

beforeEach(() => vi.clearAllMocks());

describe("apiClient.getWidgets", () => {
  it("calls GET /api/widgets and returns parsed JSON", async () => {
    mockFetch.mockResolvedValue(okResponse([mockWidget]));
    const result = await apiClient.getWidgets();
    expect(mockFetch).toHaveBeenCalledWith("/api/widgets");
    expect(result).toEqual([mockWidget]);
  });

  it("throws on non-OK response", async () => {
    mockFetch.mockResolvedValue(errorResponse());
    await expect(apiClient.getWidgets()).rejects.toThrow(
      "Failed to fetch widgets",
    );
  });
});

describe("apiClient.postWidget", () => {
  it("calls POST /api/widgets and returns the new widget", async () => {
    mockFetch.mockResolvedValue(okResponse(mockWidget));
    const result = await apiClient.postWidget();
    expect(mockFetch).toHaveBeenCalledWith("/api/widgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    expect(result).toEqual(mockWidget);
  });

  it("throws on non-OK response", async () => {
    mockFetch.mockResolvedValue(errorResponse());
    await expect(apiClient.postWidget()).rejects.toThrow(
      "Failed to create widget",
    );
  });
});

describe("apiClient.deleteWidget", () => {
  it("calls DELETE /api/widgets/:id", async () => {
    mockFetch.mockResolvedValue(okResponse(null));
    await apiClient.deleteWidget("1");
    expect(mockFetch).toHaveBeenCalledWith("/api/widgets/1", {
      method: "DELETE",
    });
  });

  it("throws on non-OK response", async () => {
    mockFetch.mockResolvedValue(errorResponse());
    await expect(apiClient.deleteWidget("1")).rejects.toThrow(
      "Failed to delete widget",
    );
  });
});

describe("apiClient.putWidget", () => {
  it("calls PUT /api/widgets/:id with body and returns updated widget", async () => {
    mockFetch.mockResolvedValue(okResponse(mockWidget));
    const result = await apiClient.putWidget("1", "updated");
    expect(mockFetch).toHaveBeenCalledWith("/api/widgets/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "updated" }),
    });
    expect(result).toEqual(mockWidget);
  });

  it("throws on non-OK response", async () => {
    mockFetch.mockResolvedValue(errorResponse());
    await expect(apiClient.putWidget("1", "updated")).rejects.toThrow(
      "Failed to update widget",
    );
  });
});
