import { DatePipe, DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import Helper from '../helper';
import { IReportData } from '../report-data.interface.model';
import PdfHelper from './pdf-helper';
import { IItemRow } from './item-row.interface';
import { IItemGroup } from './item-group.interface';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  bags = 0;
  qty = 0;
  exporting = false;

  constructor(
    readonly decimalPipe: DecimalPipe,
    readonly datePipe: DatePipe,
    readonly snackBar: MatSnackBar
  ) {}

  generatePdf(data: any) {
    if (Helper.isTruthy(data)) {
      this.exporting = true;
      this.printPdf(data);
      this.exporting = false;
    } else {
      this.snackBar.open('No data to export');
    }
  }

  printPdf(docDef: any) {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    isSafari
      ? pdfMake.createPdf(docDef as any).open({}, window)
      : pdfMake.createPdf(docDef as any).open();
  }

  getItemGroupwiseTable(groups: any) {
    let totalQty = 0,
      totalBags = 0;
    const itemGroups: IItemGroup[] = [];
    Object.keys(groups).forEach((key) => {
      const bags = groups[key].reduce(function (acc: any, obj: any) {
        return acc + obj.closingBags;
      }, 0);
      const qty = groups[key].reduce(function (acc: any, obj: any) {
        return acc + obj.closingQty;
      }, 0);
      totalBags += bags;
      totalQty += qty;
      itemGroups.push({ key: key, bags: bags, qty: qty });
    });
    itemGroups.sort((a: any, b: any) => b.qty - a.qty);
    const tableRows = itemGroups.map((tableRow: any) =>
      this.addRow(tableRow.key, tableRow.bags, tableRow.qty)
    );
    tableRows.push(this.addRow('Total', totalBags, totalQty));

    return {
      itemGroupwiseTable: this.buildTableWithTitle(
        'Item Groupwise stock',
        'Item Group',
        tableRows
      ),
      itemGroups: itemGroups,
    };
  }

  buildPdfMetadata(baseTitle: string, godown: string) {
    return {
      title: `${baseTitle}_${godown === 'All' ? 'All_GODOWNS' : godown}`,
      author: 'AMRR',
      subject: 'AMRR Transaction report for the selected criteria',
      keywords: 'amrr transactions report',
    };
  }

  buildPdfTitle(fromDateString: string, toDateString: string, godown: string) {
    const fromDate =
      fromDateString.split(' ').length > 0
        ? this.datePipe.transform(fromDateString.split(' ')[0], 'dd-MM-YYYY')
        : '';
    const toDate =
      toDateString.split(' ').length > 0
        ? this.datePipe.transform(toDateString.split(' ')[0], 'dd-MM-YYYY')
        : '';
    return `${godown === 'All' ? 'All GODOWNS' : godown} ${
      fromDate === toDate ? fromDate : fromDate + ' to ' + toDate
    }`;
  }

  buildStockTablesTitle(isInward = false) {
    return {
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
    };
  }

  getStockTable(
    reportData: IReportData[],
    itemRows: IItemRow[],
    itemGroups: any,
    groupBy: string,
    isInward = false
  ) {
    const rows = PdfHelper.getRecords(itemRows, itemGroups, isInward);
    const itemsGroup = this.groupBy(rows, groupBy);
    const tables: any[] = [];

    const itemGroupNames = Object.keys(itemsGroup);
    for (let i = 0; i < itemGroupNames.length; i++) {
      tables.push(
        this.getTransactionsTable(
          itemGroupNames[i],
          itemsGroup[itemGroupNames[i]],
          isInward,
          reportData
        )
      );
    }

    return [this.buildStockTablesTitle(isInward), ...tables];
  }

  addRow(col1: string, bags: number, qty: number) {
    const style =
      col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell';
    return [
      {
        text: col1,
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

  addRowWithDC(
    col1: string,
    bags: number,
    qty: number,
    deliveryChallan: string = '',
    place: string = ''
  ) {
    const style =
      col1 === 'Opening' || col1 === 'Closing' ? 'closingCell' : 'dataCell';
    return [
      {
        text: col1,
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
      {
        text: deliveryChallan ?? '',
        style: style,
        alignment: 'right',
      },
      {
        text: place ?? '',
        style: style,
        alignment: 'right',
      },
    ];
  }

  getPdfStyles() {
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

  groupBy = function (xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  buildTableWithTitle(title: string, tableTitle: string, tableRows: any) {
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
              text: title,
              style: 'tableMainHeader',
              colSpan: 3,
              alignment: 'center',
            },
            {},
            {},
          ],
          [
            {
              text: tableTitle,
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

  private getTransactionsTable(
    item: string,
    itemData: IItemRow[],
    isInward: boolean,
    reportData: IReportData[]
  ) {
    const reportItem = reportData.find((x) => x.desc === item);
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
      return this.addRowWithDC(
        a.partyName,
        a.bags,
        a.qty,
        a.deliveryChallan,
        a.place
      );
    });

    return {
      style: 'tableExample',

      table: {
        keepWithHeaderRows: true,
        dontBreakRows: true,
        widths: ['*', 60, 60, '*', '*'],
        headerRows: 2,
        body: [
          [
            {
              text: item,
              style: 'tableMainHeader',
              colSpan: 5,
              alignment: 'center',
            },
            {},
            {},
            {},
            {},
          ],
          [
            { text: '', style: 'tableHeader' },
            { text: 'Bags', style: 'tableHeader', alignment: 'right' },
            { text: 'Quantity', style: 'tableHeader', alignment: 'right' },
            {
              text: 'Delivery Challan',
              style: 'tableHeader',
              alignment: 'right',
            },
            {
              text: 'Place',
              style: 'tableHeader',
              alignment: 'right',
            },
          ],
          this.addRowWithDC('Opening', openingBags, openingQty),
          ...rows,
          this.addRowWithDC(
            'Closing',
            openingBags + this.bags,
            openingQty + this.qty
          ),
        ],
      },
    };
  }
}
