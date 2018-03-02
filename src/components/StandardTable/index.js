import React,{PureComponent} from 'react';
import moment from 'moment';
import {Table,Alert,Badge,Divider} from 'antd';
import styles from './index.less';

export default class StandarTable extends PureComponent{
	state={
		selectedRowKeys:[],
        totalCallNo:0,
	};
    componentWillReceiveProps(nextProps){
    	// if(nextProps.selectedRowKeys.length===0){
    	// 	this.setState({
     //            selectedRowKeys:[],
     //            totalCallNo:0,
    	// 	});
    	// }
    }
    handleTableChange=(pagination,filters,sorter)=>{
       this.props.onChange(pagination,filters,sorter);
    }
    handleRowSelectChange=(selectedRowKeys,selectRows)=>{
          const totalCallNo=selectRows.reduce((sum,val)=>{
             return sum + parseFloat(val.callNo,10);
          },0);
          if(this.props.onSelectRow){
            this.props.onSelectRow(selectRows);
          }
          this.setState({selectedRowKeys,totalCallNo});

    }
    render(){
    	const {selectedRowKeys,totalCallNo}=this.state;
    	const {data:{list,pagination},loading,onRenderAction,columns}=this.props;
      const rowSelection={
        selectedRowKeys,
        onChange:this.handleRowSelectChange,
        getCheckboxProps:record =>({
           disabled:record.disabled,
        }),

      };

      const paginationProps={
          showSizeChanger:true,
          showQuickJumper:true,
          ...pagination,
      }
    	return (
    		<div className={styles.StandarTable}>
                <div className={styles.tableAlert}>
                  
                </div>
                <Table 
                    loading={loading}
                    rowKey={record =>{return record.fid||record.fID||record.id}}
                    rowSelection={rowSelection}
                    dataSource={list}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                >
                </Table>
    		</div>
    	)
    }
}