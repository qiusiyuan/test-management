import { Button, Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import React, {  Component } from 'react';
import PropTypes from 'prop-types';
import './expandListItem.css';

class OwnerControl extends Component{
  constructor(props){
    super(props);
    this.state = {
      expand:false,
      owner:'',
    }
    this.toggleExpand = this.toggleExpand.bind(this);
    this.updateButton = this.updateButton.bind(this);
    this.changeOwnerText = this.changeOwnerText.bind(this);
  }
  componentDidMount(){
    this.setState({
      owner: this.props.owner,
    });
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      owner: nextProps.owner,
    });
  }
  toggleExpand(){
    this.setState({
      expand: !this.state.expand,
      owner: this.props.owner,
    });
  }
  updateButton(){
    var newOwner = this.state.owner;
    this.props.updateOwner(newOwner);
    this.toggleExpand();
  }
  changeOwnerText(e){
    this.setState({
      owner: e.target.value,
    })
  }
  render(){
    let that = this;
    var displayClass = that.state.expand? "showRow": "hideRow"
    return(
      <Form inline>
        <FormGroup controlId="formInlineName">
          <ControlLabel><a onClick={that.toggleExpand}>Owner</a></ControlLabel>{' '}
          <FormControl type="text" style={{width:'100px'}} disabled={!this.state.expand} placeholder="" value={this.state.owner} onChange={e=>this.changeOwnerText(e)}/>
        </FormGroup>{' '}
        <div id='ownerUpdateButton' className={displayClass} style={{float:'right'}}>
          <Button onClick={that.updateButton}> update</Button>
        </div>
      </Form>
    );
  }
}

export default OwnerControl;

OwnerControl.propTypes = {
  owner: PropTypes.string.isRequired,
  updateOwner: PropTypes.func.isRequired,
};

