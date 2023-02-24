import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import Helper from '../helper';
import { IAmrrTypeahead } from './amrr-typeahead.interface';

@Component({
  selector: 'app-amrr-typeahead',
  templateUrl: './amrr-typeahead.component.html',
  styleUrls: ['./amrr-typeahead.component.css'],
})
export class AmrrTypeaheadComponent implements OnChanges {
  @Input() title: string;
  @Input() formControl: FormControl;
  @Input() options: IAmrrTypeahead[];

  filteredOptions: Observable<IAmrrTypeahead[]>;

  ngOnChanges(changes: SimpleChanges) {
    const formControl = changes['formControl']?.currentValue;
    const options = changes['options']?.currentValue;

    if (
      Helper.isTruthy(this.formControl) &&
      formControl &&
      options &&
      options.length >= 0
    ) {
      this.filteredOptions = this.formControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '', this.options))
      );
    }
  }

  displayFn(option: number): string {
    return this.options.find((o) => o.id === option)?.name || '';
  }

  private _filter(value: string, options: IAmrrTypeahead[]): IAmrrTypeahead[] {
    return options && options.length > 0
      ? options.filter((option: IAmrrTypeahead) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        )
      : options;
  }
}
