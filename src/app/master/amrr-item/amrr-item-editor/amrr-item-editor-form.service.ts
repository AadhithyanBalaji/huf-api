import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { AmrrItemGroup } from '../../amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItemEditorComponent } from './amrr-item-editor.component';
import { AmrrItem } from './amrr-item.model';

@Injectable()
export class AmrrItemEditorFormService {
  dialogRef: MatDialogRef<AmrrItemEditorComponent, any>;
  data: AmrrItem;
  itemGroups: AmrrItemGroup[];
  shouldRefresh = false;
  form: FormGroup<{
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    name: FormControl<any>;
    isActive: FormControl<any>;
  }>;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(dialogRef: MatDialogRef<AmrrItemEditorComponent>, data: any) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.populateEditor(data);
  }

  addItem() {
    this.shouldRefresh = true;
    this.saveItem();
  }

  addItemAndClose() {
    this.saveItem(true);
  }

  cancel() {
    this.dialogRef.close(this.shouldRefresh);
  }

  private populateEditor(data: AmrrItem) {
    this.apiBusinessService
      .get('itemGroup')
      .pipe(take(1))
      .subscribe((res) => {
        this.itemGroups = res as AmrrItemGroup[];
        this.form = new FormGroup({
          itemGroupId: new FormControl(data?.itemGroupId, [
            Validators.required,
          ]),
          itemId: new FormControl(data?.id, [Validators.required]),
          name: new FormControl(data?.name, [Validators.required]),
          isActive: new FormControl(data?.isActive, [Validators.required]),
        });
      });
  }

  private saveItem(closeDialog = false) {
    const item = new AmrrItem();
    item.id = this.form.controls.itemId.value;
    item.itemGroupId = this.form.controls.itemGroupId.value;
    item.name = this.form.controls.name.value;
    item.isActive = this.form.controls.isActive.value;
    this.apiBusinessService
      .post('item', item)
      .pipe(take(1))
      .subscribe((_) =>
        closeDialog ? this.dialogRef.close(new AmrrItem()) : this.form.reset()
      );
  }
}
