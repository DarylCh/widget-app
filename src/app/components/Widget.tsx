import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Widget.module.css";

const DEBOUNCE_MS = 500;

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const onInputChange = useCallback(
    (text: string) => {
      resizeTextarea();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onFinishText(text), DEBOUNCE_MS);
    },
    [onFinishText, resizeTextarea],
  );

  const onBlurFlush = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onFinishText(text);
    },
    [onFinishText],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
        placeholder="Enter some text..."
        onInput={(e) => onInputChange(e.currentTarget.value)}
        onBlur={(e) => onBlurFlush(e.target.value)}
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
