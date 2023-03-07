import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { ItemMovement } from './item-movement.model';

@Injectable()
export class ItemMovementReportFormService {
  dataSource: MatTableDataSource<ItemMovement, MatPaginator>;
  columns = [
    'S.No.',
    'Date',
    'Party/Vehicle Details',
    'Godown/Bay',
    'Invoice/Batch No.',
    'Inward',
    'Outward',
  ];

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly datePipe: DatePipe
  ) {}

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      this.apiBusinessService
        .post('report/itemMovement', transactionFilters)
        .pipe(take(1))
        .subscribe(
          (data: any) =>
            (this.dataSource = new MatTableDataSource(
              data.recordset as ItemMovement[]
            ))
        );
    }
  }

  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date) ?? '';
  }
}
