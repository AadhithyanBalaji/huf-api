import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { BatchwiseStock } from './batchwise-stock-model';

@Injectable()
export class BatchwiseStockFormService {
  dataSource: MatTableDataSource<BatchwiseStock, MatPaginator>;
  columns = [
    'S.No.',
    'Godown/Bay',
    'Item Group',
    'Item Name',
    'Batch',
    'Opening',
    'Inward',
    'Gain',
    'Outward',
    'Loss',
    'Closing',
  ];
  loading = true;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      this.loading = true;
      this.apiBusinessService
        .post('report/batchwiseStock', transactionFilters)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.dataSource = new MatTableDataSource(
            data.recordset as BatchwiseStock[]
          );
          this.loading = false;
        });
    }
  }
}
