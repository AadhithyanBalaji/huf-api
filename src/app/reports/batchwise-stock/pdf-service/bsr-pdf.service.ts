import { Injectable } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BSRExportData } from 'src/app/reports/batchwise-stock/pdf-service/bsr-export-data.model';
import { BatchwiseStock } from 'src/app/reports/batchwise-stock/batchwise-stock-model';
import Helper from 'src/app/shared/helper';
import { IItemRow } from 'src/app/shared/pdf-service/item-row.interface';
import PdfHelper from 'src/app/shared/pdf-service/pdf-helper';
import { IPdfService } from 'src/app/shared/pdf-service/pdf-service.interface';
import { PdfService } from 'src/app/shared/pdf-service/pdf.service';
import { BSRExportRow } from './bsr-export-row.model';

@Injectable()
export class BSRPdfService extends PdfService implements IPdfService {
  constructor(
    override readonly snackBar: MatSnackBar,
    override readonly decimalPipe: DecimalPipe,
    override readonly datePipe: DatePipe
  ) {
    super(decimalPipe, datePipe, snackBar);
  }

  export(data: BSRExportData) {
    this.generatePdf(this.buildPdfContents(data));
  }

  private buildPdfContents(data: BSRExportData) {
    if (!Helper.isTruthy(data) || data.reportData.length <= 0) return null;
    const groups = this.groupBy(data.reportData, 'itemGroup');
    const { itemGroupwiseTable, itemGroups } =
      this.getItemGroupwiseTable(groups);
    const itemwiseTable = this.getBSRItemwiseTable(data.reportData, itemGroups);

    return {
      info: this.buildPdfMetadata('Detailed_StockReport', data.godown),
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
        this.getBSRStockTable(data.reportData, data.itemRows, itemGroups, true),
        this.getBSRStockTable(data.reportData, data.itemRows, itemGroups),
      ],
      styles: this.getPdfStyles(),
      defaultStyle: {
        columnGap: 20,
        color: 'black',
      },
    };
  }

  private getBSRItemwiseTable(reportData: BatchwiseStock[], itemGroups: any) {
    const tableRows = [];
    const rowsGroupedByItemName = this.groupBy(reportData, 'itemName');
    const itemNames = Object.keys(rowsGroupedByItemName);
    const itemTableRows: any[] = [];
    itemNames.forEach((itemName) => {
      let itemTotalBags = 0,
        itemTotalQty = 0;
      (rowsGroupedByItemName[itemName] as BatchwiseStock[]).forEach((x) => {
        itemTotalBags += x.closingBags ?? 0;
        itemTotalQty += x.closingQty ?? 0;
      });

      itemTableRows.push({
        itemName: itemName,
        itemGroup: rowsGroupedByItemName[itemName][0].itemGroup,
        qty: itemTotalQty,
        bags: itemTotalBags,
      });
    });

    let totalBags = 0,
      totalQty = 0;
    itemGroups.forEach((element: any) => {
      itemTableRows
        .filter((x: any) => x.itemGroup === element.key)
        .sort((a: any, b: any) => b.qty - a.qty)
        .forEach((reportRow) => {
          totalBags += reportRow.bags;
          totalQty += reportRow.qty;
          tableRows.push(
            this.addRow(reportRow.itemName, reportRow.bags, reportRow.qty)
          );
        });
    });

    tableRows.push(this.addRow('Total', totalBags, totalQty));
    return this.buildTableWithTitle('Itemwise stock', 'Item', tableRows);
  }

  private getBSRStockTable(
    reportData: BatchwiseStock[],
    itemRows: IItemRow[],
    itemGroups: any,
    isInward = false
  ) {
    const rows = PdfHelper.getRecords(itemRows, itemGroups, isInward);
    const itemsGroup = this.groupBy(rows, 'item');
    const tables: any[] = [];

    const itemNames = Object.keys(itemsGroup);
    itemNames.forEach((itemName: string) => {
      const batchesGroup = this.groupBy(itemsGroup[itemName], 'batch');
      const batchesNames = Object.keys(batchesGroup);
      batchesNames.forEach((batchName: string) => {
        tables.push(
          this.getBSRTransactionsTable(
            reportData,
            itemName,
            batchName,
            batchesGroup[batchName],
            isInward
          )
        );
      });
    });

    return [this.buildStockTablesTitle(isInward), ...tables];
  }

  private getBSRTransactionsTable(
    reportData: BatchwiseStock[],
    item: string,
    batch: string,
    itemData: BSRExportRow[],
    isInward: boolean
  ) {
    const reportItem = reportData.find((x) => x.desc === batch);
    let openingBags = reportItem?.openingBags ?? 0;
    if (!isInward) {
      openingBags +=
        (reportItem?.inwardBags ?? 0) + (reportItem?.gainBags ?? 0);
    }

    let openingQty = reportItem?.openingQty ?? 0;
    if (!isInward) {
      openingQty += (reportItem?.inwardQty ?? 0) + (reportItem?.gainQty ?? 0);
    }

    this.bags = 0;
    this.qty = 0;

    const rows = itemData.map((a) => {
      this.bags += a.bags;
      this.qty += a.qty;
      return this.addBSRRow(a.bay, a.partyName, a.bags, a.qty);
    });

    return {
      style: 'tableExample',

      table: {
        keepWithHeaderRows: true,
        dontBreakRows: true,
        widths: ['*', '*', 60, 60],
        headerRows: 2,
        body: [
          [
            {
              text: item,
              style: 'tableMainHeader',
              colSpan: 3,
              alignment: 'center',
            },
            {},
            {},
            {
              text: batch,
              style: 'tableMainHeader',
              alignment: 'center',
            },
          ],
          [
            { text: 'Bay', style: 'tableHeader', alignment: 'left' },
            { text: 'Party/Mill', style: 'tableHeader', alignment: 'left' },
            { text: 'Bags', style: 'tableHeader', alignment: 'right' },
            { text: 'Quantity', style: 'tableHeader', alignment: 'right' },
          ],
          this.addBSRRow('Opening', '', openingBags, openingQty),
          ...rows,
          this.addBSRRow(
            'Closing',
            '',
            openingBags + this.bags,
            openingQty + this.qty
          ),
        ],
      },
    };
  }

  private addBSRRow(col1: string, col2: string, bags: number, qty: number) {
    const style =
      col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell';
    return [
      {
        text: col1,
        style: style,
        alignment: 'left',
      },
      {
        text: col2,
        style: style,
        alignment: 'left',
      },
      {
        text: this.decimalPipe.transform(Math.abs(bags), '1.0-0'),
        style: style,
        alignment: 'right',
      },
      {
        text: this.decimalPipe.transform(Math.abs(qty), '1.2-2'),
        style: style,
        alignment: 'right',
      },
    ];
  }
}
