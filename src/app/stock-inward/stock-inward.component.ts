import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
export class StockInwardComponent implements OnInit {
  @ViewChild('invoiceDetailsTemplate', { static: true })
  invoiceDetailsTemplate: TemplateRef<any>;

  constructor(readonly formService: StockInwardFormService) {}

  ngOnInit(): void {
    this.formService.init(this.invoiceDetailsTemplate);
  }
}
