import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import React,{ DOM, createElement,Component } from 'react';
import {Modal} from 'antd';

window.React = React;
window.ReactDOM = ReactDOM;

import 'antd/dist/antd.css'; 
import './css/index.less';

class App extends Component {
  constructor(props) {
    super(props);
  }

  handleDragStart(type,e){
    //e.dataTransfer.setData("Text",e.target.id);
  }

  render() {
    return (
      <div>
        <div className="box" draggable onDragStart={::this.handleDragStart}>布局</div>
        <div className="box" draggable>内容</div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));