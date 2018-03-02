import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Row,Col,Form,Select,Card,Divider,Input,Button} from 'antd';
import styles from './wordslot.less';
import StandardTable from '../../components/StandardTable/index'

const FormItem=Form.Item;
@connect(state=>({
	wordslot:state.wordslot
}))
@Form.create()
export default class WordSlot extends PureComponent{

     state={
     	modalVisible:false,
        selectedRows:[]
     }
     componentDidMount(){
         const fid=this.props.match.params.fid;
         const {dispatch}=this.props;
         dispatch({
             type:'wordslot/fetch',
             payload:{
                 FID:fid
             },
             callback:function(){

             }
         })
     }
     renderAction=()=>{
        return(
           <div>
                <a href="javascript:void(0)">编辑</a>
                <Divider type="vertical"/>
                 <a href="javascript:void(0)" key='distribute'>分配</a>
                <Divider type='vertical'/>
                <a href="javascript:void(0)" key='del'>删除</a>
            </div>    
        )
     }
     renderForm=(e)=>{
          const { getFieldDecorator } = this.props.form;
          return (
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="词槽名称">
                    {getFieldDecorator('fname')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="词槽类型">
                    {getFieldDecorator('ftype')(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="0">数字</Option>
                        <Option value="1">文本</Option>
                        <Option value="2">日期</Option>
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
     render(){
        const {wordslot:{data},loading}=this.props;
        const {selectedRows}=this.state;
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
                      onAction={this.handleAction}
                      onRenderAction={this.renderAction}
                    />
               </div>
            </Card>
     	)
     }

}