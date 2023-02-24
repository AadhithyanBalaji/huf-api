import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AmrrItemGroupEditorFormService } from './amrr-item-group-editor-form.service';
import { AmrrItemGroup } from './amrr-item-group.model';

@Component({
  selector: 'app-amrr-item-group-editor',
  templateUrl: './amrr-item-group-editor.component.html',
  styleUrls: ['./amrr-item-group-editor.component.css'],
  providers: [AmrrItemGroupEditorFormService],
})
export class AmrrItemGroupEditorComponent implements OnInit {
  constructor(
    readonly formService: AmrrItemGroupEditorFormService,
    @Inject(MAT_DIALOG_DATA) public data: AmrrItemGroup,
    private readonly dialogRef: MatDialogRef<AmrrItemGroupEditorComponent>
  ) {}

  ngOnInit(): void {
    this.formService.init(this.dialogRef, this.data);
  }
}
