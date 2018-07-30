import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ListGroup, ListGroupItem, Checkbox} from 'react-bootstrap';
import '../expandListItem.css';
const helper = require('../../../helper/helper');

class ExpandListItem extends Component{
  constructor(){
    super();
    this.state = {
      expand: false,
    }
    this.toggleExpand = this.toggleExpand.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }
  toggleExpand(){
    this.setState({
      expand: !this.state.expand,
    });
  }
  handleCheck(e){
    this.props.toggleCheck(this.props.arg, e.target.checked);
  }
  render(){
    var test = this.props.test;
    let that = this;
    var displayClass = that.state.expand? "showRow": "hideRow"
    return (
      <div>
      {
      // return(<p> kk </p>)
      helper.isGroup(test)? 
          <ListGroup style={{'marginLeft':'10px', 'marginBottom':'0px'}}>
            <ListGroupItem id={test.name} style={{overflow:'auto'}}> <a onClick={that.toggleExpand}>
                {that.state.expand ?
                  <i className="fa fa-chevron-down" aria-hidden="true"></i>
                  : <i className="fa fa-chevron-right" aria-hidden="true"></i>
                }
              </a> &nbsp; {test.name} 
              <Checkbox inline style={buttonStyle1} checked={test.checked} onChange={that.handleCheck}/>
            </ListGroupItem>
            <ListGroup style={{'marginLeft':'10px', 'marginBottom':'0px'}} className={displayClass}>
              {test.subset.map(function(child, i){
                var newArg = JSON.parse(JSON.stringify(that.props.arg));
                helper.formArg(newArg, child.name);
                return (<ExpandListItem
                  test ={child}
                  toggleCheck={that.props.toggleCheck}
                  arg = {newArg}
                />);
              })}
              
            </ListGroup> 
          </ListGroup>
      :
      <div>
        <ListGroupItem style={{'marginLeft':'10px', overflow:'auto'}}> 
            {test.name}
            <Checkbox inline style={buttonStyle1} checked={test.checked} onChange={that.handleCheck}/>
        </ListGroupItem>
      </div>
      }
    </div>
  );
  }
}

var buttonStyle1 = {
  float:'right',
  marginRight:'15px',
  color:'skyblue'
}

export default ExpandListItem;

ExpandListItem.propTypes = {
  test: PropTypes.object.isRequired
};
