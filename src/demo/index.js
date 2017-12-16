export default {
  key:'sdf012sdf',
  type:'',  //page,layout,element
  'component': 'DIV',
  'title': 'title: 外部引擎演示',
  data:{
    id:'123',
    className:'test',
  },
  children:[{
    key:'H1test',
    component:'H1',
    engine:'engine01'
  },{
    key:'h1test',
    component:'h1',
    data:{
      id:'345'
    },
    children:'组件2'
  }
] 
};