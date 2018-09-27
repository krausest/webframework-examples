
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StoreService } from '../store';
import { IComboBoxValue } from '../types';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as MyValidators from '../validators';

@Component({
    selector: 'app-list-edit',
    templateUrl: './edit.component.html'
})
export class ListEditComponent {

    value: IComboBoxValue;
    id: string;

    constructor(private store: StoreService, private route: ActivatedRoute, private router: Router) {
        const comboBoxValues = store.comboBoxValues;
        this.route.params.subscribe(params => {
            console.log(params);
            if (params['id']) {
                const v = comboBoxValues.filter(c => c.value === params['id']);
                if (v.length === 1) {
                    this.value = JSON.parse(JSON.stringify(v[0]));
                    this.id = this.value.value;
                    // this.id = v[0].value;
                    // this.form = new FormGroup({
                    //     label: new FormControl(v[0].label, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]),
                    //     value: new FormControl({ value: v[0].value, disabled: true }),
                    //     minValue: new FormControl(v[0].minValue.toFixed(),
                    //         [Validators.required, MyValidators.isNumeric(), Validators.min(10), Validators.max(1000)]),
                    //     maxValue: new FormControl(v[0].maxValue.toFixed(),
                    //         [Validators.required, MyValidators.isNumeric(), Validators.min(10), Validators.max(1000)]),
                    //     step: new FormControl(v[0].step.toFixed(),
                    //         [Validators.required, MyValidators.isNumeric(), Validators.min(5), Validators.max(100)]),
                    // }, [MyValidators.minLessThanMax])
                }
            }
        });
    }

    back() {
        this.router.navigate(['/list', this.value.value, 'view']);
    }

    save() {
        this.store.updateItem(this.value.value, this.value);
        this.router.navigate(['/list', this.value.value, 'view']);
    }
}