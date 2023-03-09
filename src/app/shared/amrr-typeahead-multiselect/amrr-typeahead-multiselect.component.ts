import {
  AfterViewInit,
  ChangeDetectorRef,
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
  @Input() options: IAmrrTypeahead[] = [];

  formControl = new FormControl();
  filteredOptions: Observable<IAmrrTypeahead[]>;
  chipsText: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('multiselectInput') multiselectInput: ElementRef<HTMLInputElement>;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

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

    this.changeDetectorRef.detectChanges();
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
    const options =
      this.options && this.options.length > 0 && Helper.isTruthy(value)
        ? this.options.filter(
            (option) =>
              option.name
                .toLowerCase()
                .includes(
                  typeof value === 'string'
                    ? (value as string).toLowerCase()
                    : value.name.toLowerCase()
                ) && !this.chipsText.includes(option.name)
          )
        : this.options;
    return options;
  };

  private updateCtrl() {
    const values = this.options
      .filter((c) => this.chipsText.includes(c.name))
      .map((c) => c.id)
      .join(',');
    this.ctrl.setValue(values);
  }
}
