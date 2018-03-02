import React,{PureComponent} from 'react';
import {Card,Modal,Divider,Form,Row,Col,Button,Select,Input,message,List} from 'antd';
import StandardTable from '../../components/StandardTable';
import {connect} from 'dva';
import moment from 'moment';
import Styles from './dispatch.less';
import Utility from '../../utils/utils';

const FormItem=Form.Item;
const {Option}=Select;
@connect(state=>({
	distribute:state.distribute
}))
@Form.create()

export default class DispatchSys extends PureComponent{
     state={
        selectedRows:[],
        chooseSys:'',
        modalVisible:false,
        selectSystems:[],
        dispatchVisible:false,
        bizCommand:'',//业务指令
        bizCustParam:'',
        appNum:'',
        distributeTitle:'',
        bizFID:0,
        bizWordslotList:[]
     }
     componentDidMount(){
     	  const _this=this;
          const {intentionId,intentionName}=this.props.match.params;
          const {dispatch}=this.props;
          dispatch({
          	type:'distribute/fetch',
          	payload:{
          		intentionId:intentionId
          	},
          	callback:function(){
          		const {distribute:{data:{list}}}=_this.props;
          		let arr=[];
          		list.forEach(item=>{
                   arr.push(item['fbizAppId']);
          		})
          		//获取业务系统
                dispatch({
                	type:'distribute/getSysList',
                	payload:{'systemList':arr},
                	callback:function(){
                        const {distribute:{systems,eixtSys}}=_this.props;
                        console.log("systems is "+JSON.stringify(systems)+" and exit is "+JSON.stringify(eixtSys));
                        let tempArr=[],exitSystem=eixtSys['systemList'];
                        systems.map(item=>{
                           let temp={};
                           if(exitSystem.indexOf(item['fID'])>-1){
                             
                           }else{
                             temp["FName"]=item['fName'];
                             temp["FID"]=item['fID'];
                             tempArr.push(temp);
                           }
                            
                        })
                        _this.setState({
                        	selectSystems:tempArr
                        })
                	}

                })
          	}
          })
          

     }
     handleSelectRows=()=>{

     }
     handleStandardTableChange=()=>{

     }
     onDel=(fid,dataItem)=>{
        const {dispatch}=this.props;
        const {intentionId}=this.props.match.params;
        dispatch({
        	type:'distribute/del',
        	payload:{
        		bizSystmeId:fid,
        		intentionId:intentionId
        	},
        	callback:function(){

        	}
        })
     }
     onEdit=(fid,dataItem)=>{
     	const _this=this;
     	console.log("dataItem is "+JSON.stringify(dataItem));
     	const {intentionId}=this.props.match.params;
     	const {dispatch}=this.props;
         this.setState({
         	dispatchVisible:true,
         	distributeTitle:'编辑意图分配',
         	bizFID:dataItem['fid'],
         	chooseSys:dataItem['bizSystem']['fName'],
         	bizCommand:dataItem['fbizCommand'],
         	bizCustParam:dataItem['fbizCustParam'],
         	appNum:dataItem['fappNum']
         })
     }
     onDispatch=(fid,dataItem)=>{
        const _this=this;
        const {dispatch}=this.props;
        const {intentionId}=this.props.match.params;
        dispatch({
        	type:'distribute/fetchBizWordslot',
        	payload:{
               bizIntentionId:dataItem['fid'],
               intentionID:intentionId
        	},
        	callback:function(){
                const {distribute:{wordslotData}}=_this.props;
                console.log("wordslotData4 is "+JSON.stringify(wordslotData));
                _this.setState({
                	modalVisible:true,
                	bizWordslotList:wordslotData.list
                })
        	}

        })
     }
     handleMenuAction=(e,fid)=>{
         const action=e.target.innerText;
         const {distribute:{data:{list}}}=this.props;
         let dataItem=list.filter(item=>item.fid==fid);
        // console.log("dataItem is "+JSON.stringify(dataItem));
         dataItem=dataItem[0];
         switch(action){
         	case "编辑":
            this.onEdit(fid,dataItem);
         	break;
         	case "删除":
            this.onDel(fid,dataItem);
         	break;
         	case "分配词槽":
            this.onDispatch(fid,dataItem);
         	break;
         }
         
     }
     handleNew=()=>{
         this.setState({
         	dispatchVisible:true,
         	distributeTitle:'新增意图分配',
         	bizFID:0
         })
     }
     renderSelect=()=>{
     	const {chooseSys,selectSystems}=this.state;
     	return (
           <Select placeholder="请选择" style={{width:'120px'}} value={chooseSys} onChange={this.handleStatusSelectChange}>
               {
               	  selectSystems.map(item=><Option key={item.FID} value={item.FID}>{item.FName}</Option>)
               }
           </Select>
     	)
     }
     handleStatusSelectChange=(value)=>{
         this.setState({
         	chooseSys:value
         })
     }
     handleModalSure=()=>{
         const {bizWordslotList}=this.state;
         console.log("bizWordslotList is "+JSON.stringify(bizWordslotList));
         console.log("bizFID is "+this.state.bizFID);
         this.setState({
         	modalVisible:false
         })

     }
     handleModalCancel=()=>{
         this.setState({
         	modalVisible:false
         })
     }
     handleInput=(e,key)=>{
         this.setState({
         	[key]:e.target.value
         })
     }
     clearDispatch=()=>{
     	this.setState({
        	dispatchVisible:false,
        	appNum:'',
        	bizCommand:'',
        	bizCustParam:'',
        	chooseSys:''
        })
     }
     //取消分配
     handleCancelDispatch=()=>{
         this.clearDispatch();
     }
     verify=()=>{
     	const {appNum,bizCommand,bizCustParam,chooseSys}=this.state;
        if(Utility.isEmpty(appNum)){
        	message.error("应用编号不能为空!");
        	return false;
        }
        if(Utility.isEmpty(bizCommand)){
        	message.error("业务指令不能为空!");
        	return false;
        }
        return true;
     }
     handleNewDispatch=()=>{
     	const _this=this;
        const {dispatch}=this.props;
        const {intentionId}=this.props.match.params;
        const {appNum,bizCommand,bizCustParam,chooseSys,bizFID}=this.state;
        console.log("chooseSys is "+chooseSys);
        if(this.verify()){
	        const params={
	        	appNum:appNum,
	        	bizAppId:chooseSys,
	        	bizCommand:bizCommand,
	        	bizCustParam:bizCustParam,
	        	fid:bizFID,
	        	intentionId:intentionId
	        }
	        dispatch({
	        	type:'distribute/addOrUpdateBiz',
	        	payload:params,
	        	callback:function(){
	                _this.clearDispatch();
	        	}
	        })
        }

     }
     handleDirective=(e,fid)=>{
         let {distribute:{wordslotData}}=this.props;
         wordslotData.list.map(item=>{
         	if(item.fid==fid){
         		//item.fparamName=e.target.value;
         		 item['bizWordslot']['fparamName']=e.target.value;
         	}
         })
         let temp=wordslotData.list;
         temp=temp.filter(item=>{
            return item.fid!=0;
         })
         this.setState({
            bizWordslotList:temp
         })
     }
     render(){
     	const columns=[           
     	    {
               title:'系统名称',
               dataIndex:'bizSystem.fName',
           },
           {
               title:'系统编码',
               dataIndex:'bizSystem.fNumber',

           },
           {
               title:'系统类型',
               dataIndex:'bizSystem.fProdType',
           },
           {
               title:'业务指令',
               dataIndex:'fbizCommand',
           },
           {
               title:'业务自定义参数',
               dataIndex:'fbizCustParam',

           },
           {
               title:'分配时间',
               dataIndex:'fcreateTime',
               render:val=><span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
           },
           {
           	    title:'操作',
           	    dataIndex:'action',
           	    render:(text, record)=>{
                  return(       
                    <div onClick={(e)=>this.handleMenuAction(e,record.fid)}>
                        <a href="javascript:void(0)">编辑</a>
                        <Divider type='vertical'/>
                        <a href="javascript:void(0)" key='del'>删除</a>
                        <Divider type="vertical"/>
                        <a href="javascript:void(0)">分配词槽</a>
                    </div>
                )}
           }
        ]
     	const {distribute:{data,loading,wordslotData:{list}}}=this.props;
     	const {selectedRows,system,modalVisible,dispatchVisible,bizCommand,bizCustParam,appNum,distributeTitle,bizWordslotList}=this.state;
     	return (
           <Card bordered={false} title="意图分配">
                <Form layout='inline'>
                  <Row style={{marginBottom:'20px'}}>
                   <Col span={12}>
                      <Button onClick={this.handleNew} style={{marginLeft:'20px'}} type='primary'>分配</Button>
                   </Col>
                  </Row>
                </Form>
                <StandardTable
                  selectedRows={selectedRows}
	              loading={loading}
	              data={data}
	              onSelectRow={this.handleSelectRows}
	              onChange={this.handleStandardTableChange}
	              columns={columns}
                >

                </StandardTable>
            <Modal
              visible={modalVisible}
              title="分配词槽"
              onOk={this.handleModalSure}
              onCancel={this.handleModalCancel}
            >
                <List
                     dataSource={bizWordslotList}
                     header={ 
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col span={4}>
                                      FID
                                </Col>
                                <Col span={10}>
                                     词槽名称
                                </Col>
                                <Col span={10}>
                                     业务参数
                                </Col>
                            </Row>}
                     renderItem={(item)=>{
                        return (
                           <List.Item>
                              <Form layout="inline" style={{width:'100%'}}>
                                 <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                 <Col span={4}>
                                     {item.fid}
                                 </Col>
                                  <Col span={10}>
                                     {item.fname}
                                  </Col>
                                  <Col span={10}>
                                     <div style={{width:'100%'}}>
                                         <Input value={item.bizWordslot && item.bizWordslot.fparamName}  onChange={(e)=>this.handleDirective(e,item.fid)} />
                                     </div>
                                  
                                  </Col>

                                 </Row>
                              </Form>
                           </List.Item>
                        )
                     }
                   }
                   >

                </List>
           </Modal>
           <Modal
               visible={dispatchVisible}
               title={distributeTitle}
               className={Styles.disptachModal}
               onOk={this.handleNewDispatch}
               onCancel={this.handleCancelDispatch}
           >
            <Form layout='inline'>
              <Row>
                 <Col span={12}>
                    <FormItem
                       label="业务系统"
                    >
                        {this.renderSelect()}
                    </FormItem>
                 </Col>
                 <Col span={12}>
                    <FormItem
                       label="业务指令"
                    >
                        <Input placeholder="请输入" onChange={(e)=>this.handleInput(e,'bizCommand')} value={bizCommand} />
                    </FormItem>
                 </Col>
              </Row>
              <Row style={{marginTop:'18px'}}>
                 <Col span={12}>
                    <FormItem
                       label="应用编码"
                    >
                        <Input placeholder="请输入" onChange={(e)=>this.handleInput(e,'appNum')} value={appNum} />    
                    </FormItem>
                 </Col>
                 <Col span={12}>
                    <FormItem
                       label="业务自定义参数"
                    >
                        <Input placeholder="请输入" onChange={(e)=>this.handleInput(e,'bizCustParam')} value={bizCustParam} />
                    </FormItem>
                 </Col>
              </Row>
            </Form>  
           </Modal>
           </Card>
     	)
     }
}