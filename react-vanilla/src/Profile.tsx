import * as React from 'react';
import './App.css';
import {FormValueString, FormValueBoolean, alwaysTrue, required, minLength, maxLength, pattern, email as validateEmail, composeValidators, handleFormInput, handleFormCheckbox, validateFormValue, propsInputValidateOnBlur} from './validators';
import {IProfileData, IState, Sex} from './types';
import { connect } from 'react-redux';
import { profileSave } from './actions';
import {RouteComponentProps} from "react-router";

class PageData {
    public profile = {
        name: new FormValueString(),
        email: new FormValueString(),
        sex: new FormValueString(),
        allowPhone: new FormValueBoolean(),
        phone: new FormValueString(),
        password: new FormValueString(),
    };
    public repeatPassword = new FormValueString();
    public message = '';
    public readonly = false;
    public invalid = false;

    constructor(profile: IProfileData) {
        if (profile) {
            this.profile.name = new FormValueString(profile.name);
            this.profile.email = new FormValueString(profile.email);
            this.profile.sex = new FormValueString(profile.sex.toString());
            this.profile.allowPhone = new FormValueBoolean(profile.allowPhone);
            this.profile.phone = new FormValueString(profile.phone);
            this.profile.password = new FormValueString(profile.password);
        }
    }
}

const validateName = composeValidators(required('Please enter a name'),
                                        minLength(4)('Please enter a name with min 4 characters'),
                                        maxLength(14)('Please enter a name with max 13 characters'));

const validateEMail = composeValidators(required('Please enter an e-mail'),
                                        validateEmail('Please enter a valid e-mail'));

const validatePhonenumber = composeValidators(required('Please enter a phone number'),
                                            minLength(4)('Please enter a phone number with min 4 characters'),
                                            maxLength(14)('Please enter a phone number with max 13 characters'));

const validatePassword = composeValidators(required('Please enter a password'),
                                            minLength(4)('Please enter a password with min 4 characters'),
                                            maxLength(14)('Please enter a password with max 13 characters'));

const validatePhone = (allowPhone:boolean) => (!allowPhone ? alwaysTrue : validatePhonenumber);

const validateRepeatPassword = (password:string) => (value: string) => password !== value ? 'Passwords must match' : undefined;

const validate = (values: PageData) => {
    console.log("validate");
    validateFormValue(values.profile.name, validateName);
    validateFormValue(values.profile.email, validateEMail);
    validateFormValue(values.profile.phone, validatePhone(values.profile.allowPhone.value));
    validateFormValue(values.profile.password, validatePassword);
    validateFormValue(values.repeatPassword, validateRepeatPassword(values.profile.password.value));

    values.invalid = !!(values.profile.name.error
                || values.profile.email.error
                || values.profile.phone.error
                || values.profile.password.error
                || values.repeatPassword.error);
}

interface ICompProps extends RouteComponentProps {
    profile: IProfileData;
    save: (profile: IProfileData) => any;
}

interface ICompState {
    form: PageData;
}

class NameComponent extends React.PureComponent<any> {
    render() {
        // console.log("render name", this.props);
        return (<div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" className={(this.props.formValue.invalid ? 'is-invalid' : '') + ' form-control'}
                value={this.props.formValue.value} onChange={this.props.handleEvents(this.props.formValue, false)} onBlur={this.props.handleEvents(this.props.formValue, true, true)}
            name="name" placeholder="Enter name" disabled={this.props.readonly}/>
        {this.props.formValue.invalid && <div className="invalid-feedback">{this.props.formValue.error}</div>}
    </div>);
    }
}

class EMailComponent extends React.PureComponent<any> {
    render() {
        // console.log("render email", this.props);
        return (<div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="text" className={(this.props.formValue.invalid && this.props.formValue.touched ? 'is-invalid' : '') + ' form-control'}
                value={this.props.formValue.value} onChange={this.props.handleEvents(this.props.formValue, false)} onBlur={this.props.handleEvents(this.props.formValue, true, true)}
                name="email" placeholder="Enter e-mail" disabled={this.props.readonly}/>
            {this.props.formValue.invalid && <div className="invalid-feedback">{this.props.formValue.error}</div>}
        </div>);
    }
}

class SexComponent extends React.PureComponent<any> {
    render() {
        // console.log("render sex", this.props);
        return (
            <div className="form-group">
                <label htmlFor="name">Sex</label>
                <div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="sex" id="sex1" value={Sex.MALE.toString()}
                        checked={this.props.formValue.value === Sex.MALE.toString()}
                        onChange = {this.props.handleEvents(this.props.formValue, true, true)}/>
                        <label className="form-check-label" htmlFor="sex1">
                            Male
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="sex" id="sex2" value={Sex.FEMALE.toString()}
                        checked={this.props.formValue.value === Sex.FEMALE.toString()}
                        onChange = {this.props.handleEvents(this.props.formValue, true, true)}/>
                        <label className="form-check-label" htmlFor="sex2">
                            Female
                        </label>
                    </div>
                </div>
            </div>);
    }
}

class AllowPhoneComponent extends React.PureComponent<any> {
    render() {
        // console.log("render allow phone", this.props);
        return (
            <div className="form-check">
                <input className="form-check-input" name="allowPhone" id="allowPhone" type="checkbox"
                    checked={this.props.formValue.value}
                    onChange={this.props.handleEvents(this.props.formValue, true)}
                    disabled={this.props.readonly}/>
                <label className="form-check-label" htmlFor="allowPhone">
                    Allow phone calls
                </label>
            </div>)
    }
}

