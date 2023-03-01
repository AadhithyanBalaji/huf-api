import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
export class InwardTransactionBatchFormService {
  batchForm: FormGroup<{
    godownId: FormControl<any>;
    bayId: FormControl<any>;
    itemId: FormControl<any>;
    batchTypeId: FormControl<any>;
    batchNo: FormControl<any>;
    bags: FormControl<any>;
    qty: FormControl<any>;
  }>;

  godowns: AmrrGodown[];
  items: AmrrItem[];
  bays: AmrrBay[];
  batches: IAmrrTypeahead[] = [
    {
      id: 1,
      name: 'New',
    },
    {
      id: 2,
      name: 'Existing',
    },
  ];
  columns: IAmmrGridColumn[] = [
    {
      key: 'id',
      name: 'S.No.',
    },
    {
      key: 'godown',
      name: 'Destination',
    },
    {
      key: 'bay',
      name: 'Bay',
    },
    {
      key: 'itemName',
      name: 'Item Name',
    },
    {
      key: 'batchNo',
      name: 'Batch No',
    },
    {
      key: 'bags',
      name: 'No. of Bags',
    },
    {
      key: 'qty',
      name: 'Qty',
    },
  ];
  dataSource: MatTableDataSource<TransactionBatch, MatPaginator>;
  data: TransactionBatch[] = [];
  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init() {
    combineLatest([
        this.apiBusinessService.get('godown'),
        this.apiBusinessService.get('item'),
      ])
        .pipe(take(1))
        .subscribe((data) => {
          this.godowns = data[0] as AmrrGodown[];
          this.items = data[1] as AmrrItem[];
  
          this.batchForm = new FormGroup({
              godownId: new FormControl(),
              bayId: new FormControl(),
              itemId: new FormControl(),
              batchTypeId: new FormControl(),
              batchNo: new FormControl(),
              qty: new FormControl(),
              bags: new FormControl(),
          });

          this.dataSource = new MatTableDataSource();
        });
  }

  addBatch() {
   // if (this.checkIfBatchIsValid()) {
      const batch = new TransactionBatch();
      batch.godown = this.batchForm.controls.godownId.value;
      batch.bay = this.batchForm.controls.bayId.value;
      batch.itemName = this.batchForm.controls.itemId.value;
      batch.batchNo = this.batchForm.controls.batchNo.value;
      batch.bags = this.batchForm.controls.bags.value;
      batch.qty = this.batchForm.controls.qty.value;
      const data = this.dataSource.data;
      data.push(batch);
      this.dataSource.data = data;
   // }
  }

  removeBatch(event: any) {
    console.log(event);
  }

  checkIfBatchIsValid() {
    const ctrls = this.batchForm.controls;
    if (
      Helper.isTruthy(ctrls.godownId.value) &&
      +ctrls.godownId.value > 0 &&
      Helper.isTruthy(ctrls.bayId.value) &&
      +ctrls.bayId.value > 0 &&
      Helper.isTruthy(ctrls.itemId.value) &&
      +ctrls.itemId.value > 0 &&
      Helper.isTruthy(ctrls.batchTypeId.value) &&
      +ctrls.batchTypeId.value > 0 &&
      Helper.isTruthy(ctrls.batchNo.value) &&
      +ctrls.batchNo.value > 0 &&
      Helper.isTruthy(ctrls.bags.value) &&
      +ctrls.bags.value > 0 &&
      Helper.isTruthy(ctrls.qty.value) &&
      +ctrls.qty.value > 0
    ) {
      return true;
    }
    return false;
  }
}
