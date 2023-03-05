import { Component, OnInit } from '@angular/core';
import { StockAdjustmentEditorFormService } from './stock-adjustment-editor-form.service';

@Component({
  selector: 'app-stock-adjustment-editor',
  templateUrl: './stock-adjustment-editor.component.html',
  styleUrls: ['./stock-adjustment-editor.component.css'],
  providers: [StockAdjustmentEditorFormService]
})
export class StockAdjustmentEditorComponent implements OnInit{
  constructor(readonly formService: StockAdjustmentEditorFormService) {}
  
  ngOnInit(): void {
    this.formService.init();
  }

}
