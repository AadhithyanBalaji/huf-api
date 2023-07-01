import { IReportData } from 'src/app/shared/report-data.interface.model';

export class BatchwiseStock implements IReportData {
  sno: number;
  godown: string;
  bay: string;
  itemGroup: string;
  itemId: number;
  itemName: string;
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
