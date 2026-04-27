import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Widget } from "../app/components/Widget";

const noop = vi.fn().mockResolvedValue(undefined);

describe("Widget", () => {
  it("renders the body text in the textarea", () => {
    render(<Widget body="hello world" onUpdateText={noop} onDelete={noop} />);
    expect(screen.getByDisplayValue("hello world")).toBeInTheDocument();
  });

  it("renders placeholder when body is empty", () => {
    render(<Widget body="" onUpdateText={noop} onDelete={noop} />);
    expect(screen.getByPlaceholderText("Enter some text")).toBeInTheDocument();
  });

  it("renders a delete button", () => {
    render(<Widget body="" onUpdateText={noop} onDelete={noop} />);
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(<Widget body="" onUpdateText={noop} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("calls onUpdateText with new value on blur", async () => {
    const onUpdateText = vi.fn().mockResolvedValue(undefined);
    render(<Widget body="" onUpdateText={onUpdateText} onDelete={noop} />);
    const textarea = screen.getByPlaceholderText("Enter some text");
    await userEvent.type(textarea, "new text");
    await userEvent.tab();
    expect(onUpdateText).toHaveBeenCalledWith("new text");
  });

  it("disables delete button while deleting", async () => {
    let resolve: () => void;
    const onDelete = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    render(<Widget body="" onUpdateText={noop} onDelete={onDelete} />);
    const button = screen.getByRole("button", { name: /delete/i });
    await userEvent.click(button);
    expect(button).toBeDisabled();
    resolve!();
  });
});
