import { IReportData } from 'src/app/shared/report-data.interface.model';

export class CSRItemGroup implements IReportData {
  sno: number;
  itemGroupId: number;
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
