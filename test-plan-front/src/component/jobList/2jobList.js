import React, { Component } from 'react';
import {Table, Button} from 'react-bootstrap';
import JobRow from './3jobRow';
import AddJobBox from './3addJobBox';
const jobCall= require('../../backendCall/jobCall');

class JobList extends Component{
  constructor(){
    super();
    this.state = {
      refreshInterval: 10*1000,
      jobs :[],
      showModal: false,
    }
    this.getJobList = this.getJobList.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  getJobList(){
    var that = this;
    jobCall.listAllJobs(function(err, res){
      if(err){
        console.log(err.message);
      }else{
        that.setState({
          jobs: res,
        })
      }
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
  componentDidMount(){
    this.getJobList();
    this.podInterval = setInterval(() => {
      this.getJobList();
    }, this.state.refreshInterval);
  }
  
  render(){
    let that = this;
    return(
    <div>
      <div id='addJobBox'>
        <AddJobBox
          show={that.state.showModal}
          onHide={that.hideModal}
        />
      </div>  
      <div id='jobList' style={{height: '80vh','overflow-y': 'scroll',}}>
        <Table condensed hover style={{'wdith':'50%'}}>
          <col width="40%"/>
          <col width="20%"/>
          <col width="20%"/>
          <col width="10%"/>
          <col width="10%"/>
          <thead>
            <tr height="40">
              <th style={{'text-align':'center'}}>name</th>
              <th style={{'text-align':'center'}}>Create Date</th>
              <th style={{'text-align':'center'}}>Last Modified</th> 
              <th style={{'text-align':'center'}}>status</th>
              <th><Button onClick={that.showModal}><i className="fa fa-plus" aria-hidden="true"></i> add job </Button></th> 
            </tr>
          </thead>
          <tbody>
          {that.state.jobs.map(function(job, i){
            return(<JobRow job={job}/>)
          })}
          </tbody>
        </Table>
      </div>
    </div>
    );
  }

}

export default JobList;