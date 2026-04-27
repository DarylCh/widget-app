import { NextResponse } from "next/server";
import { WidgetContent } from "@/utils/types";
import { getAllWidgets, createWidget } from "@/utils/store";

export async function GET(): Promise<NextResponse<WidgetContent[]>> {
  return NextResponse.json(getAllWidgets());
}

export async function POST(): Promise<NextResponse<WidgetContent>> {
  const widget = createWidget();
  return NextResponse.json(widget, { status: 201 });
}
