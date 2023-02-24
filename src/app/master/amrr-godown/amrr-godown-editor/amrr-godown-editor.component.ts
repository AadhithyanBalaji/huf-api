import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AmrrGodownEditorFormService } from './amrr-godown-editor-form.service';
import { AmrrGodown } from './amrr-godown.model';

@Component({
  selector: 'app-amrr-godown-editor',
  templateUrl: './amrr-godown-editor.component.html',
  styleUrls: ['./amrr-godown-editor.component.css'],
  providers: [AmrrGodownEditorFormService],
})
export class AmrrGodownEditorComponent implements OnInit {
  constructor(
    readonly formService: AmrrGodownEditorFormService,
    @Inject(MAT_DIALOG_DATA) public data: AmrrGodown,
    private readonly dialogRef: MatDialogRef<AmrrGodownEditorComponent>
  ) {}

  ngOnInit(): void {
    this.formService.init(this.dialogRef, this.data);
  }
}
