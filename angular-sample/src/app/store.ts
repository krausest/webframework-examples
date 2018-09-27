import { Injectable } from '@angular/core';
import { IProfileData, IComboBoxValue, ISelectionData } from './types';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

    profile: IProfileData;
    comboBoxValues: IComboBoxValue[];
    columns: ISelectionData[];

  constructor() {
    this.profile = {
        name: '',
        email: '',
        allowPhone: true,
        phone: '',
        password: ''
    };

    this.comboBoxValues = [
        { label: 'A', value: 'A', minValue: 10, maxValue: 100, step: 5 },
        { label: 'B', value: 'B', minValue: 10, maxValue: 100, step: 5 },
        { label: 'C', value: 'C', minValue: 10, maxValue: 100, step: 5 },
        { label: 'D', value: 'D', minValue: 10, maxValue: 150, step: 5 },
        { label: 'E', value: 'E', minValue: 10, maxValue: 150, step: 5 }
    ];
    this.columns = [
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
            }
        ];
    }


  updateProfile(values: any) {
      this.profile.name = values.name;
      this.profile.email = values.email;
      this.profile.allowPhone = values.allowPhone;
      this.profile.phone = values.phone;
  }

  updateItem(id:string, values: any) {
      const v = this.comboBoxValues.filter(c => c.value === id);
      if (v.length === 1) {
          v[0].label = values.label;
          v[0].minValue = Number(values.minValue);
          v[0].maxValue = Number(values.maxValue);
          v[0].step = Number(values.step);
      }
  }
}

