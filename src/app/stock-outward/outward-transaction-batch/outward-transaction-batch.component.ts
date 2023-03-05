import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { OutwardTransactionBatchFormService } from './outward-transaction-batch-form.service';

@Component({
  selector: 'app-outward-transaction-batch',
  templateUrl: './outward-transaction-batch.component.html',
  styleUrls: ['./outward-transaction-batch.component.css'],
  providers: [OutwardTransactionBatchFormService],
})
export class OutwardTransactionBatchComponent implements OnInit {
  @Input() batches: TransactionBatch[];
  @Output() onBatchUpdate = new EventEmitter<any>();

  constructor(readonly formService: OutwardTransactionBatchFormService) {}

  ngOnInit(): void {
    this.formService.init(this.onBatchUpdate, this.batches);
  }
}
