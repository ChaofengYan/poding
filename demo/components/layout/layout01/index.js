import React,{Component} from 'react';
import { Row, Col } from 'antd';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {children=[null,null]} = this.props;
    return (
      <Row>
        <Col span={12}>{children[0]||'左侧内容'}</Col>
        <Col span={12}>{children[1]||'右侧内容'}</Col>
      </Row>
    )
  }
}
