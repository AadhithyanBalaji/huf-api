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
import { AmrrGodownEditorComponent } from './amrr-godown-editor/amrr-godown-editor.component';
import { AmrrGodown } from './amrr-godown-editor/amrr-godown.model';


@Injectable()
export class AmrrGodownFormService {
  columns: IAmmrGridColumn[];
  dataSource: MatTableDataSource<AmrrGodown, MatPaginator>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init() {
    this.columns = this.getColumns();
    this.getData();
  }

  addNewGodown() {
    this.dialog
      .open(AmrrGodownEditorComponent)
      .afterClosed()
      .subscribe((result) => (result ? this.getData() : null));
  }

  onEdit(event: AmrrGodown) {
    this.dialog
      .open(AmrrGodownEditorComponent, {
        data: event,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) =>
        result
          ? setTimeout(() => {
              this.getData();
            }, 1000)
          : null
      );
  }

  onDelete(event: AmrrGodown) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete the godown - ${event.name} ?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.deleteGodown(event.id);
        }
      });
  }

  private getData() {
    this.apiBusinessService
      .get('godown')
      .pipe(take(1))
      .subscribe(
        (data) => (this.dataSource = new MatTableDataSource(data as AmrrGodown[]))
      );
  }

  private deleteGodown(id: number) {
    this.apiBusinessService
      .delete('godown', id)
      .pipe(take(1))
      .subscribe((_) => this.getData());
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: 'sno',
        name: 'S.No.',
      },
      {
        key: 'name',
        name: 'Godown Name',
      },
      {
        key: 'capacity',
        name: 'Capacity',
      },
      {
        key: 'gstInName',
        name: 'GSTIN Name',
      },
      {
        key: 'gstInAddress',
        name: 'GSTIN Address',
      },
      {
        key: 'isActive',
        name: 'Status',
        type: GridColumnType.Boolean,
      },
    ];
  }
}
