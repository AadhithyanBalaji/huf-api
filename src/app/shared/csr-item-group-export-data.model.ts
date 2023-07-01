import { CSRItemGroup } from '../reports/csr-item-group-report/csr-item-group.model';
import { CSRItemGroupRow } from './csr-item-group-export-row.model';

export class CSRItemGroupExportData {
  godown: string;
  fromDate: string;
  toDate: string;
  itemGroupRows: CSRItemGroupRow[];
  reportData: CSRItemGroup[];
}
