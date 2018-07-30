import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, ControlLabel, SplitButton, MenuItem} from 'react-bootstrap';

class ErrorPanel extends Component{
  render(){
    let that = this;
    var errorID =this.props.errorID;
    var error = Object.keys(this.props.jobErrors).indexOf(errorID) !== -1 ? this.props.jobErrors[errorID]:this.props.newErrorObj;
    var errorDescription =error.descriptions;
    var status = error.status
    return(
      <div>
        <div style={{float:'left', margin:"10px"}}>
          <ControlLabel>Error </ControlLabel>{' '}
          <FormControl onChange={(e)=> that.props.changeErrorDescription(e.target.value)} rows="5" style={{width:'200px'}} componentClass="textarea" placeholder="descriptions.." value={errorDescription}/>
        </div>
        <div style={{margin:'20px', float:'left'}}>
        <ControlLabel>status</ControlLabel>{' '}
        <SplitButton
          bsStyle="default"
          title={status}
        >
          <MenuItem onSelect={that.props.selectErrorStatus} eventKey="solved">solved</MenuItem>
          <MenuItem onSelect={that.props.selectErrorStatus} eventKey="pending">pending</MenuItem>
        </SplitButton>
      </div>
    </div>
    );
  }
}

export default ErrorPanel;

ErrorPanel.protoType ={
  errorID: PropTypes.string.isRequired,
  jobErrors: PropTypes.object.isRequired,
  newErrorObj: PropTypes.object.isRequired,
  changeErrorDescription: PropTypes.func.isRequired,
  selectErrorStatus: PropTypes.func.isRequired,
}