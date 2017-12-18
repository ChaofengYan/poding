export default {
  type:'page',
  key:'000',
  component:'page',
  children:[{
    key:'H1test',
    type:'row',  //page,row,placehold,content
    component:'layout01',
    selectable:true,
    engine:'engine01',
    childrenDeleteable:false,
    children:[{
      key:'cot1'
      type:'placehold',
      component:'placehold'
    },{
      key:'cot1'
      type:'placehold',
      component:'placehold'
    }]
  }
  // ,{
  //   key:'modal01',
  //   type:'layout',
  //   title:'弹窗组件',
  //   component:'Modal',
  //   refer:['referred']
  // },{
  //   key:'referred',
  //   type:'layout',
  //   component:'div',
  //   children:'我是被引用的',
  //   referred:true
  // }
]
};