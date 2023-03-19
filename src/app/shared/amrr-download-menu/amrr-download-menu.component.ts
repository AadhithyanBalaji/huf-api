import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-amrr-download-menu',
  templateUrl: './amrr-download-menu.component.html',
  styleUrls: ['./amrr-download-menu.component.css'],
})
export class AmrrDownloadMenuComponent {
  @Input() loading = false;
  @Output() onPdfClicked = new EventEmitter<any>();
  @Output() onExcelClicked = new EventEmitter<any>();

  exportAsPdf() {
    this.onPdfClicked.emit();
  }

  exportAsExcel() {
    this.onExcelClicked.emit();
  }
}
