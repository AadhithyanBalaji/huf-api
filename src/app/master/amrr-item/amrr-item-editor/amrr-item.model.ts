import { IAmrrTypeahead } from "src/app/shared/amrr-typeahead.interface";

export class AmrrItem implements IAmrrTypeahead{
    sno: number;
    id: number;
    itemGroupId: number;
    itemGroup: string;
    name: string;
    unit: string;
    isActive: string;
}