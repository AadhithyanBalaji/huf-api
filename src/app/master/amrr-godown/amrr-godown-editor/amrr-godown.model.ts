import { IAmrrTypeahead } from "src/app/shared/amrr-typeahead/amrr-typeahead.interface";

export class AmrrGodown implements IAmrrTypeahead{
    id: number;
    name: string;
    capacity: number;
    gstInName: string;
    gstInAddress: string;
    isActive: string;
}