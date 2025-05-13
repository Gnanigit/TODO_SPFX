import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface ITodoItem {
  id?: number;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export class ToDoService {
  private context: WebPartContext;
  private listName: string;

  constructor(context: WebPartContext, listName: string) {
    this.context = context;
    this.listName = listName;
  }

  /**
   * Gets all todo items from the SharePoint list
   */
  public async getTodoItems(): Promise<ITodoItem[]> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.listName}')/items?$select=Id,Title,Completed,DueDate`;

    try {
      const response = await this.context.spHttpClient.get(
        endpoint,
        SPHttpClient.configurations.v1
      );

      const responseJson = await response.json();

      return responseJson.value.map((item: any) => ({
        id: item.Id,
        title: item.Title,
        completed: item.Completed || false,
        dueDate: item.DueDate ? new Date(item.DueDate) : undefined,
      }));
    } catch (error) {
      console.error("Error fetching todo items:", error);
      return [];
    }
  }

  /**
   * Adds a new todo item to the SharePoint list
   */
  public async addTodoItem(item: ITodoItem): Promise<ITodoItem> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.listName}')/items`;

    const itemData = {
      Title: item.title,
      Completed: item.completed,
      DueDate: item.dueDate,
    };

    try {
      const response = await this.context.spHttpClient.post(
        endpoint,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
          },
          body: JSON.stringify(itemData),
        }
      );

      const responseJson = await response.json();

      return {
        id: responseJson.Id,
        title: responseJson.Title,
        completed: responseJson.Completed || false,
        dueDate: responseJson.DueDate
          ? new Date(responseJson.DueDate)
          : undefined,
      };
    } catch (error) {
      console.error("Error adding todo item:", error);
      throw error;
    }
  }

  /**
   * Updates an existing todo item in the SharePoint list
   */
  public async updateTodoItem(item: ITodoItem): Promise<void> {
    if (!item.id) {
      throw new Error("Item ID is required for update operation");
    }

    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.listName}')/items(${item.id})`;

    const itemData = {
      Title: item.title,
      Completed: item.completed,
      DueDate: item.dueDate,
    };

    try {
      await this.context.spHttpClient.post(
        endpoint,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
          },
          body: JSON.stringify(itemData),
        }
      );
    } catch (error) {
      console.error("Error updating todo item:", error);
      throw error;
    }
  }

  /**
   * Deletes a todo item from the SharePoint list
   */
  public async deleteTodoItem(id: number): Promise<void> {
    const endpoint = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.listName}')/items(${id})`;

    try {
      await this.context.spHttpClient.post(
        endpoint,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE",
          },
        }
      );
    } catch (error) {
      console.error("Error deleting todo item:", error);
      throw error;
    }
  }
}
