import { ConsolidatedStockReport } from '../consolidated-stock-report.model';
import { CSRExportRow } from './csr-export-row.model';

export class CSRExportData {
  godown: string;
  fromDate: string;
  toDate: string;
  itemRows: CSRExportRow[];
  reportData: ConsolidatedStockReport[];
}
