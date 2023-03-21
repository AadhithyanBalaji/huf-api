import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { ExcelService } from 'src/app/shared/excel.service';
import Helper from 'src/app/shared/helper';
import { PdfService } from 'src/app/shared/pdf.service';
import { BatchwiseStock } from './batchwise-stock-model';
import { BSRExportData } from './bsr-export-data.model';
import { BSRExportRow } from './bsr-export-row.model';

@Injectable()
export class BatchwiseStockFormService {
  dataSource: MatTableDataSource<BatchwiseStock, MatPaginator>;
  columns = [
    'sno',
    'godown',
    'itemGroup',
    'itemName',
    'batchName',
    'openingQty',
    'inwardQty',
    'gainQty',
    'outwardQty',
    'lossQty',
    'closingQty',
  ];
  loading = true;
  sort: MatSort;
  filters: AmrrReportFilters;

  constructor(
    readonly pdfService: PdfService,
    readonly excelService: ExcelService,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init(sort: MatSort) {
    this.sort = sort;
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      this.loading = true;
      this.apiBusinessService
        .post('report/batchwiseStock', transactionFilters)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.dataSource = new MatTableDataSource(
            data.recordset as BatchwiseStock[]
          );
          this.filters = transactionFilters;
          this.dataSource.sort = this.sort;
          this.loading = false;
        });
    }
  }

  printPdf() {
    const reportItemIds =
      Helper.isTruthy(this.dataSource?.data) && this.dataSource?.data.length > 0
        ? this.dataSource.data.map((x) => x.itemId)?.join(',')
        : '';
    this.pdfService.exporting = true;
    this.apiBusinessService
      .post('report/batchwiseStock/exportData', {
        ...this.filters,
        reportItemIds: reportItemIds,
      })
      .pipe(take(1))
      .subscribe((data: any) => {
        const exportData = new BSRExportData();
        exportData.godown = this.filters.godown ?? 'All';
        exportData.fromDate = this.filters.fromDate;
        exportData.toDate = this.filters.toDate;
        exportData.itemRows = data.recordset as BSRExportRow[];
        exportData.reportData = this.dataSource.data;
        this.pdfService.exportBSRPdf(exportData);
      });
  }

  excelExport() {}
}
