
import {getsceneIntentionById,getWordSlotsByIntentionId,updateSceneIntention,addSceneIntention,
	delSceneIntention,modifySceneIntentionSeq,getsceneIntentionRelationList} from '../services/api';


export default {
	namespace:'sceneIntention',
	state:{
        data:{
        	list:[],   //场景意图列表
        	pagination:{},
        	dispatchList:[],//新增场景意图的意图列表
        	wordslotList:[],//进入百度UNit 的查询语
        	relationList:[],
        	total:0
        },
        loading:false
	},
	effects:{
        *fetch({payload,callback},{put,call}){
             yield put({
             	type:'changeLoading',
             	payload:true
             })
             const response=yield call(getsceneIntentionById,payload);
             //console.log("response is "+JSON.stringify(response));
             if(payload.flag=='list'){
	             yield put({
	             	type:'save',
	             	payload:response['result']
	             })
             }else if(payload.flag=='new'){
                let temp={};
                temp['dispatchList']=response['result']['data']['list'];
                yield put({
                	type:'newFlag',
                	payload:temp
                })
             }
             if(callback)callback();
        },
        *fetchWordslotByIntentionId({payload,callback},{put,call}){
        	yield put({
        		type:'changeLoading',
        		payload:true
        	})
        	const response=yield call(getWordSlotsByIntentionId,payload);
        	let temp={};
        	temp['wordslotList']=response['data']['list'];
        	yield put({
        		type:'newFlag',
        		payload:temp
        	})
        	if(callback)callback();
        },
        //修改场景意图
        *updateSceneIntention({payload,callback},{put,call}){
        	yield put({
        		type:'changeLoading',
        		payload:true
        	})
        	const response=yield call(updateSceneIntention,payload);
            yield put({
            	type:'update',
            	payload:response['result']['data']['list'][0]
            })
        	if(callback)callback();

        },
        *addSceneIntention({payload,callback},{put,call}){
        	yield put({
        		type:'changeLoading',
        		payload:true
        	})
        	const response=yield call(addSceneIntention,payload);
            console.log("response is "+JSON.stringify(response));
        	yield put({
	            type:'save',
	            payload:response['result']
	        })
	        if(callback)callback();
        },
        *delSceneIntention({payload,callback},{put,call}){
        	yield put({
        		type:'changeLoading',
        		payload:true
        	})
        	const response=yield call(delSceneIntention,payload);
        	yield put({
	            type:'save',
	            payload:response['result']
	        })
	        if(callback)callback();
        },
        *modifySceneIntentionSeq({payload,callback},{put,call}){
        	yield put({
        		type:'changeLoading',
        		payload:true
        	})
        	const response=yield call(modifySceneIntentionSeq,payload);
        	yield put({
        		type:'save',
        		payload:response['result']
        	})
        	if(callback)callback();
        }

	},
	reducers:{
         save(state,{payload}){
            return {
            	...state,
            	...payload,
            	loading:false
            }
         },
         newFlag(state,{payload}){
            return {
            	...state,
            	data:{
                   ...state.data,
                   ...payload
            	}
            }
         },
         update(state,{payload}){
         	 let tempArr=state.data.list;
         	 tempArr.map(item=>{
         	 	if(item.fid==payload.fid){
         	 		item['sceneIntention']['askEnterTemplate']=payload['sceneIntention']['askEnterTemplate'];
         	 		item['sceneIntention']['enterIntentionTemplate']=payload['sceneIntention']['enterIntentionTemplate'];
         	 	}
         	 })
             return {
             	...state,
             	data:{
             		...state.data,
             		tempArr
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