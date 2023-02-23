import { TemplateRef } from '@angular/core';

export class IAmmrGridColumn {
  key: string;
  name: string;
  type?: GridColumnType = GridColumnType.String;
  template?: TemplateRef<any>;
}

export enum GridColumnType {
  Number = 1,
  String = 2,
  Template = 3,
}
