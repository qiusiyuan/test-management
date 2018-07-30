import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Button} from 'react-bootstrap';
import './expandListItem.css';
const helper = require('../../helper/helper');

class ExpandListItem extends Component{
  constructor(){
    super();
    this.state = {
      expand: false
    }
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand(){
    this.setState({
      expand: !this.state.expand,
    });
  }
  render(){
    var test = this.props.test;
    let that = this;
    var displayClass = this.state.expand? "showRow": "hideRow"
    return (
      <div>
      {
      // return(<p> kk </p>)
      helper.isGroup(test)? 
          <ListGroup style={{'marginLeft':'10px', 'marginBottom':'0px'}}>
            <ListGroupItem id={test.name}> <a onClick={that.toggleExpand}>
                {that.state.expand ?
                  <i className="fa fa-chevron-down" aria-hidden="true"></i>
                  : <i className="fa fa-chevron-right" aria-hidden="true"></i>
                }
              </a> &nbsp; {test.name} <Button disabled style={buttonStyle1}><i className="fa fa-plus-circle"></i> </Button></ListGroupItem>
            <ListGroup style={{'marginLeft':'10px', 'marginBottom':'0px'}} className={displayClass}>
              {test.subset.map(function(child, i){
                return (<ExpandListItem
                  test ={child}
                />);
              })}
              
            </ListGroup> 
          </ListGroup>
      :
      <ListGroupItem style={{'marginLeft':'10px'}}> 
          {test.name} 
          <Button disabled style={buttonStyle2}>History </Button>
          <Button disabled style={buttonStyle1}>Description</Button>
      </ListGroupItem> 
      }
    </div>
  );
  }
}

var buttonStyle1 = {
  position:'absolute', 
  right:'30px',
  bottom:'3px',
  color:'skyblue'
}

var buttonStyle2 = {
  position:'absolute', 
  right:'150px',
  bottom:'3px',
  color:'skyblue'
}
export default ExpandListItem;