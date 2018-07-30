import React, { Component } from 'react';
import {Tab, Tabs, Jumbotron, Button} from 'react-bootstrap';
import TestList from '../testList/2testList';
import JobList from '../jobList/2jobList';

class TestMainPage extends Component {

  render(){
    return (
      <div style={{margin:'1%', height:'50%'}}>
        <Jumbotron style={{padding:10}}>
          <div style={{'text-align':'center'}}>
            <h2 style={{margin:'1%'}}> Test Manager </h2>
          </div>
          <div style={{margin:'1%'}}>
            <Button onClick={()=> window.open("http://9.30.97.77:3000/", "_blank")} bsStyle="primary" > Test Artifact </Button>
          </div>
        </Jumbotron>  
      <div>
        <Tabs>
          <Tab eventKey={1} title="Jobs">
            <JobList/>
          </Tab>
          <Tab eventKey={2} title="Test Tree">
            <TestList/>
          </Tab>
         
        </Tabs>
      </div> 
     </div> 
    );
  }
}

export default TestMainPage;