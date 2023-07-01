import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { AmrrReportFilters } from 'src/app/shared/amrr-report-filters/amrr-report-filters.model';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { PdfService } from 'src/app/shared/pdf.service';
import { CSRItemGroup } from './csr-item-group.model';
import { CSRItemGroupExportData } from 'src/app/shared/csr-item-group-export-data.model';
import { CSRItemGroupRow } from 'src/app/shared/csr-item-group-export-row.model';

@Injectable()
export class CSRItemGroupReportFormService {
  dataSource: MatTableDataSource<CSRItemGroup, MatPaginator> =
    new MatTableDataSource();
  columns = [
    'sno',
    'itemGroup',
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
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init(sort: MatSort) {
    this.sort = sort;
  }

  getData(transactionFilters: AmrrReportFilters) {
    if (Helper.isTruthy(transactionFilters)) {
      this.loading = true;
      this.apiBusinessService
        .post('report/consolidatedStock/itemGroup', transactionFilters)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.dataSource = new MatTableDataSource(
            data.recordset as CSRItemGroup[]
          );
          this.dataSource.sort = this.sort;
          this.filters = transactionFilters;
          this.loading = false;
        });
    }
  }

  printPdf() {
    this.pdfService.exporting = true;
    this.apiBusinessService
      .post('report/consolidatedStock/itemGroup/exportData', {
        ...this.filters,
      })
      .pipe(take(1))
      .subscribe((data: any) => {
        const exportData = new CSRItemGroupExportData();
        exportData.godown = this.filters.godown ?? 'All';
        exportData.fromDate = this.filters.fromDate;
        exportData.toDate = this.filters.toDate;
        exportData.itemGroupRows = data.recordset as CSRItemGroupRow[];
        exportData.reportData = this.dataSource.data;
        this.pdfService.exportCSRByItemGroupPdf(exportData);
      });
  }
}
