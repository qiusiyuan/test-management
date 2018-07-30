import React, { Component } from 'react';
import {SplitButton, MenuItem, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Textarea from "react-textarea-autosize";
import './expandListItem.css';

class JobErrorLine extends Component{
  constructor(){
    super();
    this.state = {
      descriptionEdit : false,
      descriptions:""
    }
    this.selectErrorStatus = this.selectErrorStatus.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.editJobDescription = this.editJobDescription.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }
  componentDidMount(){
    this.setState({
      descriptions: this.props.error.descriptions
    });
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      descriptions: nextProps.error.descriptions,
    });
  }
  updateDescription(e){
    this.setState({
      descriptions: e.target.value,
    })
  }
  selectErrorStatus(eventKey, event){
    this.props.changeErrorStatus(this.props.errorID, eventKey);
  }
  editJobDescription(){
    if (!this.state.descriptionEdit){
      this.setState({
        descriptionEdit:true
      });
    }else{
      this.setState({
        descriptionEdit:false
      });
      this.props.editJobDescriptionCall(this.props.errorID, this.state.descriptions)
    }
  }
  cancelEdit(){
    this.setState({
      descriptionEdit: false,
      descriptions: this.props.error.descriptions,
    })
  }
  render(){
    let that = this;
    var error = this.props.error;
    var errorID = this.props.errorID;
    var displayClass = that.state.descriptionEdit? "showRow": "hideRow"
    return(
      <tr id={errorID}>
        <td style={{'text-align':'center'}} className='errorID'> {errorID}</td>
        <td style={{'text-align':'left'}} className='errorDescriptions'>
        <Textarea style={{width:'85%'}} value={this.state.descriptions} onChange={that.updateDescription}  disabled={!this.state.descriptionEdit}/>
        <div style={{float:'right'}}>
          <div style={{marginBottom:'10px'}}>
            <Button onClick={this.editJobDescription}> {this.state.descriptionEdit? 'update':'edit'} </Button>
          </div>
          <div style={{float:'bottom'}} className={displayClass}>
            <Button onClick={this.cancelEdit}> cancel </Button>
          </div>
        </div>
        </td>
        <td style={{'text-align':'center'}} bgcolor={error.status==="solved"? 'Aquamarine':'LemonChiffon'} className='errorStatus'>
        <SplitButton
          bsStyle="default"
          title={error.status}
        >
          <MenuItem onSelect={that.selectErrorStatus} eventKey="solved">solved</MenuItem>
          <MenuItem onSelect={that.selectErrorStatus} eventKey="pending">pending</MenuItem>
        </SplitButton>
        </td>
      </tr>  
    );
  }
}

export default JobErrorLine
JobErrorLine.propType={
  error : PropTypes.object.isRequired,
  errorID : PropTypes.string.isRequired,
  changeErrorStatus : PropTypes.func.isRequired,
  editJobDescriptionCall : PropTypes.func.isRequired,
}