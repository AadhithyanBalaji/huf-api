export class AmrrReportFilters{
    userId: number;
    transactionTypeId: number;
    fromDate: string;
    toDate: string;
    godownId?: number | null;
    bayId?: number | null;
    itemGroupId?: number | null;
    itemId?: number | null;
    batchId?: number | null;   
}