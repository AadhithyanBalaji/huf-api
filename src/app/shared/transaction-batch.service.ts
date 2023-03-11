import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Helper from './helper';
import { AmrrBatch } from './models/amrr-batch.model';
import { TransactionBatch } from './models/transaction-batch.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionBatchService {
  dataSource: MatTableDataSource<TransactionBatch, MatPaginator> =
    new MatTableDataSource();

  setupGrid(batches: TransactionBatch[]) {
    if (Helper.isTruthy(batches) && batches.length > 0) {
      this.dataSource.data = [...batches];
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

  // to-do: make a pipe out of this
  getSelectedBatch(selectedBatch: AmrrBatch) {
    const transactionBatches = this.dataSource.data;
    let bags = selectedBatch?.bags ?? 0;
    let qty = selectedBatch?.qty ?? 0;
    console.log(selectedBatch);
    if (Helper.isTruthy(selectedBatch) && transactionBatches?.length > 0) {
      console.log(selectedBatch);
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
}
