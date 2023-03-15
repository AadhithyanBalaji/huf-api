import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IAmmrGridColumn } from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { TransactionService } from 'src/app/shared/transaction.service';

@Component({
  selector: 'app-all-transactions-report',
  templateUrl: './all-transactions-report.component.html',
  styleUrls: ['./all-transactions-report.component.css'],
})
export class AllTransactionsReportComponent {
  dataSource: MatTableDataSource<any>;
  columns: IAmmrGridColumn[];
  loading = false;

  constructor(private readonly transactionService: TransactionService) {
    this.transactionService.stockTransactions$.subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.recordset);
      const columnNames = Object.keys(this.dataSource.data[0]);
      this.columns = [];
      columnNames.forEach((col) => {
        this.columns.push({
          key: col,
          name: col,
        });
      });
      this.loading = false;
    });
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      this.loading = true;
      transactionFilters.transactionTypeId = null;
      this.transactionService.getTransactions(transactionFilters);
    }
  }
}
