import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { ConsolidatedStockReport } from './consolidated-stock-report.model';

@Injectable()
export class ConsolidatedStockReportFormService {
  dataSource: MatTableDataSource<ConsolidatedStockReport, MatPaginator> =
    new MatTableDataSource();
  columns = [
    'sno',
    'itemGroup',
    'itemName',
    'openingQty',
    'inwardQty',
    'gainQty',
    'outwardQty',
    'lossQty',
    'closingQty',
  ];
  loading = true;
  sort: MatSort;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(sort: MatSort) {
    this.sort = sort;
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      this.loading = true;
      this.apiBusinessService
        .post('report/consolidatedStock', transactionFilters)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.dataSource = new MatTableDataSource(
            data.recordset as ConsolidatedStockReport[]
          );
          this.dataSource.sort = this.sort;
          this.loading = false;
        });
    }
  }
}
