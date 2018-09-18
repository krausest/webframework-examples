import * as React from 'react';
import {flashMessageSet} from './actions';
import { connect } from 'react-redux';

class FlashMessage extends React.Component<any> {
    public componentWillUnmount() {
        console.log("componentWillUnmount", this.props);
        this.props.setFlashMessage('');
    }
    public render() {
        console.log("FlashMessage", this.props);
        return this.props.message ? <div className="alert alert-success" role="alert">
            {this.props.message}
        </div> : null;
    }
}

const mapStateToProps = (state: any, props: any) => {
    console.log("FlashMessage mapStateToProps", state, props);
    return {
        message: state.flashMessage,
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
      setFlashMessage: (message: string) => dispatch(flashMessageSet(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);