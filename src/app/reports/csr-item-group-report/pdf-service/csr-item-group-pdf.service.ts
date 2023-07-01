import { Injectable } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CSRItemGroupExportData } from './csr-item-group-export-data.model';
import Helper from 'src/app/shared/helper';
import { IPdfService } from 'src/app/shared/pdf-service/pdf-service.interface';
import { PdfService } from 'src/app/shared/pdf-service/pdf.service';

@Injectable()
export class CSRItemGroupPdfService extends PdfService implements IPdfService {
  constructor(
    override readonly snackBar: MatSnackBar,
    override readonly decimalPipe: DecimalPipe,
    override readonly datePipe: DatePipe
  ) {
    super(decimalPipe, datePipe, snackBar);
  }

  export(data: CSRItemGroupExportData) {
    this.generatePdf(this.buildPdfContents(data));
  }

  private buildPdfContents(data: CSRItemGroupExportData) {
    if (!Helper.isTruthy(data) || data.reportData.length <= 0) return null;
    const groups = this.groupBy(data.reportData, 'itemGroup');
    const { itemGroupwiseTable, itemGroups } =
      this.getItemGroupwiseTable(groups);

    return {
      info: this.buildPdfMetadata(
        'Consolidated_StockReport_Item_Group',
        data.godown
      ),
      content: [
        {
          text: this.buildPdfTitle(data.fromDate, data.toDate, data.godown),
          style: 'header',
          alignment: 'center',
        },
        itemGroupwiseTable,
        this.getStockTable(
          data.reportData,
          data.itemGroupRows,
          itemGroups,
          'itemGroup',
          true
        ),
        this.getStockTable(
          data.reportData,
          data.itemGroupRows,
          itemGroups,
          'itemGroup'
        ),
      ],
      styles: this.getPdfStyles(),
      defaultStyle: {
        columnGap: 20,
        color: 'black',
      },
    };
  }
}
