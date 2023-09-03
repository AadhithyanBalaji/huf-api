import { IItemRow } from 'src/app/shared/pdf-service/item-row.interface';

export class CSRExportRow implements IItemRow {
  transactionTypeId: number;
  itemGroup: string;
  item: string;
  partyName: string;
  qty: number;
  bags: number;
  deliveryChallan: string;
}
