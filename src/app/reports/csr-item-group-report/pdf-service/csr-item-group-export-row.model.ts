import { IItemRow } from "src/app/shared/pdf-service/item-row.interface";

export class CSRItemGroupRow implements IItemRow {
    item: string;
    transactionTypeId: number;
    itemGroup: string;
    partyName: string;
    qty: number;
    bags: number;
    deliveryChallan: string;
}