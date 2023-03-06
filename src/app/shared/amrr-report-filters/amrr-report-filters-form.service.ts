import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { AmrrBay } from 'src/app/master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItemGroup } from 'src/app/master/amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItem } from 'src/app/master/amrr-item/amrr-item-editor/amrr-item.model';
import { IAmrrTypeahead } from '../amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../api-business.service';
import { AmrrBatch } from '../models/amrr-batch.model';
import { AmrrReportFilters } from './amrr-report-filters.model';

@Injectable()
export class AmrrReportFiltersFormService {
  godowns: AmrrGodown[] = [];
  bays: AmrrBay[] = [];
  itemGroups: AmrrItemGroup[] = [];
  items: AmrrItem[] = [];
  batches: IAmrrTypeahead[];

  onViewClicked: EventEmitter<AmrrReportFilters>;
  form: FormGroup<{
    fromDate: FormControl<Date | null>;
    toDate: FormControl<Date | null>;
    goDownId: FormControl<any>;
    bayId: FormControl<any>;
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    batchId: FormControl<any>;
  }>;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(onViewClicked: EventEmitter<AmrrReportFilters>) {
    this.onViewClicked = onViewClicked;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    combineLatest([
      this.apiBusinessService.get('godown'),
      this.apiBusinessService.get('bay'),
      this.apiBusinessService.get('itemGroup'),
      this.apiBusinessService.get('item'),
      this.apiBusinessService.get('batch'),
    ])
      .pipe(take(1))
      .subscribe((data: any) => {
        this.godowns = data[0] as AmrrGodown[];
        this.bays = data[1] as AmrrBay[];
        this.itemGroups = data[2] as AmrrItemGroup[];
        this.items = data[3] as AmrrItem[];
        this.batches = data[4] as AmrrBatch[];
        this.form = new FormGroup({
          fromDate: new FormControl(today),
          toDate: new FormControl(tomorrow),
          goDownId: new FormControl(),
          bayId: new FormControl(),
          itemGroupId: new FormControl(),
          itemId: new FormControl(),
          batchId: new FormControl(),
        });
        this.getData(true);
      });
  }

  getData(isFirstTime = false) {
    const filters = new AmrrReportFilters();
    if (isFirstTime || (this.form.dirty && this.form.valid)) {
      filters.fromDate = this.form.controls.fromDate.value!;
      filters.toDate = this.form.controls.toDate.value!;
      filters.godownId = this.form.controls.goDownId.value;
      filters.bayId = this.form.controls.bayId.value;
      filters.itemGroupId = this.form.controls.itemGroupId.value;
      filters.itemId = this.form.controls.itemId.value;
      filters.batchId = this.form.controls.batchId.value;
    }
    return this.onViewClicked.emit(filters);
  }
}
