import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { OutwardTransactionBatchFormService } from 'src/app/stock-outward/outward-transaction-batch/outward-transaction-batch-form.service';
import { StockAdjustmentTransactionBatchFormService } from './stock-adjustment-transaction-batch-form.service';

@Component({
  selector: 'app-stock-adjustment-transaction-batch',
  templateUrl: './stock-adjustment-transaction-batch.component.html',
  styleUrls: ['./stock-adjustment-transaction-batch.component.css'],
  providers: [StockAdjustmentTransactionBatchFormService],
})
export class StockAdjustmentTransactionBatchComponent implements OnInit {
  @Input() batches: TransactionBatch[];
  @Output() onBatchUpdate = new EventEmitter<any>();

  constructor(
    readonly formService: StockAdjustmentTransactionBatchFormService
  ) {}

  ngOnInit(): void {
    this.formService.init(this.onBatchUpdate, this.batches);
  }
}
