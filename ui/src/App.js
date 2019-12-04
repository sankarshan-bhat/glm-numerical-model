import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import CDrivePathSelector from './CDrivePathSelector.js';
import TerminalOutput from './TerminalOutput.js';
import Success from './Success.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      activeStepIndex: 0,
      inputPath: "",
      outputPath: "",
      isExecuting: false,
      specs: {}
    };
    this.getSpecs = this.getSpecs.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.onInputSelect = this.onInputSelect.bind(this);
    this.onOutputSelect = this.onOutputSelect.bind(this);
    this.backToCDrive = this.backToCDrive.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }
  getSpecs() {
    const request = axios({
      method: 'GET',
      url: window.location.protocol + "//" + window.location.hostname + window.location.pathname + "api/specs/"
    });
    request.then(
      response => {
        this.setState({specs: response.data});
      },
    );
  }
  authenticateUser() {
    const cookies = new Cookies();
    var columbus_token = cookies.get('glm_token');
    if (columbus_token !== undefined) {
      this.setState({isLoggedIn: true});
      return(null);
    }
    var url_string = window.location.href;
    var url = new URL(url_string);
    var code = url.searchParams.get("code");
    var redirect_uri = this.state.specs.cdriveUrl + "app/" + this.state.specs.username + "/glm-numerical-model/";
    if (code == null) {
      window.location.href = this.state.specs.authUrl + "o/authorize/?response_type=code&client_id=" + this.state.specs.clientId + "&redirect_uri=" + redirect_uri + "&state=1234xyz";
    } else {
      const request = axios({
        method: 'POST',
        url: redirect_uri + "api/authentication-token/",
        data: {
          code: code,
          redirect_uri: redirect_uri
        }
      });
      request.then(
        response => {
          cookies.set('glm_token', response.data.access_token);
          this.setState({isLoggedIn: true});
        },
        err => {
        }
      );
    }
  }
  onInputSelect(path) {
    const data = new FormData();
    data.append('input_path', path);
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('glm_token');
    this.setState({
      isExecuting: true,
      activeStepIndex: this.state.activeStepIndex + 1
    });
    const request = axios({
      method: 'POST',
      url: this.state.specs.cdriveUrl + "app/" + this.state.specs.username + "/glm-numerical-model/api/execute/",
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({
          isExecuting: false
        });
      },
    );
  }
  onOutputSelect(path) {
    const data = new FormData();
    data.append('output_path', path);
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('glm_token');
    const request = axios({
      method: 'POST',
      url: this.state.specs.cdriveUrl + "app/" + this.state.specs.username + "/glm-numerical-model/api/save/",
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({activeStepIndex: this.state.activeStepIndex + 1});
      },
    );
  }
  backToCDrive() {
    window.location.href = this.state.specs.cdriveUrl;
  }
  nextStep() {
    this.setState({activeStepIndex: this.state.activeStepIndex + 1});
  }
  previousStep() {
    this.setState({activeStepIndex: this.state.activeStepIndex - 1});
  }
  render() {
    if (Object.keys(this.state.specs).length === 0) {
      this.getSpecs();
      return(null);
    } else if (!this.state.isLoggedIn) {
      this.authenticateUser();
      return(null);
    } else {
      let component, header;
      switch(this.state.activeStepIndex) {
        case 0:
          component = (
            <CDrivePathSelector specs={this.state.specs} primaryFn={this.onInputSelect} 
              primaryBtn={"Simulate Model"} secondaryFn={this.backToCDrive} secondaryBtn={"Go back to CDrive"} />
          );
          header = (
            <h1 className="h3 mb-3 font-weight-light">Choose an {"input"} folder {"for"} GLM Simulator</h1>
          );
          break;
        case 1:
          component = (
            <TerminalOutput specs={this.state.specs} primaryFn={this.nextStep} primaryBtn={"Save output to CDrive"} 
              secondaryFn={this.previousStep} secondaryBtn={"Back"} isExecuting={this.state.isExecuting}/>
          );
          header = (
            <h1 className="h3 mb-3 font-weight-light">GLM Output</h1>
          );
          break;
        case 2:
          component = (
            <CDrivePathSelector specs={this.state.specs} primaryFn={this.onOutputSelect}
              primaryBtn={"Save to CDrive"} secondaryFn={this.previousStep} secondaryBtn={"Back"} />
          );
          header = (
            <h1 className="h3 mb-3 font-weight-light">Choose CDrive {"location for"} saving output</h1>
          );
          break;
        case 3:
          component = (
            <Success specs={this.state.specs} primaryFn={this.backToCDrive} primaryBtn={"View in CDrive"} 
              secondaryFn={this.previousStep} secondaryBtn={"Back"} />
          );
          header = (
            <h1 className="h3 mb-3 font-weight-light">Success!</h1>
          );
          break;
        default:
          component = "";
          header = "";
      }
      return (
        <div className="app-container">
          {header}
          {component}
        </div>
      );
    }
  }
}

export default App;
