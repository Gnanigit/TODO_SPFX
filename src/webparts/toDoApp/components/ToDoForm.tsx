import * as React from "react";
import styles from "./ToDoApp.module.scss";
import { ITodoItem } from "../services/ToDoService";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { Stack } from "@fluentui/react/lib/Stack";

export interface IToDoFormProps {
  onAddItem: (title: string, dueDate?: Date) => Promise<void>;
  onUpdateItem: (item: ITodoItem) => Promise<void>;
  onCancelEdit: () => void;
  editingItem: ITodoItem | null;
}

export default function ToDoForm(props: IToDoFormProps): JSX.Element {
  const { onAddItem, onUpdateItem, onCancelEdit, editingItem } = props;
  const [title, setTitle] = React.useState<string>("");
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDueDate(editingItem.dueDate);
    } else {
      setTitle("");
      setDueDate(undefined);
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingItem) {
      await onUpdateItem({
        ...editingItem,
        title,
        dueDate,
      });
    } else {
      await onAddItem(title, dueDate);
    }

    setTitle("");
    setDueDate(undefined);
  };

  const handleCancel = (): void => {
    setTitle("");
    setDueDate(undefined);
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.todoForm}>
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField
          label="Task"
          value={title}
          onChange={(_, newValue) => setTitle(newValue || "")}
          placeholder="What needs to be done?"
          required
        />

        <DatePicker
          label="Due Date"
          value={dueDate}
          onSelectDate={(date) => setDueDate(date || undefined)}
          placeholder="Optional"
          formatDate={(date) => (date ? date.toLocaleDateString() : "")}
        />

        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <PrimaryButton
            type="submit"
            text={editingItem ? "Update Task" : "Add Task"}
            disabled={!title.trim()}
          />

          {editingItem && (
            <DefaultButton text="Cancel" onClick={handleCancel} />
          )}
        </Stack>
      </Stack>
    </form>
  );
}
