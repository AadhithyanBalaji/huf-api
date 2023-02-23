import { Injectable } from '@angular/core';
import { Form, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { AmrrItemGroupEditorComponent } from './amrr-item-group-editor.component';
import { AmrrItemGroup } from './amrr-item-group.model';

@Injectable()
export class AmrrItemGroupEditorFormService {
  name: FormControl;
  itemGroup: AmrrItemGroup;
  dialogRef: MatDialogRef<AmrrItemGroupEditorComponent, any>;
  data: any;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(dialogRef: MatDialogRef<AmrrItemGroupEditorComponent>, data: any) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.name = Helper.isTruthy(data)
      ? new FormControl(data.name, [Validators.required])
      : new FormControl('', [Validators.required]);
  }

  addItemGroup() {
    this.saveItemGroup();
  }

  addItemGroupAndClose() {
    this.saveItemGroup(true);
  }

  cancel() {
    this.dialogRef.close();
  }

  private saveItemGroup(closeDialog = false) {
    const itemGroup = new AmrrItemGroup();
    itemGroup.itemGroupId = Helper.isTruthy(this.data)
      ? this.data.itemGroupId
      : 0;
    itemGroup.name = this.name.value!.toString();
    this.apiBusinessService
      .post('itemGroup', itemGroup)
      .pipe(take(1))
      .subscribe((_) =>
        closeDialog ? this.dialogRef.close() : this.name.setValue(null)
      );
  }
}
