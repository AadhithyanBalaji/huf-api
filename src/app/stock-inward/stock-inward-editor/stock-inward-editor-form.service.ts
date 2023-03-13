import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IAmrrTypeahead } from 'src/app/shared/amrr-typeahead/amrr-typeahead.interface';
import Helper from 'src/app/shared/helper';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { TransactionBatchService } from 'src/app/shared/transaction-batch.service';
import { TransactionService } from 'src/app/shared/transaction.service';

@Injectable()
export class StockInwardEditorFormService {
  form: FormGroup<{
    transactionId: FormControl<number | null>;
    inwardDate: FormControl<Date | null>;
    runningNo: FormControl<number | null>;
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionService: TransactionService,
    private readonly authService: AuthService,
    private readonly transactionBatchService: TransactionBatchService,
    private readonly formHelperService: TransactionBatchFormHelperService
  ) {
    this.transactionService.transaction$.subscribe((data: any) => {
      this.buildForm(data[0]);
      this.transactionBatchService.setupGrid(data[1]);
    });
  }

  init() {
    this.route.params
      .pipe(take(1))
      .subscribe((params) =>
        this.transactionService.requestTransactionInfo(params['id'], 1)
      );
  }

  addTransaction(stayOnPage = false) {
    const batchData = this.transactionBatchService.dataSource.data;
    if ((this.form.dirty || batchData?.length > 0) && this.form.valid) {
      this.transactionService.addTransaction(
        'stockInward',
        this.buildTransactionData(),
        stayOnPage,
        this.form
      );
    }
  }

  addTransactionAndClose() {
    this.addTransaction(true);
  }

  cancel() {
    this.transactionService.navigateToBrowser('stockInward');
  }

  getTotalMetrics() {
    const batches = this.transactionBatchService.dataSource.data;
    let qty = 0,
      bags = 0;
    batches.forEach((element) => {
      qty += +element.qty;
      bags += +element.bags;
    });
    return { qty: qty, bags: bags };
  }

  private buildForm(transaction: Transaction) {
    if (!Helper.isTruthy(this.form)) {
      this.form = new FormGroup({
        transactionId: new FormControl(transaction.transactionId),
        inwardDate: new FormControl(new Date(transaction.transactionDate)),
        runningNo: new FormControl({
          value: transaction.runningNo,
          disabled: true,
        }),
        invoiceNo: new FormControl(transaction.invoiceNo),
        party: new FormControl(transaction.partyName ?? '', [
          Validators.required,
        ]),
        vehicleDetails: new FormControl(transaction.vehicleName ?? '', [
          Validators.required,
        ]),
        weightMeasureType: new FormControl(transaction.weightMeasureType),
        remarks: new FormControl(transaction.remarks),
        verifiedBy: new FormControl(transaction.verifiedBy),
      });
    } else {
      this.form.patchValue({
        transactionId: transaction.transactionId,
        inwardDate: transaction.transactionDate,
        runningNo: transaction.runningNo,
      });
    }
  }

  private buildTransactionData() {
    const transaction = new Transaction();
    transaction.transactionId = this.form.controls.transactionId.value!;
    transaction.batches = this.transactionBatchService.dataSource.data;
    transaction.transactionTypeId = 1;
    transaction.transactionDate = this.form.controls.inwardDate.value!;
    transaction.invoiceNo = this.form.controls.invoiceNo.value!;
    transaction.partyName = this.form.controls.party.value!;
    transaction.vehicleName = this.form.controls.vehicleDetails.value!;
    transaction.weightMeasureType = Helper.isTruthy(
      this.form.controls.weightMeasureType.value
    )
      ? this.form.controls.weightMeasureType.value
      : null;
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
