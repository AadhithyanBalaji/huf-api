export class TransactionsRequest {
  constructor(
    public transactionTypeId: number,
    public fromDate: Date | string,
    public toDate: Date | string,
    public godownId?: number,
    public bayId?: number,
    public itemGroupId?: number,
    public itemId?: number,
    public batchId?: number
  ) {}
}
