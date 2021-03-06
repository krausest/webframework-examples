type IValidator = (value:string) => string|undefined;

type ICurriedValidator = (message:string) => IValidator;

type IParamterizedCurriedValidator = (param:any) => ICurriedValidator;

export const alwaysTrue: IValidator = (value:string) => undefined;
export const required: ICurriedValidator = (message:string) => (value:string) => (value ? undefined : message);
export const minLength: IParamterizedCurriedValidator = (minValue:number) => (message:string) => (value:string) => (value.length<minValue ? message : undefined);
export const maxLength: IParamterizedCurriedValidator = (maxValue:number) => (message:string) => (value:string) => (value.length>maxValue ? message : undefined);
export const pattern: IParamterizedCurriedValidator = (patternValue:string) => (message:string) => (value:string) => RegExp(patternValue).test(value) ? undefined : message;
export const email: ICurriedValidator = (message:string) => pattern('.+@.+\\..+')(message);

export const numeric: ICurriedValidator = (message:string) => (value:string) => (Number.isNaN(Number(value)) ? message : undefined);
export const min: IParamterizedCurriedValidator = (minValue: number) => (message:string) => (value:string) => Number(value)<minValue ? message : undefined;
export const max: IParamterizedCurriedValidator = (maxValue: number) => (message:string) => (value:string) => (Number(value)>maxValue ? message : undefined);


export const composeValidators = (...validators: IValidator[]) : IValidator => (value:string) =>
  validators.reduce((error: string, validator: IValidator) => error || validator(value), undefined);

/* Simple helpers to simplify form handling. It uses a mutable form state, which might be considered bad practice by some,
 * since it prevents the usage of PureComponent and thus might make rendering less efficient.
 */

abstract class AbstractFormValue<T> {
    constructor(public value: T,  public error: string|undefined, public touched: boolean) {}
    get invalid() { return this.touched && this.error !== undefined;}
}

export class FormValueString extends AbstractFormValue<string> {
    constructor(value: string = '',  error?: string, touched: boolean = false) {
        super(value, error, touched);
    }
}

export class FormValueBoolean extends AbstractFormValue<boolean> {
    constructor(value: boolean = false,  error?: string,  touched: boolean = false) {
        super(value, error, touched);
    }
}

function handleValue<P,S, K extends keyof S, T>(that: React.Component<P,S>, formKey: K, validate: (a: S[K]) => void,
        formValue: AbstractFormValue<T>, value: T, doUpdateTouch: boolean, doValidate: boolean) {
    formValue.value = value;
    if (doUpdateTouch) { formValue.touched = true; }
    if (doValidate) { validate(that.state[formKey]); }
    that.setState(that.state);
}
export type THandleForm = (formValue: AbstractFormValue<any>, doUpdateTouch: boolean, doValidate: boolean) => (evt: React.ChangeEvent<any>) => void;

export function handleFormInput<P,S, K extends keyof S>(that: React.Component<P,S>, formKey: K, validate: (a: S[K]) => void): THandleForm {
    return  (formValue: FormValueString, doUpdateTouch: boolean, doValidate: boolean) => (evt: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
        handleValue(that, formKey, validate, formValue, evt.target.value, doUpdateTouch, doValidate);
    }
}

export function handleFormCheckbox<P,S, K extends keyof S>(that: React.Component<P,S>, formKey: K, validate: (a: S[K]) => void): THandleForm {
    return (formValue: FormValueBoolean, doUpdateTouch: boolean, doValidate: boolean) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        handleValue(that, formKey, validate, formValue, evt.target.checked, doUpdateTouch, doValidate);
    }
}

export const propsInputValidateOnBlur = (handle: ReturnType<typeof handleFormInput>) => (value: FormValueString) =>
    ({value: value.value, onChange: handle(value, false, false), onBlur: handle(value, true, true)
})

export const propsInputValidateOnChange = (handle: ReturnType<typeof handleFormInput>) => (value: FormValueString) =>
    ({value: value.value, onChange: handle(value, true, true)
})

export const validateFormValue = (formValue: FormValueString, validator: IValidator) => { formValue.error = validator(formValue.value);}