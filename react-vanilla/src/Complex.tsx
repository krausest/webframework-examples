import * as React from 'react';
import {FormValueString, FormValueBoolean, handleFormInput, handleFormCheckbox, required, numeric, min, max, composeValidators, propsInputValidateOnBlur, validateFormValue, shouldComponentUpdateFormValue} from './validators';
import {IComboBoxValue, IState, ISelectionData, IColumnSelection} from './types';
import { connect } from 'react-redux';
import {RouteComponentProps} from "react-router";

export function allowedSelections(comboBoxValues: IComboBoxValue[], columnSelections: ColumnData, selected: string|undefined) {
    let forbidden = columnSelections.selections.map(s => s.selected.value).filter(v => v !== selected);
    return comboBoxValues.filter(cbv => !forbidden.find(v => v===cbv.value));
}

class SelectionData {
    public selected:  FormValueString;
    public amount:  FormValueString;
    public price:  string;

    constructor(selectionData: IColumnSelection) {
        this.selected = new FormValueString(selectionData.selected);
        this.amount = new FormValueString(selectionData.amount ? selectionData.amount.toFixed() : '');
        this.price = selectionData.price ? selectionData.price.toFixed() : '';
    }
}

class ColumnData {
    public selections: Array<SelectionData>;
    constructor(selectionData: ISelectionData = undefined) {
        this.selections = selectionData ? selectionData.selections.map(sd => new SelectionData(sd)) : [];
    }
}

class PageData {
    public columns: Array<ColumnData>;
    constructor(columns: ISelectionData[] = undefined) {
        this.columns = columns ? columns.map(c => new ColumnData(c)) : [];
    }
}

type THandler = ReturnType<typeof handleFormInput>;

interface ICompProps extends RouteComponentProps {
    complex: ISelectionData[];
    comboBoxValues: IComboBoxValue[];
}

interface ICompState {
    form: PageData;
}

const amountValidator = composeValidators(required('Please enter amount'), numeric('must be a number'), min(5)('Must be at least 5'), max(100)('Must be less than 100'));


function validate(values: PageData) {
    values.columns.forEach(column => {
        column.selections.forEach(sel => {
            validateFormValue(sel.amount, amountValidator);
        });
    });
}

interface ISelectionProps {
    selection: SelectionData, column: ColumnData;
    handler: THandler, comboxValues: IComboBoxValue[];
    remove: (sd: SelectionData) => void;
    updatePrice: (sd: SelectionData) => void;
}

class Selection extends React.Component<ISelectionProps> {
    render() {
        return (<div className="card-body">
                    <div className="row">
                        <div className="col-3">
                            <select className="form-control" value={this.props.selection.selected.value} onChange={(evt) => {this.props.handler(this.props.selection.selected, true, true)(evt); this.props.updatePrice(this.props.selection);}}>
                            {
                                allowedSelections(this.props.comboxValues, this.props.column, this.props.selection.selected.value).map(opt =>
                                (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))
                            }
                            </select>
                        </div>
                        <div className="col-4">
                            <input type="text"  autoComplete="off" className={this.props.selection.amount.invalid ? 'is-invalid form-control' : 'form-control'}
                                value={this.props.selection.amount.value} onChange={this.props.handler(this.props.selection.amount, false)} onBlur={(evt) => {this.props.handler(this.props.selection.amount, true, true)(evt); this.props.updatePrice(this.props.selection);}}
                                placeholder="Enter amount"/>
                            {this.props.selection.amount.invalid
                                && <div className="invalid-feedback">{this.props.selection.amount.error}</div>}
                        </div>
                        <div className="col-3">
                            {this.props.selection.price} €
                        </div>
                        <div className="col-1">
                            <a href="#" onClick={(evt) => {evt.preventDefault(); this.props.remove(this.props.selection)}}><i className="text-dark fa fa-trash-o"/></a>
                        </div>
                    </div>
                </div>);
    }
}

class Column extends React.Component<{column: ColumnData, handler: THandler, comboxValues: IComboBoxValue[],
    remove: (columnData: ColumnData, selectionData: SelectionData) => void,
    updatePrice: (columnData: ColumnData, selectionData: SelectionData) => void,
        add: (columnData: ColumnData) => void}> {
    remove = (selectionData: SelectionData) => {
        this.props.remove(this.props.column, selectionData);
    }
    updatePrice = (selectionData: SelectionData) => {
        this.props.updatePrice(this.props.column, selectionData);
    }
    render() {
        return (<div className="col-4">
            <div className="card">
                {
                    this.props.column.selections.map((sel, idx) => (<Selection key={idx} selection={sel} column={this.props.column}
                        handler={this.props.handler} comboxValues={this.props.comboxValues} remove={this.remove} updatePrice={this.updatePrice}/>))
                }
            </div>
            { this.props.column.selections.length < this.props.comboxValues.length ?
            (<div className="col-1 pb-3 pt-3">
                <a href="#" onClick={(evt) => {evt.preventDefault();
                    this.props.add(this.props.column);
                }}><i className="text-dark fa fa-plus"/></a>
            </div>) : null
            }

        </div>);
    }
}

class Complex extends React.Component<ICompProps, ICompState> {
    public state: ICompState;

    constructor(props: ICompProps) {
      super(props);
      this.state = {form: new PageData(props.complex)};
    }

    handleInput = handleFormInput(this, 'form', validate);
    propsInput = propsInputValidateOnBlur(this.handleInput);

    public save = (evt: React.SyntheticEvent) => {
        evt.preventDefault();
    }

    public updatePrice = (columnData: ColumnData, selectionData: SelectionData) => {
        console.log("updatePrice", selectionData.amount.error);
        if (selectionData.amount.error || selectionData.selected.error) return;
        let inp = selectionData.amount.value;
        let sel = selectionData.selected.value === 'A' ? 2 : 1;
        window.setTimeout(() => {
            selectionData.price = (Number(inp) * 5 * sel).toFixed();
            this.setState({form: this.state.form});
        }, 3000);
    }

    public remove = (columnData: ColumnData, selectionData: SelectionData) => {
        let idx = columnData.selections.indexOf(selectionData);
        if (idx>=0) columnData.selections.splice(idx, 1);
        console.log('remove', columnData, this.state.form);
        this.setState({form: this.state.form});
    }

    public add = (columnData: ColumnData) => {
        let selected = allowedSelections(this.props.comboBoxValues, columnData, undefined)[0].value;
        columnData.selections.push(new SelectionData({selected: selected, price: null, amount: 15}));
        this.setState({form: this.state.form});
    }

    public render() {
        let gComboBoxValues = this.props.comboBoxValues;
        let columns = this.state.form.columns;
        return (<div>
                    <form className="row justify-content-center m-4" onSubmit={this.save}>
                        {columns.map((column, idx) => (<Column key={idx} column={column} add={this.add} remove={this.remove} updatePrice={this.updatePrice} handler={this.handleInput} comboxValues={gComboBoxValues}/>))}
                    </form>
            </div>);
    }
}

const mapStateToProps = (state: IState, props: any) => {
    console.log("Detail Component mapStateToProps", state, props);
    return {
        comboBoxValues: state.comboBoxValues,
        complex: state.complex,
    }
}

export default connect(mapStateToProps)(Complex);
