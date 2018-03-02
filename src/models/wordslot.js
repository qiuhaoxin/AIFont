import {routerRedux} from 'dva/router';
import {getWordSlotsByIntentionId,getIntentionById,addOrUpdateWordSlot,delWordSlot,
    updateIntention,getSpecWord,saveSpecWord,modifyseq} from '../services/api';


export default {
    namespace:'wordslot',
    state:{
    	data:{
            intention:{},
    		list:[],
    		pagination:{},
            total:0
    	},
        specData:{
            list:[],
            pagination:{

            }
        },
    	loading:false
    },
    effects:{
        *fetch({payload,callback},{put,call}){
            yield put({
            	type:'changeLoading',
            	payload:true
            })
            const response=yield call(getIntentionById,payload);
            console.log("response is "+JSON.stringify(response));
            //构建
            const data=response['result']['data']['list'][0];
            const tempData={},intention={};
            intention['fIsConfirm']=data['fIsConfirm'];
            intention['fcreateTime']=data['fcreateTime'];
            intention['fid']=data['fid'];
            intention['fname']=data['fname'];
            intention['fcomfirmTemplate']=data['fcomfirmTemplate'];
            intention['fnumber']=data['fnumber'];
            intention['fstatus']=data['fstatus'];
            tempData['intention']=intention;
            tempData['list']=data['wordSlotList'];
            tempData['total']=response["result"]["data"]["total"];
            console.log("template is "+data['fcomfirmTemplate']);
            yield put({
                type:'save',
                payload:tempData
            })
            if(callback)callback();
        },
        //添加或修改词槽
        *addOrUpdate({payload,callback},{put,call}){
            yield put({
                type:'changeLoading',
                payload:true
            })
            //console.log("payload is "+JSON.stringify(payload));
            const response= yield call(addOrUpdateWordSlot,payload);
           // console.log("response is "+JSON.stringify(response));
            if(payload['FID']==0){
               //新增
                //构建
                yield put({
                    type:'del',
                    payload:response['result']['data']
                })
            }else{
               //修改
                yield put({
                    type:'update',
                    payload:response['result']['data']['list'][0]//JSON.parse(response["result"]['data'])
                })
            }
            if(callback)callback(false,response['result']['data']['list'][0]['fwordslotConfigId']);
        },
        *delete({payload,callback},{put,call}){
            yield put({
                type:'changeLoading',
                payload:true
            })
            const response=yield call(delWordSlot,payload);
            yield put({
                type:'del',
                payload:response['result']['data']
            })
        },
        *clear({payload,callback},{put}){
            yield put({
                type:'clear',
            })
        },
        *updateIntention({payload,callback},{put,call}){
            yield put({
                type:'changeLoading',
                payload:true
            })
            const response=yield call(updateIntention,payload);
           yield put({
                type:'changeLoading',
                payload:false
           })

        },
        *fetchSpecWordslot({payload,callback},{put,call}){
           // console.log("payl is "+JSON.stringify(payload));
            yield put({
                type:'changeLoading',
                payload:true
            })
            const response=yield call(getSpecWord,payload);
           // console.log("repsonse is "+JSON.stringify(response));
            yield put({
                type:'saveSpecData',
                payload:response['result']['data']
            })
            if(callback)callback();
            
        },
        *modifyseq({payload,callback},{put,call}){
            yield put({
                type:'changeLoading',
                payload:true
            })
            const response=yield call(modifyseq,payload);
            console.log("response data is "+JSON.stringify(response));
            yield put({
                type:'del',
                payload:response['result']['data']
            })
        }
    },
    reducers:{
        saveSpecData(state,{payload}){
            return {
                ...state,
                specData:{
                    ...state.specData,
                    ...payload
                },
                loading:false
            }
        },
    	save(state,{payload}){
            payload={data:payload};
            return {
                ...state,
                ...payload,
                loading:false
            }
    	},
        update(state,{payload}){
            let flag=false;
            //console.log("payload is "+JSON.stringify(payload));
            const temp=payload;
           // console.log("payload is "+JSON.stringify(temp));
            state.data.list.map(item=>{
                if(item.fid==temp['fid']){
                    flag=true;
                    item['fname']=temp['fname'];
                    item['fnumber']=temp['fnumber'];
                    item['ftype']=temp['ftype'];
                    item['fisSpec']=temp['fisSpec'];
                }
            })
            if(!flag){
                state.data.list.push(temp);
            }
            return {
                ...state,
                data:{
                    ...state.data,
                    ...payload
                },
                loading:false
            }
        },
        del(state,{payload}){
            return {
                ...state,
                data:{
                    ...state.data,
                    ...payload
                },
                loading:false
            }
        },
        clear(state,{payload}){
            return {
                ...state,
                data:{
                    list:[]
                }
            }
        },
        changeLoading(state,{payload}){
        	return {
        		...state,
        		loading:payload
        	}
        }
    }

}