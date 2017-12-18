import React,{Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';

import Poding from '../src/paoding/';
import {reduceSchema} from '../src/paoding/reducer';
import {addSchema} from '../src/paoding/operation';
import {registerRefs,actions} from '../src/engineControl/';

import page from './components/page/';
import container from './components/container/';
import layout01 from './components/layout/layout01/';
import H1 from './components/content/h1/';

import {Modal} from 'antd';

import 'antd/dist/antd.css'; 
import './css/iframe.less';

import reactSchema from './schema/';

const contactForm = new Poding();

//分析schema所需要的组件和引擎列表
let engines=[],components=[];
reduceSchema(reactSchema,({engine,component})=>{
  components.push(component);
  if(engine) engines.push(engine);
});
console.log('所需components',components);
console.log('所需engines',engines);

const WrapComponent = ({children,...schema})=>{
  const onDragEnter = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    $(e.target).addClass('builder-layout-insert');
  };
  const onDragOver = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    console.log('over');
    $(e.target).addClass('builder-layout-insert');
  };
  const onDragLeave = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    $(e.target).removeClass('builder-layout-insert');
  };
  const onDrop = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    //e.dataTransfer.getData("schema");
    
    addSchema(reactSchema.children,{
      key:'h1test',
      type:'layout',
      component:'layout01',
      selectable:true,
      data:{
        id:'345'
      },
      children:'组件2'
    });
    window.UPDATE_REACT_SCHEMA(reactSchema);

    $(e.target).removeClass('builder-layout-insert');
  };

  const onSelect= (e)=>{
    $('.builder-layer').removeClass('builder-layer-selected')
    $(e.target).addClass('builder-layer-selected');
  };
  if(schema.type=='page'){
    return (
    <div className='builder-layer-page' 
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onSelect}
    >
    {children}
    </div>
  )
  }
  return (
    <div className='builder-layer builder-layer-selectable' 
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onSelect}
    >
      <div className="builder-layer-selector">
        <div className="builder-layer-type">{schema.component}</div>
        <div className={"builder-layer-drag "+(schema.type=='row'?"builder-layer-drag-rows":"builder-layer-drag-contents")} draggable>
            M
        </div>
        <div className="builder-layer-controls builder-layer-controls-contents">
          Trash
        </div>
      </div>
      <div dangerouslySetInnerHTML={{
        __html:ReactDOMServer.renderToString(children)
      }}></div>
    </div>
  )
};

contactForm.setConfig({
  componentMap:{
    page,H1,Modal,layout01,container,
    DIV:(props)=><div {...props}></div>
  },
  wrapComponent:WrapComponent,
  // engineMap:{
  //   engine01:async function(){  //由外部提供
  //     console.log('engine01');
  //     setGlobal('test',1);
  //     const {code,data} = await ajax({url:'/api/test'});
  //     if(code==200){
  //       tip();
  //       setState('h1test','id','123');
  //       setState('modal01','visible',true);
  //     }
  //   }
  // },
  //registerRefs,  //数据流控制引擎的注册句柄，会切断默认的数据流
  //engineInitName:'engineInit',  //统一引擎启动函数,默认为engineInit
});

class App extends Component {
  state={reactSchema,selectedKey:''};

  componentDidMount(){
    window.UPDATE_REACT_SCHEMA = this.updateState.bind(this);
  }

  updateState(reactSchema){ 
    window.ReactSchema = $.extend(true,{},reactSchema); //保存原数据
    this.setState({reactSchema});
  }

  render() {
    return contactForm.parseSchema(this.state.reactSchema)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));