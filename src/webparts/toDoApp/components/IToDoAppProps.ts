import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IToDoAppProps {
  description: string;
  listName: string;
  context: WebPartContext;
}
