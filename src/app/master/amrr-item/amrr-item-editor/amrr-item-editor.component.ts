import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AmrrItemEditorFormService } from './amrr-item-editor-form.service';
import { AmrrItem } from './amrr-item.model';

@Component({
  selector: 'app-amrr-item-editor',
  templateUrl: './amrr-item-editor.component.html',
  styleUrls: ['./amrr-item-editor.component.css'],
  providers: [AmrrItemEditorFormService],
})
export class AmrrItemEditorComponent implements OnInit {
  constructor(
    readonly formService: AmrrItemEditorFormService,
    @Inject(MAT_DIALOG_DATA) public data: AmrrItem,
    private readonly dialogRef: MatDialogRef<AmrrItemEditorComponent>
  ) {}

  ngOnInit(): void {
    this.formService.init(this.dialogRef, this.data);
  }
}
