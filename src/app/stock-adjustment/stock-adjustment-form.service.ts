import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GridColumnType,
  IAmmrGridColumn,
} from '../shared/ammr-grid/ammr-grid-column.interface';
import { AmrrReportFilters } from '../shared/amrr-report-filters/amrr-report-filters.model';
import Helper from '../shared/helper';
import { Transaction } from '../shared/models/transaction.model';
import { TransactionService } from '../shared/transaction.service';
import { StockAdjustment } from './stock-adjustment.model';

@Injectable()
export class StockAdjustmentFormService {
  dataSource: MatTableDataSource<StockAdjustment, MatPaginator>;
  columns: IAmmrGridColumn[];

  constructor(
    private readonly router: Router,
    private readonly transactionService: TransactionService
  ) {
    this.transactionService.stockTransactions$.subscribe(
      (data: any) =>
        (this.dataSource = new MatTableDataSource(
          data.recordset as StockAdjustment[]
        ))
    );
  }

  init() {
    this.columns = this.getColumns();
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      transactionFilters.transactionTypeId = 3;
      this.transactionService.getTransactions(transactionFilters);
    }
  }

  navigateToAddAdjustment() {
    this.router.navigate(['stockAdjustment', 'edit', 'new']);
  }

  edit(transaction: Transaction) {
    this.router.navigate([
      'stockAdjustment',
      'edit',
      +transaction.transactionId,
    ]);
  }

  delete(transaction: Transaction) {
    this.transactionService.delete(transaction);
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockAdjustment>('sno'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<StockAdjustment>('transactionId'),
        name: 'Transaction No',
      },
      {
        key: Helper.nameof<StockAdjustment>('inwardDate'),
        name: 'Transaction Date',
        type: GridColumnType.Date,
      },
      {
        key: Helper.nameof<StockAdjustment>('godown'),
        name: 'Godown',
      },
      {
        key: Helper.nameof<StockAdjustment>('items'),
        name: 'Items',
      },
      {
        key: Helper.nameof<StockAdjustment>('createdBy'),
        name: 'Created By',
      },
      {
        key: Helper.nameof<StockAdjustment>('updatedBy'),
        name: 'Updated By',
      },
    ];
  }
}
