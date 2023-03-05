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
import { IAmrrTypeahead } from '../shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../shared/api-business.service';
import Helper from '../shared/helper';
import { AmrrBatch } from '../shared/models/amrr-batch.model';
import { Transaction } from '../shared/models/transaction.model';
import { TransactionsRequest } from '../shared/transaction-request.model';
import { TransactionService } from '../shared/transaction.service';
import { StockAdjustment } from './stock-adjustment.model';

@Injectable()
export class StockAdjustmentFormService {
  godowns: AmrrGodown[] = [];
  bays: AmrrBay[] = [];
  itemGroups: AmrrItemGroup[] = [];
  items: AmrrItem[] = [];
  batches: IAmrrTypeahead[];
  form: FormGroup<{
    fromDate: FormControl<any>;
    toDate: FormControl<any>;
    goDownId: FormControl<any>;
    bayId: FormControl<any>;
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    batchId: FormControl<any>;
  }>;
  dataSource: MatTableDataSource<StockAdjustment, MatPaginator> = new MatTableDataSource();
  columns: IAmmrGridColumn[];

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly router: Router,
    private readonly transactionService: TransactionService
  ) {
    this.transactionService.stockTransactions$.subscribe(
      (data: any) =>
        (this.dataSource = new MatTableDataSource(
          data.recordset as StockAdjustment[]
        ))
    );
  }

  init() {
    this.setupFilters();
  }

  getData() {
    if (this.form.dirty && this.form.valid) {
      const transactionRequest = new TransactionsRequest(
        3,
        this.form.controls.fromDate.value,
        this.form.controls.toDate.value,
        this.form.controls.goDownId.value,
        this.form.controls.bayId.value,
        this.form.controls.itemGroupId.value,
        this.form.controls.itemId.value,
        this.form.controls.batchId.value
      );
      this.transactionService.getTransactions(transactionRequest);
    }
  }

  navigateToAddAdjustment() {
    this.router.navigate(['stockAdjustment', 'edit', 'new']);
  }

  edit(transaction: Transaction) {
    this.router.navigate([
      'stockAdjustment',
      'edit',
      +transaction.transactionId,
    ]);
  }

  delete(transaction: Transaction) {
    this.transactionService.delete(transaction);
  }

  private setupFilters() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    combineLatest([
      this.apiBusinessService.get('godown'),
      this.apiBusinessService.get('bay'),
      this.apiBusinessService.get('itemGroup'),
      this.apiBusinessService.get('item'),
      this.apiBusinessService.get('batch'),
    ])
      .pipe(take(1))
      .subscribe((data: any) => {
        this.godowns = data[0] as AmrrGodown[];
        this.bays = data[1] as AmrrBay[];
        this.itemGroups = data[2] as AmrrItemGroup[];
        this.items = data[3] as AmrrItem[];
        this.batches = data[4] as AmrrBatch[];
        this.form = new FormGroup({
          fromDate: new FormControl(today),
          toDate: new FormControl(tomorrow),
          goDownId: new FormControl(null),
          bayId: new FormControl(''),
          itemGroupId: new FormControl(''),
          itemId: new FormControl(''),
          batchId: new FormControl(''),
        });
        this.columns = this.getColumns();
        this.getData();
      });
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockAdjustment>('sno'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<StockAdjustment>('transactionId'),
        name: 'Transaction No',
      },
      {
        key: Helper.nameof<StockAdjustment>('inwardDate'),
        name: 'Transaction Date',
        type: GridColumnType.Date,
      },
      {
        key: Helper.nameof<StockAdjustment>('godown'),
        name: 'Godown',
      },
      {
        key: Helper.nameof<StockAdjustment>('items'),
        name: 'Items',
      },
      {
        key: Helper.nameof<StockAdjustment>('createdBy'),
        name: 'Created By',
      },
      {
        key: Helper.nameof<StockAdjustment>('updatedBy'),
        name: 'Updated By',
      },
    ];
  }
}
