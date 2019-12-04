import React from 'react';
import axios from 'axios';
import './TerminalOutput.css';

class TerminalOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "",
    };
    this.getOutput = this.getOutput.bind(this);
  }
  getOutput() {
    const request = axios({
      method: 'GET',
      url: this.props.specs.cdriveUrl + "app/" + this.props.specs.username + "/glm-numerical-model/api/output/"
    });
    request.then(
      response => {
        this.setState({output: response.data});
      },
    );
  }
  render() {
    var loading = (
      <div className="size-hundred">
        <div className="size-hundred flex-div">
          <div className="spinner-border colored-display m-auto" style={{width: "100px", height: "100px"}} role="status">
            <span className="sr-only"></span>
          </div>
        </div>
        <div className="colored-display large-font text-center m-auto">Simulating General Lake Model... </div>
      </div>
    );
    if(this.props.isExecuting) {
      return (loading);
    } else if (this.state.output === ""){
      this.getOutput();
      return (null);
    } else {
      let lines;
      lines = this.state.output.split("\n").map((line, key) => 
        <span key={key}>  {line}<br /></span>
      );
      return(
        <div className="size-hundred" >
          <div className="terminal-output">
            {lines}
          </div>
          <div className="navigation-options">
            <button className="btn btn-primary btn-lg" onClick={this.props.primaryFn} >
              {this.props.primaryBtn}
            </button>
            <button className="btn btn-secondary btn-lg ml-5" onClick={this.props.secondaryFn} >
              {this.props.secondaryBtn}
            </button>
          </div>
        </div>
      );
    }
  }
}

export default TerminalOutput;
