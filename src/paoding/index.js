import { DOM, createElement,Component } from 'react';
import HOC from './hoc';

//const _componentMap = new WeakMap();
let _componentMap = null;
let _componentRefs = {};  //组件渲染后的ref
let _engineMap={};  //动态引擎

export default class ReactJsonSchema {

  parseSchema(schema) {
    let element = null;
    let elements = null;
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
    const { component, children, data={},engine,...rest } = schema;
    let Component = this.resolveComponent(schema);
    //children 支持String 
    const Children = typeof children === 'string' ? children : this.resolveComponentChildren(schema);
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
    let Component = null;
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