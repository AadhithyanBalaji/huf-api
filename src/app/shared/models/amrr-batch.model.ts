import { IAmrrTypeahead } from "../amrr-typeahead/amrr-typeahead.interface";

export class AmrrBatch implements IAmrrTypeahead{
    id: number;
    name: string;
    bags: number;
    qty: number;
}