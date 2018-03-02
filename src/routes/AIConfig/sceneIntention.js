import React,{Component} from 'react';
import {Input,Select,Card,Modal,Row,Col,Checkbox,Button,Popover,Divider,List,Form,message} from 'antd';
import {connect} from 'dva';
import Styles from './sceneIntention.less';
import Utility from '../../utils/utils';
import StandardTable from '../../components/StandardTable';
import {routerRedux} from 'dva/router';

const FormItem=Form.Item;
const {TextArea}=Input;
@connect(state=>({
	sceneIntention:state.sceneIntention
}))
export default class SceneIntention extends Component{
	constructor(props){
		super(props);
	}
	state={
        popoverArr:[],
        sceneIntentions:[],
        modalVisible:false,
        modalTitle:'',
        modalEditVisible:false,
        modalConfigVisible:false,
        intentionName:'',
        askEnterTemplate:'',
        enterIntentionTemplate:'',
        keyDisabled:true,
        selectionPos:0,
        FID:0,
        IntentionID:0,
        configEnterIntentionTemplate:'',
        configIntentionID:0,//新增场景意图配置的意图ID
        modalSceneRelation:false,//场景意图关系Modal可见性
	}
	componentDidMount(){
		const _this=this;
        const {sceneId,sceneName}=this.props.match.params;
        const {dispatch}=this.props;
        dispatch({
        	type:'sceneIntention/fetch',
        	payload:{
        		sceneId:sceneId,
        		flag:'list'
        	},
        	callback:function(){
                const {sceneIntention:{data}}=_this.props;
                let temp=[];
                data.list.forEach(item=>{
                	temp.push(item['fid']);
                })
                _this.setState({
                	popoverArr:temp
                })
        	}
        })
	}
	onEdit=(id,dataItem)=>{
		const _this=this;
        const sceneIntention=dataItem['sceneIntention'];
        const {dispatch}=this.props;
        dispatch({
        	type:'sceneIntention/fetchWordslotByIntentionId',
        	payload:{
        		FID:id
        	},
        	callback:function(){
		        _this.setState({
		        	FID:sceneIntention['id'],
		        	IntentionID:dataItem['fid'],
		        	intentionName:dataItem['fname'],
		        	askEnterTemplate:sceneIntention['askEnterTemplate'],
		        	enterIntentionTemplate:sceneIntention['enterIntentionTemplate'],
		        	modalEditVisible:true
		        })
        	}
        })

	}
	onDel=(id,dataItem)=>{
        const sceneIntentionId=dataItem['sceneIntention']['id'];
        const {dispatch}=this.props;
        const {sceneId}=this.props.match.params;
        dispatch({
        	type:'sceneIntention/delSceneIntention',
        	payload:{
        		fid:sceneIntentionId,
        		sceneId:sceneId
        	},
        	callback:function(){

        	}
        })
	}
	onConfigure=(id,dataItem)=>{
		const _this=this;
         const {sceneId,sceneName}=this.props.match.params;
         const {dispatch}=this.props;
         dispatch(routerRedux.push("/AIConfig/SceneIntentionRelation/"+sceneId+"/"+id+"/"+sceneName));
	}
	//ID是意图ID而非场景意图的ID
	handleMenuAction=(e,id)=>{
        const action=e.target.innerText;
        const {sceneIntention:{data}}=this.props;
        let dataItem=data.list.filter(item=>item.fid==id);
        dataItem=dataItem[0];
        switch(action){
        	case "编辑":
                this.onEdit(id,dataItem);
        	break;
        	case "删除":
                this.onDel(id,dataItem);
        	break;
        	case "词槽继承关系":
                this.onConfigure(id,dataItem);
        	break;
        }
	}
	handleNew=()=>{
		const _this=this;
		const {dispatch}=this.props;
		const {sceneId}=this.props.match.params;
		dispatch({
			type:'sceneIntention/fetch',
			payload:{
                sceneId:sceneId,
                flag:'new'
			},
			callback:function(){
                const {sceneIntention:{data:{dispatchList}}}=_this.props;
                let tempArr=[];
                dispatchList.forEach(item=>{
                	let temp={};
                	temp['fid']=item['fid'];
                	temp['fname']=item['fname'];
                	temp['askEnterTemplate']='';
                	temp['enterIntentionTemplate']='';
                	tempArr.push(temp);
                })
                _this.setState({
                	sceneIntentions:tempArr,
                	modalVisible:true,
			        modalTitle:'新增场景意图'
                })
			}
		})
		// this.setState({
		// 	modalVisible:true,
		// 	modalTitle:'新增场景意图'
		// })
	}
	clearModal=()=>{

		this.setState({
            modalVisible:false
		})
	}
	//新增场景意图
	handleNewOk=()=>{
		const _this=this;
        const {sceneIntentions}=this.state;
        const {dispatch}=this.props;
        const {sceneId}=this.props.match.params;
        const tempArr=sceneIntentions.filter(item=>(!Utility.isEmpty(item.askEnterTemplate)||!Utility.isEmpty(item.enterIntentionTemplate)));
        dispatch({
        	type:'sceneIntention/addSceneIntention',
        	payload:{
        		sceneId:sceneId,
        		array:tempArr
        	},
        	callback:function(){
                _this.clearModal();
        	}
        })

	}
	handleNewCancel=()=>{
        this.clearModal();
	}
	handleDirective=(e,id,key)=>{
       let {sceneIntentions}=this.state;
       sceneIntentions.map(item=>{
       	  if(item.fid==id){
             item[key]=e.target.value;
       	  }
       })
       this.setState({
       	  sceneIntentions:sceneIntentions
       })
	}
	//处理词槽的优先级 fid:词槽ID fseq:优先级  isBatch:是否批量处理？
	dealSeq=(fseq,action,fid)=>{
	   const {sceneIntention:{data:{list,total}}}=this.props;
       const {dispatch}=this.props;
       const {sceneId}=this.props.match.params;
       let tempArr=[],reqParams={};
        switch(action){
          case "上移":
          if(fseq==1)return;

          reqParams['action']="up";
          const sourceSeq=fseq - 1;
          tempArr=list.filter(item=>{
            return (item.sceneIntention.seq==fseq||item.sceneIntention.seq==(fseq - 1));
          });
          Utility.exchange(tempArr[0]['sceneIntention'],tempArr[1]['sceneIntention'],"seq");
          reqParams['list']=tempArr;
          break;
          case "置顶":
          reqParams['action']="top";
          reqParams["start"]=1;
          reqParams["end"]=parseInt(fseq)-1;
          reqParams["direction"]=1;
          reqParams["targetSeq"]=1;
          tempArr=list.filter(item=>item.fid==fid);
          reqParams["fid"]=tempArr[0]['sceneIntention'].id;
          break;
          case "下移":
          reqParams['action']="down";
          tempArr=list.filter(item=>{
            return (item.sceneIntention.seq==fseq||item.sceneIntention.seq==parseInt(fseq)+1)
          });
          Utility.exchange(tempArr[0]['sceneIntention'],tempArr[1]['sceneIntention'],'seq');
          reqParams['list']=tempArr;
          break;
          case "置底":

          reqParams['action']="bottom";
          reqParams["start"]=parseInt(fseq)+1;
          reqParams["end"]=parseInt(total);
          reqParams["direction"]=-1;
          reqParams["targetSeq"]=total;
          tempArr=list.filter(item=>item.fid==fid);
          reqParams["fid"]=tempArr[0]['sceneIntention'].id;
          break;
       }
       reqParams['sceneId']=sceneId;
       console.log("reqParams is "+JSON.stringify(reqParams));
       dispatch({
          type:'sceneIntention/modifySceneIntentionSeq',
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
    clearEdit=()=>{
    	this.setState({
    		modalEditVisible:false,
    		intentionName:'',
    		askEnterTemplate:'',
    		enterIntentionTemplate:''
    	})
    }
    handleEditOk=()=>{
    	const _this=this;
    	const {askEnterTemplate,enterIntentionTemplate,FID,IntentionID}=this.state;
    	const params={askEnterTemplate,enterIntentionTemplate,FID,IntentionID};
    	const {dispatch}=this.props;
    	dispatch({
    		type:'sceneIntention/updateSceneIntention',
    		payload:params,
    		callback:function(){
               _this.clearEdit();
    		}
    	})
    }
    handleEditCancel=()=>{
        this.clearEdit();
    }
    handleInput=(e,key)=>{
    	const {keyDisabled}=this.state;
    	const target=e.target;
    	if(keyDisabled){
	        this.setState({
	        	[key]:target.value,
	        	selectionPos:key=='enterIntentionTemplate'?(target.selectionStart+"_"+target.selectionEnd):0 //是确定模板需要获取光标的位置
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
    handleTextChange=(e,key,value)=>{
      if(e.keyCode==13 && key=='enterIntentionTemplate'){
          this.setState({
             keyDisabled:false
          })
      }else{
        this.setState({
            keyDisabled:true
        })
      }
    }
    handleConfig=(item)=>{
       const _this=this;
       const {dispatch}=this.props;
        dispatch({
        	type:'sceneIntention/fetchWordslotByIntentionId',
        	payload:{
        		FID:item['fid']
        	},
        	callback:function(){
		       _this.setState({
		       	   modalConfigVisible:true,
		       	   configIntentionID:item['fid']
		       })
        	}
        })

    }
    handleConfigOk=()=>{
        const {sceneIntention:{data}}=this.props;
        let {sceneIntentions,configIntentionID,configEnterIntentionTemplate}=this.state;
        sceneIntentions.map(item=>{
       	  if(item.fid==configIntentionID){
             item['enterIntentionTemplate']=configEnterIntentionTemplate
       	  }
        })
        this.setState({
        	sceneIntentions:sceneIntentions,
        	modalConfigVisible:false,
        	configEnterIntentionTemplate:''
        })
    }
    handleConfigCancel=()=>{
        this.setState({
        	modalConfigVisible:false,
        	configEnterIntentionTemplate:''
        })
    }
    handleConfigTemplate=(e)=>{
    	this.setState({
    		configEnterIntentionTemplate:e.target.value
    	})
    }
    handleSelect=(e,key)=>{
       let val=e.target.innerText;
       val='['+val+']';
       const {selectionPos}=this.state;  
       const pos=selectionPos.split('_'),len=this.state[key] && this.state[key].length;
       const beforePos=this.state[key] && this.state[key].substring(0,pos[0]),afterPos=this.state[key] && this.state[key].substring(pos[0],len);
       const temp=(beforePos?beforePos:'')+val+(afterPos?afterPos:'');
       this.setState({
          [key]:temp
       })  
    }
    clearRelation=()=>{
    	this.setState({
    		modalSceneRelation:false
    	})
    }
    handleRelationOk=()=>{
        this.clearRelation();
    }
    handleRelationCancel=()=>{
        this.clearRelation(); 
    }
	renderPopoverContent=(record)=>{
       const {popoverArr}=this.state;
       const len=popoverArr.length - 1;
       const seq=record.sceneIntention.seq;
       const fid=record.fid;
      return (
          <div id={fid} fseq={seq} className={Styles.movepopover} onClick={(e,fid)=>this.handlePopover(e)}>
            <p className={fid==popoverArr[0]?Styles.notallowed:''}>上移</p>
            <p className={fid==popoverArr[len]?Styles.notallowed:''}>下移</p>
            <p className={fid==popoverArr[0]?Styles.notallowed:''}>置顶</p>
            <p className={fid==popoverArr[len]?Styles.notallowed:''}>置底</p>
          </div>
      )
    }
    renderWordslot=(record)=>{
    	const id=record.fid;
        const {sceneIntention:{data:{dispatchList}}}=this.props;
        let item=dispatchList.filter(item=>item.fid==id);
        item=item[0];
        let tempArr=[];
        tempArr=item.wordSlotList;
        return (
            tempArr.map(item=><span key={item.fid} style={{padding:'3px 7px',background:'#eee',margin:'2px 7px'}}>{item.fname}</span>)
        )
    }
    renderWordslotSpan=(key)=>{
    	const {sceneIntention:{data}}=this.props;
    	let wordSlotList=data['wordslotList'];
    	if(wordSlotList==undefined){
    		wordSlotList=[];
    	}
        return (
            wordSlotList.map(item=><span onClick={(e)=>this.handleSelect(e,key)} key={item.fid}>{item.fnumber}</span>)
        )   	
    }
	render(){
		const columns=[
            {
            	title:'FID',
            	dataIndex:'fid'
            },
            {
            	title:'意图名称',
            	dataIndex:'fname'
            },
            {
                 title:'进入场景模板',
                 dataIndex:'sceneIntention.askEnterTemplate'
            },
            {
            	title:'unit提交语',
            	dataIndex:'sceneIntention.enterIntentionTemplate'
            },
            {
            	title:'优先级',
            	dataIndex:'sceneIntention.seq',
            	render:(text,record)=>{

                return (
                   <Popover placement='bottom' content={this.renderPopoverContent(record)}>
                       {record.sceneIntention.seq}<span className={Styles.desc}>    移动
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
                        <Divider type="vertical"/>
                        <a href="javascript:void(0) ">词槽继承关系</a>
                    </div>
                )}
            }
		]
		let {sceneIntention:{data}}=this.props;
        const {sceneName}=this.props.match.params;
        const {modalVisible,modalTitle,sceneIntentions,modalEditVisible,intentionName,askEnterTemplate,enterIntentionTemplate,modalConfigVisible,
        configEnterIntentionTemplate,modalSceneRelation}=this.state;
		return (
            <Card bordered={false}>
                <Row style={{margin:'10px 0px 20px 10px',fontSize:'20px'}}>
                   <Col>
                      <span>场景:</span><span>{sceneName}</span>
                   </Col>
                </Row>
                <Row style={{marginBottom:'20px'}}>
                   <Col>
                      <Button type='primary' onClick={this.handleNew}>分配</Button>
                   </Col>
                </Row>
                <StandardTable
                   columns={columns}
                   data={data}
                >

                </StandardTable>
                <Modal
                   className={Styles.modal}
                   visible={modalVisible}
                   title={modalTitle}
                   onOk={this.handleNewOk}
                   onCancel={this.handleNewCancel}
                >

                    <List
	                     dataSource={sceneIntentions}
	                     header={ 
	                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
	                                <Col span={6}>
	                                     意图名称
	                                </Col>
	                                <Col span={8}>
	                                     进入模板
	                                </Col>
	                                <Col span={10}>
                                         唤起模板
	                                </Col>
	                            </Row>}
	                     renderItem={(item)=>{
	                        return (
	                           <List.Item>
	                              <Form layout="inline" style={{width:'100%'}}>
	                                 <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
	                                  <Col span={6}>
	                                     {item.fname}
	                                  </Col>
	                                  <Col span={8}>
	                                     <div style={{width:'100%'}}>
	                                         <Input value={item.askEnterTemplate}  onChange={(e)=>this.handleDirective(e,item.fid,"askEnterTemplate")} />
	                                     </div>
	                                  
	                                  </Col>
                                      <Col span={10}>
                                           <Input value={item.enterIntentionTemplate} disabled style={{width:'150px'}}  onChange={(e)=>this.handleDirective(e,item.fid,"enterIntentionTemplate")} />
                                           <a href="javascript:void(0)" className={Styles.enterConfig} onClick={()=>this.handleConfig(item)} >配置</a>
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
                   visible={modalEditVisible}
                   title="编辑场景意图"
                   onOk={this.handleEditOk}
                   onCancel={this.handleEditCancel}
                   className={Styles.modal}
                > 
                  <Form layout='inline'>
                    <Row>
                       <Col span={12}>
                           <FormItem
                               label="意图名称"
                           >
                               <Input disabled value={intentionName} style={{width:'100px'}}/>
                           </FormItem>
                       </Col>
                       <Col span={12}>
                           <FormItem
                               label="进入模板"
                           >
                               <Input value={askEnterTemplate} style={{width:'150px'}} onChange={(e)=>this.handleInput(e,"askEnterTemplate")}/>
                           </FormItem>
                       </Col>
                    </Row>
                    <Row style={{marginTop:'20px'}}>
                       <Col span={24}>
                          <FormItem
                             label="唤起模板"
                             style={{width:'100%'}}
                          >
                             <TextArea autosize={{minRows:3,maxRows:6}} onKeyDown={(e)=>this.handleTextChange(e,'enterIntentionTemplate',this.value)} style={{minWidth:'400px'}} 
                             value={enterIntentionTemplate} placeholder="请输入" onChange={(e)=>this.handleInput(e,"enterIntentionTemplate")} onClick={this.handleSelection}/>
                          </FormItem>
                       </Col>
                    </Row>
                    <div className={Styles.wordslot}>
                        <span>词槽:</span>
                        {this.renderWordslotSpan('enterIntentionTemplate')}
                    </div>
                  </Form>
            
                </Modal>

                <Modal
                    title="配置"
                    visible={modalConfigVisible}
                    onOk={this.handleConfigOk}
                    onCancel={this.handleConfigCancel}
                >
                  <Form layout='inline'>
                    <Row>
                       <Col span={24}>
                          <FormItem
                             label="唤醒模板"
                          >
                             <TextArea autosize={{minRows:3,maxRows:6}} style={{minWidth:'300px'}}  onClick={this.handleSelection} placeholder="请输入" value={configEnterIntentionTemplate} 
                             onChange={this.handleConfigTemplate} onKeyDown={(e)=>this.handleTextChange(e,'enterIntentionTemplate',this.value)}/>
                          </FormItem>
                       </Col>
                    </Row>
                    <div className={Styles.wordslot}>
                        <span>词槽:</span>
                        {this.renderWordslotSpan('configEnterIntentionTemplate')}
                    </div>
                  </Form>

                </Modal>
                <Modal
                    title="配置场景意图关系"
                    visible={modalSceneRelation}
                    onOk={this.handleRelationOk}
                    onCancel={this.handleRelationCancel}
                    className={Styles.modal}
                    style={{minHeight:'500px'}}
                >
                    <List
	                     dataSource={data.relationList}
	                     header={ 
	                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
	                                <Col span={6}>
	                                     目标意图
	                                </Col>
	                                <Col span={8}>
	                                     源词槽
	                                </Col>
	                                <Col span={10}>
                                         目标词槽
	                                </Col>
	                            </Row>}
	                     renderItem={(item)=>{
	                        return (
	                           <List.Item>
	                              <Form layout="inline" style={{width:'100%'}}>
	                                 <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
	                                  <Col span={6}>
	                                     {item.destIntentionName}
	                                  </Col>
	                                  <Col span={8}>
	                                      {item.srcWordslotName}
	                                  </Col>
                                      <Col span={10}>
                                          {item.destWordslotName}
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
            </Card>
		)
	}

}