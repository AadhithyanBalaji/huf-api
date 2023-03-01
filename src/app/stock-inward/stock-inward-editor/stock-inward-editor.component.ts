import { Component, OnInit } from '@angular/core';
import { StockInwardEditorFormService } from './stock-inward-editor-form.service';

@Component({
  selector: 'app-stock-inward-editor',
  templateUrl: './stock-inward-editor.component.html',
  styleUrls: ['./stock-inward-editor.component.css'],
  providers: [StockInwardEditorFormService]
})
export class StockInwardEditorComponent implements OnInit{

  constructor(readonly formService: StockInwardEditorFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}