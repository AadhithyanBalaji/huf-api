import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { AmrrItemGroup } from '../../amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItemEditorComponent } from './amrr-item-editor.component';
import { AmrrItem } from './amrr-item.model';

@Injectable()
export class AmrrItemEditorFormService {
  dialogRef: MatDialogRef<AmrrItemEditorComponent, any>;
  data: AmrrItem;
  itemGroups: AmrrItemGroup[];
  form: FormGroup<{
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    name: FormControl<any>;
    isActive: FormControl<any>;
  }>;

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly formHelper: TransactionBatchFormHelperService
  ) {}

  init(dialogRef: MatDialogRef<AmrrItemEditorComponent>, data: any) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.populateEditor(data);
  }

  addItem() {
    this.saveItem(true);
  }

  addItemAndClose() {
    this.saveItem();
  }

  cancel() {
    this.dialogRef.close(new AmrrItemGroup());
  }

  private populateEditor(data: AmrrItem) {
    this.apiBusinessService
      .get('itemGroup')
      .pipe(take(1))
      .subscribe((res) => {
        this.itemGroups = res as AmrrItemGroup[];
        let itemGroup = null;
        if (data?.itemGroupId) {
          itemGroup = this.itemGroups.find((x) => x.id == data.itemGroupId);
        }
        this.form = new FormGroup({
          itemGroupId: new FormControl(itemGroup, [Validators.required]),
          itemId: new FormControl(data?.id),
          name: new FormControl(data?.name, [Validators.required]),
          isActive: new FormControl(data?.isActive ?? true, [
            Validators.required,
          ]),
        });
      });
  }

  private saveItem(closeDialog = false) {
    if (this.form.dirty && this.form.valid) {
      const item = new AmrrItem();
      item.id = this.form.controls.itemId.value;
      item.itemGroupId = this.form.controls.itemGroupId.value?.id;
      item.name = this.form.controls.name.value;
      item.isActive = this.form.controls.isActive.value;
      this.apiBusinessService
        .post('item', item)
        .pipe(take(1))
        .subscribe((_) => {
          closeDialog
            ? this.dialogRef.close(new AmrrItem())
            : this.form.reset();
          this.snackBar.open(
            `Item ${isNaN(item.id) || item.id <= 0 ? 'created!' : 'updated'}`
          );
          this.formHelper.resetForm(this.form);
        });
    }
  }
}
