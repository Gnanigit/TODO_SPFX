import * as React from "react";
import styles from "./ToDoApp.module.scss";
import { IToDoAppProps } from "./IToDoAppProps";
import { ITodoItem, ToDoService } from "../services/ToDoService";
import ToDoForm from "./ToDoForm";
import ToDoList from "./ToDoList";
import { escape } from "@microsoft/sp-lodash-subset";

export interface IToDoAppState {
  items: ITodoItem[];
  loading: boolean;
  error: string | null;
  editingItem: ITodoItem | null;
}

export default class ToDoApp extends React.Component<
  IToDoAppProps,
  IToDoAppState
> {
  private todoService: ToDoService;

  constructor(props: IToDoAppProps) {
    super(props);

    this.todoService = new ToDoService(props.context, props.listName);

    this.state = {
      items: [],
      loading: true,
      error: null,
      editingItem: null,
    };
  }

  public componentDidMount(): void {
    this.loadTodoItems();
  }

  private async loadTodoItems(): Promise<void> {
    try {
      const items = await this.todoService.getTodoItems();
      this.setState({
        items,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: "Failed to load todo items",
        loading: false,
      });
      console.error("Error loading todo items:", error);
    }
  }

  private handleAddItem = async (
    title: string,
    dueDate?: Date
  ): Promise<void> => {
    try {
      const newItem: ITodoItem = {
        title,
        completed: false,
        dueDate,
      };

      const addedItem = await this.todoService.addTodoItem(newItem);

      this.setState((prevState) => ({
        items: [...prevState.items, addedItem],
      }));
    } catch (error) {
      this.setState({
        error: "Failed to add todo item",
      });
      console.error("Error adding todo item:", error);
    }
  };

  private handleDeleteItem = async (id: number): Promise<void> => {
    try {
      await this.todoService.deleteTodoItem(id);

      this.setState((prevState) => ({
        items: prevState.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      this.setState({
        error: "Failed to delete todo item",
      });
      console.error("Error deleting todo item:", error);
    }
  };

  private handleToggleComplete = async (id: number): Promise<void> => {
    const { items } = this.state;
    const item = items.find((i) => i.id === id);

    if (!item) return;

    const updatedItem: ITodoItem = {
      ...item,
      completed: !item.completed,
    };

    try {
      await this.todoService.updateTodoItem(updatedItem);

      this.setState((prevState) => ({
        items: prevState.items.map((i) => (i.id === id ? updatedItem : i)),
      }));
    } catch (error) {
      this.setState({
        error: "Failed to update todo item",
      });
      console.error("Error updating todo item:", error);
    }
  };

  private handleEditItem = (item: ITodoItem): void => {
    this.setState({
      editingItem: item,
    });
  };

  private handleUpdateItem = async (updatedItem: ITodoItem): Promise<void> => {
    try {
      await this.todoService.updateTodoItem(updatedItem);

      this.setState((prevState) => ({
        items: prevState.items.map((i) =>
          i.id === updatedItem.id ? updatedItem : i
        ),
        editingItem: null,
      }));
    } catch (error) {
      this.setState({
        error: "Failed to update todo item",
      });
      console.error("Error updating todo item:", error);
    }
  };

  private handleCancelEdit = (): void => {
    this.setState({
      editingItem: null,
    });
  };

  public render(): React.ReactElement<IToDoAppProps> {
    const { description } = this.props;
    const { items, loading, error, editingItem } = this.state;

    return (
      <div className={styles.toDoApp}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>{escape(description)}</h2>

              {error && (
                <div className={styles.error}>
                  {error}
                  <button onClick={() => this.setState({ error: null })}>
                    Dismiss
                  </button>
                </div>
              )}

              <ToDoForm
                onAddItem={this.handleAddItem}
                editingItem={editingItem}
                onUpdateItem={this.handleUpdateItem}
                onCancelEdit={this.handleCancelEdit}
              />

              {loading ? (
                <div>Loading items...</div>
              ) : (
                <ToDoList
                  items={items}
                  onDeleteItem={this.handleDeleteItem}
                  onToggleComplete={this.handleToggleComplete}
                  onEditItem={this.handleEditItem}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
