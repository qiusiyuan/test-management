import React, { Component } from 'react';

class JobRow extends Component{
  

  render(){
    var job = this.props.job;
    return(
      <tr height='35px' id={job.name}>
        <td style={{'text-align':'center'}} className='jobname'> {job.name}</td>
        <td style={{'text-align':'center'}} className='jobctime'> {job.createDate}</td>
        <td style={{'text-align':'center'}} className='jobmtime'>{job.lastModified}</td>
        <td style={{'text-align':'center'}} className='jobstatus'> 
          {job.status==='pending'&&<div>&nbsp;<i className="fa fa-ellipsis-h" aria-hidden="true" style={{color:'yellow', 'fontSize':'2em'}}></i></div>}
  {job.status==='success'&&<div>&nbsp;<i className="fa fa-check-circle-o" aria-hidden="true" style={{color:'green', 'fontSize':'2em'}}></i></div>}
          {job.status==='failure'&&<div>&nbsp;<i className="fa fa-circle-o-notch" aria-hidden="true" style={{color:'red', 'fontSize':'1.5em'}}></i></div>}
        </td>
        <td className='jobdetails'> <a href={`/job/${job.name}`}><i className="fa fa-hand-pointer-o" aria-hidden="true"></i> </a></td>
      </tr>  
    );
  }
}

export default JobRow