import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/shared/excel.service';
import { PdfService } from 'src/app/shared/pdf-service/pdf.service';
import { ConsolidatedStockReportFormService } from './consolidated-stock-report-form.service';
import { CsrPdfService } from './pdf-service/csr-pdf.service';

@Component({
  selector: 'app-consolidated-stock-report',
  templateUrl: './consolidated-stock-report.component.html',
  styleUrls: ['./consolidated-stock-report.component.css'],
  providers: [ConsolidatedStockReportFormService, CsrPdfService, ExcelService],
})
export class ConsolidatedStockReportComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  constructor(readonly formService: ConsolidatedStockReportFormService) {}

  ngAfterViewInit(): void {
    this.formService.init(this.sort);
  }
}
