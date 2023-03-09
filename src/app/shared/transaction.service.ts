import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transaction$ = new Subject();
  stockTransactions$ = new Subject();
  transactionRequest: AmrrReportFilters;

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly dialog: MatDialog
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
        .get(`stock/${transactionTypeId}`)
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
        result ? this.deleteTransaction(transaction.transactionId) : null
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

  private deleteTransaction(transactionId: number) {
    this.apiBusinessService
      .delete('stock', transactionId)
      .pipe(take(1))
      .subscribe((_) => {
        this.snackBar.open('Deleted Transaction', '', { duration: 2000 });
        this.getTransactions(this.transactionRequest);
      });
  }
}
