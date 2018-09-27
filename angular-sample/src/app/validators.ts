import { AbstractControl, NG_VALIDATORS, FormBuilder, FormArray, FormGroup, Validator, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Input, Directive } from '@angular/core';
import { min } from '../../node_modules/rxjs/operators';

export function isNumeric(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return Number.isNaN(Number(control.value)) ? {'isNumeric': {value: control.value}} : null;
    };
  }

  @Directive({
    selector: '[isNumeric]',
    providers: [{provide: NG_VALIDATORS, useExisting: IsNumericValidatorDirective, multi: true}]
  })
  export class IsNumericValidatorDirective implements Validator {
    validate(control: AbstractControl): {[key: string]: any} | null {
      return isNumeric()(control);
    }
  }

  function minLessThanFn(a, b) {
    return Number(a) > Number(b) ? ({ 'minLessThanMax': true }) : null;
  }

  export const minLessThanMax: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const minValue = control.get('minValue');
    const maxValue = control.get('maxValue');
    console.log('valid ', minValue.valid, maxValue.valid);
    const r = minLessThanFn(minValue.value, maxValue.value);
    console.log("return value ", r);
    return r;
};

@Directive({
    selector: '[minLessThanMax]',
    providers: [{provide: NG_VALIDATORS, useExisting: MinLessThanMaxValidatorDirective, multi: true}]
  })
  export class MinLessThanMaxValidatorDirective implements Validator {

    validate(control: FormGroup): {[key: string]: any} | null {

        let min = control.controls['minValue'];
        let max = control.controls['maxValue'];
        if (!min || !max) return null;
        return minLessThanFn(min.value, max.value);
      // return minLessThanMax(control) ? {'minLessThanMax': {value: true}} : null;
    }
  }


export function myMaxLength(length: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return control.value && control.value.length >length ? {'myMaxLength': {value: control.value}} : null;
    };
  }

  @Directive({
    selector: '[myMaxLength]',
    providers: [{provide: NG_VALIDATORS, useExisting: MyMaxLengthValidatorDirective, multi: true}]
  })
  export class MyMaxLengthValidatorDirective implements Validator {
    @Input('myMaxLength') myMaxLength: number;

    validate(control: AbstractControl): {[key: string]: any} | null {
      return this.myMaxLength ? myMaxLength(this.myMaxLength)(control): null;
    }
  }

export function myMin(minValue: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return control.value && Number(control.value) <minValue ? {'myMin': {value: control.value}} : null;
    };
  }

  @Directive({
    selector: '[myMin]',
    providers: [{provide: NG_VALIDATORS, useExisting: MyMinValidatorDirective, multi: true}]
  })
  export class MyMinValidatorDirective implements Validator {
    @Input('myMin') myMin: number;

    validate(control: AbstractControl): {[key: string]: any} | null {
      return this.myMin ? myMin(this.myMin)(control): null;
    }
  }

export function myMax(maxValue: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return control.value && Number(control.value) >maxValue ? {'myMax': {value: control.value}} : null;
    };
  }

  @Directive({
    selector: '[myMax]',
    providers: [{provide: NG_VALIDATORS, useExisting: MyMaxValidatorDirective, multi: true}]
  })
  export class MyMaxValidatorDirective implements Validator {
    @Input('myMax') myMax: number;

    validate(control: AbstractControl): {[key: string]: any} | null {
      return this.myMax ? myMax(this.myMax)(control): null;
    }
  }

@Directive({
    selector: '[checkPassword]',
    providers: [{provide: NG_VALIDATORS, useExisting: CheckPasswordValidatorDirective, multi: true}]
  })
  export class CheckPasswordValidatorDirective implements Validator {

    validate(control: FormGroup): {[key: string]: any} | null {
        let password = control.controls['password'];
        let repeatPassword = control.controls['repeat_password'];
        if (password && repeatPassword) {
            console.log("check password ", password.value, repeatPassword.value);
            return password.value !== repeatPassword.value ? ({ 'checkPassword': true }) : null;
        } else {
            console.log("ERROR:  CheckPasswordValidatorDirective: At least one component not found ");
            return null;
        }
    }
  }