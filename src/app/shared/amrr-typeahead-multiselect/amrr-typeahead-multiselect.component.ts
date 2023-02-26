import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { IAmrrTypeahead } from '../amrr-typeahead/amrr-typeahead.interface';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import Helper from '../helper';

@Component({
  selector: 'app-amrr-typeahead-multiselect',
  templateUrl: './amrr-typeahead-multiselect.component.html',
  styleUrls: ['./amrr-typeahead-multiselect.component.css'],
})
export class AmrrTypeaheadMultiselectComponent implements AfterViewInit {
  @Input() title: string;
  @Input() ctrl: FormControl;
  @Input() options: IAmrrTypeahead[] = []; // = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  formControl = new FormControl();
  filteredOptions: Observable<IAmrrTypeahead[]>;
  chipsText: string[] = []; // = ['Lemon'];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('multiselectInput') multiselectInput: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    if (Helper.isTruthy(this.ctrl.value)) {
      const selectedValues = (this.ctrl.value as string).split(',');
      selectedValues.forEach((s) => this.addChip(s));
    }

    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(null),
      map((option: AmrrGodown | null) => {
        return option
          ? this._filter(option)
          : this.options
              .filter((option) => !this.chipsText.includes(option.name))
              .slice();
      })
    );
  }

  remove(option: string): void {
    const index = this.chipsText.indexOf(option);
    if (index >= 0) {
      this.chipsText.splice(index, 1);
      this.updateCtrl();
      this.formControl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addChip(event.option.viewValue);
  }

  displayFn(option: number): string {
    return this.options.find((o) => o.id === option)?.name || '';
  }

  private addChip(value: string) {
    this.chipsText.push(value);
    this.updateCtrl();
    this.multiselectInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  private _filter = (value: AmrrGodown): IAmrrTypeahead[] => {
    return this.options.filter(
      (option) =>
        option.name.toLowerCase().includes(value.name.toLowerCase()) &&
        !this.chipsText.includes(option.name)
    );
  };

  private updateCtrl() {
    const values = this.options
      .filter((c) => this.chipsText.includes(c.name))
      .map((c) => c.id)
      .join(',');
    this.ctrl.setValue(values);
  }
}
