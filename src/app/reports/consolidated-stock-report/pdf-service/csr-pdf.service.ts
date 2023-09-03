import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe, DatePipe } from '@angular/common';
import { CSRExportData } from './csr-export-data.model';
import Helper from 'src/app/shared/helper';
import { IPdfService } from 'src/app/shared/pdf-service/pdf-service.interface';
import { PdfService } from 'src/app/shared/pdf-service/pdf.service';
import { IReportData } from 'src/app/shared/report-data.interface.model';

@Injectable()
export class CsrPdfService extends PdfService implements IPdfService {
  constructor(
    override readonly snackBar: MatSnackBar,
    override readonly decimalPipe: DecimalPipe,
    override readonly datePipe: DatePipe
  ) {
    super(decimalPipe, datePipe, snackBar);
  }

  export(data: CSRExportData) {
    this.generatePdf(this.buildPdfContents(data));
  }

  private buildPdfContents(data: CSRExportData) {
    if (!Helper.isTruthy(data) || data.reportData.length <= 0) return null;
    const groups = this.groupBy(data.reportData, 'itemGroup');
    const { itemGroupwiseTable, itemGroups } =
      this.getItemGroupwiseTable(groups);
    const itemwiseTable = this.getItemwiseTable(data.reportData, itemGroups);

    return {
      info: this.buildPdfMetadata('Consolidated_StockReport', data.godown),
      content: [
        {
          text: this.buildPdfTitle(data.fromDate, data.toDate, data.godown),
          style: 'header',
          alignment: 'center',
        },
        {
          alignment: 'justify',
          columns: [itemwiseTable, itemGroupwiseTable],
        },
        this.getStockTable(
          data.reportData,
          data.itemRows,
          itemGroups,
          'item',
          true
        ),
        this.getStockTable(data.reportData, data.itemRows, itemGroups, 'item'),
      ],
      styles: this.getPdfStyles(),
      defaultStyle: {
        columnGap: 20,
        color: 'black',
      },
    };
  }

  private getItemwiseTable(reportData: IReportData[], itemGroups: any) {
    const tableRows = [];
    let totalBags = 0,
      totalQty = 0;
    itemGroups.forEach((element: any) => {
      reportData
        .filter((x: any) => x.itemGroup === element.key)
        .sort((a: IReportData, b: IReportData) => b.closingQty - a.closingQty)
        .forEach((reportRow: IReportData) => {
          totalBags += reportRow.closingBags;
          totalQty += reportRow.closingQty;
          tableRows.push(
            this.addRow(
              reportRow.desc,
              reportRow.closingBags,
              reportRow.closingQty
            )
          );
        });
    });
    tableRows.push(this.addRow('Total', totalBags, totalQty));

    return this.buildTableWithTitle('Itemwise stock', 'Item', tableRows);
  }
}
