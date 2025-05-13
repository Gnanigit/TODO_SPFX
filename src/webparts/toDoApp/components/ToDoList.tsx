import * as React from "react";
import styles from "./ToDoApp.module.scss";
import { ITodoItem } from "../services/ToDoService";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";

export interface IToDoListProps {
  items: ITodoItem[];
  onDeleteItem: (id: number) => Promise<void>;
  onToggleComplete: (id: number) => Promise<void>;
  onEditItem: (item: ITodoItem) => void;
}

export default function ToDoList(props: IToDoListProps): JSX.Element {
  const { items, onDeleteItem, onToggleComplete, onEditItem } = props;

  if (items.length === 0) {
    return <div className={styles.emptyList}>No tasks yet. Add one above!</div>;
  }

  return (
    <div className={styles.todoList}>
      <h3>Tasks</h3>
      {items.map((item) => (
        <div key={item.id} className={styles.todoItem}>
          <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
          >
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 10 }}
            >
              <Checkbox
                checked={item.completed}
                onChange={() => onToggleComplete(item.id!)}
              />
              <div>
                <Text
                  block
                  className={item.completed ? styles.completedItem : ""}
                >
                  {item.title}
                </Text>
                {item.dueDate && (
                  <Text variant="small">
                    Due: {item.dueDate.toLocaleDateString()}
                  </Text>
                )}
              </div>
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 5 }}>
              <IconButton
                iconProps={{ iconName: "Edit" }}
                title="Edit"
                ariaLabel="Edit"
                onClick={() => onEditItem(item)}
              />
              <IconButton
                iconProps={{ iconName: "Delete" }}
                title="Delete"
                ariaLabel="Delete"
                onClick={() => onDeleteItem(item.id!)}
              />
            </Stack>
          </Stack>
        </div>
      ))}
    </div>
  );
}
