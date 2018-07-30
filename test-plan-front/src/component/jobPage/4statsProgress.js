import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ProgressBar} from 'react-bootstrap';

class StatsProgress extends Component{

  render(){
    var stats = this.props.stats;
    return(
      <ProgressBar >
        <ProgressBar bsStyle="success" label={stats[0]} now={stats[0]} key={1} max={stats[2]}/>
        <ProgressBar bsStyle="danger" label={stats[1]} now={stats[1]} key={2} max={stats[2]}/>
        <ProgressBar active label={stats[2]-stats[1]-stats[0]} now={stats[2]-stats[1]-stats[0]} key={3} max={stats[2]}/>
      </ProgressBar>
    );
  }
}

export default StatsProgress;
StatsProgress.protoType={
  stats: PropTypes.array.isRequired
}