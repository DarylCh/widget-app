import { NextResponse } from "next/server";
import { WidgetContent } from "@/utils/types";
import { widgetStore } from "@/lib/widgetStore";

export async function GET(): Promise<NextResponse<WidgetContent[]>> {
  return NextResponse.json(widgetStore.getAll());
}

export async function POST(): Promise<NextResponse<WidgetContent>> {
  const widget = widgetStore.create();
  return NextResponse.json(widget, { status: 201 });
}
