import React,{PureComponent} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Row,Col,Card,Modal,Form,Divider,Input,Button,message,Select} from 'antd';
import StandardTable from '../../components/StandardTable';
import Utility from '../../utils/utils';
import styles from './system.less';

const FormItem=Form.Item;
const Option=Select.Option;
@connect(state=>({
	system:state.system
}))
@Form.create()

export default class System extends PureComponent{
	constructor(props){
		super(props);
	}
	state={
       selectedRows:[],
       modalVisible:false,
       modalTitle:'',
       modalKey:'',
       sysName:'',
       sysNumber:'',
       sysPropType:'',
       sysLoginAPI:'',
       sysCallBackAPI:'',
       sysFID:0,
       searchName:'',
       searchPropTpe:'',
       formValues:{

       }
	}
	componentDidMount(){
		const {dispatch}=this.props;
		dispatch({
			type:'system/fetch',
			payload:{

			}
		})
	}
	handleStandardTableChange=()=>{

	}
	handleSelectRows=(e,fid)=>{

	}
	onValidate=()=>{
       if(Utility.isEmpty(this.state.sysName)){
            message.error("系统名称不能为空!");
            return false;
        }
        if(Utility.isEmpty(this.state.sysNumber)){
            message.error("系统编码不能为空!");
            return false;
        }
        if(Utility.isEmpty(this.state.sysPropType)){
            message.error("系统类型不能为空!");
            return false;
        }
        if(Utility.isEmpty(this.state.sysLoginAPI)){
            message.error("系统LoginAPI不能为空!");
            return false;
        }
        return true;
	}
	handleOk=()=>{
	   const _this=this;	
       const result=this.onValidate();
       const {dispatch}=this.props;
       if(result){
       	   const params={
       	   	  FName:this.state.sysName,
       	   	  FNumber:this.state.sysNumber,
       	   	  FProdType:this.state.sysPropType,
       	   	  FLoginAPI:this.state.sysLoginAPI,
       	   	  FCallbackAPI:this.state.sysCallBackAPI,
       	   	  FID:this.state.sysFID
       	   }
           dispatch({
           	  type:'system/addOrUpdate',
           	  payload:params,
           	  callback:function(){
                _this.clear();
           	  }
           })

       }
	}
	clear=()=>{
		this.setState({
            modalVisible:false,
            sysName:'',
		    sysNumber:'',
		    sysPropType:'',
		    sysLoginAPI:'',
		    sysCallBackAPI:'',
		    sysFID:0
        })
	}
	handleCancel=(flag)=>{
		// this.setState({
		// 	modalVisible:!!flag
		// })
		this.clear();
	}
	handleSysInput=(e,key)=>{
		this.setState({
			[key]:e.target.value
		})
	}
	onDel=(fid,dataItem)=>{
        const {dispatch}=this.props;
        dispatch({
        	type:'system/delSystem',
        	payload:{
        		FID:fid
        	},
        	callback:function(){
                
        	}
        })
	}
	onEdit=(fid,dataItem)=>{
        this.setState({
        	modalVisible:true,
        	modalKey:'edit',
            sysName:dataItem['fName'],
            sysNumber:dataItem['fNumber'],
            sysPropType:dataItem['fProdType'],
            sysLoginAPI:dataItem['fLoginAPI'],
            sysCallBackAPI:dataItem['fcallbackAPI'],
            sysFID:fid
        })
	}
	handleMenuAction=(e,fid)=>{
        const key=e.target.innerText;
        const {system:{data}}=this.props;
        let temp=data.list.filter(item=>{
        	return item.fID==fid;
        })
        temp=temp[0];
        switch(key){
        	case "编辑":
            this.onEdit(fid,temp);
        	break;
        	case "删除":
            this.onDel(fid,temp);
        	break;
        }
	}
	handleNew=()=>{
		this.setState({
			modalVisible:true,
			modalTitle:'新增业务系统',
			modalKey:'new'
		})
	}
	handleSearch=()=>{
            const {form,dispatch}=this.props;
            form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
              ...fieldsValue,
              updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
              formValues: values,
            });
            console.log("search is "+JSON.stringify(values));
            dispatch({
              type: 'system/fetch',
              payload: {filter:values},
            });
          });
	}
	handleFormReset=()=>{
		 const {form,dispatch}=this.props;
         form.resetFields();
         this.setState({
            formValues:{}
         })
         dispatch({
			type:'system/fetch',
			payload:{

			}
		})
	}
	renderForm=(e)=>{
        const { getFieldDecorator } = this.props.form;
          return (
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="业务系统名称">
                    {getFieldDecorator('searchName')(
                      <Input placeholder="请输入"/>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="业务系统编码">
                    {getFieldDecorator('searchPropType')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </Col>
              </Row>
            </Form>
          );
	}
	render(){
		const columns=[
           {
              title:'编号',
              dataIndex:'fNumber'
           },
           {
               title:'名称',
               dataIndex:'fName',
           },
           {
               title:'类型',
               dataIndex:'fProdType',
           },
           {
               title:'FLoginAPI',
               dataIndex:'fLoginAPI'
           },
           {
                title:'FCallBackAPI',
                dataIndex:'fcallbackAPI'
           },
           {
               title:'创建时间',
               dataIndex:'fcreatetime',
               render:val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
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
        const {system:{data,loading}}=this.props;
        const {selectedRows,modalVisible,sysName,sysNumber,modalTitle,sysPropType,sysLoginAPI,sysCallBackAPI}=this.state;
		return (
           <Card bordered={false}>
            <div className={styles.tableList}>
	            <div className={styles.tableListForm}>
	              {this.renderForm()}
	            </div>
              <Row style={{margin:'20px 0'}}>
                 <Col span={24}>
                     <Button type="primary" icon="plus" onClick={this.handleNew}>新建</Button>
                 </Col>
              </Row>
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
                title={modalTitle}
                onOk={this.handleOk}
                onCancel={()=>this.handleCancel(false)}
              > 
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                   <Col span={12}>
                       <FormItem
	                      label="系统名称"
	                    >
	                     <Input placeholder="请输入" value={sysName} onChange={(e)=>this.handleSysInput(e,"sysName")}/>
	                    </FormItem>
                   </Col>
                   <Col span={12}>
			            <FormItem
			                label="系统编码"
			            >
			                <Input placeholder="请输入" value={sysNumber} onChange={(e)=>this.handleSysInput(e,"sysNumber")}/>
			            </FormItem>
                   </Col>
                </Row>
	            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                   <Col span={12}>
                        <FormItem
	                      label="系统类型"
	                    >
	                     <Input placeholder="请输入" value={sysPropType} onChange={(e)=>this.handleSysInput(e,"sysPropType")}/>
	                    </FormItem>
                   </Col>
                    <Col span={12}>
                        <FormItem
	                      label="LoginAPI"
	                    >
	                     <Input placeholder="请输入" value={sysLoginAPI} onChange={(e)=>this.handleSysInput(e,"sysLoginAPI")}/>
	                    </FormItem>
                   </Col>
	            </Row>
	              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                   <Col span={24}>
                        <FormItem
	                      label="FCallBackAPI"
	                    >
	                     <Input placeholder="请输入" value={sysCallBackAPI} onChange={(e)=>this.handleSysInput(e,"sysCallBackAPI")}/>
	                    </FormItem>
                   </Col>
	            </Row>
              
              </Modal>
            </div>  
           </Card>
		)
	}

}