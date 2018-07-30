import React, { Component } from 'react';
import ExpandListItem from './4expandListItem';

class CheckTestList extends Component {
  constructor(){
    super();
    this.state = {
      
    };
  }
  render(){
    let that = this;
    return (
      <div id='testList' style={{height: '500px','overflowY': 'scroll',}}>
        {this.props.test.map(function(child, i){
          return <ExpandListItem
            toggleCheck={that.props.toggleCheck}
            arg = {{name:child.name}}
            test = {child}
          />
        })}
      </div>
    );
  }
}

export default CheckTestList;