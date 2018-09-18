import { Route, Link, RouteComponentProps } from "react-router-dom";
import * as React from 'react';

const LiNavLink = (props: any) => (
    <Route path={props.to} children={({ match }) => (
      <li className={match ? 'active nav-item' : 'nav-item'}>
            <Link className="nav-link" {...props}/>
      </li>
    )}/>
  )

export default LiNavLink;