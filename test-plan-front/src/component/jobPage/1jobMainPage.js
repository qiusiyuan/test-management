import React, { Component } from 'react';
import JobTestList from './2jobTestList';
import AddTestCheckList from './2addTestCheckList/2addTestCheckList';
import JobTitlePanel from './2jobTitlePanel';
import JobErrorPanel from './2jobErrorPanel';
const helper = require('../../helper/helper');
const jobCall= require('../../backendCall/jobCall');

class JobMainPage extends Component{
  constructor(props){
    super(props);
    this.state={
      tests: [],
      jobErrors:{},
      jobStatus: "",
      jobDescriptions: "",
      jobName: "",
      createDate: "",
      lastModified: "",

      showModal:false,
    }
    this.updateDescription = this.updateDescription.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.getJobContent =  this.getJobContent.bind(this);
    this.addJobTests = this.addJobTests.bind(this);
    this.editJobDescriptionCall = this.editJobDescriptionCall.bind(this);
  }
  componentDidMount(){
    this.getJobContent();
  }
  getJobContent(){
    var that = this;
    var jobName = this.props.match.params.jobName;
    jobCall.getJob(jobName, function(err, res){
      if(err){
        console.log(err);
      }else{
        that.setState({
          tests: res.tests,
          jobDescriptions: res.descriptions,
          jobStatus: res.status,
          jobName: res.name,
          createDate: res.createDate,
          lastModified: res.lastModified,
          jobErrors: res.jobErrors,
        });
      }
    });
  }
  addJobTests(test){
    let that = this;
    var jobName = this.state.jobName;
    jobCall.addJobTests(jobName, test, function(err, res){
      if(err){
        console.log(err.message);
      }else{
        that.getJobContent(that.hideModal());
      }
    })

  }
  updateDescription(e){
    this.setState({
      jobDescriptions: e.target.value
    });
  }
  editJobDescriptionCall(){
    var that = this;
    var jobName = this.state.jobName;
    var jobDescriptions = this.state.jobDescriptions;
    jobCall.editJobDescription(jobName, jobDescriptions, function(err, res){
      if(err) console.log(err.message);
      that.getJobContent();
    });
  }
  showModal(){
    this.setState({
      showModal:true
    });
  }
  hideModal(){
    this.setState({
      showModal:false
    });
  }
  render(){
    var jobStats = helper.getStats(this.state.tests);
    return(
      <div>
        <AddTestCheckList 
          show={this.state.showModal}
          onHide={this.hideModal}
          addJobTests={this.addJobTests}
        />
        <JobTitlePanel
          jobName={this.state.jobName}
          jobDescriptions={this.state.jobDescriptions}
          jobStats={jobStats}
          createDate={this.state.createDate}
          lastModified={this.state.lastModified}
          updateDescription={this.updateDescription}
          showModal={this.showModal}
          editJobDescriptionCall={this.editJobDescriptionCall}
        />
        <JobErrorPanel
          jobErrors={this.state.jobErrors}
          jobName = {this.state.jobName}
          getJobContent = {this.getJobContent}
        />
        <div id='testList' style={testListStyle}>
          <JobTestList
            test={this.state.tests}
            jobErrors={this.state.jobErrors}
            getJobContent={this.getJobContent}
            jobName={this.state.jobName}
          />
        </div>
      </div>  
    );
  }
}

const testListStyle={width:'90%', margin:'10px auto'}
export default JobMainPage;