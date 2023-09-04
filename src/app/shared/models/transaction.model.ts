import { TransactionBatch } from './transaction-batch.model';

export class Transaction {
  batches: TransactionBatch[];
  runningNo: number;
  transactionId: number;
  transactionTypeId: number;
  deliveryChallan: string;
  place: string;
  invoiceNo: string;
  partyName: string;
  vehicleName: string;
  vehicleRegNo: string;
  weightMeasureType: number;
  remarks: string;
  verifiedBy: string;
  transactionDate: Date;
  transactionDateString: string; // to avoid date conversion while passing to API
  createdByUserId: number;
  createdBy: string;
  updatedByUserId:number;
  updatedBy: string;
}
