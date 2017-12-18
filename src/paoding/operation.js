import randomize from 'randomatic';

//所有组件的key
let componentKeys={};

function generateUniqueKey(){
  const key = randomize('a',5);
  if(componentKeys[key]) return generateUniqueKey();
  return key;
}

export function findByKey(){

}

export function collectKeys(schema){
  const {key} = schema;
  componentKeys[key] = true;
}

export function addSchema(schema,subSchema,option={}){
  const {fatherKey,brotherkey,position='after'} = option;
  if(!fatherKey) return addSubSchema(schema,subSchema,brotherkey,position);
  schema.forEach(({key,children},index)=>{
    if(key==fatherKey) return addSubSchema(schema.children,subSchema,brotherkey,position);
  });
}

/**
 * 将子级schema添加到指定父级schema下，可指定相对兄弟元素的位置
 */
export function addSubSchema(fatherSchemaChildren,childSchema,brotherkey,position='after'){
  if(!childSchema.key) {
    const newKey = generateUniqueKey();
    childSchema.key = newKey;
    componentKeys[newKey] = true;
  }
  if(!brotherkey) return fatherSchemaChildren.push(childSchema);  //添加到最后
  let index = fatherSchemaChildren.findIndex(item=>item.key==brotherkey);
  if(position=='before') index--;
  if(index<0) return fatherSchemaChildren.unshift(childSchema) //添加到最前面
  fatherSchemaChildren.splice(index,0,childSchema);
}

export function reorderSchema(schema,sourceKey,targetKey,position="after"){

}

export function deleteSchema(schema,targetKey){
  schema.forEach(({key,children},index)=>{
    if(key==targetKey) schema.splice(index,1);
    if(Array.isArray(children)) deleteSchema(children,targetKey);
  });
}

/**
 * 当前组件及其父级链
 */
export function buildChains(schema,key){
  let chainsMap={};
  const loop = (root,fatherChain=[])=>{
    const {children} = root; 
    fatherChain.push(root);  //(2017.3.5改)此处导出引用，故而不使用{...rest}
    chainsMap[root.key]=fatherChain;  
    if(Array.isArray(children)&&children.length>0){
      children.forEach((item)=>{
        loop(item,fatherChain.slice());
      });
    }
  };
  loop(schema);
  return chainsMap[key]||[];
}

export default function getComponentById(root, key) {
  const chains = buildChains(root,key),
    chainsLenght = chains.length;
  let current = chains[chainsLenght-1],
    father = chainsLenght>1?chains[chainsLenght-2]:current;
  return {current,father};
}