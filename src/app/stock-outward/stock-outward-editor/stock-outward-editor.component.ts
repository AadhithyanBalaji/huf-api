import { Component, OnInit } from '@angular/core';
import { StockOutwardEditorFormService } from './stock-outward-editor-form.service';

@Component({
  selector: 'app-stock-outward-editor',
  templateUrl: './stock-outward-editor.component.html',
  styleUrls: ['./stock-outward-editor.component.css'],
  providers: [StockOutwardEditorFormService],
})
export class StockOutwardEditorComponent implements OnInit {
  constructor(readonly formService: StockOutwardEditorFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
