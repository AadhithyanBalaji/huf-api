import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AmrrLoadingComponent } from './amrr-loading.component';

@Injectable()
export class AmrrLoadingDialogService {
  dialogRef: MatDialogRef<any>;
  constructor(private dialog: MatDialog) {}

  showLoading() {
    this.dialogRef = this.dialog.open(AmrrLoadingComponent, {
      disableClose: true,
    });
  }

  hideLoading() {
    this.dialogRef.close();
  }
}
