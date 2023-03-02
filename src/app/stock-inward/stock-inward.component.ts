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
  constructor(readonly formService: StockInwardFormService) {
    this.formService.init();
  }
}
