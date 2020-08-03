import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Confirmation,
  Dashboard,
  Error404,
  Error500,
  Form,
  Loading,
  PrivateRoute,
} from '@/components'
import '@/App.css';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) return (<Loading/>)

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Form} />
          <Route path="/confirmation" exact component={Confirmation} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/error500" exact component={Error500} />
          <Route path="/" component={Error404} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
