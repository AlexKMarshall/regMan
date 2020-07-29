import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Confirmation,
  Dashboard,
  Error404,
  Error500,
  Form,
  GroupsList,
  Loading,
  Navbar,
  ParticipantDetails,
  PrivateRoute,
} from '@/components'
import '@/App.css';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) return (<Loading/>)

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Form} />
          <Route path="/confirmation" exact component={Confirmation} />
          <PrivateRoute path="/dashboard" exact component={Dashboard} />
          <PrivateRoute path="/dashboard/:id" component={ParticipantDetails} />
          <PrivateRoute path="/groups" exact component={GroupsList} />
          <Route path="/" component={Error404} />
          <Route path="/error500" component={Error500} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
