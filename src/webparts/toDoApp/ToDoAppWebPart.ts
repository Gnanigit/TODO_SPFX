import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "ToDoAppWebPartStrings";
import ToDoApp from "./components/ToDoApp";
import { IToDoAppProps } from "./components/IToDoAppProps";

export interface IToDoAppWebPartProps {
  description: string;
  listName: string;
}

export default class ToDoAppWebPart extends BaseClientSideWebPart<IToDoAppWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IToDoAppProps> = React.createElement(
      ToDoApp,
      {
        description: this.properties.description,
        listName: this.properties.listName || "TodoItems",
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneTextField("listName", {
                  label: "SharePoint List Name",
                  description:
                    "Name of the SharePoint list to store To-Do items",
                  value: this.properties.listName,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
