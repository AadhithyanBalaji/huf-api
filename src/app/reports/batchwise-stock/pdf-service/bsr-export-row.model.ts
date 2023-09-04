import { IItemRow } from "src/app/shared/pdf-service/item-row.interface";

export class BSRExportRow implements IItemRow{
  transactionTypeId: number;
  bay: string;
  itemGroup: string;
  item: string;
  batch: string;
  partyName: string;
  qty: number;
  bags: number;
  deliveryChallan: string;
  place: string;
}
