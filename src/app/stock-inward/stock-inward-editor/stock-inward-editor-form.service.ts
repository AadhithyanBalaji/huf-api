import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { AmrrBay } from 'src/app/master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItem } from 'src/app/master/amrr-item/amrr-item-editor/amrr-item.model';
import { IAmmrGridColumn } from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { IAmrrTypeahead } from 'src/app/shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';

@Injectable()
export class StockInwardEditorFormService {
  batch: TransactionBatch;
  form: FormGroup<{
    inwardDate: FormControl<Date | null>;
    inwardNo: FormControl<string | null>;
    invoiceNo: FormControl<string | null>;
    party: FormControl<string | null>;
    vehicleDetails: FormControl<string | null>;
    weightMeasureType: FormControl<any>;
    remarks: FormControl<any>;
    verifiedBy: FormControl<any>;
  }>;

  weightMeasures: IAmrrTypeahead[] = [
    {
      id: 1,
      name: 'Godown',
    },
    {
      id: 2,
      name: 'Weighbridge',
    },
  ];

  constructor(private readonly router: Router) {}

  init() {
    this.form = new FormGroup({
      inwardDate: new FormControl(new Date()),
      inwardNo: new FormControl('TBD'),
      invoiceNo: new FormControl(''),
      party: new FormControl(''),
      vehicleDetails: new FormControl(''),
      weightMeasureType: new FormControl(),
      remarks: new FormControl(),
      verifiedBy: new FormControl(),
    });
  }

  onBatchUpdate(event: any) {
    console.log(event);
  }

  addTransaction() {
    console.log('adding transaction');
  }

  addTransactionAndClose() {
    console.log('adding transaction and closing');
  }

  cancel() {
    this.router.navigate(['stockInward']);
  }
}
