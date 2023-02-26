import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AmrrTypeaheadMultiselectComponent } from 'src/app/shared/amrr-typeahead-multiselect/amrr-typeahead-multiselect.component';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
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
  typeaheadComponent: AmrrTypeaheadMultiselectComponent;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(
    dialogRef: MatDialogRef<AmrrUserEditorComponent>,
    data: AmrrUser,
    typeaheadComponent: AmrrTypeaheadMultiselectComponent
  ) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.typeaheadComponent = typeaheadComponent;
    this.populateEditor(data);
  }

  addUser() {
    this.saveUser();
  }

  addUserAndClose() {
    this.saveUser(true);
  }

  cancel() {
    this.dialogRef.close();
  }

  private populateEditor(data: AmrrUser) {
    this.apiBusinessService
      .get('godown')
      .pipe(take(1))
      .subscribe((res) => {
        this.godowns = res as AmrrGodown[];
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
          isAdmin: new FormControl(data?.isAdmin, [Validators.required]),
          godowns: new FormControl(data?.godowns, [Validators.required]),
          isActive: new FormControl(data?.isActive ?? true, [
            Validators.required,
          ]),
        });
      });
  }

  private saveUser(closeDialog = false) {
    const item = new AmrrUser();
    item.id = this.form.controls.id.value;
    item.name = this.form.controls.name.value;
    item.mobileNumber = this.form.controls.mobileNumber.value;
    item.loginName = this.form.controls.loginName.value;
    item.password = this.form.controls.password.value;
    item.isAdmin = this.form.controls.isAdmin.value ? '1' : '0';
    item.godownIds = this.form.controls.godowns.value;
    item.isActive = this.form.controls.isActive.value ? '1' : '0';
    this.apiBusinessService
      .post('user', item)
      .pipe(take(1))
      .subscribe((_) =>
        closeDialog ? this.dialogRef.close(new AmrrUser()) : this.form.reset()
      );
  }
}
