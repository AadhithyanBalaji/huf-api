import { DatePipe } from '@angular/common';
import { Injectable, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { AmrrBay } from '../master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from '../master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItemGroup } from '../master/amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItem } from '../master/amrr-item/amrr-item-editor/amrr-item.model';
import {
  GridColumnType,
  IAmmrGridColumn,
} from '../shared/ammr-grid/ammr-grid-column.interface';
import { AmrrModalComponent } from '../shared/amrr-modal/amrr-modal.component';
import { AmrrReportFilters } from '../shared/amrr-report-filters/amrr-report-filters.model';
import { IAmrrTypeahead } from '../shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../shared/api-business.service';
import Helper from '../shared/helper';
import { AmrrBatch } from '../shared/models/amrr-batch.model';
import { Transaction } from '../shared/models/transaction.model';
import { StockOutward } from './stock-outward.model';

@Injectable()
export class StockOutwardFormService {
  dataSource: MatTableDataSource<StockOutward, MatPaginator>;
  columns: IAmmrGridColumn[];

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  init(partyNameTemplate: TemplateRef<any>) {
    this.columns = this.getColumns(partyNameTemplate);
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      transactionFilters.transactionTypeId = 2;
      this.apiBusinessService
        .post('stock/transactions', transactionFilters)
        .pipe(take(1))
        .subscribe(
          (data: any) =>
            (this.dataSource = new MatTableDataSource(
              data.recordset as StockOutward[]
            ))
        );
    }
  }

  navigateToAddOutward() {
    this.router.navigate(['stockOutward', 'edit', 'new']);
  }

  edit(transaction: Transaction) {
    this.router.navigate(['stockOutward', 'edit', +transaction.transactionId]);
  }

  delete(transaction: Transaction) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete the transaction with invoice - ${transaction.invoiceNo} ?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        result ? this.deleteTransaction(transaction.transactionId) : null;
      });
  }

  private getColumns(partyNameTemplate: TemplateRef<any>): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockOutward>('transactionId'),
        name: 'TRID',
        hidden: true,
      },
      {
        key: Helper.nameof<StockOutward>('sno'),
        name: 'S.No.',
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

  private deleteTransaction(transactionId: number) {
    this.apiBusinessService
      .delete('stock', transactionId)
      .pipe(take(1))
      .subscribe((_) => {
        this.snackBar.open('Deleted Transaction', '', { duration: 2000 });
        //this.getData();
      });
  }
}