class PhoneComponent extends React.PureComponent<any> {
    render() {
        // console.log("render phone", this.props);
        return (
            <div className="form-group">
            <label htmlFor="phone">Phone number</label>
            <input type="text" className={(this.props.formValue.invalid ? 'is-invalid' : '') + ' form-control'}
                value={this.props.formValue.value} onChange={this.props.handleEvents(this.props.formValue, false)} onBlur={this.props.handleEvents(this.props.formValue, true, true)}
                name="phone" placeholder="Enter phone" disabled={this.props.readonly}/>
            {this.props.formValue.invalid && <div className="invalid-feedback">{this.props.formValue.error}</div>}
        </div>);
    }
}

class PasswordComponent extends React.PureComponent<any> {
    render() {
        // console.log("render password", this.props);
        return (
            <div className="form-group">
            <label htmlFor="phone">Password</label>
            <input type="text" className={(this.props.formValue.invalid ? 'is-invalid' : '') + ' form-control'}
                value={this.props.formValue.value} onChange={this.props.handleEvents(this.props.formValue, false)} onBlur={this.props.handleEvents(this.props.formValue, true, true)}
                name="password" placeholder="Enter password" disabled={this.props.readonly}/>
            {this.props.formValue.invalid && <div className="invalid-feedback">{this.props.formValue.error}</div>}
        </div>
        );
    }
}

class RepeatPasswordComponent extends React.PureComponent<any> {
    render() {
        // console.log("render repeat password", this.props);
        return (
            <div className="form-group">
                <label htmlFor="phone">Repeat password</label>
                <input type="text" className={(this.props.formValue.invalid ? 'is-invalid' : '') + ' form-control'}
                value={this.props.formValue.value} onChange={this.props.handleEvents(this.props.formValue, false)} onBlur={this.props.handleEvents(this.props.formValue, true, true)}
                    name="repeatPassword" placeholder="Repeat password" disabled={this.props.readonly}/>
                {this.props.formValue.invalid && <div className="invalid-feedback">{this.props.formValue.error}</div>}
            </div>
        )
    }
}

class Profile extends React.Component<ICompProps, ICompState>
{
    public state: ICompState;

    constructor(props: ICompProps) {
      super(props);
      this.state = { form: new PageData(props.profile) };
      validate(this.state.form);
    }

    handleInput = handleFormInput(this, 'form', validate);
    handleCheckbox = handleFormCheckbox(this, 'form', validate);
    propsInput = propsInputValidateOnBlur(this.handleInput);

    submit = (evt: React.SyntheticEvent) => {
        console.log("submit", this);
        evt.preventDefault();
        if (!this.state.form.invalid) {
            this.props.save({
                name: this.state.form.profile.name.value,
                email: this.state.form.profile.email.value,
                sex: Number(this.state.form.profile.sex.value),
                allowPhone: this.state.form.profile.allowPhone.value,
                phone: this.state.form.profile.phone.value,
                password: this.state.form.profile.password.value
            });
        }
    }

    render() {

        return (<div className="row justify-content-center m-4">
                <div className="col-8">
                    {this.state.form.message && <div className="alert alert-success" role="alert">
                        {this.state.form.message}
                    </div>}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Profile</h5>
                            <form onSubmit={this.submit}>
                            {/* <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className={(p.profile.name.invalid ? 'is-invalid' : '') + ' form-control'}
                                        // value={p.profile.name.value} onChange={handle(p.profile.name, false)} onBlur={handle(p.profile.name, true, true)}
                                        {...this.propsInput(p.profile.name)}
                                        name="name" placeholder="Enter name" disabled={p.readonly}/>
                                    {p.profile.name.invalid && <div className="invalid-feedback">{p.profile.name.error}</div>}
                                </div> */}
                                <NameComponent formValue={this.state.form.profile.name} handleEvents={this.handleInput} readonly={this.state.form.readonly} {...this.state.form.profile.name}/>
                                <EMailComponent formValue={this.state.form.profile.email} handleEvents={this.handleInput} readonly={this.state.form.readonly} {...this.state.form.profile.email}/>
                                <SexComponent formValue={this.state.form.profile.sex} handleEvents={this.handleInput} readonly={this.state.form.readonly} {...this.state.form.profile.sex}/>
                                <AllowPhoneComponent formValue={this.state.form.profile.allowPhone} handleEvents={this.handleCheckbox} readonly={this.state.form.readonly} {...this.state.form.profile.allowPhone}/>
                                <PhoneComponent formValue={this.state.form.profile.phone} handleEvents={this.handleInput} readonly={this.state.form.readonly} {...this.state.form.profile.phone}/>
                                <PasswordComponent formValue={this.state.form.profile.password} handleEvents={this.handleInput} readonly={this.state.form.readonly} {...this.state.form.profile.password}/>
                                <RepeatPasswordComponent formValue={this.state.form.repeatPassword} handleEvents={this.handleInput} readonly={this.state.form.readonly} {...this.state.form.repeatPassword}/>
                                values: {JSON.stringify(this.state)}
                                <div className="mt-2">
                                    <button type="submit" className="btn btn-primary" disabled={this.state.form.invalid}>Save</button>
                                    <button type="button" className="ml-3 btn btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

const mapStateToProps = (state: IState, props: any) => {
    return {
        profile: state.profile,
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
      save: (profile: IProfileData) => {
        dispatch(profileSave(profile))
      }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);