import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-amrr-modal',
  templateUrl: './amrr-modal.component.html',
  styleUrls: ['./amrr-modal.component.css'],
})
export class AmrrModalComponent {
  title: string;
  body: string;
  actionText1: string;
  actionText2: string;

  constructor(
    public dialogRef: MatDialogRef<AmrrModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AmrrModalComponent
  ) {
    // Update view with given values
    this.title = data.title;
    this.body = data.body;
    this.actionText1 = data.actionText1 ?? 'Yes';
    this.actionText2 = data.actionText2 ?? 'No';
  }

  onActionOne() {
    this.dialogRef.close(true);
  }

  onActionTwo() {
    this.dialogRef.close(false);
  }
}
