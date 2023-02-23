import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IAmmrGridColumn } from './ammr-grid-column.interface';

@Component({
  selector: 'app-ammr-grid',
  templateUrl: './ammr-grid.component.html',
  styleUrls: ['./ammr-grid.component.css'],
})
export class AmmrGridComponent implements AfterViewInit {
  @Input() columns: IAmmrGridColumn[];
  @Input() dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayColumns() {
    return this.columns.map((col) => col.key);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
