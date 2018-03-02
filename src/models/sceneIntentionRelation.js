
import {getsceneIntentionRelationList,getSceneIntentionbyIntentionId,getWordSlotsByIntentionId,savesceneintentionrelation,delSceneIntentionRelation} from '../services/api';

export default{
	namespace:'sceneIntentionRelation',
	state:{
		data:{
			list:[],
			pagination:{},
			intentionList:[],//场景ID下可分配的意图列表
			srcWordslotList:[],//源意图词槽列表
			destWordslotList:[]  //目标意图词槽列表
		},
		loading:false
	},
	effects:{
		*fetch({payload,callback},{put,call}){
        	yield put({
        		type:'changeLoading',
        		payload:true
        	})
        	const response=yield call(getsceneIntentionRelationList,payload);
        	//console.log("response si "+JSON.stringify(response));
        	yield put({
        		type:'save',
        		payload:response['result']
        	})
        	if(callback)callback();
		},
		//获取场景和当前待分配的意图外的意图
		*getsceneIntentionById({payload,callback},{put,call}){
            yield put({
            	type:'changeLoading',
            	payload:true
            })
            const response=yield call(getSceneIntentionbyIntentionId,payload);
            //console.log("response is "+JSON.stringify(response));
            let temp={};
            temp['intentionList']=response['result']['data']['list'];
            yield put({
            	type:'saveIntentionList',
            	payload:temp
            })
            if(callback)callback();
		},
		*getWordSlotsByIntentionId({payload,callback},{put,call}){

			console.log("getWordslot !!!!");
			yield put({
				type:'changeLoading',
				payload:true
			})
			const response=yield call(getWordSlotsByIntentionId,payload);
			//console.log("response si "+JSON.stringify(response));
			let temp={};
			if(payload.flag=='src'){
               temp['srcWordslotList']=response['data']['list'];
			}else{
				temp['destWordslotList']=response['data']['list'];
			}
			 yield put({
			 	type:'saveWordslotList',
			 	payload:temp
			 })
			 if(callback)callback();
		},
		*savesceneintentionrelation({payload,callback},{put,call}){
			yield put({
				type:'changeLoading',
				payload:true
			})
			const response=yield call(savesceneintentionrelation,payload);

			//console.log("response is "+JSON.stringify(response));
			yield put({
				type:'save',
				payload:response['result']
			})
			if(callback)callback();

		},
		*del({payload,callback},{put,call}){
			yield put({
				type:'changeLoading',
				payload:true
			})
			const response=yield call(delSceneIntentionRelation,payload);
			yield put({
				type:'save',
				payload:response['result']
			})
			if(callback)callback();
			//console.log("response is "+JSON.stringify(response));

		}
	},
	reducers:{
		changeLoading(state,{payload}){
			return {
				...state,
				loading:true
			}
		},
		save(state,{payload}){
			return {
				...state,
				...payload,
				loding:false
			}
		},
		saveIntentionList(state,{payload}){
			return {
				...state,
				data:{
                    ...state.data,
                    ...payload
				},
				loading:false
			}
		},
		saveWordslotList(state,{payload}){
			return {
				...state,
				data:{
					...state.data,
					...payload,

				},
				loading:false
			}
		}
	}
}