import { Component } from '@angular/core';
import { BatchwiseStockFormService } from './batchwise-stock-form.service';

@Component({
  selector: 'app-batchwise-stock',
  templateUrl: './batchwise-stock.component.html',
  styleUrls: ['./batchwise-stock.component.css'],
  providers: [BatchwiseStockFormService]
})
export class BatchwiseStockComponent {
  constructor(readonly formService: BatchwiseStockFormService) {}
  
}
