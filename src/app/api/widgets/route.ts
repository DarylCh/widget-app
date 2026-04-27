import { NextRequest, NextResponse } from "next/server";
import { WidgetContent } from "@/app/types";
import { getAllWidgets, addWidget } from "./store";

export async function GET(): Promise<NextResponse<WidgetContent[]>> {
  return NextResponse.json(getAllWidgets());
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<WidgetContent>> {
  const { body } = await request.json();
  const widget: WidgetContent = {
    id: crypto.randomUUID(),
    body,
    createdAt: new Date(),
  };
  return NextResponse.json(addWidget(widget), { status: 201 });
}
