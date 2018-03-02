import React,{PureComponent} from 'react';
import {Button,Form,Row,Col,Select,Card,Modal,Input,Radio,Divider,message,List,Checkbox,Switch,Popover} from 'antd'
import {connect} from 'dva';
import moment from 'moment';
import StandardTable from '../../components/StandardTable';
import Utility from '../../utils/utils';
import InfiniteScroll from 'react-infinite-scroller';
import Styles from './editintention.less';


const FormItem=Form.Item;
const {Option}=Select;
const RadioGroup=Radio.Group;
const {TextArea}=Input;
@connect(state=>({
   wordslot:state.wordslot,
   intention:state.intention
}))
@Form.create()

export default class EditIntention extends PureComponent{
	state={
        formValus:{},
        fname:'',
        fnumber:'',
        fcomfirmTemplate:'',
        radioValue:0,
        fstatus:'',
        selectedRows:[],
        worlSlotTitle:'',
        wordSlotVisible:false,
        wordSlotActionKey:'',
        wordSlotName:'',
        wordSlotNumber:'',
        wordSlotType:'',
        wordSlotFID:0,
        value:0,
        intentionID:0,
        test:0,
        showDspList:false,  //特殊词槽显示配置的列表
        dspList:[],
        fbizcommand:'',
        fwordslotConfigId:0,
        checkDisabled:false,    //check
        ifSelCheck:false,
        popoverVisible:true,
        popoverArr:[],//popover 用的FID列表
        keyDisabled:true,    //判断是否
        selectionPos:0      //意图确定模板光标
      }   
	componentWillMount=()=>{
		const _this=this;
		const {faction,fid}=this.props.match.params;
		const {dispatch}=this.props;
		if(faction==='edit'&&fid!=0){
             dispatch({
             	type:'wordslot/fetch',
             	payload:{
                   FID:fid
             	},
             	callback:function(){
             		const {wordslot:{data,loading}}=_this.props;
                let arr=[];
                data.list.forEach(item=>{
                  arr.push(item['fseq']);
                })
             		const intention=data['intention'];
             		_this.setState({
             			fname:intention['fname'],
             			fnumber:intention['fnumber'],
             			fstatus:intention['fstatus'],
             			radioValue:intention['fIsConfirm']?1:0,
                  fcomfirmTemplate:intention['fcomfirmTemplate'],
                  popoverArr:arr
             		})
             	}
             })
		}else{
       this.props.wordslot.data.list=[];
    }
	}
	handleSelectRows=()=>{

	}
	handleStandardTableChange=(pagination,filtersArg,sorter)=>{
        const {dispatch}=this.props;
        const {formValues}=this.state;
        const params={
            ...pagination,
            ...formValues
        }
        dispatch({
          type:'intention/fetch',
          payload:params
        })

     }
     handleRadioChange=(e)=>{
        e.preventDefault();
        this.setState({
        	radioValue:e.target.value
        })
     }
     handleNewWordSlot=(flag)=>{
        const {fid}=this.props.match.params;
       	this.setState({
       		wordSlotVisible:!!flag,
       		worlSlotTitle:'新建词槽',
       		wordSlotActionKey:'new'
       	})
        this.fetchSpecWordslot(fid,{fwordslotConfigId:0,fid:0});
     }
     //添加词槽
     handleAddWorkSlot=()=>{
         const _this=this;
         if(Utility.isEmpty(this.state.wordSlotName)){
         	message.error("词槽名称不能为空!");
         	return;
         }
         if(Utility.isEmpty(this.state.wordSlotNumber)){
         	message.error("词槽编码不能为空!");
         	return;
         }
         if(Utility.isEmpty(this.state.wordSlotType)){
         	message.error("请选择词槽类型!");
         	return;
         }

        const {form,dispatch}=this.props;
        const {fid}=this.props.match.params;

        const {dspList}=this.state;
        let commitData=[];
        let temp=dspList.map(item=>{
            if(!Utility.isEmpty(item.fBizParam)){
               let tempData={};
               tempData['fBizParam']=item['fBizParam'];
               tempData["fID"]=item['fID'];
               commitData.push(tempData);
            }
        })
        const values = {
        	wordSlotName:this.state.wordSlotName,
        	wordSlotNumber:this.state.wordSlotNumber,
        	wordSlotType:this.state.wordSlotType,
          FIsSpec:this.state.value,
          FWordslotConfigId:this.state.fwordslotConfigId,
          FIntentionId:this.state.intentionID!=0?this.state.intentionID:fid,//如果是新增意图进来，保存了意图后，意图的ID就不为0了
          FID:this.state.wordSlotActionKey=='new'?0:this.state.wordSlotFID,

          FBizCommand:this.state.fbizcommand,//特使词槽配置的指令
          wordslotConfig:commitData //特殊词槽配置对应的系统参数
	      };
        dispatch({
          	 type:'wordslot/addOrUpdate',
          	 payload:values,
          	 callback:function(loading,wordSlotConfigId){
          	 	if(!loading){
          	 		//const {wordslot:{intention}}=_this.props;
          	 		_this.setState({
          	 			wordSlotVisible:false,
                  wordSlotName:'',
                  wordSlotNumber:'',
                  wordSlotType:'',
                  FWordslotConfigId:wordSlotConfigId,
                  value:0
          	 		})
          	 	}
          	 }
          })	
     }
     handleCancelWorkSlot=()=>{
         this.setState({
         	wordSlotVisible:false,
         	wordSlotName:'',
         	wordSlotNumber:'',
         	wordSlotType:''
         })
     }

