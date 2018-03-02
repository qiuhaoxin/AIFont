import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Row,Col,Card,Input,Checkbox,Form,Divider,Modal,Button,Select} from 'antd';
import Utility from '../../utils/utils';
import StandardTable from '../../components/StandardTable';
import moment from 'moment';
import Styles from './userManager.less';

const FormItem=Form.Item;
@connect(state=>({
	user:state.user
}))
@Form.create()
 export default class userManager extends PureComponent{
     state={
         modalVisible:false,
         modalTitle:'',
         modalModel:0,
         FName:'',
         FFullName:'',
         FMobile:'',
         FEmail:'',
         FIsActive:0,
         FPsw:'',
         FID:0

     }
     componentDidMount(){
        const {dispatch}=this.props;
        dispatch({
        	type:'user/fetch',
        	payload:{

        	},
        	callback:function(){

        	}
        })
     }
     onDel=(fid,dataItem)=>{
         const {dispatch}=this.props;
         dispatch({
         	type:'user/delUser',
         	payload:{
         		FID:fid
         	},
         	callback:function(){

         	}
         })
     }
     onEdit=(fid,dataItem)=>{
     	console.log("dataItem is "+JSON.stringify(dataItem));
         this.setState({
         	modalTitle:'编辑用户',
         	modalModel:1,
         	modalVisible:true,
         	FName:dataItem['fName'],
         	FFullName:dataItem['fFullName'],
         	FEmail:dataItem['fEmail'],
         	FPsw:dataItem['fPsw'],
         	FMobile:dataItem['fMobile'],
         	FIsActive:dataItem['fIsActive'],
         	FID:dataItem['fID']
         })
     }
     handleMenuAction=(e,fid)=>{
         const action=e.target.innerText;
         const {user:{data}}=this.props;
         let dataItem=data.list.filter(item=>item.fID==fid)
         dataItem=dataItem[0];
         switch(action){
         	case "编辑":
               this.onEdit(fid,dataItem);
         	break;
         	case "删除":
               this.onDel(fid,dataItem);
         	break;
         }
     }
     handleNewUser=()=>{
         this.setState({
         	modalVisible:true,
         	modalTitle:'新增用户',
         	modalModel:0
         })
     }
     clearUserModal=()=>{
     	this.setState({
     		modalVisible:false,
            userName:'',
            fullName:'',
            isActive:0,
            email:'',
            mobile:''
     	})
     }
     buildParams=()=>{
         const {FName,FFullName,FPsw,FIsActive,FMobile,FEmail}=this.state;
         console.log("active value si "+FIsActive);
         return {
            FName,FFullName,FPsw,FIsActive,FMobile,FEmail
         }
     }
     handleNewUserOK=()=>{
     	 const _this=this;
         const {dispatch}=this.props;

         let params=this.buildParams();
         params['FID']=this.state.modalModel==0?0:this.state.FID;
         params['FIsActive']=params['FIsActive']?1:0;
         params['FPsw']=Utility.MD5(params['FPsw']);
         dispatch({
         	type:'user/addOrUpdate',
         	payload:params,
         	callback:function(){
                _this.clearUserModal();
         	}
         })     
     }
     handleNewUserCancel=()=>{
         this.clearUserModal();
     }
     handleInput=(e,key)=>{
     	this.setState({
           [key]:e.target.value
     	})
     }
     handleIsActive=(e)=>{
        this.setState({
        	FIsActive:e.target.checked
        })
     }
     render(){
     	const columns=[
            {
            	title:'用户名',
            	dataIndex:'fName'
            },
            {
            	title:'真实姓名',
            	dataIndex:'fFullName'
            },
            {
            	title:'电子邮箱',
            	dataIndex:'fEmail'
            },
            {
            	title:'电话',
            	dataIndex:'fMobile'
            },
            {
            	title:'创建时间',
            	dataIndex:'fCreateTime',
            	render:val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title:'是否激活',
                dataIndex:'fIsActive',
                render:(text,record)=>{
                	return (
                       <Checkbox defaultChecked={record.fIsActive==1?true:false} disabled={true} ></Checkbox>
                	)
                }
            },
            {
            	title:'Action',
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
     	]
     	const {user:{data,loading}}=this.props;
        const {modalVisible,modalTitle,FName,FFullName,FEmail,FMobile,FIsActive,FPsw,modalModel}=this.state;
        console.log("FIsActive is "+FIsActive);
     	return (
           <Card bordered={false}>

              <Row style={{marginBottom:'20px'}}>
                 <Col>
                    <Button type='primary' onClick={this.handleNewUser}>新建</Button>
                 </Col>
              </Row>
              <StandardTable
                 columns={columns}
                 data={data}
                 loading={loading}
              >

              </StandardTable>
              <Modal
                  visible={modalVisible}
                  title={modalTitle}
                  onOk={this.handleNewUserOK}
                  onCancel={this.handleNewUserCancel}
                  className={Styles.userModal}
              >
                <Row>
                    <Form layout='inline'>
                         <Col sm={24} md={12}>
                            <FormItem
                                label="用 户 名"
                            >
                               <Input placeholder="请输入" value={FName} onChange={(e)=>this.handleInput(e,'FName')} style={{width:'150px'}} />
                            </FormItem>
                         </Col>
                         <Col sm={24} md={12}>
                            <FormItem
                                label="真实姓名"
                            >
                               <Input placeholder="请输入" value={FFullName} onChange={(e)=>this.handleInput(e,'FFullName')} style={{width:'150px'}} />
                            </FormItem>
                         </Col>
                  </Form>
                </Row>
                <Row style={{marginTop:'18px'}}>
                    <Form layout='inline'>
                         <Col sm={24} md={12}>
                            <FormItem
                                label="电子邮箱"
                            >
                               <Input placeholder="请输入" value={FEmail} onChange={(e)=>this.handleInput(e,'FEmail')} style={{width:'150px'}} />
                            </FormItem>
                         </Col>
                         <Col sm={24} md={12}>
                            <FormItem
                                label="手机号码"
                            >
                               <Input placeholder="请输入" value={FMobile} onChange={(e)=>this.handleInput(e,'FMobile')} style={{width:'150px'}} />
                            </FormItem>
                         </Col>
                  </Form>
                </Row>
                <Row style={{marginTop:'18px'}} >
                    <Form layout='inline'>
                         <Col sm={24} md={12}>
                            <FormItem
                                label="初始密码"
                            >
                               <Input type='password' placeholder="请输入" value={FPsw} onChange={(e)=>this.handleInput(e,'FPsw')} style={{width:'150px'}} />
                            </FormItem>
                         </Col>
                         <Col sm={24} md={12}>
                            <FormItem
                                label="是否激活"
                            >
                               <Checkbox defaultChecked={FIsActive} checked={FIsActive} onChange={this.handleIsActive}></Checkbox>
                            </FormItem>
                         </Col>
                  </Form>
                </Row>
              </Modal>
           </Card>
     	)
     }
 }
