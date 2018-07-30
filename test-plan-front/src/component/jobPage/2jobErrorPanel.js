import React, { Component } from 'react';
import { Panel, Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import JobErrorLine from './3jobErrorLine';
const jobCall= require('../../backendCall/jobCall');

class JobErrorPanel extends Component{
  constructor(){
    super();
    this.state = {
      jobErrors: {},
    }
    this.changeErrorStatus = this.changeErrorStatus.bind(this);
    this.editJobDescriptionCall = this.editJobDescriptionCall.bind(this);
  }
  componentDidMount(){
    this.setState({
      jobErrors: this.props.jobErrors,
    });
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      jobErrors: nextProps.jobErrors,
    });
  }
  changeErrorStatus(errorID, status){
    let that = this;
    var errorCallBody =  {}
    errorCallBody.errorID = errorID;
    errorCallBody.status = status;
    switch(errorCallBody.status){
      case "pending":
        errorCallBody.status = 0;
        break;
      case "solved":
        errorCallBody.status = 1;
        break;
    }
    jobCall.editJobErrors(that.props.jobName, errorCallBody, function(err,res){
      if(err){
        console.log(err.message)
      } 
      that.props.getJobContent();
    });
  }
  editJobDescriptionCall(errorID, descriptions){
    let that = this;
    var errorCallBody =  {}
    errorCallBody.errorID = errorID;
    errorCallBody.descriptions= descriptions;
    jobCall.editJobErrors(that.props.jobName, errorCallBody, function(err,res){
      if(err){
        console.log(err.message)
      } 
      that.props.getJobContent();
    });
  }
  render(){
    let that = this;
    return(
      <div id='errorsPanel' style={errorsPanelStyle}>
        <Panel bsStyle="warning" defaultExpanded={false} style={{ border:0, mariginBottom:0}}>
          <Panel.Heading style={{overflow:'auto'}}>
            <Panel.Title toggle style={{marginTop:'5px', float:'left'}}>Errors({Object.keys(this.state.jobErrors).length})</Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <div id='errorList'>
            <Table condensed hover bordered>
              <col width="10%"/>
              <col width="60%"/>
              <col width="30%"/>
              <thead>
                <tr height="40">
                  <th style={{'text-align':'center'}}>ID</th>
                  <th style={{'text-align':'center'}}>Descriptions</th>
                  <th style={{'text-align':'center'}}>status</th> 
                </tr>
              </thead>
              <tbody>
              {Object.keys(that.state.jobErrors).map(function(errorID, i){
                return(<JobErrorLine
                        error = {that.state.jobErrors[errorID]}
                        errorID = {errorID}
                        changeErrorStatus = {that.changeErrorStatus}
                        editJobDescriptionCall={that.editJobDescriptionCall}
                      />)
              })}
              </tbody>
            </Table>
            </div>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  }
}
const errorsPanelStyle = {width:'70%', margin:'10px auto'}
export default JobErrorPanel;
JobErrorPanel.propTypes = {
  jobErrors: PropTypes.array.isRequired,
  jobName: PropTypes.string.isRequired,
  getJobContent: PropTypes.func.isRequired,
}