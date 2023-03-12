import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { TransactionBatchService } from 'src/app/shared/transaction-batch.service';
import { TransactionService } from 'src/app/shared/transaction.service';

@Injectable()
export class StockAdjustmentEditorFormService {
  form: FormGroup<{
    transactionId: FormControl<number | null>;
    outwardDate: FormControl<Date | null>;
    runningNo: FormControl<number | null>;
    remarks: FormControl<string | null>;
    verifiedBy: FormControl<string | null>;
  }>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService,
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
        this.transactionService.requestTransactionInfo(params['id'], 3)
      );
  }

  addTransaction(stayOnPage = false) {
    const batchData = this.transactionBatchService.dataSource.data;
    if ((this.form.dirty || batchData?.length > 0) && this.form.valid) {
      this.transactionService.addTransaction(
        'stockAdjustment',
        this.buildTransactionData(),
        stayOnPage,
        this.form
      );
    }
  }

  addTransactionAndClose() {
    this.addTransaction(true);
    // this.formHelperService.resetForm(this.form);
    // this.transactionBatchService.setupGrid([]);
  }

  cancel() {
    this.transactionService.navigateToBrowser('stockAdjustment');
  }

  private buildForm(transaction: Transaction) {
    this.form = new FormGroup({
      transactionId: new FormControl(transaction.transactionId),
      outwardDate: new FormControl(new Date(transaction.transactionDate)),
      runningNo: new FormControl({
        value: transaction.runningNo,
        disabled: true,
      }),
      remarks: new FormControl(transaction.remarks),
      verifiedBy: new FormControl(transaction.verifiedBy),
    });
  }

  private buildTransactionData() {
    const transaction = new Transaction();
    transaction.transactionId = this.form.controls.transactionId.value!;
    transaction.batches = this.transactionBatchService.dataSource.data;
    transaction.transactionTypeId = 3;
    transaction.transactionDate = this.form.controls.outwardDate.value!;
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
