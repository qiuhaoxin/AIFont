import {routeRedux} from 'dva/router';
import {getSystemList,addOrUpdateSystem,delSystem} from '../services/api';

export default {
	namespace:'system',
	state:{
		data:{
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
           const response=yield call(getSystemList,payload);
           console.log("response is "+JSON.stringify(response));
           yield put({
           	  type:'save',
           	  payload:response['result']
           })
       },
       *addOrUpdate({payload,callback},{put,call}){
       	console.log("payload is "+JSON.stringify(payload));
       	   yield put({
       	   	  type:'changeLoading',
       	   	  payload:true
       	   })
       	   const response=yield call(addOrUpdateSystem,payload);
       	   console.log("response is "+JSON.stringify(response));
       	  //  if(payload.FID!=0){
          //       yield put({
          //       	type:'update',
          //       	payload:response['result']
          //       })
       	  //  }else{
		        // yield put({
	       	 //   	   type:'save',
	       	 //   	   payload:response['result'],
	       	 //    })
       	  //  }
           yield put({
           	   type:payload.FID!=0?"update":"save",
           	   payload:response['result']
           })
       	   if(callback)callback();
       },
       *delSystem({payload,callback},{put,call}){
       	   yield put({
       	   	  type:'changeLoading',
       	   	  loading:true
       	   });
       	   const response=yield call(delSystem,payload);
       	   console.log("result si "+JSON.stringify(response));
       	   console.log("response is "+JSON.stringify(response['result']));
           yield put({
           	  type:'save',
           	  payload:response['result']
           })
       	   if(callback)callback();
       }
	},
	reducers:{
       changeLoading(state,{payload}){
       	   return {
       	   	  ...state,
       	   	  loading:payload
       	   }
       },
       save(state,{payload,FID}){
       	   return {
       	   	  ...state,
       	   	  ...payload,
       	   	  loading:false
       	   }
       },
       update(state,{payload,FID}){
       	    let dataItem=payload['data']['list'][0];
                state.data.list.map(item=>{
                    if(item.fID==dataItem.fID){
                    	item['fName']=dataItem['fName'];
                    	item['fNumber']=dataItem['fNumber'];
                    	item['fLoginAPI']=dataItem['fLoginAPI'];
                    	item['fcallbackAPI']=dataItem['fcallbackAPI'];
                    	item['fProdType']=dataItem['fProdType']
                }
            }) 
           return {
           	  ...state,
           	  list:{
           	  	  ...state.data.list,
           	  },
           	  loading:false
           }
       }
	}
}