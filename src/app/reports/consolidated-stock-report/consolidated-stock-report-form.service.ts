import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { ExcelService } from 'src/app/shared/excel.service';
import Helper from 'src/app/shared/helper';
import { ConsolidatedStockReport } from './consolidated-stock-report.model';
import { CsrPdfService } from './pdf-service/csr-pdf.service';
import { CSRExportData } from './pdf-service/csr-export-data.model';
import { CSRExportRow } from './pdf-service/csr-export-row.model';

@Injectable()
export class ConsolidatedStockReportFormService {
  dataSource: MatTableDataSource<ConsolidatedStockReport, MatPaginator> =
    new MatTableDataSource();
  columns = [
    'sno',
    'itemGroup',
    'itemName',
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
    readonly pdfService: CsrPdfService,
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
        .post('report/consolidatedStock', transactionFilters)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.dataSource = new MatTableDataSource(
            data.recordset as ConsolidatedStockReport[]
          );
          this.dataSource.sort = this.sort;
          this.filters = transactionFilters;
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
      .post('report/consolidatedStock/exportData', {
        ...this.filters,
        reportItemIds: reportItemIds,
      })
      .pipe(take(1))
      .subscribe((data: any) => {
        const exportData = new CSRExportData();
        exportData.godown = this.filters.godown ?? 'All';
        exportData.fromDate = this.filters.fromDate;
        exportData.toDate = this.filters.toDate;
        exportData.itemRows = data.recordset as CSRExportRow[];
        exportData.reportData = this.dataSource.data;
        this.pdfService.export(exportData);
      });
  }

  excelExport() {
    this.excelService.exportCSRAsExcel(this.dataSource.data, this.filters);
  }
}
