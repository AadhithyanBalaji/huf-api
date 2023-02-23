import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-stock-inward',
  templateUrl: './stock-inward.component.html',
  styleUrls: ['./stock-inward.component.css'],
})
export class StockInwardComponent {
  godowns: string[] = [
    'S R M GODOWN',
    'V P S A COLD STORAGE',
    'ESWAR NAGAR GODOWN',
  ];
  filteredGodowns: Observable<string[]>;

  bays: string[] = [
    '4 - H - 1',
    '3 - C - 3',
    '1 - E - 1',
    '2 - H - 2',
    '2 - J - 2',
  ];
  filteredBays: Observable<string[]>;

  itemGroups: string[] = ['ORID', 'MOONG', 'TOOR', 'LENTILS'];
  filteredItemGroups: Observable<string[]>;

  items: string[] = [
    'ORID ANDHRA SADHA',
    'BUTTERFLY GRAM',
    'MOONG ASAKKU UDASAL',
  ];
  filteredItems: Observable<string[]>;

  batches: string[] = [];
  filteredBatches: Observable<string[]>;

  users = ['Ramesh', 'Suresh', 'Dinesh', 'Mahesh', 'Paramesh'];

  profileForm = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    goDownId: new FormControl(''),
    bayId: new FormControl(''),
    itemGroupId: new FormControl(''),
    itemId: new FormControl(''),
    batchId: new FormControl(''),
  });
  dataSource: any;
  columns = [
    {
      key: 'id',
      name: 'S.No.',
    },
    {
      key: 'inwardDate',
      name: 'Inward Date',
    },
    {
      key: 'godown',
      name: 'Godown',
    },
    {
      key: 'invoiceDetail',
      name: 'Invoice Detail',
    },
    {
      key: 'items',
      name: 'Items',
    },
    {
      key: 'noOfBags',
      name: 'No. of Bags',
    },
    {
      key: 'qty',
      name: 'Qty',
    },
    {
      key: 'user',
      name: 'User',
    },
    {
      key: 'options',
      name: 'Options',
    },
  ];

  constructor() {
    this.setupAutoCompleteListeners();

    // Create 100 users
    const mockData = Array.from({ length: 100 }, (_, k) => this.createMockRecord(k + 1));
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(mockData);
  }

  getData() {
    console.log(this.profileForm.value);
  }

  private setupAutoCompleteListeners() {
    this.filteredGodowns = this.profileForm.controls.goDownId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.godowns))
    );

    this.filteredBays = this.profileForm.controls.bayId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.bays))
    );

    this.filteredItemGroups =
      this.profileForm.controls.itemGroupId.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '', this.itemGroups))
      );

    this.filteredItems = this.profileForm.controls.itemId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.items))
    );

    this.filteredBatches = this.profileForm.controls.batchId.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.batches))
    );
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();

    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private createMockRecord(id: number) {
    return {
      id: id.toString(),
      inwardDate: new Date().toLocaleDateString(),
      godown: this.getRandomElement(this.godowns),
      invoiceDetail: this.getRandomElement(this.itemGroups),
      item: this.getRandomElement(this.items),
      noOfBags: Math.round(Math.random() * 100),
      qty: Math.round(Math.random() * 100),
      user: this.getRandomElement(this.users),
    };
  }

  private getRandomElement(array: any[]) {
    return array[Math.round(Math.random() * (array.length - 1))];
  }
}
