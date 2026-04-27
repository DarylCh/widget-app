export type WidgetContent = {
  id: string;
  body: string;
  createdAt: Date;
};

export type WidgetId = Pick<WidgetContent, "id">;
