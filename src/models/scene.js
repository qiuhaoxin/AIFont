import {getSceneList,getSceneIntentionbyIntentionId,addOrUpdate,delScene} from '../services/api';

export default{
	namespace:'scene',
	state:{
		data:{
			list:[],
			pagination:{},
			intentionList:[]
		},
		loading:false
	},
	effects:{
       *fetch({payload,callback},{put,call}){
            yield put({
            	type:'changeLoading',
            	payload:true
            })
            const response=yield call(getSceneList,payload);
            yield put({
            	type:'save',
            	payload:response['result']
            })
            if(callback)callback();

       },
       //获取场景下意图
       *fetchIntention({payload,callback},{put,call}){
       	    yield put({
       	    	type:'changeLoading',
       	    	payload:true
       	    })
       	    const response=yield call(getSceneIntentionbyIntentionId,payload);
       	    let temp={};
            temp['intentionList']=response['result']['data']['list'];
            yield put({
            	type:'saveIntention',
            	payload:temp
            })
            if(callback)callback();
       },
       *addOrUpdate({payload,callback},{put,call}){
       	  yield put({
       	  	type:'changeLoading',
       	  	payload:true
       	  })
       	  const response=yield call(addOrUpdate,payload);
       	  if(payload.id==0){
       	  	//new
             yield put({
             	type:'save',
             	payload:response['result']
             })
       	  }else{
             
       	  }
       	  if(callback)callback();
       },
       *delScene({payload,callback},{put,call}){
       	   yield put({
       	   	  type:'changeLoading',
       	   	  payload:true
       	   })
       	   console.log("payload is "+JSON.stringify(payload));
       	   const response=yield call(delScene,payload);
       	   console.log("response is "+JSON.stringify(response));
       	   yield put({
       	   	   type:'save',
       	   	   payload:response['result']
       	   })
       }
	},
	reducers:{
       changeLoading(state,{payload}){
       	   return {
       	   	  ...state,
       	   	  loading:payload
       	   }
       },
       save(state,{payload}){
           return {
           	   ...state,
           	   ...payload,
           	   loading:false
           }
       },
       saveIntention(state,{payload}){
       	  return {
       	  	...state,
       	  	data:{
                ...state.data,
                ...payload
       	  	}
       	  }
       }
	}
}