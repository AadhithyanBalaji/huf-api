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
import { StockInward } from './stock-inward.model';

@Injectable()
export class StockInwardFormService {
  dataSource: MatTableDataSource<StockInward, MatPaginator>;
  columns: IAmmrGridColumn[];
  loading = false;

  constructor(private readonly transactionService: TransactionService) {
    this.transactionService.stockTransactions$.subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.recordset as StockInward[]);
      this.loading = false;
    });
  }

  init(invoiceDetailsTemplate: TemplateRef<any>) {
    this.columns = this.getColumns(invoiceDetailsTemplate);
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      transactionFilters.transactionTypeId = 1;
      this.loading = true;
      this.transactionService.getTransactions(transactionFilters);
    }
  }

  navigateToAddInward() {
    this.transactionService.navigateToAddScreen('stockInward');
  }

  edit(transaction: Transaction) {
    this.transactionService.navigateToEditScreen(
      'stockInward',
      +transaction.transactionId
    );
  }

  delete(transaction: Transaction) {
    this.transactionService.delete(transaction);
  }

  private getColumns(
    invoiceDetailsTemplate: TemplateRef<any>
  ): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockInward>('sno'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<StockInward>('transactionId'),
        name: 'Transaction No.',
      },
      {
        key: Helper.nameof<StockInward>('inwardDate'),
        name: 'Inward Date',
        type: GridColumnType.Date,
      },
      {
        key: Helper.nameof<StockInward>('godown'),
        name: 'Godown',
      },
      {
        key: Helper.nameof<StockInward>('partyName'),
        name: 'Invoice Detail',
        type: GridColumnType.Template,
        template: invoiceDetailsTemplate,
      },
      {
        key: Helper.nameof<StockInward>('items'),
        name: 'Items',
      },
      {
        key: Helper.nameof<StockInward>('bags'),
        name: 'No. of Bags',
      },
      {
        key: Helper.nameof<StockInward>('qty'),
        name: 'Qty',
      },
      {
        key: Helper.nameof<StockInward>('createdBy'),
        name: 'Created By',
      },
      {
        key: Helper.nameof<StockInward>('updatedBy'),
        name: 'Updated By',
      },
    ];
  }
}
