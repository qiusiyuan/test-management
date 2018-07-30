import React, { Component } from 'react';
import ExpandListItem from './3expandListItem';

class JobTestList extends Component {
  constructor(){
    super();
    this.state = {
      
    };
  }
  
  render(){
    let that = this;
    return (
      <div id='testList' style={{height: '70vh','overflowY': 'scroll',}}>
        {this.props.test.map(function(child, i){
          return <ExpandListItem
            test = {child}
            jobErrors={that.props.jobErrors}
            arg = {{name:child.name}}
            getJobContent={that.props.getJobContent}
            jobName={that.props.jobName}
          />
        })}
      </div>
    );
  }
}

export default JobTestList;