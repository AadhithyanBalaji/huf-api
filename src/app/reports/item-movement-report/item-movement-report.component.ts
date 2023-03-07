import { Component } from '@angular/core';
import { ItemMovementReportFormService } from './item-movement-report-form.service';

@Component({
  selector: 'app-item-movement-report',
  templateUrl: './item-movement-report.component.html',
  styleUrls: ['./item-movement-report.component.css'],
  providers: [ItemMovementReportFormService],
})
export class ItemMovementReportComponent {
  constructor(readonly formService: ItemMovementReportFormService) {}
}