     handleWordSlotName=(e)=>{
         this.setState({
         	wordSlotName:e.target.value
         })
     }
     handleWordSlotNumber=(e)=>{
         this.setState({
         	wordSlotNumber:e.target.value
         })
     }
     handleWordSlotType=(e)=>{

     }
     handleWordSlotIsSpec=(e)=>{
      //对data进行修改和对象属性的修改
      console.log("fbizcommand is "+this.state.fbizcommand);
         this.setState({
         	 value:e.target.value,
         })
     }
     onDel=(wordSlotID)=>{
        const {dispatch}=this.props;
        const {fid}=this.props.match.params;
        dispatch({
        	type:'wordslot/delete',
        	payload:{
        		FID:wordSlotID,
            FIntentionID:this.state.intentionID==0?fid:this.state.intentionID
        	},
        	callback:function(loading){
               if(!loading){

               }
        	}
        })
     }
     fetchSpecWordslot=(fid,dataItem)=>{
        const _this=this;
        const {dispatch}=this.props;
        dispatch({
          type:'wordslot/fetchSpecWordslot',
          payload:{
            FWordslotConfigId:dataItem['fwordslotConfigId'],
            FWordslotID:dataItem['fid'],
            FIntentionID:fid
          },
          callback:function(){
              const {wordslot:{specData}}=_this.props;
              const tempList= specData.list.filter(item=>!Utility.isEmpty(item.fBizParam));
             _this.setState({
                dspList:specData.list,
                ifSelCheck:(tempList.length>0 && _this.state.value)?true:false,
                fbizcommand:(tempList.length>0 && tempList[0]['fBizCommand'])?tempList[0]["fBizCommand"]:""
             })
          }
        })
     }
     onEdit=(flag,dataItem)=>{
      const {wordslot:{data,specData}}=this.props;
      const {fid}=this.props.match.params;
      this.setState({
     		wordSlotVisible:!!flag,
     		worlSlotTitle:'编辑词槽',
     		wordSlotActionKey:'edit',
     		wordSlotName:dataItem['fname'],
     		wordSlotNumber:dataItem['fnumber'],
     		wordSlotType:dataItem['ftype'],
     		value:dataItem['fisSpec']?1:0,
     		wordSlotFID:dataItem['fid'],
        fwordslotConfigId:dataItem["fwordslotConfigId"]
     	})
      this.fetchSpecWordslot(fid,dataItem);
     }
     handleMenuAction=(e,fid)=>{
         const key=e.target.innerText;
         const {wordslot:{data}}=this.props;
         let temp=data.list.filter(item=>{
         	return item.fid==fid;
         })
         temp=temp && temp[0];
         switch(key){
         	case "编辑":
               this.onEdit(true,temp);
         	break;
         	case "删除":
               this.onDel(fid);
         	break;
         }

     }
     handleSelectChange=(value)=>{
         this.setState({
         	wordSlotType:value
         })
     }
     handleStatusSelectChange=(value)=>{
     	 this.setState({
     	 	fstatus:value
     	 })
     }
     handleSaveIntention=()=>{
      const _this=this;
     	const {fid}=this.props.match.params;
     	const {dispatch}=this.props;
     	const params={
     		FName:this.state.fname,
     		FNumber:this.state.fnumber,
     		FStatus:this.state.fstatus,
     		FID:fid,
     		FIsConfirm:this.state.radioValue,
        FComfirmTemplate:this.state.fcomfirmTemplate
     	}
      console.log("param is "+JSON.stringify(params));
     	dispatch({
     		type:fid==0?"intention/addIntention":'wordslot/updateIntention',
     		payload:params,
     		callback:function(fid){
            console.log("itnent is is "+fid);
            _this.setState({
              intentionID:fid
            })
     		}
     	})

     }
    handleInput=(e,key)=>{
        const {keyDisabled}=this.state;
        const target=e.target;
        //
        if(keyDisabled){
          this.setState({
            [key]:e.target.value,
            selectionPos:key=='fcomfirmTemplate'?(target.selectionStart+"_"+target.selectionEnd):0 //是确定模板需要获取光标的位置
          })
        }
     }
    handleInfiniteOnLoad = () => {
    }
    handleDispatchList=()=>{

    }
    handleDirective=(e,itemID,key)=>{
         let {dspList}=this.state;
         dspList.map(item=>{
             if(item.fID==itemID){
                 item['fBizParam']=e.target.value;
             } 
         })
         let temp=dspList;
         temp=temp.filter(item=>{
            return item.fID!=0;
         })
         this.setState({
            dspList:temp
         })
    }
    handleDir=(e)=>{
        this.setState({
          fbizcommand:e.target.value
        })
    }
    //是否配置
    handleCheck=(checked)=>{
        this.setState({
          ifSelCheck:checked
        })
    }
    //处理词槽的优先级 fid:词槽ID fseq:优先级  isBatch:是否批量处理？
    dealSeq=(fseq,action,fwordslotid)=>{
       const {wordslot:{data:{list,total}}}=this.props;
       const {fid}=this.props.match.params;
       const {dispatch}=this.props;
       let tempArr=[],reqParams={};
        switch(action){
          case "上移":
          if(fseq==1)return;

          reqParams['action']="up";
          const sourceSeq=fseq - 1;
          tempArr=list.filter(item=>{
            return (item.fseq==fseq||item.fseq==(fseq - 1));
          });
          Utility.exchange(tempArr[0],tempArr[1],"fseq");
          reqParams['list']=tempArr;
          break;
          case "置顶":
          reqParams['action']="top";
          reqParams["start"]=1;
          reqParams["end"]=parseInt(fseq)-1;
          reqParams["direction"]=1;
          reqParams["targetSeq"]=1;
          reqParams["fid"]=fwordslotid;
          break;
          case "下移":
          reqParams['action']="down";
          tempArr=list.filter(item=>{
            return (item.fseq==fseq||item.fseq==parseInt(fseq)+1)
          });
          Utility.exchange(tempArr[0],tempArr[1],'fseq');
          reqParams['list']=tempArr;
          break;
          case "置底":

          reqParams['action']="bottom";
          reqParams["start"]=parseInt(fseq)+1;
          reqParams["end"]=parseInt(total);
          reqParams["direction"]=-1;
          reqParams["targetSeq"]=total;
          reqParams["fid"]=fwordslotid;
          break;
       }
       reqParams['intentionID']=fid;
       dispatch({
          type:'wordslot/modifyseq',
          payload:reqParams,
          callback:function(){

          }
       })
       
    }
    handlePopover=(e)=>{
       let target=e.target;
       const fid=target.parentNode.getAttribute("id"),seq=target.parentNode.getAttribute("fseq"),action=target.innerText;
       let reqParams={};
       const params=this.dealSeq(seq,action,fid);
       reqParams["action"]=action;
    }
    handleSelect=(e)=>{
       let val=e.target.innerText;
       val='['+val+']';
      // console.log("v is "+this.state['fcomfirmTemplate']+"and pos is "+this.state.selectionPos); 
       const {selectionPos,fcomfirmTemplate}=this.state;  
       const pos=selectionPos.split('_'),len=fcomfirmTemplate && fcomfirmTemplate.length;
       const beforePos=fcomfirmTemplate && fcomfirmTemplate.substring(0,pos[0]),afterPos=fcomfirmTemplate && fcomfirmTemplate.substring(pos[0],len);
       const temp=(beforePos?beforePos:'')+val+(afterPos?afterPos:'');
       this.setState({
          fcomfirmTemplate:temp
       })  
    }
    renderWordslot=()=>{
      const {wordslot:{data:{list}}}=this.props;
      let tempArr=[];
      list.forEach(item=>{
        let temp={};
        temp['fnumber']=item.fnumber;
        temp['fid']=item.fid;
        tempArr.push(temp);
      });
      return (
         <div>
            <label>词槽:</label>
            {
                tempArr.map(item=><span onClick={this.handleSelect} style={{padding:'5px 8px',"backgroundColor":'#eee','marginLeft':'11px'}} key={item.fid}>{item.fnumber}</span>)
            }
         </div>
      )
    }
    renderPopoverContent=(fseq,fid)=>{
      const tempArr=this.state.popoverArr;
      return (
          <div id={fid} fseq={fseq} className={Styles.movepopover} onClick={(e,fid)=>this.handlePopover(e)}>
            <p className={fseq==tempArr[0]?Styles.notallowed:''}>上移</p>
            <p >下移</p>
            <p className={fseq==tempArr[0]?Styles.notallowed:''}>置顶</p>
            <p>置底</p>
          </div>
      )
    }
    handleTextChange=(e,key,value)=>{
      if(e.keyCode==13 && key=='fcomfirmTemplate'){
          this.setState({
             keyDisabled:false
          })
      }else{
        this.setState({
            keyDisabled:true
        })
      }
    }
    //处理input 的光标选择问题
    handleSelection=(e)=>{
       const target=e.target,selectionStart=target.selectionStart,selectionEnd=target.selectionEnd;
       this.setState({
          selectionPos:selectionStart+"_"+selectionEnd
       })
    }

