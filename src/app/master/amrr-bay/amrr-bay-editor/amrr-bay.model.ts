import { IAmrrTypeahead } from "src/app/shared/amrr-typeahead/amrr-typeahead.interface";

export class AmrrBay implements IAmrrTypeahead {
  sno: number;
  id: number;
  name: string;
  godowns: string;
  godownIds: string;
  isActive: string;
}
