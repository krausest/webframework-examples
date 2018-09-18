import * as React from 'react';
import ListEdit from './EditComponent';
import DetailComponent from './DetailComponent';
import ListComponent from './ListComponent';
import { Switch, BrowserRouter as Router, Route, Link, NavLink, withRouter, RouteComponentProps } from "react-router-dom";

const ListView = (props: any) => (
    <div className="row justify-content-center m-4">
        <div className="col-8">
            <div className="card">
                <div className="card-body">
                    <Route path={`${props.match.url}`} exact={true} component={ListComponent}/>
                    <Route path={`${props.match.url}/:value/view`} component={DetailComponent}/>
                    <Route path={`${props.match.url}/:value/edit`} component={ListEdit}/>
                </div>
            </div>
        </div>
    </div>
  );

export default ListView;
