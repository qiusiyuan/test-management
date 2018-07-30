import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';
import CheckTestList from './3checkTestList';
const helper = require('../../../helper/helper');
const testCall = require('../../../backendCall/testCall');

class AddTestCheckList extends Component{
  constructor(){
    super();
    this.state = {
      checkedTest:[],
      allTest:[]
    }
    this.toggleCheck = this.toggleCheck.bind(this);
    this.toggleCheckRecursive = this.toggleCheckRecursive.bind(this);
    this.addTestCall = this.addTestCall.bind(this);
    this.getTestList = this.getTestList.bind(this);
  }
  getTestList(){
    let that = this;
    testCall.getAllTests(function(err,result){
      if(err){
        console.log(err.message);
      }else{
        that.setState({
          allTest: result
        });
      }
    });
  }
  componentDidMount(){
    this.getTestList();
  }
  toggleCheck(target, checked){
    var allTest = JSON.parse(JSON.stringify(this.state.allTest));
    this.toggleCheckRecursive(allTest, target, checked);
    this.setState({
      allTest: allTest,
    });
  }
  toggleCheckRecursive(sourceLst, target, checked){
    let that = this;
    sourceLst.forEach((source)=>{
      if(source.name===target.name){
        if(!helper.isGroup(source) && !helper.isGroup(target)){
          source.checked =  checked;
        }else if(helper.isGroup(source) && !helper.isGroup(target)){
          source.checked = checked;
          var targetLst = JSON.parse(JSON.stringify(source.subset));
          targetLst.forEach((childSource)=>{
            childSource.subset = undefined;
            that.toggleCheckRecursive(source.subset, childSource, checked);
          });
        }else if(helper.isGroup(source) && helper.isGroup(target)){
          var newTarget = target.subset[0];
          that.toggleCheckRecursive(source.subset, newTarget, checked);
        }
      }
    });
  }
  addTestCall(){
    var requestTest = helper.getAddLst(this.state.allTest);
    this.props.addJobTests(requestTest)
  }
  
  render(){
    return(
      <Modal
        {...this.props}
        bsSize="median"
      >
       <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Add Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CheckTestList
            test={this.state.allTest}
            toggleCheck={this.toggleCheck}
          />
        </Modal.Body>
      <Modal.Footer>
          <Button onClick={this.addTestCall}>Add</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddTestCheckList;
AddTestCheckList.propTypes={
  show:PropTypes.bool.isRequired,
  onHide:PropTypes.func.isRequired,
  addJobTests:PropTypes.func.isRequired,
}