import { Component, OnInit } from '@angular/core';
import { StockOutwardFormService } from './stock-outward-form.service';

@Component({
  selector: 'app-stock-outward',
  templateUrl: './stock-outward.component.html',
  styleUrls: ['./stock-outward.component.css'],
  providers: [StockOutwardFormService],
})
export class StockOutwardComponent implements OnInit {
  constructor(readonly formService: StockOutwardFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
