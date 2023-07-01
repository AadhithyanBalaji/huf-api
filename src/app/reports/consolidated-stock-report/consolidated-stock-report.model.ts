import { IReportData } from 'src/app/shared/report-data.interface.model';

export class ConsolidatedStockReport implements IReportData {
  sno: number;
  itemId: number;
  itemGroup: string;
  desc: string;
  openingQty: number;
  openingBags: number;
  inwardQty: number;
  inwardBags: number;
  gainQty: number;
  gainBags: number;
  outwardQty: number;
  outwardBags: number;
  lossQty: number;
  lossBags: number;
  closingQty: number;
  closingBags: number;
}
