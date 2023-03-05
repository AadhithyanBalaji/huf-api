import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/transaction.service';

@Injectable()
export class StockAdjustmentEditorFormService {
  transactionId: number;
  batchData: TransactionBatch[];
  batches: TransactionBatch[];
  form: FormGroup<{
    outwardDate: FormControl<Date | null>;
    outwardNo: FormControl<string | null>;
    remarks: FormControl<any>;
    verifiedBy: FormControl<any>;
  }>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService
  ) {
    this.transactionService.transaction$.subscribe((data: any) => {
      this.buildForm(data[0].recordset[0]);
      this.batches = data[1].recordset as TransactionBatch[];
    });
  }

  init() {
    this.route.params.pipe(take(1)).subscribe((params) => {
      if (!isNaN(params['id'])) {
        this.transactionId = +params['id'];
        this.transactionService.getTransaction(this.transactionId, 3);
      } else {
        this.buildForm(new Transaction());
      }
    });
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
        'stockAdjustment',
        this.buildTransactionData(),
        stayOnPage
      );
    }
  }

  addTransactionAndClose() {
    this.addTransaction(true);
  }

  cancel() {
    this.router.navigate(['stockAdjustment']);
  }

  private buildForm(transaction: Transaction) {
    this.form = new FormGroup({
      outwardDate: new FormControl(new Date(transaction.transactionDate)),
      outwardNo: new FormControl({ value: '', disabled: true }),
      remarks: new FormControl(transaction.remarks),
      verifiedBy: new FormControl(transaction.verifiedBy),
    });
  }

  private buildTransactionData() {
    const transaction = new Transaction();
    transaction.transactionId = this.transactionId;
    transaction.batches = this.batchData ?? this.batches;
    transaction.transactionTypeId = 3;
    transaction.transactionDate = this.form.controls.outwardDate.value!;
    transaction.remarks = this.form.controls.remarks.value!;
    transaction.verifiedBy = this.form.controls.verifiedBy.value!;
    if (this.transactionId == null) {
      transaction.createdByUserId = this.authService.getUserId();
    } else {
      transaction.updatedByUserId = this.authService.getUserId();
    }
    return transaction;
  }
}
