import { IItemRow } from './item-row.interface';

export default class PdfHelper {
  static getRecords(rows: IItemRow[], itemGroups: any, isInward = false) {
    return isInward
      ? PdfHelper.getInwardRecords(rows, itemGroups)
      : PdfHelper.getOutwardRecords(rows, itemGroups);
  }

  static getInwardRecords(rows: IItemRow[], itemGroups: any) {
    const unsortedInwardData = rows.filter(
      (x: any) =>
        x.transactionTypeId === 1 || (x.transactionTypeId === 3 && x.qty > 0)
    );
    return this.sortByItemGroup(unsortedInwardData, itemGroups);
  }
  static getOutwardRecords(rows: IItemRow[], itemGroups: any) {
    const unsortedOutwardData = rows.filter(
      (x: any) =>
        x.transactionTypeId === 2 || (x.transactionTypeId === 3 && x.qty < 0)
    );
    return this.sortByItemGroup(unsortedOutwardData, itemGroups);
  }

  static sortByItemGroup(unsortedData: any[], itemGroups: any) {
    let data: any[] = [];
    itemGroups.forEach((itemGroup: any) => {
      data.push(
        ...unsortedData.filter((x: any) => x.itemGroup === itemGroup.key)
      );
    });
    return data;
  }
}
