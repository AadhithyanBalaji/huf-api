import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ItemMovementReportFormService } from './item-movement-report-form.service';

@Component({
  selector: 'app-item-movement-report',
  templateUrl: './item-movement-report.component.html',
  styleUrls: ['./item-movement-report.component.css'],
  providers: [ItemMovementReportFormService],
})
export class ItemMovementReportComponent implements AfterViewInit {
  @ViewChild(MatSort) sort : MatSort;

  constructor(readonly formService: ItemMovementReportFormService) {}

  ngAfterViewInit(): void {
    this.formService.init(this.sort);
  }
}
