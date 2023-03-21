import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/shared/excel.service';
import { PdfService } from 'src/app/shared/pdf.service';
import { ConsolidatedStockReportFormService } from './consolidated-stock-report-form.service';

@Component({
  selector: 'app-consolidated-stock-report',
  templateUrl: './consolidated-stock-report.component.html',
  styleUrls: ['./consolidated-stock-report.component.css'],
  providers: [ConsolidatedStockReportFormService, PdfService, ExcelService],
})
export class ConsolidatedStockReportComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  constructor(readonly formService: ConsolidatedStockReportFormService) {}

  ngAfterViewInit(): void {
    this.formService.init(this.sort);
  }
}
