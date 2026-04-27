import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Widget.module.css";

type WidgetProps = {
  body: string;
  onUpdateText: (text: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export const Widget: React.FC<WidgetProps> = ({
  body,
  onUpdateText,
  onDelete,
}) => {
  const [submittingText, setSubmittingText] = useState(false);
  const [executingDelete, setExecutingDelete] = useState(false);
  const isLoading = submittingText || executingDelete;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    const ref = textAreaRef.current;
    if (ref) {
      ref.style.height = "auto";
      ref.style.height = `${ref.scrollHeight}px`;
    }
  }, []);

  // Resize widget area upon body mutation
  useEffect(() => {
    resizeTextarea();
  }, [body, resizeTextarea]);

  // Resize widget area upon changes to the textArea
  useEffect(() => {
    const ref = textAreaRef.current;
    if (!ref) return;
    const observer = new ResizeObserver(() => resizeTextarea());
    observer.observe(ref);

    return () => observer.disconnect();
  }, [resizeTextarea]);

  const onFinishText = useCallback(
    async (text: string) => {
      try {
        setSubmittingText(true);
        await onUpdateText(text);
      } finally {
        setSubmittingText(false);
      }
    },
    [onUpdateText],
  );

  const onClickDelete = useCallback(async () => {
    try {
      setExecutingDelete(true);
      await onDelete();
    } finally {
      setExecutingDelete(false);
    }
  }, [onDelete]);

  return (
    <div className={styles.widget}>
      <textarea
        ref={textAreaRef}
        className={styles.textarea}
        defaultValue={body}
        placeholder="Enter some text"
        onInput={() => resizeTextarea()}
        onBlur={(e) => onFinishText(e.target.value)}
      />
      <button
        className={styles.deleteButton}
        disabled={isLoading}
        onClick={onClickDelete}
      >
        Delete
      </button>
    </div>
  );
};
