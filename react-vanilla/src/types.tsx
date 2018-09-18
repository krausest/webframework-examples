export interface IComboBoxValue {
    label: string,
    value: string,
    minValue: number,
    maxValue: number,
    step: number
};

export interface IProfileData {
    name: string;
    email: string;
    allowPhone: boolean;
    phone: string;
    password: string;
}

export interface IColumnSelection {
    selected: string,
    amount: number,
    price: number | null
}

export interface ISelectionData {
    selections: IColumnSelection[];
}

export interface IState {
    profile: IProfileData;
    comboBoxValues: IComboBoxValue[];
    complex: ISelectionData[];
    flashMessage: string;
  };