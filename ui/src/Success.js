import React from 'react';

class Success extends React.Component {
  render() {
    return (
      <div className="size-hundred">
        <div className="large-font text-center m-auto">
          GLM Simulation output has been saved to CDrive! 
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

export default Success;

