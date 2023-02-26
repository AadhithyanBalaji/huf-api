import { TemplateRef } from '@angular/core';

export class IAmmrGridColumn {
  key: string;
  name: string;
  type?: GridColumnType = GridColumnType.String;
  template?: TemplateRef<any>;
  hidden? = false;
}

export enum GridColumnType {
  Number = 1,
  String = 2,
  Template = 3,
  Boolean = 4
}
