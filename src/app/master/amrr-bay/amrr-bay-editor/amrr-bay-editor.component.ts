import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AmrrTypeaheadMultiselectComponent } from 'src/app/shared/amrr-typeahead-multiselect/amrr-typeahead-multiselect.component';
import { AmrrBayEditorFormService } from './amrr-bay-editor-form.service';
import { AmrrBay } from './amrr-bay.model';

@Component({
  selector: 'app-amrr-bay-editor',
  templateUrl: './amrr-bay-editor.component.html',
  styleUrls: ['./amrr-bay-editor.component.css'],
  providers: [AmrrBayEditorFormService],
})
export class AmrrBayEditorComponent implements OnInit {
  @ViewChild('multiselect', {static: false}) typeaheadComponent: AmrrTypeaheadMultiselectComponent;

  constructor(
    readonly formService: AmrrBayEditorFormService,
    @Inject(MAT_DIALOG_DATA) public data: AmrrBay,
    private readonly dialogRef: MatDialogRef<AmrrBayEditorComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.typeaheadComponent);
    this.formService.init(this.dialogRef, this.data, this.typeaheadComponent);
  }
}
