import { Injectable, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  loading = false;
  constructor(private readonly transactionService: TransactionService) {
    this.transactionService.stockTransactions$.subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(
        data.recordset as StockAdjustment[]
      );
      this.loading = false;
    });
  }

  init(dateTemplate: TemplateRef<any>) {
    this.columns = this.getColumns(dateTemplate);
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      transactionFilters.transactionTypeId = 3;
      this.loading = true;
      this.transactionService.getTransactions(transactionFilters);
    }
  }

  navigateToAddAdjustment() {
    this.transactionService.navigateToAddScreen('stockAdjustment');
  }

  edit(transaction: Transaction) {
    this.transactionService.navigateToEditScreen(
      'stockAdjustment',
      +transaction.transactionId
    );
  }

  delete(transaction: Transaction) {
    this.transactionService.delete(transaction);
  }

  private getColumns(dateTemplate: TemplateRef<any>): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockAdjustment>('sno'),
        name: 'S.No.',
        type: GridColumnType.Sno,
      },
      {
        key: Helper.nameof<StockAdjustment>('inwardDate'),
        name: 'Transaction Date',
        template: dateTemplate,
        type: GridColumnType.Template,
      },
      {
        key: Helper.nameof<StockAdjustment>('godown'),
        name: 'Godown',
        type: GridColumnType.String
      },
      {
        key: Helper.nameof<StockAdjustment>('items'),
        name: 'Items',
        type: GridColumnType.String
      },
      {
        key: Helper.nameof<StockAdjustment>('createdBy'),
        name: 'Created By',
        type: GridColumnType.String
      },
      {
        key: Helper.nameof<StockAdjustment>('updatedBy'),
        name: 'Updated By',
        type: GridColumnType.String
      },
    ];
  }
}
