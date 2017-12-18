import React,{Component} from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  // get placeholder(){
  //   return <div className="builder-placeholder"></div>;
  // }

  handleDragEnter(e){
    e.preventDefault();
    e.stopPropagation();
    $(e.target).addClass('builder-layout-insert');
  }

  handleDragOver(e){
    e.preventDefault();
    e.stopPropagation();
    console.log('over');
    $(e.target).addClass('builder-layout-insert');
  }

  handleDragLeave(e){
    e.preventDefault();
    e.stopPropagation();
    $(e.target).removeClass('builder-layout-insert');
  }

  handleDrop(e){
    e.preventDefault();
    e.stopPropagation();
    //e.dataTransfer.getData("schema");
    
    // addSchema(reactSchema.children,{
    //   key:'h1test',
    //   type:'layout',
    //   component:'layout01',
    //   selectable:true,
    //   data:{
    //     id:'345'
    //   },
    //   children:'组件2'
    // });
    // window.UPDATE_REACT_SCHEMA(reactSchema);
    $(e.target).removeClass('builder-layout-insert');
  }

  render() {
    const {children=[]} = this.props;
    const placeholder = <div className="builder-placeholder"></div>;
    let elements = [];
    for(let child of children){
      elements.push(child);
      elements.push(placeholder);
    }
    return (
      <div 
        className="builder-drop-container" 

        >
        {placeholder}
        {
          elements.length==0?
          <div className="builder-empty">请从右侧拖入内容</div>
          :elements
        }
      </div>
    )
  }
}
