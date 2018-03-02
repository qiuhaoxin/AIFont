import React,{Component} from 'react';
import {Input,Select,Form,Card,Modal,Divider,Button,Row,Col} from 'antd';
import Utitlity from '../../utils/utils';
import Styles from './scene.less';
import StandardTable from '../../components/StandardTable';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';

const FormItem=Form.Item;
const {TextArea}=Input;
const {Option}=Select;
@connect(state=>({
	scene:state.scene
}))
@Form.create()
export default class Scene extends Component{
     constructor(props){
     	 super(props);
     }
     state={
        modalVisible:false,
        modalTitle:'',
        modalType:0,// 0新增 1.编辑
        FDesc:'',
        selectDefault:0,//启动意图
        sceneID:0

     }
     componentDidMount(){
         const {dispatch}=this.props;
         dispatch({
         	type:'scene/fetch',
         	payload:{

         	},
         	callback:function(){

         	}
         })
     }
     onDel=(id,dataItem)=>{
        const _this=this;
        const {dispatch}=this.props;
        dispatch({
        	type:'scene/delScene',
        	payload:{
        		sceneID:id
        	},
        	callback:function(){

        	}
        })
     }
     clearModal=()=>{
     	this.setState({
     		FDesc:'',
     		selectDefault:0,
     		modalVisible:false
     	})
     }
     onEdit=(id,dataItem)=>{
     	const _this=this;
        const {dispatch}=this.props;
        console.log("eidt");
        dispatch({
        	type:'scene/fetchIntention',
        	payload:{
        		sceneId:id
        	},
        	callback:function(){
        		_this.setState({
                   modalVisible:true,
                   modalTitle:'编辑场景',
                   modalType:1,
                   selectDefault:dataItem['intention'] && dataItem['intention']['fid'],
                   FDesc:dataItem['desc'],
                   sceneID:id
        		})
        	}
        })
     }
     onDistribute=(id,dataItem)=>{
        const {dispatch}=this.props;

        dispatch(routerRedux.push("/AIConfig/sceneIntention/"+id+"/"+dataItem['desc']))
     }
     handleMenuAction=(e,id)=>{
        const action=e.target.innerText;
        const {scene:{data}}=this.props;
        let dataItem=data.list.filter(item=>item.id==id);
        dataItem=dataItem[0];
        console.log("dataItem is "+JSON.stringify(dataItem));
        switch(action){
        	case "编辑":
               this.onEdit(id,dataItem);
        	break;
        	case "场景意图分配":
                this.onDistribute(id,dataItem);
        	break;
        	case "删除":
                this.onDel(id,dataItem);
        	break;
        }
     }
     handleNewScene=()=>{
        this.setState({
        	modalVisible:true,
        	modalTitle:'新增场景',
        	modalType:0
        })
     }
     handleModalOK=()=>{
     	const _this=this;
     	const {FDesc,selectDefault,sceneID}=this.state;
     	const {dispatch}=this.props;
     	let params={FDesc,selectDefault};
     	params['id']=sceneID;
     	console.log("params is "+JSON.stringify(params));
        dispatch({
        	type:'scene/addOrUpdate',
        	payload:params,
        	callback:function(){
                _this.clearModal();
        	}
        })

     }
     handleModalCancel=()=>{
        this.clearModal();
     }
     handleInput=(e,key)=>{
         this.setState({
         	[key]:e.target.value
         })
     }
     renderIntentionSelect=()=>{
        let {scene:{data:{intentionList}}}=this.props;
        const {modalType}=this.state;
        if(intentionList==undefined||modalType==0){
        	intentionList=[];
        }
        return (
            <Select style={{width:'200px'}} value={this.state.modalType==0?'':this.state.selectDefault}>
               {
               	  intentionList.map(item=>(<Option key={item.intention.fid} value={item.intention.fid}>{item.intention.fname}</Option>))
               }
            </Select>
        )
     }
     render(){
     	const columns=[
            {
            	title:'FID',
            	dataIndex:'id'
            },
            {
            	title:'场景描述',
            	dataIndex:'desc'
            },
            {
            	title:'启动意图',
                dataIndex:'intention.fname'
            },
            {
            	title:'操作',
            	dataIndex:'action',
            	render:(text,record)=>{
            		return (
                    <div onClick={(e)=>this.handleMenuAction(e,record.id)}>
                        <a href="javascript:void(0)">编辑</a>
                        <Divider type="vertical"/>
                        <a href="javascript:void(0)" key="distribute">场景意图分配</a>
                        <Divider type='vertical'/>
                        <a href="javascript:void(0)" key='del'>删除</a>                        
                    </div>
                	)
            	}
            }
     	]
     	const {scene:{data,loading}}=this.props;
        const {modalVisible,modalTitle,FDesc}=this.state;
     	return (
           <Card bordered={false}>
              <Row style={{marginBottom:'20px'}}>
                 <Col>
                     <Button type="primary" onClick={this.handleNewScene}>新建</Button>
                 </Col>
              </Row>
              <StandardTable
                  columns={columns}
                  data={data}
              >

              </StandardTable>
              <Modal
                  visible={modalVisible}
                  title={modalTitle}
                  onOk={this.handleModalOK}
                  onCancel={this.handleModalCancel}
              >
                 <Form layout='inline'>
                      <Row>
                         <Col span={24}>
                             <FormItem
                               label="场景描述"
                             >
                             <TextArea placeholder="请输入" rows={2} style={{width:'300px'}} value={FDesc} onChange={(e)=>this.handleInput(e,'FDesc')}/>
                             </FormItem>
                         </Col>
                      </Row>
                      <Row style={{marginTop:'20px'}}>
                        <Col>
                            <FormItem
                               label="启动意图"
                            >
                              {
                                 this.renderIntentionSelect()
                              }
                            </FormItem>
                        </Col> 
                      </Row>
                 </Form>
              </Modal>
           </Card>
     	)
     }
}