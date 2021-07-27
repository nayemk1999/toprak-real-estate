import React, { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from '../src/components/Home/Home/Home'
import PropertyDetailPage from './components/PropertyDetailPage/PropertyDetailPage/PropertyDetailPage';
import Dashboard from './components/Dashboard/Dashboard/Dashboard';

export const UserContext = createContext()

function App() {
  const [loggedInUser, setLoggedInUser] = useState();
  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Router>
        <Switch>
        <Route path='/detail'>
            <PropertyDetailPage/>
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
