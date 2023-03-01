import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { StockInwardFormService } from './stock-inward-form.service';

@Component({
  selector: 'app-stock-inward',
  templateUrl: './stock-inward.component.html',
  styleUrls: ['./stock-inward.component.css'],
  providers: [StockInwardFormService],
})
export class StockInwardComponent {
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
  ];

  constructor(readonly formService: StockInwardFormService) {
    this.dataSource = new MatTableDataSource([]);
    this.formService.init();
  }
}
