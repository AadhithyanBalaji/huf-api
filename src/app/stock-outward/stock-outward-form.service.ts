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
import { StockOutward } from './stock-outward.model';

@Injectable()
export class StockOutwardFormService {
  dataSource: MatTableDataSource<StockOutward, MatPaginator>;
  columns: IAmmrGridColumn[];
  loading = false;

  constructor(private readonly transactionService: TransactionService) {
    this.transactionService.stockTransactions$.subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(
        data.recordset as StockOutward[]
      );
      this.loading = false;
    });
  }

  init(partyNameTemplate: TemplateRef<any>) {
    this.columns = this.getColumns(partyNameTemplate);
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      transactionFilters.transactionTypeId = 2;
      this.loading = true;
      this.transactionService.getTransactions(transactionFilters);
    }
  }

  navigateToAddOutward() {
    this.transactionService.navigateToAddScreen('stockOutward');
  }

  edit(transaction: Transaction) {
    this.transactionService.navigateToEditScreen(
      'stockOutward',
      +transaction.transactionId
    );
  }

  delete(transaction: Transaction) {
    this.transactionService.delete(transaction);
  }

  private getColumns(partyNameTemplate: TemplateRef<any>): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockOutward>('sno'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<StockOutward>('transactionId'),
        name: 'Transaction Id',
      },
      {
        key: Helper.nameof<StockOutward>('inwardDate'),
        name: 'Outward Date',
        type: GridColumnType.Date,
      },
      {
        key: Helper.nameof<StockOutward>('godown'),
        name: 'Godown',
      },
      {
        key: Helper.nameof<StockOutward>('partyName'),
        name: 'Party Name',
        type: GridColumnType.Template,
        template: partyNameTemplate,
      },
      {
        key: Helper.nameof<StockOutward>('items'),
        name: 'Items',
      },
      {
        key: Helper.nameof<StockOutward>('bags'),
        name: 'No. of Bags',
      },
      {
        key: Helper.nameof<StockOutward>('qty'),
        name: 'Qty',
      },
      {
        key: Helper.nameof<StockOutward>('createdBy'),
        name: 'Created By',
      },
      {
        key: Helper.nameof<StockOutward>('updatedBy'),
        name: 'Updated By',
      },
    ];
  }
}
