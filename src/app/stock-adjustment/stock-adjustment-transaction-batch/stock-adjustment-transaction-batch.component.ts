import { Component, OnInit } from '@angular/core';
import { StockAdjustmentTransactionBatchFormService } from './stock-adjustment-transaction-batch-form.service';

@Component({
  selector: 'app-stock-adjustment-transaction-batch',
  templateUrl: './stock-adjustment-transaction-batch.component.html',
  styleUrls: ['./stock-adjustment-transaction-batch.component.css'],
  providers: [StockAdjustmentTransactionBatchFormService],
})
export class StockAdjustmentTransactionBatchComponent implements OnInit {
  constructor(
    readonly formService: StockAdjustmentTransactionBatchFormService
  ) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
