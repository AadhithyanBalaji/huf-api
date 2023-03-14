import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AmrrBay } from 'src/app/master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItem } from 'src/app/master/amrr-item/amrr-item-editor/amrr-item.model';
import { IAmmrGridColumn } from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { IAmrrTypeahead } from 'src/app/shared/amrr-typeahead/amrr-typeahead.interface';
import { DataHelperService } from 'src/app/shared/data-helper.service';
import Helper from 'src/app/shared/helper';
import { AmrrBatch } from 'src/app/shared/models/amrr-batch.model';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { TransactionBatchService } from 'src/app/shared/transaction-batch.service';

@Injectable()
export class InwardTransactionBatchFormService {
  batchForm: FormGroup<{
    godown: FormControl<any>;
    bay: FormControl<any>;
    item: FormControl<any>;
    batchType: FormControl<any>;
    batch: FormControl<any>;
    batchName: FormControl<any>;
    bags: FormControl<any>;
    qty: FormControl<any>;
  }>;

  godowns: AmrrGodown[] = [];
  items: AmrrItem[] = [];
  bays: AmrrBay[] = [];
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
  batches: AmrrBatch[] = [];
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
  data: TransactionBatch[] = [];

  constructor(
    readonly transactionBatchService: TransactionBatchService,
    private readonly dataHelperService: DataHelperService,
    private readonly formHelperService: TransactionBatchFormHelperService
  ) {}

  init() {
    this.dataHelperService.batches$.subscribe(
      (batches) => (this.batches = batches)
    );

    this.dataHelperService.bays$.subscribe((bays) => (this.bays = bays));
    this.dataHelperService.godownsItems$.subscribe((res) => {
      this.godowns = res.godowns;
      this.items = res.items;
      this.buildForm();
    });

    this.dataHelperService.getGodownAndItems();
  }

  addBatch() {
    if (this.checkIfBatchIsValid()) {
      const batch = this.buildTransactionBatchData();
      this.transactionBatchService.addToGrid(batch);
      this.formHelperService.resetForm(this.batchForm);
    }
  }

  removeBatch(event: TransactionBatch) {
    this.transactionBatchService.removeFromGrid(event);
  }

  private buildForm() {
    this.batchForm = new FormGroup({
      godown: new FormControl(null, [Validators.required]),
      bay: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      item: new FormControl(null, [Validators.required]),
      batchType: new FormControl(null, [Validators.required]),
      batch: new FormControl(null),
      batchName: new FormControl(null),
      qty: new FormControl(null, [Validators.required, Validators.min(0.0001)]),
      bags: new FormControl(null, [
        Validators.required,
        Validators.min(0.0001),
      ]),
    });

    this.setupFormListeners();
  }

  setupFormListeners() {
    this.batchForm.controls['godown'].valueChanges.subscribe((godown) => {
      if (Helper.isTruthy(godown) && +godown.id > 0) {
        this.dataHelperService.updateBays(godown.id);
        this.batchForm.get('bay')!.enable();
      } else {
        this.batchForm.get('bay')!.disable();
      }
      this.batchForm.updateValueAndValidity();
    });

    this.batchForm.controls.bay.valueChanges.subscribe((bay) =>
      this.dataHelperService.updateBatches(
        this.batchForm.controls['batchType'].value?.id,
        this.batchForm.controls['godown'].value?.id,
        this.batchForm.controls['item'].value?.id,
        bay?.id
      )
    );

    this.batchForm.controls['batchName'].valueChanges
      .pipe(debounceTime(300))
      .subscribe((name) => {
        this.transactionBatchService.validateBatch(
          name,
          this.batchForm.controls['batchName']
        );
      });

    this.batchForm.controls['batchType'].valueChanges.subscribe((batchType) => {
      this.dataHelperService.updateBatches(
        batchType?.id,
        this.batchForm.controls['godown'].value?.id,
        this.batchForm.controls['item'].value?.id,
        this.batchForm.controls['bay'].value?.id
      );
      if (batchType?.id === 1) {
        this.batchForm.controls.batchName.enable();
        this.batchForm.controls.batch.disable();
        this.batchForm.controls.batchName.setValidators(Validators.required);
      } else if (batchType?.id === 2) {
        this.batchForm.controls.batch.enable();
        this.batchForm.controls.batchName.disable();
        this.batchForm.controls.batch.setValidators(Validators.required);
      } else {
        this.batchForm.controls.batch.enable();
        this.batchForm.controls.batchName.enable();
      }
      this.batchForm.updateValueAndValidity();
    });

    this.batchForm.controls['item'].valueChanges.subscribe((item) =>
      this.dataHelperService.updateBatches(
        this.batchForm.controls['batchType'].value?.id,
        this.batchForm.controls['godown'].value?.id,
        item?.id,
        this.batchForm.controls['bay'].value?.id
      )
    );
  }

  private checkIfBatchIsValid() {
    return (
      this.batchForm.valid &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('godown'),
        this.batchForm.get('godown')?.value?.id
      ) &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('bay'),
        this.batchForm.get('bay')?.value?.id
      ) &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('item'),
        this.batchForm.get('item')?.value?.id
      ) &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('batchType'),
        this.batchForm.get('batchType')?.value?.id
      ) &&
      this.validateBatchValue(this.batchForm) &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('bags'),
        this.batchForm.get('bags')?.value
      ) &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('qty'),
        this.batchForm.get('qty')?.value
      )
    );
  }

  validateBatchValue(form: FormGroup) {
    const batchTypeId = form.controls['batchType'].value?.id;
    const batchId = form.controls['batch'].value?.id;
    const batchName = form.controls['batchName'].value;
    let isValid = false;
    if (Helper.isTruthy(batchName) || Helper.isTruthy(batchId)) {
      if (batchTypeId === 1 && batchName.length === 0) {
        form.controls['batchName'].setErrors({ InvalidValue: true });
        isValid = false;
      } else if (batchTypeId === 2 && isNaN(batchId)) {
        form.controls['batch'].setErrors({ InvalidValue: true });
        isValid = false;
      } else {
        isValid = true;
        form.controls['batch'].setErrors(null);
        form.controls['batchName'].setErrors(null);
      }
    }
    return isValid;
  }

  private buildTransactionBatchData() {
    const batch = new TransactionBatch();
    const ctrls = this.batchForm.controls;
    batch.sno = this.transactionBatchService.getNextRowSno();
    batch.godownId = ctrls['godown'].value?.id;
    batch.godown = ctrls['godown'].value?.name;
    batch.bayId = ctrls['bay'].value?.id;
    batch.bay = ctrls['bay'].value?.name;
    batch.itemId = ctrls['item'].value?.id;
    batch.itemName = ctrls['item'].value?.name;
    batch.batchId = ctrls['batch'].value?.id ?? null;
    batch.batchName =
      +ctrls['batchType'].value?.id === 1
        ? ctrls['batchName'].value
        : ctrls['batch'].value?.name;
    batch.bags = ctrls['bags'].value;
    batch.qty = ctrls['qty'].value;
    return batch;
  }
}
