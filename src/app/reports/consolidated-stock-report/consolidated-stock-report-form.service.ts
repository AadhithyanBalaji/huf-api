import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { CSRExportData } from 'src/app/shared/csr-export-data.model';
import { CSRExportRow } from 'src/app/shared/csr-export-row.model';
import Helper from 'src/app/shared/helper';
import { PdfService } from 'src/app/shared/pdf.service';
import { ConsolidatedStockReport } from './consolidated-stock-report.model';

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
    private readonly apiBusinessService: ApiBusinessService,
    private readonly pdfService: PdfService
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
    this.apiBusinessService
      .post('report/consolidatedStock/exportData', this.filters)
      .pipe(take(1))
      .subscribe((data: any) => {
        const exportData = new CSRExportData();
        exportData.godown = this.filters.godown ?? 'All';
        exportData.fromDate = this.filters.fromDate;
        exportData.toDate = this.filters.toDate;
        exportData.itemRows = data.recordset as CSRExportRow[];
        exportData.reportData = this.dataSource.data;
        this.pdfService.exportAsPdf(exportData);
      });
  }
}
