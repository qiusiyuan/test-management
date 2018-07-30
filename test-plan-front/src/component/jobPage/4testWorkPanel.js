import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, FormGroup, FormControl, ControlLabel, SplitButton, MenuItem} from 'react-bootstrap';
import ErrorPanel from './5errorPanel';
import update from 'react-addons-update';
const jobCall= require('../../backendCall/jobCall');

class TestWorkPanel extends Component{
  constructor(props){
    super(props);
    this.state={
      status:"",
      jobErrors:{},
      error:"new error",
      newErrorObj: {
        "descriptions":"",
        "status":"pending",
      },
    };
    this.selectStatus = this.selectStatus.bind(this);
    this.selectError = this.selectError.bind(this);
    this.changeErrorDescription = this.changeErrorDescription.bind(this);
    this.selectErrorStatus = this.selectErrorStatus.bind(this);
    this.updateTestStatus = this.updateTestStatus.bind(this);
  }
  componentDidMount(){
    this.setState({
      status: this.props.test.status,
      jobErrors: this.props.jobErrors,
      error:  this.props.test.error||this.state.error,
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      status: nextProps.test.status,
      jobErrors: nextProps.jobErrors,
      error:  nextProps.test.error||"new error",
      newErrorObj: {
        "descriptions":"",
        "status":"pending",
      },
    });
  }
  selectStatus(eventKey, event){
    this.setState({
      status: eventKey,
    });
  }
  selectError(eventKey, event){
    this.setState({
      error: eventKey
    });
  }
  changeErrorDescription(newDescription){
    if(this.state.error === "new error"){
      var newObj = update(this.state.newErrorObj, {
        descriptions:{$set: newDescription},
      });
      this.setState({
        newErrorObj: newObj
      })
    }else{
      var newJobErrors = this.state.jobErrors;
      newJobErrors[this.state.error].descriptions = newDescription;
      this.setState({
        jobErrors: newJobErrors,
      });
    }
  }
  selectErrorStatus(eventKey, event){
    if(this.state.error === "new error"){
      var newObj = update(this.state.newErrorObj, {
        status:{$set: eventKey},
      });
      this.setState({
        newErrorObj: newObj
      })
    }else{
      var newJobErrors = this.state.jobErrors;
      newJobErrors[this.state.error].status = eventKey;
      this.setState({
        jobErrors: newJobErrors,
      });
    }
  }
  updateTestStatus(){// call api to update
    let that = this;
    var arg = this.props.arg;
    var jobName = this.props.jobName
    var status;
    switch(this.state.status){
      case "success":
        status = 2;
        break
      case "failure":
        status = 1;
        break
      case "pending":
        status = 0;
        break
    }
    var body = {
      test: arg,
      status: status,
    }
    if (this.state.status !== "failure"){
      jobCall.editTestResult(jobName, body, function(err, res){
        if(err) console.log(err.message);
        that.props.getJobContent();
      });
    }
    else if(this.state.error === "new error"){//post error
      var errorCallBody = JSON.parse(JSON.stringify(this.state.newErrorObj));
      errorCallBody.errorID = "new";
      switch(errorCallBody.status){
        case "pending":
          errorCallBody.status = 0;
          break;
        case "solved":
          errorCallBody.status = 1;
          break;
      }
      jobCall.editJobErrors(jobName, errorCallBody, function(err,res){
        if(err){
          console.log(err.message)
          that.props.getJobContent();
        }else{
          body.error = res;
          jobCall.editTestResult(jobName, body, function(err, res){
            if(err) console.log(err.message);
            that.props.getJobContent();
          });
        }
      })
    }else{
      var errorCallBody = JSON.parse(JSON.stringify(this.state.jobErrors[this.state.error]));
      errorCallBody.errorID = this.state.error;
      switch(errorCallBody.status){
        case "pending":
          errorCallBody.status = 0;
          break;
        case "solved":
          errorCallBody.status = 1;
          break;
      }
      jobCall.editJobErrors(jobName, errorCallBody, function(err,res){
        if(err){
          console.log(err.message)
          that.props.getJobContent();
        }else{
          body.error = res;
          jobCall.editTestResult(jobName, body, function(err, res){
            if(err) console.log(err.message);
            that.props.getJobContent();
          });
        }
      });
    }
  }
  render(){
    var descriptions = this.props.test.description;
    let that = this;
    var displayClass = that.state.status==="failure"? "showRow": "hideRow"
    var panelStyle;
    switch(this.state.status){
      case "success":
        panelStyle = "success";
        break
      case "failure":
        panelStyle = "danger";
        break
      case "pending":
        panelStyle = "warning";
        break
    }
    return(
      <div id='workPanel' style={workpanelStyle}>
        <Panel bsStyle={panelStyle} style={{ border:0, mariginBottom:0}}>
          <Panel.Heading style={{overflow:'auto'}}>
            <Panel.Title style={{marginTop:'5px', float:'left'}}>Test Work Panel</Panel.Title>
            <Button style={{ float:'right'}} onClick={that.updateTestStatus}> Update</Button>
          </Panel.Heading>
          <Panel.Body>
            <div style={{borderRight:'5px solid grey', width:'60%', float:'left'}}>
              <div style={{margin:'10px'}}>
                <FormGroup controlId="formControlsTextarea" style={{float:'left'}}>
                <ControlLabel>Descriptions</ControlLabel>{' '}
                <FormControl disabled rows="7" style={{width:'300px'}} componentClass="textarea" placeholder="descriptions.." value={descriptions}/>
                </FormGroup>
              </div>  
              <div style={{margin:'20px', float:'left'}}>
                <ControlLabel>status</ControlLabel>{' '}
                <SplitButton
                  bsStyle="default"
                  title={that.state.status}
                >
                  <MenuItem onSelect={that.selectStatus} eventKey="success">success</MenuItem>
                  <MenuItem onSelect={that.selectStatus} eventKey="failure">failure</MenuItem>
                  <MenuItem onSelect={that.selectStatus} eventKey="pending">pending</MenuItem>
                </SplitButton>
              </div>
              <div className={displayClass} style={{margin:'20px', float:'left'}}>
                <ControlLabel>errorID</ControlLabel>{' '}
                <SplitButton
                  bsStyle="default"
                  title={this.state.error}
                >
                  <MenuItem onSelect={that.selectError} eventKey="new error">new error</MenuItem>
                  {Object.keys(that.state.jobErrors).map(function(err,i){
                    return (
                      <MenuItem onSelect={that.selectError} eventKey={err}>{err}</MenuItem>
                    );
                  })}
                </SplitButton>
              </div>
              <div style={{clear:'both'}}> </div>
             </div>
             <div id='errorPanel' className={displayClass}>
              <ErrorPanel
                errorID={this.state.error}
                jobErrors={this.state.jobErrors}
                newErrorObj={this.state.newErrorObj}
                changeErrorDescription={this.changeErrorDescription}
                selectErrorStatus={this.selectErrorStatus}
              />
             </div>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const workpanelStyle={width:'100%', margin:'5px 10px'};

export default TestWorkPanel;
TestWorkPanel.protoTypes={
  test: PropTypes.object.isRequired,
  jobErrors: PropTypes.object.isRequired
}