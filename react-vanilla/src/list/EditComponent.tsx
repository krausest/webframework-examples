import * as React from 'react';
import {FormValueString, FormValueBoolean, handleFormInput, handleFormCheckbox, numeric, min, max, alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators, propsInputValidateOnBlur, validateFormValue} from '../validators';
import {RouteComponentProps} from "react-router";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {IComboBoxValue, IState} from '../types';
import {listItemSave, flashMessageSet} from '../actions';

class PageData {
    public  label = new FormValueString();
    public  value = new FormValueString();
    public  minValue = new FormValueString();
    public  maxValue = new FormValueString();
    public  step = new FormValueString();
    public  message = '';
    public  invalid = false;

    constructor(item: IComboBoxValue) {
        if (item) {
            this.label = new FormValueString(item.label);
            this.value = new FormValueString(item.value);
            this.minValue = new FormValueString(item.minValue.toFixed());
            this.maxValue = new FormValueString(item.maxValue.toFixed());
            this.step = new FormValueString(item.step.toFixed());
        }
    }
}

let biggerThan = (otherValue:string) => (message:string) => (value:string) => Number(value)<=Number(otherValue) ? message : undefined;

function validate(values: PageData) {
    validateFormValue(values.label, composeValidators(required('Must not be empty'),
            minLength(1)('Must be at least 1 character'),
            maxLength(5)('Must be at most 5 characters')));
    validateFormValue(values.minValue, composeValidators(required('Must not be empty'),
            numeric('Must not be a number'),
            min(10)('Must be at least 10'),
            max(1000)('Must be at most 1000')));
    validateFormValue(values.maxValue, composeValidators(required('Must not be empty'),
            numeric('Must be a number'),
            biggerThan(values.minValue.value)('must be bigger than minimun'),
            min(10)('Must be at least 10'),
            max(1000)('Must be at most 1000')));
    validateFormValue(values.step, composeValidators(required('Must not be empty'),
            numeric('Must be a number'),
            min(5)('Must be at least 5'),
            max(100)('Must be at most 100')));
    values.invalid = !!(values.label.error
                    || values.value.error
                    || values.minValue.error
                    || values.maxValue.error
                    || values.step.error);
    // do something arbitrary
    values.message = `Last validated at ${Date.now()}`;
}


interface ICompProps extends RouteComponentProps {
    item: IComboBoxValue;
    save: (item: PageData) => any;
    setFlashMessage: (msg: string) => any;
}

interface ICompState {
    item: PageData;
}

class ListEdit extends React.Component<ICompProps, ICompState> {
    public state: ICompState;
    private handleInput = handleFormInput(this, 'item', validate);
    private propsInput = propsInputValidateOnBlur(this.handleInput);
    private handleCheckbox = handleFormCheckbox(this, 'item', validate);

    constructor(props: ICompProps) {
      super(props);
      this.state = { item: new PageData(props.item)};
      validate(this.state.item);
    }

    public cancel = (evt: React.SyntheticEvent) => {
        evt.preventDefault();
        (this as any).props.history.push(`/list/${(this as any).props.item.value}/view`);
        console.log("cancel");
    }
    public save = (evt: React.SyntheticEvent) => {
        evt.preventDefault();
        console.log("submitting", this.state.item);
        this.props.save(this.state.item);
        this.props.history.push(`/list/${(this as any).props.item.value}/view`);
        this.props.setFlashMessage('Item saved');
    }

    public render() {
        let values = this.state.item;
        return (
            <div>
                <h5 className="card-title">
                    <Link to={`/list/${values.value.value}/view`}><i className="text-dark fa fa-arrow-circle-left"/></Link> View item
                </h5>
            <form onSubmit={this.save}>
                <div className="form-group">
                    <label htmlFor="name">Value:</label>
                    <input type="text" className="form-control" disabled={true}
                        name="value" {...this.propsInput(values.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Label:</label>
                    <input type="text" placeholder="Enter label"
                        name="label" {...this.propsInput(values.label)}
                        className = {values.label.invalid ? 'form-control is-invalid' : 'form-control'}
                    />
                    {values.label.invalid && <div className="invalid-feedback">{values.label.error}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="name">Minimum Value:</label>
                    <input type="text" placeholder="Enter minimum value"
                        name="minValue" {...this.propsInput(values.minValue)}
                        className = {values.minValue.invalid ? 'form-control is-invalid' : 'form-control'}
                    />
                    {values.minValue.invalid && <div className="invalid-feedback">{values.minValue.error}</div>}
                </div>
                 {/* Check for error and not invalid here, because it can be influenced by minValue */}
                <div className="form-group">
                    <label htmlFor="name">Maximum Value:</label>
                    <input type="text" placeholder="Enter maximum value"
                        name="maxValue" {...this.propsInput(values.maxValue)}
                        className = {values.maxValue.error ? 'form-control is-invalid' : 'form-control'}
                    />
                    {values.maxValue.error && <div className="invalid-feedback">{values.maxValue.error}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="name">Step:</label>
                    <input type="text" placeholder="Enter step value"
                        name="step" {...this.propsInput(values.step)}
                        className = {values.step.invalid ? 'form-control is-invalid' : 'form-control'}
                    />
                    {values.step.invalid && <div className="invalid-feedback">{values.step.error}</div>}
                </div>
                <div>{values.message}</div>
                <div className="mt-2">
                    <button type="submit" className="btn btn-primary" disabled={values.invalid}>Save</button>
                    <button type="button" className="ml-3 btn btn-secondary" onClick={this.cancel}>Cancel</button>
                </div>

            </form>
        </div>);
    }
}

const mapStateToProps = (state: IState, props: any) : any => {
    console.log("Detail Component mapStateToProps", state, props);
    let filtered = state.comboBoxValues.filter((c:any) => c.value === props.match.params.value);
    if (filtered.length!==1) { props.history.replace('/list') };
    return {
        item: filtered[0]
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
      save: (item:PageData) => {
        dispatch(listItemSave(({
            label: item.label.value,
            value: item.value.value,
            minValue: Number(item.minValue.value),
            maxValue: Number(item.maxValue.value),
            step: Number(item.step.value)
        } as IComboBoxValue)))
      },
      setFlashMessage: (message: string) => dispatch(flashMessageSet(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListEdit);
