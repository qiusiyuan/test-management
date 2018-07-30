import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Form, FormGroup, FormControl} from 'react-bootstrap';
const jobCall= require('../../backendCall/jobCall');

class AddJobBox extends Component{
  constructor(){
    super();
    this.state={
      jobNameBox:"",
      smallModalShow:false,
      boxState:"input", //load, error
      errorMessage:"",
    }
    this.changeOwnerText = this.changeOwnerText.bind(this);
    this.cleanBox =  this.cleanBox.bind(this);
    this.hideSmallModal = this.hideSmallModal.bind(this);
    this.showSmallModal = this.showSmallModal.bind(this);
    this.addTestCall = this.addTestCall.bind(this);
  }
  addTestCall(){
    let that = this;
    this.hideSmallModal();
    var jobName = this.state.jobNameBox;
    this.setState({
      boxState: "load",
      errorMessage: "",
    });
    jobCall.createJob(jobName, function(err, res){
      if(err){
        that.setState({
          boxState: "error",
          errorMessage: err.message,
        });
      }else{
        window.location = `/job/${jobName}`;
      }
    });
  }
  hideSmallModal(){
    this.setState({
      smallModalShow: false,
    });
  }
  showSmallModal(){
    this.setState({
      smallModalShow: true,
    });
  }
  changeOwnerText(e){
    this.setState({
      jobNameBox: e.target.value,
    })
  }
  cleanBox(){
    let that = this;
    this.setState({
      jobNameBox: "",
      boxState:"input",
      errorMessage:"",
    }, that.props.onHide);  
  }
  render(){
    return(
      <Modal
      {...this.props}
      bsSize="small"
      backdrop='static'
      >
        <div>
          <Modal
          show = {this.state.smallModalShow}
          onHide = {this.hideSmallModal}
          bsSize="small"
          >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-sm">
              Are sure to add job:{this.state.jobNameBox}
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={this.hideSmallModal}>Cancel</Button>
            <Button onClick={this.addTestCall}>Add</Button>
          </Modal.Footer>
          </Modal>
        </div>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-sm">
            Create New Job
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.boxState==="input"&&<Form inline>
            <FormGroup controlId="formInlineName">
              <FormControl type="text" style={{width:'250px'}} placeholder="job name" value={this.state.jobNameBox} onChange={e=>this.changeOwnerText(e)}/>
            </FormGroup>
            {this.state.jobNameBox.length>11&&<font color="red">Name cannot be longer than 11 characters</font>}
          </Form>}
          {this.state.boxState==="load" && "Creating.."}
          {this.state.boxState==="error" && this.state.errorMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.cleanBox}>Close</Button>
          {this.state.boxState==="input"&&
          <Button onClick={this.showSmallModal} disabled={this.state.jobNameBox===""||this.state.jobNameBox.length>11}>Add</Button>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddJobBox
AddJobBox.propTypes = {
  show:PropTypes.bool.isRequired,
  onHide:PropTypes.func.isRequired,
}