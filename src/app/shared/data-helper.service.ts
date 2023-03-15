import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Subject, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
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
  items$ = new Subject<AmrrItem[]>();
  batches$ = new Subject<AmrrBatch[]>();
  godownsItems$ = new Subject<{ godowns: AmrrGodown[]; items: AmrrItem[] }>();

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService
  ) {}

  getGodownAndItems(restrictByStock = false) {
    combineLatest([
      this.apiBusinessService.get(
        `godown/userId/${this.authService.getUserId()}/restrictByStock/${restrictByStock}`
      ),
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

  updateBatches(
    batchTypeId: number,
    godownId: number,
    itemId: number,
    bayId: number
  ) {
    if (
      !Helper.isTruthy(batchTypeId) ||
      !Helper.isTruthy(godownId) ||
      !Helper.isTruthy(itemId) ||
      !Helper.isTruthy(bayId)
    )
      return;
    if (batchTypeId === 2) {
      this.apiBusinessService
        .get(`batch/godown/${godownId}/bay/${bayId}/item/${itemId}`)
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

  updateBays(godownId: number, restrictByStock = false) {
    if (!Helper.isTruthy(godownId) || isNaN(godownId)) return;
    this.apiBusinessService
      .get(`bay/godown/${godownId}/restrictByStock/${restrictByStock}`)
      .pipe(take(1))
      .subscribe((result: any) => {
        const bays = [...(result.recordsets[0] as AmrrBay[])];
        bays.length === 0
          ? this.snackBar.open('No bays found for this godown!')
          : null;
        this.bays$.next(bays);
      });
  }

  updateItems(godownId: number, bayId: number) {
    if (
      !Helper.isTruthy(godownId) ||
      isNaN(godownId) ||
      !Helper.isTruthy(bayId) ||
      isNaN(bayId)
    )
      return;
    this.apiBusinessService
      .get(`item/godown/${godownId}/bay/${bayId}`)
      .pipe(take(1))
      .subscribe((result: any) => {
        const items = [...(result as AmrrItem[])];
        items.length === 0
          ? this.snackBar.open('No items found for this godown/bay!')
          : null;
        this.items$.next(items);
      });
  }
}
