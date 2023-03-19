import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StockInwardFormService } from './stock-inward-form.service';

@Component({
  selector: 'app-stock-inward',
  templateUrl: './stock-inward.component.html',
  styleUrls: ['./stock-inward.component.css'],
  providers: [StockInwardFormService],
})
export class StockInwardComponent implements OnInit {
  @ViewChild('invoiceDetailsTemplate', { static: true })
  invoiceDetailsTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true })
  dateTemplate: TemplateRef<any>;
  @ViewChild('userTemplate', { static: true })
  userTemplate: TemplateRef<any>;

  constructor(readonly formService: StockInwardFormService) {}

  ngOnInit(): void {
    this.formService.init(
      this.invoiceDetailsTemplate,
      this.dateTemplate,
      this.userTemplate
    );
  }
}
