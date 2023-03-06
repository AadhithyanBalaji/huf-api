import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { combineLatest, Observable, of, Subject, take } from 'rxjs';
import { AmrrModalComponent } from './amrr-modal/amrr-modal.component';
import { AmrrReportFilters } from './amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from './api-business.service';
import Helper from './helper';
import { Transaction } from './models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transaction$ = new Subject();
  stockTransactions$ = new Subject();

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  getTransactions(transactionRequest: AmrrReportFilters) {
    transactionRequest.toDate = transactionRequest.toDate;
    transactionRequest.fromDate = transactionRequest.fromDate;
    this.apiBusinessService
      .post('stock/transactions', transactionRequest)
      .pipe(take(1))
      .subscribe((data) => this.stockTransactions$.next(data));
  }

  getTransaction(transactionId: number, transactionTypeId: number) {
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
        this.transaction$.next(data);
      });
  }

  addTransaction(
    routeKey: string,
    transaction: Transaction,
    stayOnPage = false
  ) {
    this.apiBusinessService
      .post('stock', transaction)
      .pipe(take(1))
      .subscribe((_) => {
        this.displaySuccessToast(transaction.transactionId);
        stayOnPage
          ? this.router.navigate([])
          : this.router.navigate([routeKey]);
      });
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
        result
          ? this.deleteTransaction(
              transaction.transactionId,
              transaction.transactionTypeId
            )
          : null
      );
  }

  private displaySuccessToast(transactionId: number) {
    this.snackBar.open(
      Helper.isTruthy(transactionId) &&
        !isNaN(transactionId) &&
        transactionId > 0
        ? 'Updated Transaction'
        : 'Created Transaction',
      '',
      { duration: 2000 }
    );
  }

  private deleteTransaction(transactionId: number, transactionTypeId: number) {
    this.apiBusinessService
      .delete('stock', transactionId)
      .pipe(take(1))
      .subscribe((_) => {
        this.snackBar.open('Deleted Transaction', '', { duration: 2000 });
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.getTransactions({
          transactionTypeId: transactionTypeId,
          fromDate: today,
          toDate: tomorrow,
        });
      });
  }
}
