import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { AmrrBatch } from 'src/app/shared/models/amrr-batch.model';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';

@Injectable()
export class OutwardTransactionBatchFormService {
  batchForm: FormGroup<{
    godownId: FormControl<any>;
    bayId: FormControl<any>;
    itemId: FormControl<any>;
    batchId: FormControl<any>;
    batchName: FormControl<any>;
    bags: FormControl<any>;
    qty: FormControl<any>;
  }>;

  godowns: AmrrGodown[];
  items: AmrrItem[];
  bays: AmrrBay[];
  batchTypes: IAmrrTypeahead[] = [
    {
      id: 1,
      name: 'New',
    },
    {
      id: 2,
      name: 'Existing',
    },
  ];
  batches: AmrrBatch[];
  columns: IAmmrGridColumn[] = [
    {
      key: Helper.nameof<TransactionBatch>('sno'),
      name: 'S.No.',
    },
    {
      key: Helper.nameof<TransactionBatch>('godown'),
      name: 'Destination',
    },
    {
      key: Helper.nameof<TransactionBatch>('bay'),
      name: 'Bay',
    },
    {
      key: Helper.nameof<TransactionBatch>('itemName'),
      name: 'Item Name',
    },
    {
      key: Helper.nameof<TransactionBatch>('batchName'),
      name: 'Batch No',
    },
    {
      key: Helper.nameof<TransactionBatch>('bags'),
      name: 'No. of Bags',
    },
    {
      key: Helper.nameof<TransactionBatch>('qty'),
      name: 'Qty',
    },
  ];
  dataSource: MatTableDataSource<TransactionBatch, MatPaginator>;
  data: TransactionBatch[] = [];
  onBatchUpdate: EventEmitter<any>;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(onBatchUpdate: EventEmitter<any>, batches: TransactionBatch[]) {
    this.onBatchUpdate = onBatchUpdate;
    combineLatest([
      this.apiBusinessService.get('godown'),
      this.apiBusinessService.get('item'),
    ])
      .pipe(take(1))
      .subscribe((data) => {
        this.godowns = data[0] as AmrrGodown[];
        this.items = data[1] as AmrrItem[];

        this.batchForm = new FormGroup({
          godownId: new FormControl(null, [Validators.required]),
          bayId: new FormControl(null, [Validators.required]),
          itemId: new FormControl(null, [Validators.required]),
          batchId: new FormControl(null, [Validators.required]),
          batchName: new FormControl(null, [Validators.required]),
          qty: new FormControl(null, [Validators.required]),
          bags: new FormControl(null, [Validators.required]),
        });
        this.dataSource = new MatTableDataSource();
        if (Helper.isTruthy(batches) && batches.length > 0) {
          this.dataSource.data = [...batches];
        }
        this.setupFormListeners();
      });
  }

  addBatch() {
    if (this.checkIfBatchIsValid()) {
      const batch = this.buildTransactionBatchData();
      const data = this.dataSource.data;
      data.push(batch);
      this.dataSource.data = data;
      this.onBatchUpdate.emit(data);
      this.batchForm.reset();
      this.batchForm.markAsPristine();
      this.batchForm.markAsUntouched();
      this.batchForm.updateValueAndValidity();
    }
  }

  removeBatch(event: TransactionBatch) {
    const data = this.dataSource.data;
    var index = data.findIndex((d) => d.sno === event.sno);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;
      this.onBatchUpdate.emit(this.dataSource.data);
    }
  }

  getSelectedBatch() {
    if (
      Helper.isTruthy(this.batches) &&
      this.batches.length > 0 &&
      Helper.isTruthy(this.batchForm.controls.batchId.value)
    ) {
      const selectedBatch = this.batches.find(
        (b) => b.id === this.batchForm.controls.batchId.value
      );

      let bags = selectedBatch?.bags ?? 0;
      let qty = selectedBatch?.qty ?? 0;
      const transactionBatches = this.dataSource.data;
      transactionBatches.forEach((element) => {
        if (element.batchId === this.batchForm.controls.batchId.value) {
          bags -= element.bags;
          qty -= element.qty;
        }
      });

      return { bags: bags, qty: qty };
    }

    return { bags: 0, qty: 0 };
  }

  private setupFormListeners() {
    this.batchForm.controls.godownId.valueChanges.subscribe((godownId) => {
      if (Helper.isTruthy(godownId) && +godownId > 0) {
        this.apiBusinessService
          .get(`bay/godown/${godownId}`)
          .pipe(take(1))
          .subscribe((bays: any) => {
            this.bays = [...(bays.recordsets[0] as AmrrBay[])];
          });
      }
    });

    this.batchForm.controls.itemId.valueChanges.subscribe((itemId) =>
      this.updateBatches(itemId)
    );
  }

  private checkIfBatchIsValid() {
    return (
      this.validateNumberControlValue(this.batchForm.controls.godownId) &&
      this.validateNumberControlValue(this.batchForm.controls.bayId) &&
      this.validateNumberControlValue(this.batchForm.controls.itemId) &&
      this.validateBatchValue() &&
      this.validateNumberControlValue(this.batchForm.controls.bags) &&
      this.validateNumberControlValue(this.batchForm.controls.qty)
    );
  }

  private validateNumberControlValue(control: FormControl) {
    const isValid =
      Helper.isTruthy(control.value) &&
      !isNaN(+control.value) &&
      +control.value > 0;
    isValid
      ? control.setErrors(null)
      : control.setErrors({ InvalidValue: true });
    return isValid;
  }

  private validateBatchValue() {
    const ctrls = this.batchForm.controls;
    if (
      this.batches.length === 0 ||
      !Helper.isTruthy(ctrls.batchId.value) ||
      isNaN(+ctrls.batchId.value)
    ) {
      this.batchForm.controls.batchId.setErrors({ InvalidValue: true });
      return false;
    }
    return true;
  }

  private updateBatches(itemId: number) {
    if (Helper.isTruthy(itemId)) {
      this.apiBusinessService
        .get(`batch/item/${itemId}`)
        .pipe(take(1))
        .subscribe(
          (batches: any) =>
            (this.batches = [...(batches.recordsets[0] as AmrrBatch[])])
        );
    } else {
      this.batches = [];
    }
  }

  private buildTransactionBatchData() {
    const batch = new TransactionBatch();
    batch.sno = this.dataSource.data.length + 1;
    batch.godownId = this.batchForm.controls.godownId.value;
    batch.godown = this.godowns.find((g) => g.id === batch.godownId)!.name;
    batch.bayId = this.batchForm.controls.bayId.value;
    batch.bay = this.bays.find((b) => b.id === batch.bayId)!.name;
    batch.itemId = this.batchForm.controls.itemId.value;
    batch.itemName = this.items.find((i) => i.id === batch.itemId)!.name;
    batch.batchId = this.batchForm.controls.batchId.value;
    batch.batchName =
      this.batches.find((b) => b.id === this.batchForm.controls.batchId.value)
        ?.name ?? '';
    batch.bags = this.batchForm.controls.bags.value;
    batch.qty = this.batchForm.controls.qty.value;
    batch.sno = this.dataSource.data.length + 1;
    return batch;
  }
}
