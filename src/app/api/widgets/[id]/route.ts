import { NextRequest, NextResponse } from "next/server";
import { removeWidget } from "../store";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const deleted = removeWidget(id);
  if (!deleted) return NextResponse.json({ error: "Widget not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
