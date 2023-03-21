import { DatePipe, DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { BatchwiseStock } from '../reports/batchwise-stock/batchwise-stock-model';
import { BSRExportData } from '../reports/batchwise-stock/bsr-export-data.model';
import { BSRExportRow } from '../reports/batchwise-stock/bsr-export-row.model';
import { ConsolidatedStockReport } from '../reports/consolidated-stock-report/consolidated-stock-report.model';
import { CSRExportData } from './csr-export-data.model';
import { CSRExportRow } from './csr-export-row.model';
import Helper from './helper';
import { IReportData } from './report-data.interface.model';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  itemGroups: any[] = [];
  bags = 0;
  qty = 0;
  exporting = false;

  constructor(
    private readonly decimalPipe: DecimalPipe,
    private readonly datePipe: DatePipe,
    private readonly snackBar: MatSnackBar
  ) {}

  exportCSRPdf(data: CSRExportData) {
    if (
      Helper.isTruthy(data) &&
      Helper.isTruthy(data.reportData) &&
      data.reportData.length > 0
    ) {
      this.exporting = true;
      const documentDefinition = this.getCSRContent(data);
      pdfMake.createPdf(documentDefinition as any).open();
      this.exporting = false;
    } else {
      this.snackBar.open('No data to export');
    }
  }

  exportBSRPdf(data: BSRExportData) {
    if (
      Helper.isTruthy(data) &&
      Helper.isTruthy(data.reportData) &&
      data.reportData.length > 0
    ) {
      this.exporting = true;
      const documentDefinition = this.getBSRContent(data);
      pdfMake.createPdf(documentDefinition as any).open();
      this.exporting = false;
    } else {
      this.snackBar.open('No data to export');
    }
  }

  private getCSRContent(data: CSRExportData) {
    const itemGroupwiseTable = this.getItemGroupwiseTable(data.reportData);
    const itemwiseTable = this.getItemwiseTable(data.reportData);
    const unsortedInwardData = data.itemRows.filter(
      (x) =>
        x.transactionTypeId === 1 || (x.transactionTypeId === 3 && x.qty > 0)
    );
    const inwardData = this.sortByItemGroup(unsortedInwardData);

    const unsortedOutwardData = data.itemRows.filter(
      (x) =>
        x.transactionTypeId === 2 || (x.transactionTypeId === 3 && x.qty < 0)
    );
    const outwardData = this.sortByItemGroup(unsortedOutwardData);

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
          columns: [itemwiseTable, itemGroupwiseTable],
        },
        inwardData.length > 0
          ? this.getStockTable(true, inwardData, data.reportData)
          : {},
        outwardData.length > 0
          ? this.getStockTable(false, outwardData, data.reportData)
          : {},
      ],
      styles: this.getPdfStyles(),
      defaultStyle: {
        columnGap: 20,
        color: 'black',
      },
    };
  }

  private getBSRContent(data: BSRExportData) {
    const itemGroupwiseTable = this.getItemGroupwiseTable(data.reportData);
    const itemwiseTable = this.getBSRItemwiseTable(data.reportData);
    const unsortedInwardData = data.itemRows.filter(
      (x) =>
        x.transactionTypeId === 1 || (x.transactionTypeId === 3 && x.qty > 0)
    );
    const inwardData = this.sortBSRByItemGroup(unsortedInwardData);

    const unsortedOutwardData = data.itemRows.filter(
      (x) =>
        x.transactionTypeId === 2 || (x.transactionTypeId === 3 && x.qty < 0)
    );
    const outwardData = this.sortBSRByItemGroup(unsortedOutwardData);

    return {
      info: {
        title: `Detailed_StockReport_${
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
          columns: [itemwiseTable, itemGroupwiseTable],
        },
        inwardData.length > 0
          ? this.getBSRStockTable(true, inwardData, data.reportData)
          : {},
        outwardData.length > 0
          ? this.getBSRStockTable(false, outwardData, data.reportData)
          : {},
      ],
      styles: this.getPdfStyles(),
      defaultStyle: {
        columnGap: 20,
        color: 'black',
      },
    };
  }

  private sortByItemGroup(unsortedData: CSRExportRow[]) {
    let data: CSRExportRow[] = [];
    this.itemGroups.forEach((itemGroup) => {
      data.push(
        ...unsortedData.filter(
          (x: CSRExportRow) => x.itemGroup === itemGroup.key
        )
      );
    });
    return data;
  }

  private sortBSRByItemGroup(unsortedData: BSRExportRow[]) {
    let data: BSRExportRow[] = [];
    this.itemGroups.forEach((itemGroup) => {
      data.push(
        ...unsortedData.filter(
          (x: BSRExportRow) => x.itemGroup === itemGroup.key
        )
      );
    });
    return data;
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

  private getItemGroupwiseTable(reportData: IReportData[]) {
    const groups = this.groupBy(reportData, 'itemGroup');
    let totalQty = 0,
      totalBags = 0;
    this.itemGroups = [];
    Object.keys(groups).forEach((key) => {
      const bags = groups[key].reduce(function (acc: any, obj: any) {
        return acc + obj.closingBags;
      }, 0);
      const qty = groups[key].reduce(function (acc: any, obj: any) {
        return acc + obj.closingQty;
      }, 0);
      totalBags += bags;
      totalQty += qty;
      this.itemGroups.push({ key: key, bags: bags, qty: qty });
    });
    this.itemGroups.sort((a: any, b: any) => b.qty - a.qty);
    const tableRows = this.itemGroups.map((tableRow: any) =>
      this.addRow(tableRow.key, tableRow.bags, tableRow.qty)
    );
    tableRows.push(this.addRow('Total', totalBags, totalQty));

    return {
      style: 'tableExample',
      table: {
        keepWithHeaderRows: true,
        dontBreakRows: true,
        widths: ['*', 60, 60],
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
              alignment: 'left',
            },
            { text: 'Bags', style: 'tableHeader', alignment: 'right' },
            { text: 'Qty', style: 'tableHeader', alignment: 'right' },
          ],
          ...tableRows,
        ],
      },
    };
  }

  private getItemwiseTable(reportData: IReportData[]) {
    const tableRows = [];
    let totalBags = 0,
      totalQty = 0;
    this.itemGroups.forEach((element) => {
      reportData
        .filter((x: any) => x.itemGroup === element.key)
        .sort((a: IReportData, b: IReportData) => b.closingQty - a.closingQty)
        .forEach((reportRow) => {
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
    });

    tableRows.push(this.addRow('Total', totalBags, totalQty));

    return {
      keepWithHeaderRows: true,
      dontBreakRows: true,
      style: 'tableExample',

      table: {
        widths: ['auto', 60, 60],
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
              alignment: 'left',
            },
            { text: 'Bags', style: 'tableHeader', alignment: 'right' },
            { text: 'Qty', style: 'tableHeader', alignment: 'right' },
          ],
          ...tableRows,
        ],
      },
    };
  }

  private getBSRItemwiseTable(reportData: IReportData[]) {
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
    this.itemGroups.forEach((element) => {
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

    return {
      keepWithHeaderRows: true,
      dontBreakRows: true,
      style: 'tableExample',

      table: {
        widths: ['auto', 60, 60],
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
              alignment: 'left',
            },
            { text: 'Bags', style: 'tableHeader', alignment: 'right' },
            { text: 'Qty', style: 'tableHeader', alignment: 'right' },
          ],
          ...tableRows,
        ],
      },
    };
  }

  private getStockTable(
    isInward: boolean,
    rows: CSRExportRow[],
    reportData: ConsolidatedStockReport[]
  ) {
    const itemsGroup = this.groupBy(rows, 'item');
    const tables: any[] = [];

    const itemNames = Object.keys(itemsGroup);
    for (let i = 0; i + 1 < itemNames.length; i = i + 2) {
      tables.push(
        this.buildColumn(
          reportData,
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
          reportData,
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

  private getBSRStockTable(
    isInward: boolean,
    rows: BSRExportRow[],
    reportData: BatchwiseStock[]
  ) {
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
    reportData: ConsolidatedStockReport[],
    itemName: string,
    items: CSRExportRow[],
    itemName2?: string,
    items2?: CSRExportRow[],
    isInward = false
  ) {
    return {
      columns: [
        this.getTransactionsTable(itemName, items, isInward, reportData),
        itemName2 !== undefined
          ? this.getTransactionsTable(itemName2!, items2!, isInward, reportData)
          : {},
      ],
    };
  }

  private getTransactionsTable(
    item: string,
    itemData: CSRExportRow[],
    isInward: boolean,
    reportData: ConsolidatedStockReport[]
  ) {
    const reportItem = reportData.find((x) => x.itemName === item);
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
      return this.addRow(a.partyName, a.bags, a.qty);
    });

    return {
      style: 'tableExample',

      table: {
        keepWithHeaderRows: true,
        dontBreakRows: true,
        widths: ['*', 60, 60],
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
            { text: 'Bags', style: 'tableHeader', alignment: 'right' },
            { text: 'Quantity', style: 'tableHeader', alignment: 'right' },
          ],
          this.addRow('Opening', openingBags, openingQty),
          ...rows,
          this.addRow(
            'Closing',
            openingBags + this.bags,
            openingQty + this.qty
          ),
        ],
      },
    };
  }

  private getBSRTransactionsTable(
    reportData: BatchwiseStock[],
    item: string,
    batch: string,
    itemData: BSRExportRow[],
    isInward: boolean
  ) {
    const reportItem = reportData.find((x) => x.batchName === batch);
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

  private addRow(col1: string, bags: number, qty: number) {
    return [
      {
        text: col1,
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'left',
      },
      {
        text: this.decimalPipe.transform(Math.abs(bags), '1.0-0'),
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'right',
      },
      {
        text: this.decimalPipe.transform(Math.abs(qty), '1.2-2'),
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'right',
      },
    ];
  }

  private addBSRRow(col1: string, col2: string, bags: number, qty: number) {
    return [
      {
        text: col1,
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'left',
      },
      {
        text: col2,
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'left',
      },
      {
        text: this.decimalPipe.transform(Math.abs(bags), '1.0-0'),
        style:
          col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell',
        alignment: 'right',
      },
      {
        text: this.decimalPipe.transform(Math.abs(qty), '1.2-2'),
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
