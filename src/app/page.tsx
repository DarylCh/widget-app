"use client";
import { Widget } from "./components/Widget";
import { useManageWidgets } from "./hooks/useManageWidgets";
import styles from "./page.module.css";

export type WidgetContent = {
  id: string;
  body: string;
  createdAt: Date;
};

function Home() {
  const { widgets, loading, error, createWidget, removeWidget, updateWidgetText } =
    useManageWidgets();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Widget Generator</h2>
          <p className={styles.subheading}>Create a widget</p>
          <button className={styles.createButton} disabled={loading} onClick={() => createWidget()}>
            + Create
          </button>
        </header>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.widgetList}>
          {widgets.map((entry) => (
            <Widget
              key={entry.id}
              body={entry.body}
              onUpdateText={(text: string) => updateWidgetText(entry.id, text)}
              onDelete={() => removeWidget(entry.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
