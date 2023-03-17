import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { AmrrGodownEditorComponent } from './amrr-godown-editor.component';
import { AmrrGodown } from './amrr-godown.model';

@Injectable()
export class AmrrGodownEditorFormService {
  dialogRef: MatDialogRef<AmrrGodownEditorComponent, AmrrGodown>;
  data: AmrrGodown;
  form: FormGroup<{
    id: FormControl<any>;
    name: FormControl<any>;
    capacity: FormControl<any>;
    gstInName: FormControl<any>;
    gstInAddress: FormControl<any>;
    isActive: FormControl<any>;
  }>;

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly formHelper: TransactionBatchFormHelperService
  ) {}

  init(dialogRef: MatDialogRef<AmrrGodownEditorComponent>, data: AmrrGodown) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.populateEditor(data);
  }

  addGodown() {
    this.saveGodown(true);
  }

  addGodownAndClose() {
    this.saveGodown();
  }

  cancel() {
    this.dialogRef.close(new AmrrGodown());
  }

  private populateEditor(data: AmrrGodown) {
    this.form = new FormGroup({
      id: new FormControl(data?.id),
      name: new FormControl(data?.name, [Validators.required]),
      capacity: new FormControl(data?.capacity),
      gstInName: new FormControl(data?.gstInName),
      gstInAddress: new FormControl(data?.gstInAddress),
      isActive: new FormControl(data?.isActive ?? true, [Validators.required]),
    });
  }

  private saveGodown(closeDialog = false) {
    if (this.form.dirty && this.form.valid) {
      const item = new AmrrGodown();
      item.id = this.form.controls.id.value;
      item.name = this.form.controls.name.value;
      item.capacity = this.form.controls.capacity.value;
      item.gstInName = this.form.controls.gstInName.value ?? '';
      item.gstInAddress = this.form.controls.gstInAddress.value ?? '';
      item.isActive = this.form.controls.isActive.value ? '1' : '0';

      this.apiBusinessService
        .post('godown', item)
        .pipe(take(1))
        .subscribe((_) => {
          closeDialog
            ? this.dialogRef.close(new AmrrGodown())
            : this.form.reset();
          this.snackBar.open(
            `Godown ${isNaN(item.id) ? 'created!' : 'updated'}`
          );
          this.formHelper.resetForm(this.form);
          this.form.controls.isActive.setValue(true);
        });
    }
  }
}
