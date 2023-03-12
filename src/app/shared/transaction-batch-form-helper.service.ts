import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import Helper from './helper';

@Injectable({
  providedIn: 'root',
})
export class TransactionBatchFormHelperService {
  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      form.controls[key].setErrors(null);
    });
  }

  validateNumberControlValue(control: any, value: any, allowZeroValue = false) {
    const isValid =
      Helper.isTruthy(value) && !isNaN(value) && (allowZeroValue || +value > 0);
    control.setErrors(isValid ? null : { InvalidValue: true });
    return isValid;
  }

  setMaxValueForControl(control: any, max: number, min?: number) {
    control.setValue(null);
    control.setValidators([
      Validators.required,
      Validators.min(min ?? 0.0001),
      Validators.max(max),
    ]);
  }
}
