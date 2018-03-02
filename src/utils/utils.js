//公共方法

const MD5=require('md5.js');
export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

class Utility{
    constructor(){

    }
}
Utility.isEmpty=function(str){
    const emptyReg=/^\s*$/;
  if(emptyReg.test(str)){
    return true;
  }
  return false;
}
Utility.exchange=function(source,target,key){
    const temp=source[key];
    source[key]=target[key];
    target[key]=temp;
    
}
Utility.MD5=function(msg) {
  // body...
  var md5stream=new MD5();
  const afterMd5=md5stream.update(msg).digest('hex');
  return afterMd5;

}
//获取数组的最大ID+1 返回
Utility.FilterMaxId=function(list,columnName){
    const temp=list && list[list.length-1];
    if(temp==undefined)return 1;
    if(columnName in temp)
      return parseInt(temp[columnName])+1;
    return 1;
}
export default Utility;