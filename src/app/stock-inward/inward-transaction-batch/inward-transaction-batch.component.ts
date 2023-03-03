import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { InwardTransactionBatchFormService } from './inward-transaction-batch-form.service';

@Component({
  selector: 'app-inward-transaction-batch',
  templateUrl: './inward-transaction-batch.component.html',
  styleUrls: ['./inward-transaction-batch.component.css'],
  providers: [InwardTransactionBatchFormService]
})
export class InwardTransactionBatchComponent implements OnInit{
  @Input() batches : TransactionBatch[];
  @Output() onBatchUpdate = new EventEmitter<any>();

  constructor(readonly formService: InwardTransactionBatchFormService) {}

  ngOnInit(): void {
    this.formService.init(this.onBatchUpdate, this.batches);
  }
}
