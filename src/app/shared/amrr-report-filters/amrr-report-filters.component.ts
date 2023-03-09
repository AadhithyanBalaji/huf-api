import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AmrrReportFiltersFormService } from './amrr-report-filters-form.service';
import { AmrrReportFilters } from './amrr-report-filters.model';

@Component({
  selector: 'app-amrr-report-filters',
  templateUrl: './amrr-report-filters.component.html',
  styleUrls: ['./amrr-report-filters.component.css'],
  providers: [AmrrReportFiltersFormService],
})
export class AmrrReportFiltersComponent implements OnInit {
  @Input() enableAllOptions = true;
  @Output() onViewClicked = new EventEmitter<AmrrReportFilters>();

  constructor(readonly formService: AmrrReportFiltersFormService) {}

  ngOnInit(): void {
    this.formService.init(this.onViewClicked, this.enableAllOptions);
  }
}
