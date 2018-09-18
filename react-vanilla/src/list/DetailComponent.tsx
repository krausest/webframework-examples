import * as React from 'react';
import FlashMessage from '../FlashMessage';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IComboBoxValue, IState } from '../types';
import {RouteComponentProps} from "react-router";

let edit = (evt: React.SyntheticEvent) => {
    console.log("edit");
};
let back = (evt: React.SyntheticEvent) => {
    console.log("back");
};

interface IProps {
    comboBoxValue:IComboBoxValue;
    message: string
};

const DetailComponent = (props: IProps) => {
    let {comboBoxValue, message} = props;
    let {label, value, minValue, maxValue, step} = comboBoxValue;
    return (<div>
        <h5 className="card-title"><Link to='/list'><i className="text-dark fa fa-arrow-circle-left"/></Link> View item
            <div className="ml-auto" style={{float: 'right'}}><Link to={`/list/${value}/edit`}><i className="text-dark fa fa-edit"/></Link></div>
        </h5>

        <FlashMessage/>

        <form>
            <div className="form-group">
                <label htmlFor="name">Label:</label>{label}
            </div>
            <div className="form-group">
                <label htmlFor="name">Value:</label>
                {value}
            </div>
            <div className="form-group">
                <label htmlFor="name">Minimum Value:</label>
                {minValue}
            </div>
            <div className="form-group">
                <label htmlFor="name">Maximum Value:</label>
                {maxValue}
            </div>
            <div className="form-group">
                <label htmlFor="name">Step:</label>
                {step}
            </div>
        </form>
    </div>)
};


const mapStateToProps = (state: IState, props: RouteComponentProps<{value:string}>) : IProps => {
    console.log("Detail Component mapStateToProps", state, props);
    let filtered = state.comboBoxValues.filter(c => c.value === props.match.params.value);
    if (filtered.length !== 1) { props.history.replace('/list') };
    return {
        comboBoxValue: filtered[0],
        message: state.flashMessage,
    }
}

const ConnectedDetailComponent = connect(mapStateToProps)(DetailComponent);
export default ConnectedDetailComponent;