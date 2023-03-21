import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ExcelService } from 'src/app/shared/excel.service';
import { PdfService } from 'src/app/shared/pdf.service';
import { BatchwiseStockFormService } from './batchwise-stock-form.service';

@Component({
  selector: 'app-batchwise-stock',
  templateUrl: './batchwise-stock.component.html',
  styleUrls: ['./batchwise-stock.component.css'],
  providers: [BatchwiseStockFormService, PdfService, ExcelService],
})
export class BatchwiseStockComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  constructor(readonly formService: BatchwiseStockFormService) {}

  ngAfterViewInit(): void {
    this.formService.init(this.sort);
  }
}
