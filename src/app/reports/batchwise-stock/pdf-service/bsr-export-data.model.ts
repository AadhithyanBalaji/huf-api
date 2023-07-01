import { BatchwiseStock } from '../batchwise-stock-model';
import { BSRExportRow } from './bsr-export-row.model';

export class BSRExportData {
  godown: string;
  fromDate: string;
  toDate: string;
  itemRows: BSRExportRow[];
  reportData: BatchwiseStock[];
}
