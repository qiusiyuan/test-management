import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ListGroup, ListGroupItem, } from 'react-bootstrap';
import './expandListItem.css';
import OwnerControl from './4ownerControl';
import TestWorkPanel from './4testWorkPanel';
import StatsProgress from './4statsProgress';
const helper = require('../../helper/helper');
const jobCall= require('../../backendCall/jobCall');

class ExpandListItem extends Component{
  constructor(){
    super();
    this.state = {
      expand: false,
      expandTestPanel: false
    }
    this.toggleExpand = this.toggleExpand.bind(this);
    this.updateOwner = this.updateOwner.bind(this);
    this.toggleTestPanel = this.toggleTestPanel.bind(this);
  }
  toggleExpand(){
    this.setState({
      expand: !this.state.expand,
    });
  }
  updateOwner(newOwner){
    let that = this;
    var jobName = this.props.jobName;
    var body = {
      test: that.props.arg,
      owner: newOwner,
    };
    jobCall.editTestOwner(jobName, body, function(err, res){
      if(err){
        console.log(err.message);
      }else{
        that.props.getJobContent();
      }
    })
  }
  toggleTestPanel(){
    this.setState({
      expandTestPanel: !this.state.expandTestPanel,
    });
  }
  render(){
    var test = this.props.test;
    let that = this;
    var displayClass = that.state.expand? "showRow": "hideRow";
    var testPanelDisplayClass = that.state.expandTestPanel? "showRow": "hideRow";
    if (helper.isGroup(test)){
      var stats = helper.getStats(test.subset);
    }
    return (
      <div>
      {
      // return(<p> kk </p>)
      helper.isGroup(test)? 
          <ListGroup style={{'marginLeft':'10px', 'marginBottom':'0px'}}>
            <ListGroupItem id={test.name} style={{overflow:'auto'}}> <a onClick={that.toggleExpand}>
                {that.state.expand ?
                  <i className="fa fa-chevron-down" aria-hidden="true"></i>
                  : <i className="fa fa-chevron-right" aria-hidden="true"></i>
                }
              </a> &nbsp; {test.name}
              <div style={buttonStyle1}>
                <OwnerControl
                  owner={test.owner}
                  updateOwner={that.updateOwner}
                />
              </div>
              <div style={statsProgressStyle} className="status stats">
                <StatsProgress
                  stats={stats}
                />
              </div>
            </ListGroupItem>
            <ListGroup style={{'marginLeft':'10px', 'marginBottom':'0px'}} className={displayClass}>
              {test.subset.map(function(child, i){
                var newArg = JSON.parse(JSON.stringify(that.props.arg));
                helper.formArg(newArg, child.name);
                return (<ExpandListItem
                  test ={child}
                  jobErrors={that.props.jobErrors}
                  arg = {newArg}
                  getJobContent={that.props.getJobContent}
                  jobName={that.props.jobName}
                />);
              })}
              
            </ListGroup> 
          </ListGroup>
      :
      <div>
        <ListGroupItem style={{'marginLeft':'10px', overflow:'auto'}}> 
            <a style={{fontSize:'130%'}} onClick={this.toggleTestPanel}> {test.name}</a>
            <div style={buttonStyle2}>
              {test.status==='pending'&&<div>&nbsp;<i className="fa fa-ellipsis-h" aria-hidden="true" style={{color:'yellow', 'fontSize':'2em'}}></i></div>}
              {test.status==='success'&&<div>&nbsp;<i className="fa fa-check-circle-o" aria-hidden="true" style={{color:'green', 'fontSize':'2em'}}></i></div>}
              {test.status==='failure'&&<div>&nbsp;<i className="fa fa-circle-o-notch" aria-hidden="true" style={{color:'red', 'fontSize':'1.5em'}}></i></div>}
            </div>
            <div style={buttonStyle1}>
              <OwnerControl
                owner={test.owner}
                updateOwner={that.updateOwner}
              />
            </div>
        </ListGroupItem>
        <div id='testPanel' className={testPanelDisplayClass}>
          <TestWorkPanel
            test={test}
            jobErrors={JSON.parse(JSON.stringify(that.props.jobErrors))}
            arg = {that.props.arg}
            getJobContent={that.props.getJobContent}
            jobName={that.props.jobName}
          />
        </div>
      </div>
      }
    </div>
  );
  }
}

var buttonStyle1 = {
  float:'right',
  marginRight:'15px',
  color:'skyblue'
}

var buttonStyle2 = {
  float:'right',
  marginRight:'15px',
  marginTop:'5px',
  color:'skyblue'
}
var statsProgressStyle={
  float:'right',
  marginRight:'15px',
  marginTop:'5px',
  width:'20%',
}
export default ExpandListItem;

ExpandListItem.propTypes = {
  test: PropTypes.object.isRequired
};
