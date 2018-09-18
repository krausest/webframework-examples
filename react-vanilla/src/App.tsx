import * as React from 'react';
import { BrowserRouter as Router, Route, NavLink} from "react-router-dom";
import { Provider } from 'react-redux';

import Home from './Home';
import Complex from './Complex';
import Profile from './Profile';
import ListView from './list/ListView';
import LiNavLink from './LiNavLink';

import { createStore } from 'redux'
import AppReducer from './reducers';

const store = createStore(AppReducer)

class App extends React.Component {
  public render() {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <NavLink activeClassName="active" className="navbar-brand" to="/" >React.js Sample</NavLink>
                        <ul className="navbar-nav mr-auto">
                            <LiNavLink to='/profile'>Profile</LiNavLink>
                            <LiNavLink to='/list'>List</LiNavLink>
                            <LiNavLink to='/complex'>Complex</LiNavLink>
                        </ul>
                    </nav>
                    <div className="container-fluid">
                        <Route exact={true} path="/" component={Home} />
                        <Route path="/list" component={ListView}/>
                        <Route path="/complex" component={Complex} />
                        <Route path="/profile" component={Profile} />
                    </div>
                </div>
            </Router>
        </Provider>
    );
  }
}



export default App;
