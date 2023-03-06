import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { ConsolidatedStockReport } from './consolidated-stock-report.model';

@Injectable()
export class ConsolidatedStockReportFormService {
  dataSource: MatTableDataSource<ConsolidatedStockReport, MatPaginator>;
  columns = [
    'S.No.',
    'Item Group',
    'Item Name',
    'Opening',
    'Inward',
    'Gain',
    'Outward',
    'Loss',
    'Closing',
  ];

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      this.apiBusinessService
        .post('report/consolidatedStock', transactionFilters)
        .pipe(take(1))
        .subscribe(
          (data: any) =>
            (this.dataSource = new MatTableDataSource(
              data.recordset as ConsolidatedStockReport[]
            ))
        );
    }
  }
}
