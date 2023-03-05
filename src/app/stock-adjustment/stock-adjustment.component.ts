import { Component, OnInit } from '@angular/core';
import { StockAdjustmentFormService } from './stock-adjustment-form.service';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.css'],
  providers: [StockAdjustmentFormService],
})
export class StockAdjustmentComponent implements OnInit {
  constructor(readonly formService: StockAdjustmentFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
