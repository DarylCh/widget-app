import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockCreateWidget = vi.fn();
const mockRemoveWidget = vi.fn();
const mockUpdateWidgetText = vi.fn();

const mockUseManageWidgets = vi.hoisted(() => vi.fn());

vi.mock("./hooks/useManageWidgets", () => ({
  useManageWidgets: mockUseManageWidgets,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseManageWidgets.mockReturnValue({
    widgets: [],
    loading: false,
    error: null,
    createWidget: mockCreateWidget,
    removeWidget: mockRemoveWidget,
    updateWidgetText: mockUpdateWidgetText,
  });
});

// Import after mock is registered
const { default: Home } = await import("./page");

describe("Home page", () => {
  it("renders the title", () => {
    render(<Home />);
    expect(screen.getByText("Widget Generator")).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    render(<Home />);
    expect(screen.getByText("Create a widget")).toBeInTheDocument();
  });

  it("renders the create button", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("calls createWidget when create button is clicked", async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole("button", { name: /create/i }));
    expect(mockCreateWidget).toHaveBeenCalledOnce();
  });

  it("renders no widgets when list is empty", () => {
    render(<Home />);
    expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
  });

  it("does not render an error when error is null", () => {
    render(<Home />);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("Home page — error state", () => {
  it("renders the error message when error is set", () => {
    mockUseManageWidgets.mockReturnValueOnce({
      widgets: [],
      loading: false,
      error: "Something went wrong",
      createWidget: vi.fn(),
      removeWidget: vi.fn(),
      updateWidgetText: vi.fn(),
    });
    render(<Home />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
