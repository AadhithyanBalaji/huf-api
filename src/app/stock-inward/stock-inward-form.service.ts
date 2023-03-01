import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { AmrrBay } from '../master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from '../master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItemGroup } from '../master/amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItem } from '../master/amrr-item/amrr-item-editor/amrr-item.model';
import { IAmrrTypeahead } from '../shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../shared/api-business.service';

@Injectable()
export class StockInwardFormService {
  godowns: AmrrGodown[] = [];
  bays: AmrrBay[] = [];
  itemGroups: AmrrItemGroup[] = [];
  items: AmrrItem[] = [];
  batches: IAmrrTypeahead[];
  form: FormGroup<{
    fromDate: FormControl<any>;
    toDate: FormControl<any>;
    goDownId: FormControl<any>;
    bayId: FormControl<any>;
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    batchId: FormControl<any>;
  }>;

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly router: Router
  ) {}

  init() {
    combineLatest([
      this.apiBusinessService.get('godown'),
      this.apiBusinessService.get('itemGroup'),
      this.apiBusinessService.get('item'),
    ])
      .pipe(take(1))
      .subscribe((data) => {
        console.log(data);
        this.godowns = data[0] as AmrrGodown[];
        this.itemGroups = data[1] as AmrrItemGroup[];
        this.items = data[2] as AmrrItem[];
        this.form = new FormGroup({
          fromDate: new FormControl('', [Validators.required]),
          toDate: new FormControl('', [Validators.required]),
          goDownId: new FormControl(null, [Validators.required]),
          bayId: new FormControl('', [Validators.required]),
          itemGroupId: new FormControl('', [Validators.required]),
          itemId: new FormControl('', [Validators.required]),
          batchId: new FormControl('', [Validators.required]),
        });
        this.setupFormListeners();
      });
  }

  getData() {
    if (this.form.dirty && this.form.valid) {
      console.log(this.form.value);
    }
  }

  navigateToAddInward() {
    this.router.navigate(['stockInward', 'edit', 'new']);
  }

  private setupFormListeners() {
    this.form.controls.goDownId.valueChanges.subscribe((godownId) => {
      this.apiBusinessService
        .get(`bay/godown/${godownId}`)
        .pipe(take(1))
        .subscribe((bays: any) => (this.bays = bays.recordset as AmrrBay[]));
    });
  }
}
