import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AmrrTypeaheadMultiselectComponent } from 'src/app/shared/amrr-typeahead-multiselect/amrr-typeahead-multiselect.component';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
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
  typeaheadComponent: AmrrTypeaheadMultiselectComponent;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(
    dialogRef: MatDialogRef<AmrrBayEditorComponent>,
    data: AmrrBay,
    typeaheadComponent: AmrrTypeaheadMultiselectComponent
  ) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.typeaheadComponent = typeaheadComponent;
    this.populateEditor(data);
  }

  addBay() {
    this.saveBay();
  }

  addBayAndClose() {
    this.saveBay(true);
  }

  cancel() {
    this.dialogRef.close();
  }

  private populateEditor(data: AmrrBay) {
    this.apiBusinessService
      .get('godown')
      .pipe(take(1))
      .subscribe((res) => {
        this.godowns = res as AmrrGodown[];
        this.form = new FormGroup({
          id: new FormControl(data?.id),
          name: new FormControl(data?.name, [Validators.required]),
          godowns: new FormControl(data?.godowns, [Validators.required]),
          isActive: new FormControl(data?.isActive ?? true, [
            Validators.required,
          ]),
        });
      });
  }

  private saveBay(closeDialog = false) {
    const item = new AmrrBay();
    item.id = this.form.controls.id.value;
    item.name = this.form.controls.name.value;
    item.godownIds = this.form.controls.godowns.value;
    item.isActive = this.form.controls.isActive.value ? '1' : '0';
    this.apiBusinessService
      .post('bay', item)
      .pipe(take(1))
      .subscribe((_) =>
        closeDialog ? this.dialogRef.close(new AmrrBay()) : this.form.reset()
      );
  }
}
