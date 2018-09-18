import * as React from 'react';
import './App.css';
import {FormValueString, FormValueBoolean, alwaysTrue, required, minLength, maxLength, pattern, email as validateEmail, composeValidators, handleFormInput, handleFormCheckbox, validateFormValue, propsInputValidateOnBlur} from './validators';
import {IProfileData, IState} from './types';
import { connect } from 'react-redux';
import { profileSave } from './actions';
import {RouteComponentProps} from "react-router";

class PageData {
    public profile = {
        name: new FormValueString(),
        email: new FormValueString(),
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

class EMailPureComponent extends React.Component<any> {
    render() {
        console.log("render email", this.props);
        let email = this.props.value;

        return (<div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="text" className={(email.error && email.touched ? 'is-invalid' : '') + ' form-control'}
                value={email.value} onChange={this.props.handleEvents(email, false)} onBlur={this.props.handleEvents(email, true, true)}
                name="email" placeholder="Enter e-mail" disabled={this.props.readonly}/>
            {email.error && <div className="invalid-feedback">{email.error}</div>}
        </div>);
    }
}

class Profile extends React.Component<ICompProps, ICompState>
{
    public state: ICompState;

    constructor(props: ICompProps) {
      super(props);
      this.state = { form: new PageData(props.profile)};
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
                allowPhone: this.state.form.profile.allowPhone.value,
                phone: this.state.form.profile.phone.value,
                password: this.state.form.profile.password.value
            });
        }
    }

    render() {
        const p = this.state.form;
        const handle = this.handleInput;
        const handleCheckbox = this.handleCheckbox;

        return (<div className="row justify-content-center m-4">
                <div className="col-8">
                    {p.message && <div className="alert alert-success" role="alert">
                        {p.message}
                    </div>}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Profile</h5>
                            <form onSubmit={this.submit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className={(p.profile.name.invalid ? 'is-invalid' : '') + ' form-control'}
                                        // value={p.profile.name.value} onChange={handle(p.profile.name, false)} onBlur={handle(p.profile.name, true, true)}
                                        {...this.propsInput(p.profile.name)}
                                        name="name" placeholder="Enter name" disabled={p.readonly}/>
                                    {p.profile.name.invalid && <div className="invalid-feedback">{p.profile.name.error}</div>}
                                </div>
                                <EMailPureComponent value={p.profile.email} handleEvents={handle} readonly={p.readonly}/>
                                {/* <div className="form-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input type="text" className={(p.profile.email.error && p.profile.email.touched ? 'is-invalid' : '') + ' form-control'}
                                        value={p.profile.email.value} onChange={handle(p.profile.email)} onBlur={handle(p.profile.email, true)}
                                        name="profile.email" placeholder="Enter e-mail" disabled={p.readonly}/>
                                    {p.profile.name.error && <div className="invalid-feedback">{p.profile.email.error}</div>}
                                </div> */}
                                <div className="form-check">
                                    <input className="form-check-input" name="allowPhone" id="allowPhone" type="checkbox"
                                        checked={p.profile.allowPhone.value}
                                        onChange={handleCheckbox(p.profile.allowPhone, true)}
                                        disabled={p.readonly}/>
                                    <label className="form-check-label" htmlFor="allowPhone">
                                        Allow phone calls
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone number</label>
                                    <input type="text" className={(p.profile.phone.invalid ? 'is-invalid' : '') + ' form-control'}
                                        {...this.propsInput(p.profile.phone)}
                                        name="phone" placeholder="Enter phone" disabled={p.readonly}/>
                                    {p.profile.phone.invalid && <div className="invalid-feedback">{p.profile.phone.error}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Password</label>
                                    <input type="text" className={(p.profile.password.invalid ? 'is-invalid' : '') + ' form-control'}
                                        {...this.propsInput(p.profile.password)}
                                        name="password" placeholder="Enter password" disabled={p.readonly}/>
                                    {p.profile.password.invalid && <div className="invalid-feedback">{p.profile.password.error}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Repeat password</label>
                                    <input type="text" className={(p.repeatPassword.invalid  ? 'is-invalid' : '') + ' form-control'}
                                        {...this.propsInput(p.repeatPassword)}
                                        name="repeatPassword" placeholder="Repeat password" disabled={p.readonly}/>
                                    {p.repeatPassword.error && <div className="invalid-feedback">{p.repeatPassword.error}</div>}
                                </div>
                                <div>
                                values: {JSON.stringify(this.state)}
                                </div>
                                <div className="mt-2">
                                    <button type="submit" className="btn btn-primary" disabled={p.invalid}>Save</button>
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