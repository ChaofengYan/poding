import React,{Component} from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(){
    const {engineInit} = this.props;
    engineInit&&engineInit();
  }

  render() {
    return (
      <div>
        <button onClick={::this.handleClick}>点我更改【组件2】的id</button>
      </div>
    );
  }
}
