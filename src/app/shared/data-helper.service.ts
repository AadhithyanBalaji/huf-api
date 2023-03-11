import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Subject, take } from 'rxjs';
import { AmrrBay } from '../master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from '../master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItem } from '../master/amrr-item/amrr-item-editor/amrr-item.model';
import { ApiBusinessService } from './api-business.service';
import Helper from './helper';
import { AmrrBatch } from './models/amrr-batch.model';

@Injectable({
  providedIn: 'root',
})
export class DataHelperService {
  bays$ = new Subject<AmrrBay[]>();
  batches$ = new Subject<AmrrBatch[]>();
  godownsItems$ = new Subject<{ godowns: AmrrGodown[]; items: AmrrItem[] }>();
  
  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar
  ) {}

  getGodownAndItems() {
    combineLatest([
      this.apiBusinessService.get('godown'),
      this.apiBusinessService.get('item'),
    ])
      .pipe(take(1))
      .subscribe((result) =>
        this.godownsItems$.next({
          godowns: result[0] as AmrrGodown[],
          items: result[1] as AmrrItem[],
        })
      );
  }

  updateBatches(batchTypeId: number, itemId: number) {
    if (!Helper.isTruthy(batchTypeId) || !Helper.isTruthy(itemId)) return;
    if (batchTypeId === 2 && Helper.isTruthy(itemId)) {
      this.apiBusinessService
        .get(`batch/item/${itemId}`)
        .pipe(take(1))
        .subscribe((data: any) => {
          const batches = [...(data.recordsets[0] as AmrrBatch[])];
          batches.length === 0 ? this.snackBar.open('No batches found!') : null;
          this.batches$.next(batches);
        });
    } else {
      this.batches$.next([]);
    }
  }

  updateBays(godownId: number) {
    if (!Helper.isTruthy(godownId) || isNaN(godownId)) return;
    this.apiBusinessService
      .get(`bay/godown/${godownId}`)
      .pipe(take(1))
      .subscribe((result: any) => {
        const bays = [...(result.recordsets[0] as AmrrBay[])];
        bays.length === 0
          ? this.snackBar.open('No bays found for this godown!')
          : null;
        this.bays$.next(bays);
      });
  }
}
