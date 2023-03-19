import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StockAdjustmentFormService } from './stock-adjustment-form.service';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.css'],
  providers: [StockAdjustmentFormService],
})
export class StockAdjustmentComponent implements OnInit {
  @ViewChild('dateTemplate', { static: true })
  dateTemplate: TemplateRef<any>;
  @ViewChild('userTemplate', { static: true })
  userTemplate: TemplateRef<any>;

  constructor(readonly formService: StockAdjustmentFormService) {}

  ngOnInit(): void {
    this.formService.init(this.dateTemplate, this.userTemplate);
  }
}
