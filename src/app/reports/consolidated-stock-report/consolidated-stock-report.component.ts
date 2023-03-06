import { Component, OnInit } from '@angular/core';
import { ConsolidatedStockReportFormService } from './consolidated-stock-report-form.service';

@Component({
  selector: 'app-consolidated-stock-report',
  templateUrl: './consolidated-stock-report.component.html',
  styleUrls: ['./consolidated-stock-report.component.css'],
  providers: [ConsolidatedStockReportFormService],
})
export class ConsolidatedStockReportComponent{
  constructor(readonly formService: ConsolidatedStockReportFormService) {}
}
