import { NextRequest, NextResponse } from "next/server";
import { removeWidget, updateWidget } from "../../../../utils/store";
import { WidgetContent } from "@/utils/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<WidgetContent>> {
  const { id } = await params;
  const { body } = await request.json();
  const updated = updateWidget(id, body);
  if (!updated)
    return NextResponse.json({ error: "Widget not found" } as never, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const deleted = removeWidget(id);
  if (!deleted)
    return NextResponse.json({ error: "Widget not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
