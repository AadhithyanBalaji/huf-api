import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GridColumnType, IAmmrGridColumn } from './ammr-grid-column.interface';

@Component({
  selector: 'app-ammr-grid',
  templateUrl: './ammr-grid.component.html',
  styleUrls: ['./ammr-grid.component.css'],
})
export class AmmrGridComponent implements OnChanges {
  @Input() columns: IAmmrGridColumn[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() loading: boolean;
  @Input() enableActionColumn = true;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  GridColumnType = GridColumnType;

  ngOnChanges() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (
        this.enableActionColumn &&
        this.columns.findIndex((col) => col.key === 'options') === -1
      ) {
        this.columns.push({
          key: 'options',
          name: 'Options',
        });
      }
    }
  }

  getDisplayColumns() {
    return this.columns.map((col) => col.key);
  }

  onEditClicked(event: any) {
    this.onEdit.emit(event);
  }

  onDeleteClicked(event: any) {
    this.onDelete.emit(event);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
