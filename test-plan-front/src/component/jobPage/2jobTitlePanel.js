import React, { Component } from 'react';
import { Panel, Button, FormGroup, FormControl, PageHeader} from 'react-bootstrap';
import PropTypes from 'prop-types';
import StatsProgress from './4statsProgress';

class JobTitlePanel extends Component{
  constructor(){
    super();
    this.state={
      descriptionEdit: false,
    }
    this.editJobDescription =  this.editJobDescription.bind(this);
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
      this.props.editJobDescriptionCall()
    }
  }
  render(){
    let that = this;
    var stats = this.props.jobStats;
    return(
      <div>
        <PageHeader style={{margin:"0 auto"}}>
          &nbsp;{that.props.jobName} &nbsp; 
          <small style={{fontSize:'35%'}}>Create Date: {that.props.createDate}</small> &nbsp;&nbsp;
          <small style={{fontSize:'35%'}}>Last Modified: {that.props.lastModified}</small>
          <Button onClick={that.props.showModal} style={{float:'right', marginTop:'10px', marginRight:'50px'}}> Add Test </Button>
          <div style={statsProgressStyle} className="status stats">
            <StatsProgress
              stats={stats}
            />
          </div>
        </PageHeader>
        <div id='jobdescriptions' style={descriptionStyle}>
          <Panel bsStyle="info" defaultExpanded style={{ border:0, mariginBottom:0}}>
            <Panel.Heading style={{overflow:'auto'}}>
              <Panel.Title toggle style={{marginTop:'5px', float:'left'}}>Job Descriptions</Panel.Title>
              <Button style={{ float:'right'}} onClick={this.editJobDescription}> {this.state.descriptionEdit? 'update':'edit'}</Button>
            </Panel.Heading>
            <Panel.Collapse>
              <FormGroup controlId="formControlsTextarea">
              <FormControl onChange={e=>that.props.updateDescription(e)} disabled={!this.state.descriptionEdit} rows="3" componentClass="textarea" placeholder="descriptions.." value={that.props.jobDescriptions}/>
              </FormGroup>
            </Panel.Collapse>
          </Panel>
        </div>
      </div>
      );
  }
}
const descriptionStyle={width:'70%', margin:'10px auto'}
const statsProgressStyle={
  float:'right',
  marginRight:'40px',
  marginTop:'15px',
  width:'25%',
}

export default JobTitlePanel;
JobTitlePanel.protoType = {
  jobName: PropTypes.string.isRequired,
  jobDescriptions: PropTypes.string.isRequired,
  jobStats: PropTypes.array.isRequired,
  createDate: PropTypes.string,
  lastModified: PropTypes.string,
  updateDescription: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired
};