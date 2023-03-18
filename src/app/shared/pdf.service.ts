import { style } from '@angular/animations';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ConsolidatedStockReport } from '../reports/consolidated-stock-report/consolidated-stock-report.model';
import { CSRExportData } from './csr-export-data.model';
import { CSRExportRow } from './csr-export-row.model';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  reportData: ConsolidatedStockReport[] = [];
  bags = 0;
  qty = 0;

  constructor(
    private readonly decimalPipe: DecimalPipe,
    private readonly datePipe: DatePipe
  ) {}

  exportAsPdf(data: CSRExportData) {
    this.reportData = data.reportData;
    const documentDefinition = this.getCSRContent(data);
    pdfMake.createPdf(documentDefinition as any).open();
  }

  exportAsExcel() {}

  private getCSRContent(data: CSRExportData) {
    const inwardData = data.itemRows.filter(
      (x) =>
        x.transactionTypeId === 1 || (x.transactionTypeId === 3 && x.qty > 0)
    );
    const outwardData = data.itemRows.filter(
      (x) =>
        x.transactionTypeId === 2 || (x.transactionTypeId === 3 && x.qty < 0)
    );
    return {
      info: {
        title: `Consolidated_StockReport_${
          data.godown === 'All' ? 'All_GODOWNS' : data.godown
        }`,
        author: 'AMRR',
        subject: 'AMRR Transaction report for the selected criteria',
        keywords: 'amrr transactions report',
      },
      content: [
        {
          text: this.buildPdfTitle(data),
          style: 'header',
          alignment: 'center',
        },
        {
          alignment: 'justify',
          columns: [this.getItemwiseTable(), this.getItemGroupwiseTable()],
        },
        inwardData.length > 0 ? this.getStockTable(true, inwardData) : {},
        outwardData.length > 0 ? this.getStockTable(false, outwardData) : {},
      ],
      styles: this.getPdfStyles(),
      defaultStyle: {
        columnGap: 20,
        color: 'black',
      },
    };
  }

  private buildPdfTitle(data: CSRExportData) {
    const fromDate =
      data.fromDate.split(' ').length > 0
        ? this.datePipe.transform(data.fromDate.split(' ')[0], 'dd-MM-YYYY')
        : '';
    const toDate =
      data.toDate.split(' ').length > 0
        ? this.datePipe.transform(data.toDate.split(' ')[0], 'dd-MM-YYYY')
        : '';
    return `${data.godown === 'All' ? 'All GODOWNS' : data.godown} ${
      fromDate === toDate ? fromDate : fromDate + ' to ' + toDate
    }`;
  }

  private getItemGroupwiseTable() {
    const groups = this.groupBy(this.reportData, 'itemGroup');
    const tableRows = [];
    let totalQty = 0,
      totalBags = 0;
    Object.keys(groups).forEach((key) => {
      const bags = groups[key].reduce(function (acc: any, obj: any) {
        return acc + obj.closingBags;
      }, 0);
      const qty = groups[key].reduce(function (acc: any, obj: any) {
        return acc + obj.closingQty;
      }, 0);
      totalBags += bags;
      totalQty += qty;
      tableRows.push(this.addRow(key, bags, qty));
    });
    tableRows.push(this.addRow('Total', totalBags, totalQty));

    return {
      style: 'tableExample',
      table: {
        keepWithHeaderRows: true,
        dontBreakRows: true,
        widths: ['*', 50, 50],
        headerRows: 2,
        body: [
          [
            {
              text: 'Item Groupwise stock',
              style: 'tableMainHeader',
              colSpan: 3,
              alignment: 'center',
            },
            {},
            {},
          ],
          [
            {
              text: 'Item Group',
              style: 'tableHeader',
              alignment: 'center',
            },
            { text: 'Bags', style: 'tableHeader' },
            { text: 'Qty', style: 'tableHeader' },
          ],
          ...tableRows,
        ],
      },
    };
  }

  private getItemwiseTable() {
    const tableRows = [];
    let totalBags = 0,
      totalQty = 0;
    this.reportData.forEach((reportRow) => {
      totalBags += reportRow.closingBags;
      totalQty += reportRow.closingQty;
      tableRows.push(
        this.addRow(
          reportRow.itemName,
          reportRow.closingBags,
          reportRow.closingQty
        )
      );
    });
    tableRows.push(this.addRow('Total', totalBags, totalQty));

    return {
      keepWithHeaderRows: true,
      dontBreakRows: true,
      style: 'tableExample',

      table: {
        widths: ['auto', 50, 50],
        headerRows: 2,
        body: [
          [
            {
              text: 'Itemwise stock',
              style: 'tableMainHeader',
              colSpan: 3,
              alignment: 'center',
            },
            {},
            {},
          ],
          [
            {
              text: 'Item',
              style: 'tableHeader',
              alignment: 'center',
            },
            { text: 'Bags', style: 'tableHeader' },
            { text: 'Qty', style: 'tableHeader' },
          ],
          ...tableRows,
        ],
      },
    };
  }

  private getStockTable(isInward: boolean, rows: CSRExportRow[]) {
    const itemsGroup = this.groupBy(rows, 'item');
    const tables: any[] = [];

    const itemNames = Object.keys(itemsGroup);
    for (let i = 0; i + 1 < itemNames.length; i = i + 2) {
      tables.push(
        this.buildColumn(
          itemNames[i],
          itemsGroup[itemNames[i]],
          itemNames[i + 1],
          itemsGroup[itemNames[i + 1]],
          isInward
        )
      );
    }
    if (itemNames.length % 2 === 1) {
      tables.push(
        this.buildColumn(
          itemNames[itemNames.length - 1],
          itemsGroup[itemNames[itemNames.length - 1]],
          undefined,
          undefined,
          isInward
        )
      );
    }

    return [
      {
        table: {
          style: 'noBorder',
          widths: ['*'],
          headerRows: 1,
          body: [
            [
              {
                text: isInward ? 'Stock In List' : 'Delivery list',
                style: 'transactionsHeader',
                alignment: 'center',
              },
            ],
          ],
        },
      },
      ...tables,
    ];
  }

  private buildColumn(
    itemName: string,
    items: CSRExportRow[],
    itemName2?: string,
    items2?: CSRExportRow[],
    isInward = false
  ) {
    return {
      columns: [
        this.getTransactionsTable(itemName, items, isInward),
        itemName2 !== undefined
          ? this.getTransactionsTable(itemName2!, items2!, isInward)
          : {},
      ],
    };
  }

  private getTransactionsTable(
    item: string,
    itemData: CSRExportRow[],
    isInward: boolean
  ) {
    const reportItem = this.reportData.find((x) => x.itemName === item);
    let openingBags = reportItem?.openingBags ?? 0;
    if (!isInward) {
      openingBags +=
        (reportItem?.inwardBags ?? 0) + (reportItem?.gainBags ?? 0);
    }

    let openingQty = reportItem?.openingQty ?? 0;
    if (!isInward) {
      openingQty += (reportItem?.inwardQty ?? 0) + (reportItem?.gainQty ?? 0);
    }

    this.bags = reportItem?.openingBags ?? 0;
    this.qty = reportItem?.openingQty ?? 0;

    const rows = itemData.map((a) => {
      this.bags += a.bags;
      this.qty += a.qty;
      return this.addRow(a.partyName, a.bags, a.qty);
    });

    return {
      style: 'tableExample',

      table: {
        keepWithHeaderRows: true,
        dontBreakRows: true,
        widths: ['*', 50, 50],
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
          ],
          [
            { text: '', style: 'tableHeader' },
            { text: 'Bags', style: 'tableHeader' },
            { text: 'Quantity', style: 'tableHeader' },
          ],
          this.addRow('Opening', openingBags, openingQty),
          ...rows,
          this.addRow(
            'Closing',
            !isInward ? openingBags + this.bags : this.bags,
            !isInward ? openingQty + this.qty : this.qty
          ),
        ],
      },
    };
  }

  private addRow(col1: string, bags: number, qty: number) {
    return [
      {
        text: col1,
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'center',
      },
      {
        text: this.decimalPipe.transform(Math.abs(bags), '1.0-0'),
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'right',
      },
      {
        text: this.decimalPipe.transform(Math.abs(qty), '1.4-4'),
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'right',
      },
    ];
  }

  private getPdfStyles() {
    return {
      header: {
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        fontSize: 10,
        color: 'black',
      },
      tableHeader: {
        fontSize: 10,
        color: 'black',
        alignment: 'center',
      },
      tableMainHeader: {
        color: 'black',
        fillColor: '#cccccc',
        bold: true,
      },
      transactionsHeader: {
        fillColor: '#cccccc',
        bold: true,
      },
      noBorder: {
        border: [false, false, false, false],
      },
      defaultCell: {
        color: 'black',
      },
      closingCell: {
        fillColor: '#cccccc',
        color: 'black',
      },
    };
  }

  private groupBy = function (xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
}
