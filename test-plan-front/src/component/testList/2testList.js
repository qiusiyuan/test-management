import React, { Component } from 'react';
import ExpandListItem from './3expandListItem';
const testCall = require('../../backendCall/testCall');

class TestList extends Component {
  constructor(){
    super();
    this.state = {
      refreshInterval: 10*1000,
      tests: [],
    };
    this.getTestList = this.getTestList.bind(this);
  }
  
  getTestList(){
    let that = this;
    testCall.getAllTests(function(err,result){
      if(err){
        console.log(err.message);
      }else{
        that.setState({
          tests: result
        });
      }
    });
  }
  componentDidMount(){
    this.getTestList();
    this.podInterval = setInterval(() => {
      this.getTestList();
    }, this.state.refreshInterval);
  }
  
  render(){
    return (
      <div id='testList' style={{height: '80vh','overflow-y': 'scroll',}}>
        {this.state.tests.map(function(child, i){
          return <ExpandListItem
            test = {child}
          />
        })}
      </div>
    );
  }
}

export default TestList;