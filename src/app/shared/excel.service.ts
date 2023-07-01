import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { BatchwiseStock } from '../reports/batchwise-stock/batchwise-stock-model';
import { ConsolidatedStockReport } from '../reports/consolidated-stock-report/consolidated-stock-report.model';
import { AmrrReportFilters } from './amrr-report-filters/amrr-report-filters.model';

@Injectable()
export class ExcelService {
  exporting = false;

  constructor(private readonly datePipe: DatePipe) {}

  exportCSRAsExcel(
    data: ConsolidatedStockReport[],
    filterData: AmrrReportFilters
  ) {
    this.exporting = true;
    const sheetName = 'Consolidated Stock Report';
    const filteredData: any[] = data.map(function (x) {
      return {
        'S.No.': x.sno,
        'Group Name': x.itemGroup,
        'Item Name': x.desc,
        'Opening Bags': x.openingBags,
        Opening: x.openingQty,
        'Inward Bags': x.inwardBags,
        Inward: x.inwardQty,
        'Outward Bags': x.outwardBags,
        Outward: x.outwardQty,
        'Gain Bags': x.gainBags,
        Gain: x.gainQty,
        'Loss Bags': x.lossBags,
        Loss: x.lossQty,
        'Closing Bags': x.closingBags,
        Closing: x.closingQty,
      };
    });

    const ws = XLSX.utils.json_to_sheet([]);
    const bagsWidth = 12;
    const qtyWidth = 9;
    var wscols = [
      { wch: 20 },
      { wch: 20 },
      { wch: 50 },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
    ];

    ws['!cols'] = wscols;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.utils.sheet_add_json(wb.Sheets[sheetName], filteredData, {
      origin: 'A4',
    });
    XLSX.utils.sheet_add_json(
      wb.Sheets[sheetName],
      [{ note: 'AMRR Maharaja Dhall Mills' }],
      {
        header: ['note'],
        skipHeader: true,
        origin: 'C1',
      }
    );
    const fromDate =
      filterData.fromDate.split(' ').length > 0
        ? this.datePipe.transform(
            filterData.fromDate.split(' ')[0],
            'dd-MM-YYYY'
          )
        : '';
    const toDate =
      filterData.toDate.split(' ').length > 0
        ? this.datePipe.transform(filterData.toDate.split(' ')[0], 'dd-MM-YYYY')
        : '';
    XLSX.utils.sheet_add_json(
      wb.Sheets[sheetName],
      [{ note: `Consolidated Stock Report from ${fromDate} to ${toDate}` }],
      {
        header: ['note'],
        skipHeader: true,
        origin: 'C2',
      }
    );
    XLSX.utils.sheet_add_json(
      wb.Sheets[sheetName],
      [
        {
          f1: `Godown Name : ${filterData.godown}`,
          f2: `BayName : ${filterData.bay}`,
          f3: `Item Group : ${filterData.itemGroup}`,
          f4: `Items : ${filterData.item}`,
          f5: `Batch: ${filterData.batch}`,
        },
      ],
      {
        header: ['f1', 'f2', 'f3', 'f4', 'f5'],
        skipHeader: true,
        origin: 'A3',
      }
    );
    XLSX.writeFile(
      wb,
      `Consolidated Stock Report ${fromDate} - ${toDate}.xlsx`
    );
    this.exporting = false;
  }

  exportBSRAsExcel(data: BatchwiseStock[], filterData: AmrrReportFilters) {
    this.exporting = true;
    const sheetName = 'Batchwise Stock Report';
    const filteredData: any[] = data.map(function (x) {
      return {
        'S.No.': x.sno,
        'Group Name': x.itemGroup,
        'Item Name': x.itemName,
        Godown: x.godown,
        Bay: x.bay,
        Batch: x.desc,
        'Opening Bags': x.openingBags,
        Opening: x.openingQty,
        'Inward Bags': x.openingBags,
        Inward: x.openingBags,
        'Outward Bags': x.outwardBags,
        Outward: x.outwardQty,
        'Gain Bags': x.gainBags,
        Gain: x.gainQty,
        'Loss Bags': x.lossBags,
        Loss: x.lossQty,
        'Closing Bags': x.closingBags,
        Closing: x.closingQty,
      };
    });

    const ws = XLSX.utils.json_to_sheet([]);
    const bagsWidth = 12;
    const qtyWidth = 9;
    var wscols = [
      { wch: 20 },
      { wch: 20 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
      { wch: bagsWidth },
      { wch: qtyWidth },
    ];

    ws['!cols'] = wscols;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.utils.sheet_add_json(wb.Sheets[sheetName], filteredData, {
      origin: 'A4',
    });
    XLSX.utils.sheet_add_json(
      wb.Sheets[sheetName],
      [{ note: 'AMRR Maharaja Dhall Mills' }],
      {
        header: ['note'],
        skipHeader: true,
        origin: 'C1',
      }
    );
    const fromDate =
      filterData.fromDate.split(' ').length > 0
        ? this.datePipe.transform(
            filterData.fromDate.split(' ')[0],
            'dd-MM-YYYY'
          )
        : '';
    const toDate =
      filterData.toDate.split(' ').length > 0
        ? this.datePipe.transform(filterData.toDate.split(' ')[0], 'dd-MM-YYYY')
        : '';
    XLSX.utils.sheet_add_json(
      wb.Sheets[sheetName],
      [{ note: `Batchwise Stock Report from ${fromDate} to ${toDate}` }],
      {
        header: ['note'],
        skipHeader: true,
        origin: 'C2',
      }
    );
    XLSX.utils.sheet_add_json(
      wb.Sheets[sheetName],
      [
        {
          f1: `Godown Name : ${filterData.godown}`,
          f2: `BayName : ${filterData.bay}`,
          f3: `Item Group : ${filterData.itemGroup}`,
          f4: `Items : ${filterData.item}`,
          f5: `Batch: ${filterData.batch}`,
        },
      ],
      {
        header: ['f1', 'f2', 'f3', 'f4', 'f5'],
        skipHeader: true,
        origin: 'A3',
      }
    );
    XLSX.writeFile(wb, `Batchwise Stock Report ${fromDate} - ${toDate}.xlsx`);
    this.exporting = false;
  }
}
