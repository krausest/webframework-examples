import * as React from 'react';
import {numeric, min, max, alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators} from '../validators';
import {IComboBoxValue} from '../types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const ListComponent = ({comboBoxValues} : {comboBoxValues: IComboBoxValue[]}) => {
    console.log('comboBoxValues', comboBoxValues);
    return <div>
        <h5 className="card-title">Search list of combobox entries</h5>
            <div className="list-group">
            {comboBoxValues.map((item, index) =>
            (<Link to={`/list/${item.value}/view`} className="list-group-item list-group-item-action flex-column align-items-start" key={item.value}>
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{ item.label }</h5>
                    <small>{ index+1 }</small>
                </div>
                <small className="text-muted">Label: {item.label}, value: {item.value}, minValue: {item.minValue}, maxValue: {item.maxValue}, step: {item.step}</small>
            </Link>))}
        </div>
    </div>
};

const mapStateToProps = (state: any) => {
    return {
        comboBoxValues: state.comboBoxValues,
    }
}

export default connect(mapStateToProps)(ListComponent);
