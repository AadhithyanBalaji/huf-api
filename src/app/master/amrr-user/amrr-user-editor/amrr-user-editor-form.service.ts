import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { AmrrGodown } from '../../amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrUserEditorComponent } from './amrr-user-editor.component';
import { AmrrUser } from './amrr-user.model';

@Injectable()
export class AmrrUserEditorFormService {
  dialogRef: MatDialogRef<AmrrUserEditorComponent, AmrrUser>;
  data: AmrrUser;
  form: FormGroup<{
    id: FormControl<any>;
    name: FormControl<any>;
    mobileNumber: FormControl<any>;
    loginName: FormControl<any>;
    password: FormControl<any>;
    isAdmin: FormControl<any>;
    godowns: FormControl<any>;
    isActive: FormControl<any>;
  }>;
  godowns: AmrrGodown[];

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly formHelper: TransactionBatchFormHelperService
  ) {}

  init(
    dialogRef: MatDialogRef<AmrrUserEditorComponent>,
    data: AmrrUser
  ) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.populateEditor(data);
  }

  addUser() {
    this.saveUser(true);
  }

  addUserAndClose() {
    this.saveUser();
  }

  cancel() {
    this.dialogRef.close(new AmrrUser());
  }

  private populateEditor(data: AmrrUser) {
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
          mobileNumber: new FormControl(data?.mobileNumber, [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(10),
            Validators.maxLength(10),
          ]),
          loginName: new FormControl(data?.loginName, [Validators.required]),
          password: new FormControl(data?.password, [Validators.required]),
          isAdmin: new FormControl(data?.isAdmin ?? false, [Validators.required]),
          godowns: new FormControl(userGodowns, [Validators.required]),
          isActive: new FormControl(data?.isActive ?? true, [
            Validators.required,
          ]),
        });
      });
  }

  private saveUser(closeDialog = false) {
    if (this.form.dirty && this.form.valid) {
      const item = new AmrrUser();
      item.id = this.form.controls.id.value;
      item.name = this.form.controls.name.value;
      item.mobileNumber = this.form.controls.mobileNumber.value;
      item.loginName = this.form.controls.loginName.value;
      item.password = this.form.controls.password.value;
      item.isAdmin = this.form.controls.isAdmin.value ? '1' : '0';
      item.godownIds = this.form.controls.godowns.value
        ?.map((x: any) => x.id)
        ?.join(',');
      item.isActive = this.form.controls.isActive.value ? '1' : '0';
      this.apiBusinessService
        .post('user', item)
        .pipe(take(1))
        .subscribe((_) => {
          closeDialog
            ? this.dialogRef.close(new AmrrUser())
            : this.form.reset();
          this.snackBar.open(`User ${isNaN(item.id) ? 'created!' : 'updated'}`);
          this.formHelper.resetForm(this.form);
          this.form.controls.isActive.setValue(true);
        });
    }
  }
}
