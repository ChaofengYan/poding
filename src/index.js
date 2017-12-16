import ReactDOM from 'react-dom';
import React,{ DOM, createElement,Component } from 'react';

import Poding from './paoding/';
import {registerRefs,actions} from './engineControl/';

import schema from './demo/';
import H1 from './components/h1/';

const contactForm = new Poding();
const {setGlobal,getGlobal,setState,ajax,tip} = actions;

import 'antd/dist/antd.css'; 

const WrapComponent = ({children,...schema})=>{
  return (
    <div className='01'>
      <h1>{schema.title}</h1>
      {children}
    </div>
  )
};

contactForm.setConfig({
  componentMap:{
    H1,
    DIV:(props)=><div {...props}></div>
  },
  wrapComponent:WrapComponent,
  engineMap:{
    engine01:async function(){  //由外部提供
      console.log('engine01');
      setGlobal('test',1);
      const {code,data} = await ajax({url:'/api/test'});
      if(code==200){
        tip();
        setState('h1test','id','123');
      }
    }
  },
  registerRefs,  //数据流控制引擎的注册句柄，会切断默认的数据流
  engineInitName:'engineInit',  //统一引擎启动函数,默认为engineInit
});

ReactDOM.render(contactForm.parseSchema(schema), document.getElementById('app'));