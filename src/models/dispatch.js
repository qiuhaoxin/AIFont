import {routerRedux} from 'dva/router';
import {getBizIntention,getsystem,addorupdate,delBiz,getbizwordslot} from '../services/api';

export default {
	namespace:'distribute',
	state:{
       data:{
          list:[],
          pagination:{},
          total:0,
       },
       wordslotData:{
          list:[],
          pagination:{},
          total:0
       },
       systems:[],//未分配的业务系统
       eixtSys:{},//意图已分配的系统
       loading:false
	},
	effects:{
       *fetch({payload,callback},{put,call}){
       	  console.log("payload is "+JSON.stringify(payload));
           yield put({
           	   type:'changeLoading',
           })
           const repsonse=yield call(getBizIntention,payload);
           console.log("repsonse si "+JSON.stringify(repsonse));
           yield put({
           	  type:'save',
           	  payload:repsonse['result']
           })
           if(callback) callback();
       },
       *getSysList({payload,callback},{put,call}){
       	    yield put({
       	    	type:'changeLoading',

       	    })
       	    const repsonse=yield call(getsystem,payload);
       	    //console.log("getSystemList repsonse is "+JSON.stringify(repsonse));
       	    yield put({
       	    	type:'syncSystem',
       	    	payload:{
                   systems:repsonse['result']['data']['list'],
                   eixtSys:payload
       	    	}
       	    })
            if(callback) callback();
       },
       *addOrUpdateBiz({payload,callback},{put,call}){
       	   yield put({
       	   	  type:'changeLoading'
       	   })
       	   console.log("addOrUpdateBiz"+JSON.stringify(payload));
       	   const repsonse=yield call(addorupdate,payload);
       	   console.log("repsonse is "+JSON.stringify(repsonse));
       	   if(payload.fid==0){
       	   	   yield put({
       	   	   	  type:'save',
       	   	   	  payload:repsonse['result']
       	   	   })
       	   }else{

       	   }
       	   if(callback)callback();
       },
       *del({payload,callback},{put,call}){
       	   yield put({
       	   	  type:'changeLoading'
       	   })
       	   const repsonse=yield call(delBiz,payload);
       	   yield put({
       	   	  type:'save',
       	   	  payload:repsonse['result']
       	   })

       },
       *fetchBizWordslot({payload,callback},{put,call}){
       	   yield put({
       	   	  type:'changeLoading'
       	   })
       	   const response=yield call(getbizwordslot,payload);
       	   console.log("response is "+JSON.stringify(response));
       	   yield put({
       	   	   type:'saveBizwordslot',
       	   	   payload:response['result']['data']
       	   })
       	   if(callback)callback();
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
           return{
           	   ...state,
           	   ...payload,
           	   loading:false
           }
       },
       syncSystem(state,{payload}){
           return {
           	  ...state,
           	  ...payload,
           	  loading:false
           }
       },
       update(state,{payload}){
       	   return {
       	      ...state,

       	   }
       },
       saveBizwordslot(state,{payload}){
       	   return {
       	   	  ...state,
       	   	  wordslotData:{
       	   	  	  ...state.wordslotData,
       	   	  	  ...payload
       	   	  },
       	   	  loading:false
       	   }
       }

	}

}