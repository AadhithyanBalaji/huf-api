import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DefaultValueAccessor, FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import Helper from '../helper';
import { IAmrrTypeahead } from './amrr-typeahead.interface';

@Component({
  selector: 'app-amrr-typeahead',
  templateUrl: './amrr-typeahead.component.html',
  styleUrls: ['./amrr-typeahead.component.css'],
})
export class AmrrTypeaheadComponent
  implements OnInit, OnChanges
{
  @Input() title: string;
  @Input() options: IAmrrTypeahead[] = [];

  @Input() ctrl = new FormControl();
  filteredOptions: Observable<IAmrrTypeahead[]>;

  ngOnInit() {
    this.filteredOptions = this.ctrl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filter(value);
      })
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['options']) {
      this.ctrl.setValue(null);
    }
  }

  displayFn(option: number): string {
    return (
      (Helper.isTruthy(this.options) &&
        this.options.find((o) => o.id === option)?.name) ||
      ''
    );
  }

  private _filter(value: string): IAmrrTypeahead[] {
    return this.options &&
      this.options.length > 0 &&
      Helper.isTruthy(value) &&
      value.length > 0
      ? this.options.filter((option: IAmrrTypeahead) => {
          return (
            Helper.isTruthy(option) &&
            option?.name.toLowerCase().includes(value.toLowerCase())
          );
        })
      : this.options;
  }
}
