import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isExecuting: false,
      isComplete: false,
      inputPath: '',
      outputPath: ''
    };
    this.handleExecute = this.handleExecute.bind(this);
    this.handleInputPathChange = this.handleInputPathChange.bind(this);
    this.handleOutputPathChange = this.handleOutputPathChange.bind(this);
  }
  handleExecute(event) {
    event.preventDefault();

    this.setState({
      isExecuting: true,
      isComplete: false
    });

    const data = new FormData();
    data.append('input_path', this.state.inputPath);
    data.append('output_path', this.state.outputPath);

    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('glm_token');

    const request = axios({
      method: 'POST',
      url: window.location.protocol + "//" + window.location.hostname + window.location.pathname + "api/start-execution/",
      data: data,
      headers: {'Authorization': auth_header}
    });

    request.then(
      response => {
        this.setState({
          isExecuting: false,
          isComplete: true
        });
      },
    );
  }
  handleInputPathChange(event) {
    this.setState({inputPath: event.target.value});
  }
  handleOutputPathChange(event) {
    this.setState({outputPath: event.target.value});
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
    var redirect_uri = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
    if (code == null) {
      const request = axios({
        method: 'GET',
        url: redirect_uri + "api/client-id/"
      });
      request.then(
        response => {
          var client_id = response.data.client_id;
          window.location.href = "https://authentication.columbusecosystem.com/o/authorize/?response_type=code&client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&state=1234xyz";
        },
      );
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
  render() {
    if (!this.state.isLoggedIn) {
      this.authenticateUser();
      return(null);
    } else {
      let executeButton;
      if(this.state.isExecuting) {
        executeButton = <button className="btn btn-lg btn-primary btn-block" type="submit" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>;
      } else {
        executeButton = <button className="btn btn-lg btn-primary btn-block" type="submit">Simulate Model</button>;
      }
      let cdriveLink;
      if(this.state.isComplete) {
        cdriveLink = 
          <div className="h5 mt-3 font-weight-normal" >
            Done! <a href="https://cdrive.columbusecosystem.com"> View in CDrive</a>
          </div> ;
      } else {
      }
      return (
        <div className="app-container">
          <form className="form-upload" onSubmit={this.handleExecute}>
            <h1 className="h3 mb-3 font-weight-normal">GLM Model Simulator</h1>
            <input type="text" className="form-control" placeholder="Enter CDrive path to input folder" 
              value={this.state.inputPath} onChange={this.handleInputPathChange} required autofocus>
            </input>
            <br />
            <input type="text" className="form-control" placeholder="Enter CDrive Path to output folder" 
              value={this.state.outputPath} onChange={this.handleOutputPathChange} required>
            </input>
            <br />
            {executeButton}
            {cdriveLink}
          </form>
        </div>
      );
    }
  }
}

export default App;
