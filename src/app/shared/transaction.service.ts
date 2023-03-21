import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { combineLatest, Subject, take } from 'rxjs';
import { AmrrModalComponent } from './amrr-modal/amrr-modal.component';
import { AmrrReportFilters } from './amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from './api-business.service';
import Helper from './helper';
import { TransactionBatch } from './models/transaction-batch.model';
import { Transaction } from './models/transaction.model';
import { TransactionBatchFormHelperService } from './transaction-batch-form-helper.service';
import { TransactionBatchService } from './transaction-batch.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transaction$ = new Subject();
  stockTransactions$ = new Subject();
  transactionRequest: AmrrReportFilters;
  saving: boolean;

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly formHelperService: TransactionBatchFormHelperService,
    private readonly transactionBatchService: TransactionBatchService
  ) {}

  navigateToAddScreen(routeKey: string) {
    this.router.navigate([routeKey, 'edit', 'new']);
  }

  navigateToEditScreen(routeKey: string, id: number) {
    this.router.navigate([routeKey, 'edit', +id]);
  }

  navigateToBrowser(routeKey: string) {
    this.router.navigate([routeKey]);
  }

  getTransactions(transactionRequest: AmrrReportFilters) {
    this.transactionRequest = transactionRequest;
    this.transactionRequest.fromDate =
      this.datePipe.transform(
        new Date(new Date(transactionRequest.fromDate).setHours(0, 0, 0, 0)),
        'YYYY-MM-dd HH:mm:ss'
      ) ?? '';
    this.transactionRequest.toDate =
      this.datePipe.transform(
        new Date(new Date(transactionRequest.toDate).setHours(23, 59, 59, 0)),
        'YYYY-MM-dd HH:mm:ss'
      ) ?? '';
    this.apiBusinessService
      .post('stock/transactions', transactionRequest)
      .pipe(take(1))
      .subscribe((data) => this.stockTransactions$.next(data));
  }

  requestTransactionInfo(transactionId: number, transactionTypeId: number) {
    if (!isNaN(transactionId)) {
      combineLatest([
        this.apiBusinessService.post('stock/transaction', {
          transactionTypeId: transactionTypeId,
          transactionId: transactionId,
        }),
        this.apiBusinessService.get(
          `transactionBatch/transaction/${transactionId}`
        ),
      ])
        .pipe(take(1))
        .subscribe((data: any) => {
          this.transaction$.next([
            data[0].recordset[0],
            data[1].recordset as TransactionBatch[],
          ]);
        });
    } else {
      this.apiBusinessService
        .get(`stock`)
        .pipe(take(1))
        .subscribe((res: any) => {
          const transaction = new Transaction();
          transaction.transactionDate = new Date();
          transaction.runningNo = res[0].transactionId;
          this.transaction$.next([transaction, []]);
        });
    }
  }

  addTransaction(
    routeKey: string,
    transaction: Transaction,
    stayOnPage = false,
    form: FormGroup
  ) {
    this.saving = true;
    transaction.transactionDateString =
      this.datePipe.transform(
        transaction.transactionDate,
        'YYYY-MM-dd HH:mm:ss'
      ) ?? '';
    this.apiBusinessService
      .post('stock', transaction)
      .pipe(take(1))
      .subscribe(
        (_) => {
          this.displaySuccessToast(transaction.transactionId);
          if (stayOnPage) {
            this.router.navigate([]);
            this.formHelperService.resetForm(form);
            this.transactionBatchService.setupGrid([]);
            this.requestTransactionInfo(NaN, transaction.transactionTypeId);
          } else {
            this.router.navigate([routeKey]);
          }
          this.saving = false;
        },
        (error) => {
          this.saving = false;
        }
      );
  }

  delete(transaction: Transaction) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete this record?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) =>
        result ? this.deleteTransaction(transaction.transactionId) : null
      );
  }

  private displaySuccessToast(transactionId: number) {
    this.snackBar.open(
      Helper.isTruthy(transactionId) &&
        !isNaN(transactionId) &&
        transactionId > 0
        ? 'Updated Transaction'
        : 'Created Transaction'
    );
  }

  private deleteTransaction(transactionId: number) {
    this.apiBusinessService
      .delete('stock', transactionId)
      .pipe(take(1))
      .subscribe((_) => {
        this.snackBar.open('Deleted Transaction');
        this.getTransactions(this.transactionRequest);
      });
  }
}
