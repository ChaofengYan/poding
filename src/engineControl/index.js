import { Modal } from 'antd';

//组件ref句柄
let compsHandles={};
let globalCache = {};  //全局状态存储

export default {
  //注册组件
  registerRefs:(refKey,el)=>{
    compsHandles[refKey] = el;
  },

  //对外提供的引擎方法
  actions:{
    setState:(refKey,key,value)=>{
      compsHandles[refKey]&&compsHandles[refKey].changeState(key,value);
    },
    redirect:(href)=>{
      window.location.href = href;
    },
    ajax:(option)=>{
      return $.ajax(option).then(result=>{
        if(typeof result=='string') result = JSON.parse(result);
        return result;
      });
    },
    modal:()=>{
      
    },
    tip:()=>{  //各种类型的信息提示，只提供一个按钮用于关闭
      Modal.success({
        title: 'This is a success message',
        content: '成功',
      });
    },
    setGlobal:(key,value)=>{
      globalCache[key] = value;
    },
    getGlobal:(key)=>{
      return globalCache[key];
    }
  }
}