import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import {
  GridColumnType,
  IAmmrGridColumn,
} from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { AmrrModalComponent } from 'src/app/shared/amrr-modal/amrr-modal.component';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { AmrrBayEditorComponent } from './amrr-bay-editor/amrr-bay-editor.component';
import { AmrrBay } from './amrr-bay-editor/amrr-bay.model';

@Injectable()
export class AmrrBayFormService {
  columns: IAmmrGridColumn[];
  dataSource: MatTableDataSource<AmrrBay, MatPaginator>;
  loading = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init() {
    this.columns = this.getColumns();
    this.getData();
  }

  addNewBay() {
    this.dialog
      .open(AmrrBayEditorComponent)
      .afterClosed()
      .subscribe((result) => (result ? this.getData() : null));
  }

  onEdit(event: AmrrBay) {
    this.dialog
      .open(AmrrBayEditorComponent, {
        data: event,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) =>
        result
          ? setTimeout(() => {
              this.getData();
            }, 300)
          : null
      );
  }

  onDelete(event: AmrrBay) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete the bay - ${event.name} ?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.deleteBay(event.id);
        }
      });
  }

  private getData() {
    this.loading = true;
    this.apiBusinessService
      .get('bay')
      .pipe(take(1))
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data as AmrrBay[]);
        this.loading = false;
      });
  }

  private deleteBay(id: number) {
    this.apiBusinessService
      .delete('bay', id)
      .pipe(take(1))
      .subscribe((_) => this.getData());
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<AmrrBay>('sno'),
        name: 'S.No.',
        type: GridColumnType.Sno,
      },
      {
        key: Helper.nameof<AmrrBay>('name'),
        name: 'Bay Name',
      },
      {
        key: Helper.nameof<AmrrBay>('godowns'),
        name: 'Godowns',
      },
      {
        key: Helper.nameof<AmrrBay>('isActive'),
        name: 'Status',
        type: GridColumnType.Boolean,
      },
    ];
  }
}
