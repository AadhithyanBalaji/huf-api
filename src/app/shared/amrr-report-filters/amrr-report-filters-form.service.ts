import { DatePipe } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { AmrrBay } from 'src/app/master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItemGroup } from 'src/app/master/amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItem } from 'src/app/master/amrr-item/amrr-item-editor/amrr-item.model';
import { IAmrrTypeahead } from '../amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../api-business.service';
import Helper from '../helper';
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
    fromDate: FormControl<any>;
    toDate: FormControl<any>;
    goDownId: FormControl<any>;
    bayId: FormControl<any>;
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    batchId: FormControl<any>;
    checkBox: FormControl<any>;
  }>;
  enableAllOptions: boolean;
  allOption = { id: 0, name: 'All' };
  transactionTypeId: number;

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly authService: AuthService,
    private readonly datePipe: DatePipe
  ) {}

  init(
    onViewClicked: EventEmitter<AmrrReportFilters>,
    enableAllOptions: boolean,
    transactionTypeId: number
  ) {
    this.onViewClicked = onViewClicked;
    this.enableAllOptions = enableAllOptions;
    this.transactionTypeId = transactionTypeId;
    this.updateFiltersValues(true);
  }

  updateFiltersValues(isFirstTime = false): void {
    const filters = isFirstTime
      ? {
          transactionTypeId: this.transactionTypeId,
          userId: this.authService.getUserId(),
        }
      : this.buildFiltersObject();
    this.apiBusinessService
      .post('stock/filtersData', filters)
      .subscribe((filterData: any) => {
        this.godowns = this.addAllOption(
          JSON.parse(filterData?.output?.Godowns) ?? []
        );
        this.bays = this.addAllOption(
          JSON.parse(filterData?.output?.Bays) ?? []
        );
        this.itemGroups = this.addAllOption(
          JSON.parse(filterData?.output?.ItemGroups) ?? []
        );
        this.items = this.addAllOption(
          JSON.parse(filterData?.output?.Items) ?? []
        );
        this.batches = this.addAllOption(
          JSON.parse(filterData?.output?.Batches) ?? []
        );
        if (isFirstTime) {
          const today = new Date();
          this.form = new FormGroup({
            fromDate: new FormControl(today, [Validators.required]),
            toDate: new FormControl(today, [Validators.required]),
            goDownId: new FormControl(this.allOption),
            bayId: new FormControl(this.allOption),
            itemGroupId: new FormControl(this.allOption),
            itemId: new FormControl(this.allOption),
            batchId: new FormControl(this.allOption),
            checkBox: new FormControl(false),
          });
          this.setupFormListeners();
          this.getData();
        }
      });
  }

  getData() {
    const filters = this.buildFiltersObject();
    return this.onViewClicked.emit(filters);
  }

  private setupFormListeners() {
    this.form.controls.goDownId.valueChanges.subscribe((_) =>
      this.updateFiltersValues()
    );
    this.form.controls.bayId.valueChanges.subscribe((_) =>
      this.updateFiltersValues()
    );
    this.form.controls.itemGroupId.valueChanges.subscribe((_) =>
      this.updateFiltersValues()
    );
    this.form.controls.itemId.valueChanges.subscribe((_) =>
      this.updateFiltersValues()
    );
  }

  private addAllOption(options: any[]) {
    if (
      !Helper.isTruthy(options) ||
      options.length <= 0 ||
      !this.enableAllOptions
    )
      return options;
    options.unshift({
      id: 0,
      name: 'All',
    });
    return options;
  }

  private buildFiltersObject(): AmrrReportFilters {
    const filters = new AmrrReportFilters();
    if (this.form.valid) {
      filters.userId = this.authService.getUserId();
      filters.transactionTypeId = this.transactionTypeId;
      filters.fromDate =
        this.datePipe.transform(
          new Date(
            new Date(this.form.controls.fromDate.value).setHours(0, 0, 0, 0)
          ),
          'YYYY-MM-dd HH:mm:ss'
        ) ?? '';
      filters.toDate =
        this.datePipe.transform(
          new Date(
            new Date(this.form.controls.toDate.value).setHours(23, 59, 59, 0)
          ),
          'YYYY-MM-dd HH:mm:ss'
        ) ?? '';
      filters.godownId = this.checkForAllOption(this.form.controls.goDownId);
      filters.godown = this.form.controls.goDownId.value?.name;
      filters.bayId = this.checkForAllOption(this.form.controls.bayId);
      filters.itemGroupId = this.checkForAllOption(
        this.form.controls.itemGroupId
      );
      filters.itemId = this.checkForAllOption(this.form.controls.itemId);
      filters.batchId = this.checkForAllOption(this.form.controls.batchId);
      filters.userId = this.authService.getUserId();
      filters.checkBoxValue = this.form.controls.checkBox.value;
    }
    return filters;
  }

  private checkForAllOption(ctrl: any) {
    return Helper.isTruthy(ctrl.value) && ctrl.value?.id > 0
      ? +ctrl.value.id
      : null;
  }
}
