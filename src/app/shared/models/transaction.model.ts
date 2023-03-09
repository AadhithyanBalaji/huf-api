import { TransactionBatch } from './transaction-batch.model';

export class Transaction {
  batches: TransactionBatch[];
  runningNo: number;
  transactionId: number;
  transactionTypeId: number;
  invoiceNo: string;
  partyName: string;
  vehicleName: string;
  vehicleRegNo: string;
  weightMeasureType: number;
  remarks: string;
  verifiedBy: string;
  transactionDate: Date;
  createdByUserId: number;
  createdBy: string;
  updatedByUserId:number;
  updatedBy: string;
}
