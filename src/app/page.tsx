"use client";
import { Widget } from "./components/Widget";
import { useManageWidgets } from "./hooks/useManageWidgets";

export type WidgetContent = {
  id: string;
  body: string;
  createdAt: Date;
};

function Home() {
  const { widgets, loading, createWidget, removeWidget } = useManageWidgets();

  return (
    <>
      <section id="spacer">
        <h2>Widget Creator</h2>
        <button disabled={loading} onClick={() => createWidget()}>
          <p>Create widget</p>
        </button>
      </section>
      <section
        id="widgets"
        style={{
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2>Widgets</h2>
        {widgets.map((entry) => (
          <Widget
            key={entry.id}
            body={entry.body}
            onDelete={async () => await removeWidget(entry.id)}
          />
        ))}
      </section>
    </>
  );
}

export default Home;
