import { Component, OnInit } from '@angular/core';
import { InwardTransactionBatchFormService } from './inward-transaction-batch-form.service';

@Component({
  selector: 'app-inward-transaction-batch',
  templateUrl: './inward-transaction-batch.component.html',
  styleUrls: ['./inward-transaction-batch.component.css'],
  providers: [InwardTransactionBatchFormService],
})
export class InwardTransactionBatchComponent implements OnInit {
  constructor(readonly formService: InwardTransactionBatchFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
