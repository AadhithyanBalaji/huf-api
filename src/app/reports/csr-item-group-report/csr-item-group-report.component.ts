import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CSRItemGroupReportFormService } from './csr-item-group-report-form.service';
import { CSRItemGroupPdfService } from './pdf-service/csr-item-group-pdf.service';

@Component({
  selector: 'app-csr-item-group-report',
  templateUrl: './csr-item-group-report.component.html',
  providers: [CSRItemGroupReportFormService, CSRItemGroupPdfService],
})
export class CsrItemGroupReportComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  constructor(readonly formService: CSRItemGroupReportFormService) {}

  ngAfterViewInit(): void {
    this.formService.init(this.sort);
  }
}
