import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ConsolidatedStockReportFormService } from '../consolidated-stock-report/consolidated-stock-report-form.service';
import { PdfService } from 'src/app/shared/pdf.service';
import { CSRItemGroupReportFormService } from './csr-item-group-report-form.service';

@Component({
  selector: 'app-csr-item-group-report',
  templateUrl: './csr-item-group-report.component.html',
  providers: [CSRItemGroupReportFormService, PdfService],
})
export class CsrItemGroupReportComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  constructor(readonly formService: CSRItemGroupReportFormService) {}

  ngAfterViewInit(): void {
    this.formService.init(this.sort);
  }
}
