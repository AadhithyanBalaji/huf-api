import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { IAmrrTypeahead } from 'src/app/shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { Transaction } from 'src/app/shared/models/transaction.model';

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
  batchData: any;

  constructor(
    private readonly router: Router,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init() {
    this.form = new FormGroup({
      inwardDate: new FormControl(new Date()),
      inwardNo: new FormControl(),
      invoiceNo: new FormControl(),
      party: new FormControl('', [Validators.required]),
      vehicleDetails: new FormControl('', [Validators.required]),
      weightMeasureType: new FormControl(),
      remarks: new FormControl(),
      verifiedBy: new FormControl(),
    });
  }

  onBatchUpdate(event: any) {
    this.batchData = event;
  }

  addTransaction(stayOnPage = false) {
    if (this.form.dirty && this.form.valid) {
      const transaction = new Transaction();
      transaction.batches = this.batchData;
      transaction.transactionTypeId = 1;
      transaction.transactionDate = this.form.controls.inwardDate.value!;
      transaction.invoiceNo = this.form.controls.invoiceNo.value!;
      transaction.partyName = this.form.controls.party.value!;
      transaction.vehicleName = this.form.controls.vehicleDetails.value!;
      transaction.weightMeasureType =
        this.form.controls.weightMeasureType.value!;
      transaction.remarks = this.form.controls.remarks.value!;
      transaction.verifiedBy = this.form.controls.verifiedBy.value!;
      this.apiBusinessService
        .post('stock', transaction)
        .pipe(take(1))
        .subscribe((_) => {
          stayOnPage
            ? this.router.navigate([])
            : this.router.navigate(['stockInward']);
        });
    }
  }

  addTransactionAndClose() {
    this.addTransaction(true);
  }

  cancel() {
    this.router.navigate(['stockInward']);
  }
}
