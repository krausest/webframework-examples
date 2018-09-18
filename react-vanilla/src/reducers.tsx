import {IComboBoxValue, IProfileData, ISelectionData, IState} from './types';
import { combineReducers } from 'redux';
import * as actions from './actions';

interface IAction {
    type: string;
}

const initialProfileState : IProfileData = {
    name: '',
    email: '',
    allowPhone: true,
    phone: '',
    password: ''
}

const initialComoboBoxValuesState : IComboBoxValue[] = [
    { label: 'A', value: 'A', minValue: 10, maxValue: 100, step: 5 },
    { label: 'B', value: 'B', minValue: 10, maxValue: 100, step: 5 },
    { label: 'C', value: 'C', minValue: 10, maxValue: 100, step: 5 },
    { label: 'D', value: 'D', minValue: 10, maxValue: 150, step: 5 },
    { label: 'E', value: 'E', minValue: 10, maxValue: 150, step: 5 }
];

const initialComplexState : ISelectionData[] = [
    {
        selections: [
            { selected: 'B', amount: 10, price: null},
            { selected: 'D', amount: 20, price: null},
            { selected: 'E', amount: 30, price: null}
        ]
    }
    ,
    {
        selections: [{ selected: 'E', amount: 30, price: null}]
    },
    {
        selections: []
    },
];

function profile(state = initialProfileState, action: IAction) {
    switch (action.type) {
      case actions.PROFILE_SAVE:
        return (action as any).profile;
      default:
        return state;
    }
  }

  function flashMessage(state = '', action: IAction) {
    switch (action.type) {
      case actions.FLASH_MESSAGE_SET:
        return (action as any).message;
      default:
        return '';
    }
  }
  ​
  function comboBoxValues(state = initialComoboBoxValuesState, action: IAction) {
    switch (action.type) {
        case actions.LIST_SHOW:
          return state;
        case actions.LIST_ITEM_DETAIL:
          return state;
        case actions.LIST_ITEM_EDIT:
          return state;
        case actions.LIST_ITEM_SAVE:
            console.log("list item save");
            return state.map((comboBoxValue: IComboBoxValue) =>
                comboBoxValue.value !== (action as any).item.value ? comboBoxValue : (action as any).item
            );
        default:
          return state;
      }
    }

  function complex(state = initialComplexState, action: IAction) {
    switch (action.type) {
      case actions.COMPLEX_SHOW:
        return state;
      default:
        return state;
    }
  }

  const AppReducer = combineReducers<IState>({profile,
    comboBoxValues,
    complex,
    flashMessage})
  ​
  export default AppReducer;