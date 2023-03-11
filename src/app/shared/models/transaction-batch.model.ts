export class TransactionBatch{
  sno: number;
  id: number | null;
  transactionBatchId: number;
  godownId: number;
  bayId: number;
  batchId: number;
  itemId: number;
  adjustmentTypeId: number;
  batchName: string;
  qty: number;
  bags: number;
  reason: string;

  godown: string;
  bay: string;
  itemName: string;
  adjustmentType: string;
}
