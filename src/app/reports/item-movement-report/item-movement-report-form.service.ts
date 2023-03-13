import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { ItemMovement } from './item-movement.model';

@Injectable()
export class ItemMovementReportFormService {
  count = 0;
  dataSource: MatTableDataSource<ItemMovement, MatPaginator> = new MatTableDataSource();
  columns = [
    'S.No.',
    'Date',
    'Party/Vehicle Details',
    'Godown/Bay',
    'Invoice/Batch No.',
    'Inward',
    'Outward',
  ];
  loading = false;

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly datePipe: DatePipe,
    private readonly snackBar: MatSnackBar
  ) {}

  getData(transactionFilters: AmrrReportFilters) {
    if (
      Helper.isTruthy(transactionFilters) &&
      Helper.isValidNumber(transactionFilters.itemId) &&
      transactionFilters.itemId! > 0
    ) {
      this.loading = true;
      this.apiBusinessService
        .post('report/itemMovement', transactionFilters)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.dataSource = new MatTableDataSource(
            data.recordset as ItemMovement[]
          );
          this.loading = false;
        });
    } else if (
      this.count > 0 &&
      (!Helper.isValidNumber(transactionFilters.itemId) ||
        transactionFilters.itemId! <= 0)
    ) {
      this.snackBar.open('Select an item please');
    }
    this.count++;
  }

  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date) ?? '';
  }

  getTotalInward(transactionTypeId = 1) {
    let qty = 0,
      bags = 0;
    const data = Helper.isTruthy(this.dataSource?.data)
      ? this.dataSource.data.filter(
          (d) => d.transactionTypeId === transactionTypeId
        )
      : [];
    data.forEach((d) => {
      qty += +d.qty;
      bags += +d.bags;
    });

    return { qty: qty, bags: bags };
  }
}
