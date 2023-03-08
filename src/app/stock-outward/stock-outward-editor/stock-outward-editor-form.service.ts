import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IAmrrTypeahead } from 'src/app/shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/transaction.service';

@Injectable()
export class StockOutwardEditorFormService {
  batchData: TransactionBatch[];
  batches: TransactionBatch[];
  form: FormGroup<{
    transactionId: FormControl<number | null>;
    outwardDate: FormControl<Date | null>;
    runningNo: FormControl<number | null>;
    vehicleName: FormControl<string | null>;
    party: FormControl<string | null>;
    vehicleRegNo: FormControl<string | null>;
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionService: TransactionService,
    private readonly authService: AuthService
  ) {
    this.transactionService.transaction$.subscribe((data: any) => {
      this.buildForm(data[0]);
      this.batches = data[1];
    });
  }

  init() {
    this.route.params
      .pipe(take(1))
      .subscribe((params) =>
        this.transactionService.requestTransactionInfo(params['id'], 2)
      );
  }

  onBatchUpdate(event: TransactionBatch[]) {
    this.batchData = event;
  }

  addTransaction(stayOnPage = false) {
    if (
      (this.form.dirty ||
        this.batchData?.length > 0 ||
        this.batches.length > 0) &&
      this.form.valid
    ) {
      this.transactionService.addTransaction(
        'stockOutward',
        this.buildTransactionData(),
        stayOnPage
      );
    }
  }

  addTransactionAndClose() {
    this.addTransaction(true);
  }

  cancel() {
    this.transactionService.navigateToBrowser('stockOutward');
  }

  getTotalMetrics() {
    const batches = this.batchData ?? this.batches;
    let qty = 0,
      bags = 0;
    batches.forEach((element) => {
      qty += +element.qty;
      bags += +element.bags;
    });
    return { qty: qty, bags: bags };
  }

  private buildForm(transaction: Transaction) {
    this.form = new FormGroup({
      transactionId: new FormControl(transaction.transactionId),
      outwardDate: new FormControl(new Date(transaction.transactionDate)),
      runningNo: new FormControl({
        value: transaction.transactionId,
        disabled: true,
      }),
      vehicleName: new FormControl(transaction.vehicleName),
      party: new FormControl(transaction.partyName ?? '', [
        Validators.required,
      ]),
      vehicleRegNo: new FormControl(transaction.vehicleRegNo ?? '', [
        Validators.required,
      ]),
      remarks: new FormControl(transaction.remarks),
      verifiedBy: new FormControl(transaction.verifiedBy),
    });
  }

  private buildTransactionData() {
    const transaction = new Transaction();
    transaction.transactionId = this.form.controls.transactionId.value!;
    transaction.batches = this.batchData ?? this.batches;
    transaction.transactionTypeId = 2;
    transaction.transactionDate = this.form.controls.outwardDate.value!;
    transaction.vehicleRegNo = this.form.controls.vehicleRegNo.value!;
    transaction.partyName = this.form.controls.party.value!;
    transaction.vehicleName = this.form.controls.vehicleName.value!;
    transaction.remarks = this.form.controls.remarks.value!;
    transaction.verifiedBy = this.form.controls.verifiedBy.value!;
    if (transaction.transactionId == null) {
      transaction.createdByUserId = this.authService.getUserId();
    } else {
      transaction.updatedByUserId = this.authService.getUserId();
    }
    return transaction;
  }
}
