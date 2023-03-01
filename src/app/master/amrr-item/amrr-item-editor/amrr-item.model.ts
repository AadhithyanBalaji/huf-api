import { IAmrrTypeahead } from "src/app/shared/amrr-typeahead/amrr-typeahead.interface";

export class AmrrItem implements IAmrrTypeahead{
    id: number;
    itemGroupId: number;
    itemGroup: string;
    name: string;
    unit: string;
    isActive: string;
}