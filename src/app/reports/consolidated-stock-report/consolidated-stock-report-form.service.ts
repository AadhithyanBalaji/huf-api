import { DatePipe } from '@angular/common';
import { Injectable, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { AmrrBay } from 'src/app/master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItemGroup } from 'src/app/master/amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItem } from 'src/app/master/amrr-item/amrr-item-editor/amrr-item.model';
import {
  IAmmrGridColumn,
  GridColumnType,
} from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { AmrrModalComponent } from 'src/app/shared/amrr-modal/amrr-modal.component';
import { IAmrrTypeahead } from 'src/app/shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { AmrrBatch } from 'src/app/shared/models/amrr-batch.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { ConsolidatedStockReport } from './consolidated-stock-report.model';

@Injectable()
export class ConsolidatedStockReportFormService {
  godowns: AmrrGodown[] = [];
  bays: AmrrBay[] = [];
  itemGroups: AmrrItemGroup[] = [];
  items: AmrrItem[] = [];
  batches: IAmrrTypeahead[];
  form: FormGroup<{
    startDate: FormControl<any>;
    endDate: FormControl<any>;
    goDownId: FormControl<number>;
    bayId: FormControl<number>;
    itemGroupId: FormControl<number>;
    itemId: FormControl<number>;
    batchId: FormControl<number>;
  }>;
  dataSource: MatTableDataSource<ConsolidatedStockReport, MatPaginator> = new MatTableDataSource();
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

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly datePipe: DatePipe
  ) {}

  init() {
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
          startDate: new FormControl(today),
          endDate: new FormControl(tomorrow),
          goDownId: new FormControl(),
          bayId: new FormControl(),
          itemGroupId: new FormControl(),
          itemId: new FormControl(),
          batchId: new FormControl(),
        });
        this.getData(true);
      });
  }

  getData(isFirstTime = false) {
    if (isFirstTime || (this.form.dirty && this.form.valid)) {
        console.log(this.form.controls.goDownId.value);
      this.apiBusinessService
        .post('report/consolidatedStock', {
          startDate: this.form.controls.startDate.value,
          endDate: this.form.controls.endDate.value,
          godownId: this.form.controls.goDownId.value,
          bayId: this.form.controls.bayId.value,
          itemGroupId: this.form.controls.itemGroupId.value,
          itemId: this.form.controls.itemId.value,
          batchId: this.form.controls.batchId.value,
        })
        .pipe(take(1))
        .subscribe((data: any) => {
          this.dataSource = new MatTableDataSource(
            data.recordset as ConsolidatedStockReport[]
          );
        });
    }
  }
}
