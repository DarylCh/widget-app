import { useState } from "react";

type WidgetProps = {
  body: string;
  onUpdateText?: (text: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export const Widget: React.FC<WidgetProps> = ({ body, onDelete }) => {
  const [executingDelete, setExecutingDelete] = useState(false);
  const isLoading = executingDelete;

  const onClickDelete = async () => {
    try {
      setExecutingDelete(true);
      await onDelete();
    } finally {
      setExecutingDelete(false);
    }
  };

  return (
    <>
      <div
        style={{
          maxWidth: "700px",
          padding: "10px 40px",
          backgroundColor: "grey",
          border: 1,
          borderRadius: "12px",
        }}
      >
        <textarea
          defaultValue={body}
          placeholder="Enter some text"
          style={{
            width: "200px",
            height: "200px",
            border: "1px solid #ccc",
            padding: "8px",
            resize: "none",
          }}
        />
        <button disabled={executingDelete} onClick={() => onClickDelete()}>
          <p>Delete Widget</p>
        </button>
      </div>
    </>
  );
};