	render(){
      const popoverContent=(<div onClick={this.handlePopover}>
            <p>上移</p>
            <p>下移</p>
            <p>置顶</p>
            <p>置底</p>
          </div>);
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
               title:'类型',
               dataIndex:'ftype',
               render:val=><span>{val==0?"数字":(val==1?"文本":"日期")}</span>
           },
           {
               title:'澄清术语',
               dataIndex:'fclarification'
           },
           {
               title:'创建时间',
               dataIndex:'fcreateTime',
               render:val=><span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
           },
           {
               title:'优先级',
               dataIndex:'fseq',
               render:(text,record)=>{

                return (
                   <Popover placement='bottom' content={this.renderPopoverContent(record.fseq,record.fid)}>
                       {record.fseq}<span className={Styles.desc}>    移动
                       </span><span className={Styles.arrowDown}></span>
                   </Popover>)
              }
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
                    </div>
                )}
           }
      ]
		const {getFieldDecorator}=this.props.form;
		const {wordslot:{data,loading}}=this.props;
		const {selectedRows,fname,fnumber,fcomfirmTemplate,fstatus,worlSlotTitle,wordSlotVisible,wordSlotName,wordSlotNumber,wordSlotType,value,fbizcommand,
           ifSelCheck,radioValue}=this.state;
		return (
          <div>
           <Card bordered={false}>

               <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Form layout='inline'>
                   <Col span={12}>
                      <FormItem
                          label="意图名称"
                      >
                      <Input placeholder="请输入" style={{widt:'230px'}}  value={fname} onChange={(e)=>{this.handleInput(e,'fname')}}/>
                      </FormItem>
                  </Col>
                  <Col span={12}>
                      <FormItem
                          label="意图编码"
                      >
                        <Input placeholder="请输入" style={{widt:'230px'}} value={fnumber} onChange={(e)=>{this.handleInput(e,'fnumber')}} />
                      </FormItem>
                  </Col>
                  </Form>
               
               </Row>
               <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:20}}>
                  
                  <Form layout='inline'>
                      <Col span={12}>
                        <FormItem
                         label="需要确认"
                      >
                             <RadioGroup defaultValue={radioValue} value={radioValue} onChange={this.handleRadioChange}>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                             </RadioGroup> 
                      </FormItem>
                     
                  </Col>
                  <Col span={12}>
                      <FormItem
                         label="训练状态"
                      >
                        <Select placeholder="请选择" style={{width:'180px'}} value={fstatus} onChange={this.handleStatusSelectChange}>
                            <Option value='0'>未训练</Option>
                            <Option value='1'>训练中</Option>
                            <Option value='2'>已训练</Option>
                        </Select>

                      </FormItem>
                  </Col>
                  </Form>
                    
               </Row>
               <Row>
                  <FormItem
                     label="确认模板"
                  >
                    <TextArea style={{width:'50%'}} onKeyDown={(e)=>this.handleTextChange(e,'fcomfirmTemplate',this.value)} disabled={radioValue?false:true} rows={4} 
                    value={fcomfirmTemplate} onChange={(e)=>{this.handleInput(e,'fcomfirmTemplate')}} onClick={this.handleSelection}/>
                  </FormItem>
               </Row>
               <Row>
                  {this.renderWordslot()}
               </Row>
               <Button type='primary' style={{marginTop:'23px'}} onClick={this.handleSaveIntention}>保存</Button>

           </Card>
           <Divider type='horizontal'></Divider>
           <Card bordered={false} title="词槽">
                <Button type='primary' onClick={()=>this.handleNewWordSlot(true)}>新建</Button>
                <StandardTable
                  selectedRows={selectedRows}
	              loading={loading}
	              data={data}
	              onSelectRow={this.handleSelectRows}
	              onChange={this.handleStandardTableChange}
	              columns={columns}
                >

                </StandardTable>
           </Card>
           <Modal
               title={worlSlotTitle}
               visible={wordSlotVisible}
               onOk={this.handleAddWorkSlot}
               onCancel={()=>this.handleCancelWorkSlot()}
               className={Styles.modal}
           >
               <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="词槽名称"
               >
                   <Input placeholder="请输入" onChange={this.handleWordSlotName} value={wordSlotName}/>

               </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="词槽编码"
               >
                    <Input placeholder="请输入" onChange={this.handleWordSlotNumber} value={wordSlotNumber}/>

               </FormItem>
               <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="词槽类型"
               >

	                <Select placeholder="请选择" style={{width:'100%'}} value={wordSlotType} onChange={this.handleSelectChange}>
	                    <Option value='0'>数字</Option>
	                    <Option value='1'>文本</Option>
	                    <Option value='2'>日期</Option>
	                </Select>
               </FormItem>
               <Form layout="inline">
                 <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:'20px'}}>
                    <Col md={12} sm={24}>
                      <FormItem
                          label="是否特殊"
                      >
                        <RadioGroup onChange={this.handleWordSlotIsSpec} value={value} defaultValue={value}>
                            <Radio value={0}>否</Radio>
                            <Radio value={1}>是</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col md={12} sm={24}>
                        <FormItem
                           label="选择性查询："
                        >
                           <Switch disabled={value?false:true} onChange={this.handleCheck} checked={ifSelCheck}></Switch>
                        </FormItem>
                    </Col>
                            
                 </Row>
              </Form>
               <Form layout="inline">
                 <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:'20px'}}>
                    <Col span={12}>
                      <FormItem
                        style={{display:(value && ifSelCheck)?'block':'none'}}
                        label="业务指令"
                        >
                          <Input value={fbizcommand} placeholder="请输入" style={{width:'150px'}} onChange={this.handleDir}/>
                      </FormItem>
                    </Col>
                 </Row>
               </Form>
               <InfiniteScroll className={Styles.infiniteContainer}
                  loadMore={this.handleInfiniteOnLoad}
                  style={{display:(value && ifSelCheck)?'block':'none'}}
               >
                   <List
                     dataSource={this.state.dspList}
                     header={ 
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col span={8}>
                                     词槽名称
                                </Col>
                                <Col span={16}>
                                     对应系统参数
                                </Col>
                            </Row>}
                     renderItem={(item)=>{
                        return (
                           <List.Item>
                              <Form layout="inline" style={{width:'100%'}}>
                                 <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                  <Col span={8}>
                                     {item.fName}
                                  </Col>
                                  <Col span={16}>
                                     <div style={{width:'100%'}}>
                                         <Input value={item.fBizParam}  onChange={(e)=>this.handleDirective(e,item.fID)} />
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
               </InfiniteScroll>

           </Modal>
          </div>
		)
	}
}