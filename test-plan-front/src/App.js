import React, { Component } from 'react';
import './App.css';
import TestMainPage from './component/testPlanPage/1testMainPage'
import '../node_modules/font-awesome/css/font-awesome.css';
import {Route, BrowserRouter} from 'react-router-dom';
import JobMainPage from './component/jobPage/1jobMainPage';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path='/' component={TestMainPage} exact/>
          <Route path='/job/:jobName' component={JobMainPage}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
