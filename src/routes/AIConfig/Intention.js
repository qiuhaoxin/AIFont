import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Row,Col,Form,Select,Card,Button,Modal,Input,message,Icon,Divider,Radio} from 'antd';
import StandardTable from '../../components/StandardTable';
import styles from './Intention.less';
import moment from 'moment';

const FormItem=Form.Item;
const {Option}=Select;
const RadioGroup=Radio.Group;
const confirm=Modal.confirm;
@connect(state=>({
	intention:state.intention
}))
@Form.create()
export default class Intention extends PureComponent{
     constructor(props){
        super(props)
     }
     state={
        selectedRows:[],
        formValues:{},
        FName:'',
        FNumber:'',
        FID:0,
        radioValue:0,
     }
     componentDidMount(){
         const {dispatch}=this.props;
         dispatch({
             type:'intention/fetch',
             payload:{

             }
         }) 
     }
     handleMenuAction=(e,fid)=>{
      e.preventDefault();
         const text=e.target.innerText;
         let action="";
         switch(text){
           case "编辑":
              action="edit";
           break;
           case "分配":
              action="distribute";
           break;
           case "查看词槽":
              action="check"
           break;
           case "删除":
              action="del";
           break;
         }
         this.handleAction(action,fid);
     }
    handleModalVisible=(flag)=>{
        this.onDispatch({action:'new',fid:0})
     }
     handleSelectRows=()=>{

     }
     handleStandardTableChange=(pagination,filtersArg,sorter)=>{
        const {dispatch}=this.props;
        const {formValues}=this.state;
        console.log("pagination is "+JSON.stringify(pagination));
        const params={
            ...pagination,
            ...formValues
        }
        dispatch({
          type:'intention/fetch',
          payload:params
        })

     }
     handleAddFName=(e)=>{
        this.setState({
           FName:e.target.value
        })
     }
     handleAddFNumber=(e)=>{
        this.setState({
           FNumber:e.target.value
        })
     }
     onCheck=(fid,tempIntention)=>{
       this.onDispatch({action:'edit',fid:fid});
     }
     onDispatch=(params)=>{
        const {dispatch}=this.props;
        dispatch({
          type:"intention/jump",
          payload:params
        })
     }
     onDel=(fid)=>{
         const {dispatch}=this.props;
         dispatch({
           type:'intention/delIntention',
           payload:{FID:fid},
           callback:function(){
           }
         })
     }
     handleAction=(action,fid)=>{
        const _this=this;
        const {intention:{data},dispatch}=this.props;
        let itemData=data.list.filter(item=>{
            return item.fid==fid;
        })
        itemData=itemData && itemData[0];
        console.log("action is "+action+"itemDa is "+JSON.stringify(itemData));
        switch(action){
            case "del":
                confirm({
                  title: '删除意图?',
                    content: '你确定删除此意图及意图相关的词槽吗',
                    onOk() {
                       _this.onDel(fid);
                    },
                    onCancel() {
                      
                    },
                })
            break;
            case "check":
                this.onCheck(fid);
            break;
            case "edit":
                //编辑意图
                dispatch({
                   type:'intention/jump',
                   payload:{
                      action:'edit',
                      fid:itemData['fid'],
                      tempIntention:itemData
                   }
                })
            break;
            case "distribute":
                this.onDispatch({action:'dispatch',fid:itemData['fid'],intentionName:itemData['fname']});
            break;
        }
     }
     handleFormReset=()=>{
         const {form,dispatch}=this.props;
         form.resetFields();
         this.setState({
            formValues:{}
         })
         dispatch({
             type:'intention/fetch',
             payload:{

             }
         }) 

     }
     handleSearch=(e)=>{
          e.preventDefault();
          const { dispatch, form } = this.props;

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
              type: 'intention/fetch',
              payload: {filter:values},
            });
          });
     }
     renderForm=(e)=>{
          const { getFieldDecorator } = this.props.form;
          return (
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="意图名称">
                    {getFieldDecorator('fname')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="意图状态">
                    {getFieldDecorator('fstatus')(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="0">未训练</Option>
                        <Option value="1">训练中</Option>
                        <Option value="2">已训练</Option>
                      </Select>
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
     handleRadioConfirm=(e)=>{
        this.setState({
           radioValue:e.target.value
        })
     }
     render(){
        const columns=[
           {
              title:'编号',
              dataIndex:'fnumber'
           },
           {
               title:'名称',
               dataIndex:'fname',
           },
           {
               title:'状态',
               dataIndex:'fstatus',
               render:val=><span>{val==0?"未训练":(val==1?"训练中":"已训练")}</span>
           },
           {
               title:'需要确认',
               dataIndex:'fIsConfirm',
               render:val=><span>{val?"是":"否"}</span>
           },
           {
               title:'创建时间',
               dataIndex:'fcreateTime',
               render:val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
           },
           {
                title:'操作',
                dataIndex:'action',
                render:(text, record)=>{
                  return(
                  
                    <div onClick={(e)=>this.handleMenuAction(e,record.fid)}>
                        <a href="javascript:void(0)">编辑</a>
                        <Divider type="vertical"/>
                         <a href="javascript:void(0)" key='distribute'>分配</a>
                        <Divider type='vertical'/>
                        <a href="javascript:void(0)" key='check'>查看词槽</a>
                        <Divider type='vertical'/>
                        <a href="javascript:void(0)" key='del'>删除</a>
                    </div>
                )}
           }
      ]
        const {intention:{data,loading},form:{getFieldDecorator}}=this.props;
        const {selectedRows,FName,FNumber,radioValue,WordSlotType}=this.state;
     	return(
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              columns={columns}
            />
         
          </div>
        </Card>
     	)
     }
}