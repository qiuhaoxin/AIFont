import React,{Component} from 'react';
import {connect} from 'dva';
import {Input,Button,Form,Card,Modal,Select,Divider,Row,Col,List,message} from 'antd';
import Utility from '../../utils/utils';
import Styles from './sceneIntentionRelation.less';
import StandardTable from '../../components/StandardTable';

const FormItem=Form.Item
const {Option}=Select;
@connect(state=>({
   sceneIntentionRelation:state.sceneIntentionRelation
}))
@Form.create()
export default class SceneIntentionRelation extends Component{
	state={
        modalVisible:false,
        modalTitle:'',
        srcIntentionName:'',
        destIntentionName:'',  //目标意图
        destWordslot:'',//目标词槽
        srcWordslot:'',//源词槽
        listData:[]
	}
	componentDidMount(){
		const _this=this;
        const {sceneId,srcIntentionId}=this.props.match.params;
        const {dispatch}=this.props;
        console.log("sceneId is "+sceneId+" and srcIntentionId is "+srcIntentionId);
        dispatch({
         	type:'sceneIntentionRelation/fetch',
         	payload:{
         		sceneId:sceneId,
         		srcIntentionId:srcIntentionId
         	},
         	callback:function(){
         		const {sceneIntentionRelation:{data}}=_this.props;
         		//console.log("data is "+JSON.stringify(data));
                _this.setState({
                    srcIntentionName:data.list[0]['srcIntentionName']
                })
         	}
        })
	}
    onDel=(fid,dataItem)=>{
        const {dispatch}=this.props;
        const {sceneId,srcIntentionId}=this.props.match.params;
        dispatch({
            type:'sceneIntentionRelation/del',
            payload:{
                fid,
                sceneId,
                srcIntentionId
            },
            callback(){

            }
        })
    }
    onEdit=(fid,dataItem)=>{

    }
    handleMenuAction=(e,fid)=>{
         const action=e.target.innerText;
         const {sceneIntentionRelation:{data}}=this.props;
         const temp=data.list.filter(item=>item.fID==fid)[0];
         console.log("temp is "+JSON.stringify(temp));
         switch(action){
            case "删除":
            this.onDel(fid)
            break;
            case "编辑":

            break;
         }
    }
    handleModal=()=>{
        const _this=this;
        const {sceneName,sceneId,srcIntentionId}=this.props.match.params;
        const {dispatch}=this.props;
        dispatch({
            type:'sceneIntentionRelation/getsceneIntentionById',
            payload:{
                sceneId,
                intentionId:srcIntentionId
            },
            callback:function () {
                // body...
              //获取源词槽
              dispatch({
                type:'sceneIntentionRelation/getWordSlotsByIntentionId',
                payload:{
                    FID:srcIntentionId,
                    flag:'src'
                }
              })
              _this.setState({
                modalVisible:true,
                modalTitle:"新增词槽继承关系（场景："+sceneName+")"
              })
            }
        })

    }
    clearModal=()=>{
        this.setState({
            modalVisible:false,
            destIntentionName:'',
            destWordslot:'',
            srcWordslot:'',
            listData:[]
        })
    }
    handleModalOk=()=>{
        const _this=this;
        const {listData}=this.state;
        const {dispatch}=this.props;
        const {sceneId,srcIntentionId}=this.props.match.params;
       // console.log("listData is "+JSON.stringify(listData));
        dispatch({
            type:'sceneIntentionRelation/savesceneintentionrelation',
            payload:{
                sceneId,
                srcIntentionId,
                array:listData
            },
            callback(){
               _this.clearModal();
            }
        })

    }
    handleModalCancel=()=>{
        this.clearModal();
    }
    handleDestIntentionName=(value)=>{
        const {dispatch}=this.props;
        const _this=this;
        //选择目标意图后加载目标词槽
        dispatch({
            type:'sceneIntentionRelation/getWordSlotsByIntentionId',
            payload:{
                FID:value,
                flag:'dest'
            },
            callback:function(){
                const {sceneIntentionRelation:{data}}=_this.props;
                console.log("dest is "+JSON.stringify(data.destWordslotList));
                _this.setState({
                  destIntentionName:value,
                  destWordslot:''
                })
            }

        })
    }
    createListObj=(srcObj,destObj)=>{
        let {listData,destIntentionName}=this.state;
        const {sceneIntentionRelation:{data}}=this.props;
        const intentionObj=data.intentionList.filter(item=>item.intention.fid==destIntentionName)[0];
        const intentionName=intentionObj.intention.fname;
        const destIntentionId=intentionObj.intention.fid;
        let tempObj={};
        const TextArr=listData.filter(item=>item.srcWordslotId==srcObj['fid']&&item.destWordslotId==destObj['fid']&&item.intentionName==intentionName);
        if(TextArr!=null&&TextArr.length>0){
            message.error("不能添加重复项!");
            return;
        }
        const FID=Utility.FilterMaxId(listData,'fid');
        tempObj['fid']=FID;
        tempObj['srcWordslotId']=srcObj['fid'];
        tempObj['srcIntentionId']=srcObj['fintentionID'];
        tempObj['srcWordslotName']=srcObj['fname'];
        tempObj['srcWordslotNumber']=srcObj['fnumber'];

        tempObj['destWordslotId']=destObj['fid'];
        tempObj['destIntentionId']=destObj['fintentionID'];
        tempObj['destWordslotName']=destObj['fname'];
        tempObj['destWordslotNumber']=destObj['fnumber'];
        tempObj['destIntentionName']=intentionName;
        
        listData.push(tempObj);
        this.setState({
            listData:listData
        })

    }
    //增加词槽关系对
    handleAddWordslot=()=>{
        const {destWordslot,srcWordslot}=this.state;
        const {sceneIntentionRelation:{data}}=this.props;
        const destObj=data.destWordslotList.filter(item=>item.fid==destWordslot)[0];
        const srcObj=data.srcWordslotList.filter(item=>item.fid==srcWordslot)[0];


        if(Utility.isEmpty(srcWordslot)){
             message.error("源词槽不能为空!");
             return;
        }
        if(Utility.isEmpty(destWordslot)){
             message.error("目标词槽不能为空!");
             return;
        }
        this.createListObj(srcObj,destObj);
    }
    handleWordslotSelect=(key,value)=>{
        this.setState({
            [key]:value
        })
    }
    handleDelItem=(item)=>{
          console.log("item is "+JSON.stringify(item));
          const {listData}=this.state;
          listData.filter()

    }
    //render 目标意图
    renderSelectIntention=()=>{
        const {sceneIntentionRelation:{data}}=this.props;
        const {destIntentionName}=this.state;
        let intentionList=data.intentionList;

        if(intentionList==undefined){
            intentionList=[];
        }
        return (
            <Select style={{width:'150px'}} value={destIntentionName} onChange={this.handleDestIntentionName}>
                {
                    intentionList.map(item=><Option key={item.intention.fid} value={item.intention.fid}>{item.intention.fname}</Option>)
                }
            </Select>

        )
    }
    //render源词槽列表
    renderSrcWordslot=()=>{
        const {sceneIntentionRelation:{data}}=this.props;
        let srcWordslotList=data.srcWordslotList;
        const {srcWordslot}=this.state;
        if(srcWordslotList==undefined){
            srcWordslotList=[];
        }
        return (
            <Select style={{width:'150px'}} value={srcWordslot} onChange={(value)=>this.handleWordslotSelect('srcWordslot',value)}>
                {
                    srcWordslotList.map(item=><Option key={item.fid} value={item.fid}>{item.fname}</Option>)
                }
            </Select>

        )
    }
    //render目标词槽列表
    renderDestWordslot=()=>{
        const {sceneIntentionRelation:{data}}=this.props;
        let destWordslotList=data.destWordslotList;
        const {destWordslot}=this.state;
        if(destWordslotList==undefined){
            destWordslotList=[];
        }
        return (
            <Select style={{width:'150px'}} value={destWordslot} onChange={(value)=>this.handleWordslotSelect('destWordslot',value)}>
                {
                    destWordslotList.map(item=><Option key={item.fid} value={item.fid}>{item.fname}</Option>)
                }
            </Select>

        )
    }
	render(){
		const columns=[
            {
                title:'FID',
                dataIndex:'fID'
            },
            {
            	title:'源意图',
            	dataIndex:'srcIntentionName'
            },
            {
                title:'源词槽',
                dataIndex:'srcWordslotName'
            },
            {
                title:'目标意图',
                dataIndex:'destIntentionName'
            },
            {
                title:'目标词槽',
                dataIndex:'destWordslotName'
            },
            {
                title:'操作',
                dataIndex:'action',
                render:(text, record)=>{
                  return(
                  
                    <div onClick={(e)=>this.handleMenuAction(e,record.fID)}>
                        <a href="javascript:void(0)">编辑</a>
                        <Divider type='vertical'/>
                        <a href="javascript:void(0)" key='del'>删除</a>
                    </div>
                )}
            }

		];
		const {sceneIntentionRelation:{data}}=this.props;
        const {modalVisible,modalTitle,srcIntentionName,listData}=this.state;
		return (
            <Card bordered={false}>
                <Row style={{margintBottom:'20px'}}>
                  <Col>
                    <Button type='primary' onClick={this.handleModal}>新建</Button>
                  </Col>
                </Row>
                <StandardTable
                     data={data}
                     columns={columns}
                >
                </StandardTable>
                <Modal
                    visible={modalVisible}
                    title={modalTitle}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    className={Styles.modal}
                >
                    <Form layout='inline'>
                         <Row style={{marginBottom:'20px'}}>
                              <Col span={12}>
                                  <FormItem
                                     label="源意图"
                                  >
                                      <Input value={srcIntentionName} disabled style={{width:'150px'}}/>
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  <FormItem
                                     label="目标意图"
                                  >
                                      {this.renderSelectIntention()}
                                  </FormItem>
                              </Col>
                         </Row>
                         <Row>
                             <Col span={10}>
                                <FormItem
                                   label="源词槽"
                                >
                                    {this.renderSrcWordslot()}
                                </FormItem>
                             </Col>
                             <Col span={10}>
                                <FormItem
                                   label="目标词槽"
                                >
                                    {this.renderDestWordslot()}
                                </FormItem>
                             </Col>
                             <Col span={4}>
                                 <Button onClick={this.handleAddWordslot}>添加</Button>
                             </Col>
                         </Row>
                         <div className={Styles.configList}>
                             <List
                                 style={{width:'100%'}}
                                 dataSource={this.state.listData}
                                 header={ 
                                       <div className={Styles.listRow}>
                                          <div className={Styles.text}>源词槽</div>
                                          <div className={Styles.text}>目标意图</div>
                                          <div className={Styles.text}>目标词槽</div>
                                          <div className={Styles.del}>操作</div>
                                       </div>
                                    }
                                 renderItem={(item)=>{
                                    return (
                                       <List.Item
                                        style={{width:'100%'}}
                                       >
                                       <div className={Styles.listRow}>
                                           <div className={Styles.text}>{item.srcWordslotName} </div>
                                           <div className={Styles.text}>{item.destIntentionName}</div>
                                           <div className={Styles.text}>{item.destWordslotName}</div>
                                           <div className={Styles.del} onClick={()=>this.handleDelItem(item)}>删除</div>
                                       </div>                         
                                      </List.Item>
                                    )
                                 }
                               }
                               >
                             </List>
                         </div>
                    </Form>
                </Modal>
            </Card>
		)
	}
}

