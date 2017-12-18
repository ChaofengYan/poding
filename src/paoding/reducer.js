/**
 * 遍历整个Schema，不做更改
 * 
 * @param {*} schema 
 * @param {*} reducer 
 */
export function reduceSchema(schema,reducer){
  if (!schema) return;
  if(Array.isArray(schema)){
    schema.forEach(item=>reducer(item));
  }else{
    reducer(schema)
  }
  Array.isArray(schema.children) && schema.children.forEach((item) => {
    reduceSchema(item, reducer);
  });
}


/**
 * 属性注入或替换
 * 
 * @param {Object} schema [description]
 * @param {Object/Function} asserts [需要注入的对象，可以为函数，但必须返回Object]
 * @param {Object/Function} isReplace []
 * @return {[type]} null []
 */
export function addAssertsToAllSchema(schema, asserts, isReplace) {
  if (!schema) return;
  let _asserts = asserts;
  if (typeof asserts == 'function') _asserts = asserts(schema) || schema;
  if (typeof _asserts == 'object') {
    Array.isArray(schema.children) && schema.children.forEach((item) => {
      addAssertsToAllSchema(item, asserts, isReplace);
    });
    if (isReplace) {
      schema = _asserts;
    } else {
      $.extend(schema, _asserts);
    }
  } else {
    throw new Error('asserts should be Object type or a function return an object.');
  }
}

/**
 * 属性过滤
 * 
 * @param {Object} schema  [description]
 * @param {String/RegExp/Array} asserts [需要删除的属性]
 * @return {[type]} null []
 */
export function filterAssertsToAllSchema(schema, asserts) {
  if (!schema) return;
  if (typeof asserts == 'string') { //字符串
    Object.keys(schema).forEach((item) => {
      if (item == asserts) delete schema[item];
    });
  } else if (asserts instanceof RegExp) { //正则表达式
    Object.keys(schema).forEach((item) => {
      if (asserts.test(item)) delete schema[item];
    });
  } else if (Array.isArray(asserts)) { //数组
    Object.keys(schema).forEach((item) => {
      if (asserts.indexOf(item) > -1) delete schema[item];
    });
  }

  Array.isArray(schema.children) && schema.children.forEach((item) => {
    filterAssertsToAllSchema(item, asserts);
  });
}

/**
 * 过滤系统属性
 * 
 * @param  {[type]} schema [description]
 * @return {[type]}        [description]
 */
export function filterSystemAsserts(schema) {
  return filterAssertsToAllSchema(schema, /^_(\S)+_$/);
}