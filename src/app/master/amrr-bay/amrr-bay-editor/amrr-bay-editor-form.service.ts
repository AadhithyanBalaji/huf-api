import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { AmrrGodown } from '../../amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrBayEditorComponent } from './amrr-bay-editor.component';
import { AmrrBay } from './amrr-bay.model';

@Injectable()
export class AmrrBayEditorFormService {
  dialogRef: MatDialogRef<AmrrBayEditorComponent, AmrrBay>;
  data: AmrrBay;
  form: FormGroup<{
    id: FormControl<any>;
    name: FormControl<any>;
    godowns: FormControl<any>;
    isActive: FormControl<any>;
  }>;
  godowns: AmrrGodown[];

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly formHelper: TransactionBatchFormHelperService
  ) {}

  init(dialogRef: MatDialogRef<AmrrBayEditorComponent>, data: AmrrBay) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.populateEditor(data);
  }

  addBay() {
    this.saveBay(true);
  }

  addBayAndClose() {
    this.saveBay();
  }

  cancel() {
    this.dialogRef.close(new AmrrBay());
  }

  private populateEditor(data: AmrrBay) {
    this.apiBusinessService
      .get('godown')
      .pipe(take(1))
      .subscribe((res) => {
        this.godowns = res as AmrrGodown[];
        let userGodowns: AmrrGodown[] = [];
        if (data?.godowns?.length > 0) {
          const userGodownNames = data?.godowns.split(',');
          userGodowns = this.godowns.filter(
            (x) => userGodownNames.find((y) => y === x.name) !== undefined
          );
        }
        this.form = new FormGroup({
          id: new FormControl(data?.id),
          name: new FormControl(data?.name, [Validators.required]),
          godowns: new FormControl(userGodowns, [Validators.required]),
          isActive: new FormControl(data?.isActive ?? true, [
            Validators.required,
          ]),
        });
      });
  }

  private saveBay(closeDialog = false) {
    if (this.form.dirty && this.form.valid) {
      const item = new AmrrBay();
      item.id = this.form.controls.id.value;
      item.name = this.form.controls.name.value;
      item.godownIds = this.form.controls.godowns.value
        ?.map((x: any) => x.id)
        ?.join(',');
      item.isActive = this.form.controls.isActive.value ? '1' : '0';
      this.apiBusinessService
        .post('bay', item)
        .pipe(take(1))
        .subscribe((_) => {
          closeDialog ? this.dialogRef.close(new AmrrBay()) : this.form.reset();
          this.snackBar.open(`Bay ${isNaN(item.id) ? 'created!' : 'updated'}`);
          this.formHelper.resetForm(this.form);
          this.form.controls.isActive.setValue(true);
        });
    }
  }
}
