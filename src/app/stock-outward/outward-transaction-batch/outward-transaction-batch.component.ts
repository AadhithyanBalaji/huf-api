import { Component, OnInit } from '@angular/core';
import { OutwardTransactionBatchFormService } from './outward-transaction-batch-form.service';

@Component({
  selector: 'app-outward-transaction-batch',
  templateUrl: './outward-transaction-batch.component.html',
  styleUrls: ['./outward-transaction-batch.component.css'],
  providers: [OutwardTransactionBatchFormService],
})
export class OutwardTransactionBatchComponent implements OnInit {
  constructor(readonly formService: OutwardTransactionBatchFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
