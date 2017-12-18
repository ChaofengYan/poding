import { DOM, createElement,Component } from 'react';

import HOC from './hoc';
import {reduceSchema} from './reducer';
import {collectKeys} from './operation';

//const _componentMap = new WeakMap();
let _componentMap = null;
let _engineMap={};  //动态引擎
let _componentReferred = {}; //被引用的组件们

export default class ReactJsonSchema {
  isPreAnalysised = false;  //分析过被引用组件

  //预分析：被引用项，并为每个schema生成随机key
  preAnalyse(schema){
    let _keys={};
    if(this.isPreAnalysised) return;
    reduceSchema(schema,(_schema)=>{
      const {key,referred} = _schema;
      collectKeys(_schema);
      if(!referred) return;  
      _componentReferred[key] = {..._schema,referred:false};
    });
    this.isPreAnalysised = true;
  }

  parseSchema(schema) {
    let element = null;
    let elements = null;
    this.preAnalyse(schema);
    if (Array.isArray(schema)) {
      elements = this.parseSubSchemas(schema);
    } else if (schema) {
      element = this.createComponent(schema);
    }
    return element || elements;
  }

  parseSubSchemas(subSchemas = []) {
    const Components = [];
    let index = 0;
    for (const subSchema of subSchemas) {
      subSchema.key = typeof subSchema.key !== 'undefined' ? subSchema.key : index;
      Components.push(this.parseSchema(subSchema));
      index++;
    }
    return Components;
  }

  createComponent(schema) {
    const { component, children, data={},refer,referred,engine,...rest } = schema;
    if(referred) return ()=>null; //被引用组件不单独渲染
    let Component = this.resolveComponent(schema);
    //解析children 
    let Children;
    let refers = typeof refer=='string'?[refer]:refer;
    if(Array.isArray(refers)){  //refer优先级高
      Children = this.parseSchema(refers.map((_refer)=> _componentReferred[_refer]));
    }else{
      Children = typeof children === 'string' ? children : this.resolveComponentChildren(schema);
    }
    //执行HOC
    Component = HOC({
      WrapComponent:this.wrapComponent,
      WrappedComponent:Component,
      schema,
      registerRefs:this.registerRefs
    });
    //添加引擎执行
    if(engine&&_engineMap[engine]) data[this.engineInitName] = _engineMap[engine];
    return createElement(Component, data, Children);
  }

  resolveComponent(schema) {
    const {component} = schema;
    let Component = ()=><div>{component}</div>;  //默认打印component
    if (schema.hasOwnProperty('component')) {
      if (schema.component === Object(schema.component)) {
        //已是React元素
        Component = schema.component;
      } else if (_componentMap && _componentMap[schema.component]) {
        //React组件
        Component = _componentMap[schema.component];
      } else if (DOM.hasOwnProperty(schema.component)) {
        //原生DOM元素
        Component = schema.component;
      }
    } else {
      throw new Error('ReactJsonSchema could not resolve a component due to a missing component attribute in the schema.');
    }
    return Component;
  }

  resolveComponentChildren(schema) {
    return (schema.hasOwnProperty('children')) ?
      this.parseSchema(schema.children) : undefined;
  }

  //引擎设置
  setConfig({engineMap,componentMap,wrapComponent,engineInitName='engineInit',registerRefs}){
    if(engineMap) _engineMap = engineMap;
    if(componentMap) _componentMap = componentMap;
    this.wrapComponent = wrapComponent; //设置组件的包裹组件
    this.engineInitName = engineInitName;
    this.registerRefs = registerRefs;
  }
}