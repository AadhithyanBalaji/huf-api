import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  GridColumnType,
  IAmmrGridColumn,
} from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import Helper from 'src/app/shared/helper';
import { TransactionService } from 'src/app/shared/transaction.service';

@Component({
  selector: 'app-all-transactions-report',
  templateUrl: './all-transactions-report.component.html',
  styleUrls: ['./all-transactions-report.component.css'],
})
export class AllTransactionsReportComponent {
  @ViewChild('dateTemplate', { static: true })
  dateTemplate: TemplateRef<any>;
  dataSource: MatTableDataSource<any>;
  columns: IAmmrGridColumn[] = [];
  loading = false;
  excludedColumns = ['transactionId', 'transactionTypeId'];

  constructor(private readonly transactionService: TransactionService) {
    this.transactionService.stockTransactions$.subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.recordset);
      if (this.dataSource.data?.length > 0) {
        let columnNames = Object.keys(this.dataSource.data[0]);
        columnNames = columnNames.filter(
          (x: string) => !this.excludedColumns.includes(x)
        );
        this.columns = columnNames.map((col: string) => this.buildColumn(col));
      }
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

  private buildColumn(colName: string): {
    key: string;
    name: string;
    type: GridColumnType;
    template?: TemplateRef<any>;
  } {
    let type = GridColumnType.String;
    if (colName.indexOf('date') !== -1) {
      type = GridColumnType.Date;
    } else if (colName === 'inwardDate') {
      type = GridColumnType.Template;
    }

    return {
      key: colName,
      name: colName,
      type: type,
      template:
        type === GridColumnType.Template ? this.dateTemplate : undefined,
    };
  }
}
