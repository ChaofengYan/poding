import React,{Component } from 'react';

/**
 * 高级组件HOC，两部分功能：定制外层包裹组件，定制组件状态的外部控制引擎
 */
export default ({WrappedComponent,schema,WrapComponent,registerRefs})=>{
  const {key,data,engine,title} = schema;
  
  //两个功能均未有
  if(!WrapComponent&&!registerRefs) return WrappedComponent;
  
  //仅有“包裹组件”
  if(WrapComponent&&!registerRefs){
    return (props)=>(
      <WrapComponent {...schema}>
        <WrappedComponent {...props}/>
      </WrapComponent>
    );
  }

  //其他
  class InnerComponent extends Component {
    state=data; //目前仅data会继续往下传递
    changeState(k,v){
      this.setState({[k]:v});
    }
    render() {
      const origin = <WrappedComponent {...this.props} {...this.state} />;
      if(!WrapComponent) return origin; //无“包裹组件”
      return <WrapComponent {...schema}>{origin}</WrapComponent>;
    }
  }
  return class extends Component{
    shouldComponentUpdate(nextProps) {   
      if(registerRefs) return false; //切断数据流，不再跟随父级组件props而变化
    }
    render(){
      return <InnerComponent ref={el=>registerRefs&&registerRefs(key,el)} {...this.props} />;
    }
  }
};

