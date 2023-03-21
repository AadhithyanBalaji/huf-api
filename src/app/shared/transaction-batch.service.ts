import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { ApiBusinessService } from './api-business.service';
import Helper from './helper';
import { AmrrBatch } from './models/amrr-batch.model';
import { TransactionBatch } from './models/transaction-batch.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionBatchService {
  dataSource: MatTableDataSource<TransactionBatch, MatPaginator> =
    new MatTableDataSource();

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar
  ) {}

  setupGrid(batches: TransactionBatch[]) {
    if (Helper.isTruthy(batches) && batches.length > 0) {
      this.dataSource.data = [...batches];
    } else {
      this.dataSource.data = [];
    }
  }

  addToGrid(batch: TransactionBatch) {
    this.dataSource.data = [...this.dataSource.data, batch];
  }

  removeFromGrid(batch: TransactionBatch) {
    const data = this.dataSource.data;
    const index = data.findIndex((d) => d.sno === batch.sno);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;
    }
  }

  getNextRowSno() {
    return this.dataSource.data.length + 1;
  }

  getBatches() {
    const batches = this.dataSource.data;
    if (batches.length <= 0) {
      this.snackBar.open('No batches added!');
    }
    return batches;
  }

  // to-do: make a pipe out of this
  getSelectedBatch(selectedBatch: AmrrBatch) {
    const transactionBatches = this.dataSource.data;
    let bags = selectedBatch?.bags ?? 0;
    let qty = selectedBatch?.qty ?? 0;
    if (Helper.isTruthy(selectedBatch) && transactionBatches?.length > 0) {
      transactionBatches.forEach((element) => {
        if (
          element.batchId === selectedBatch.id &&
          !Helper.isTruthy(element.id)
        ) {
          bags -= element.bags;
          qty -= element.qty;
        }
      });
    }
    return { bags: bags, qty: qty };
  }

  validateBatch(name: string, batchNameControl: FormControl) {
    if (!Helper.isTruthy(name) || name.length <= 0) return;
    this.apiBusinessService
      .get(`batch/${name}`)
      .pipe(take(1))
      .subscribe((res: any) =>
        Helper.isTruthy(res) &&
        res.recordset?.length > 0 &&
        +res.recordset[0]?.batchCount > 0
          ? batchNameControl.setErrors({ BatchExists: true })
          : batchNameControl.setErrors(null)
      );
  }
}
