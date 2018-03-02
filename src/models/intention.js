import {routerRedux} from 'dva/router';
import {getIntention,saveIntention,delIntention,updateIntention} from '../services/api';


export default {

	namespace:'intention',
	state:{
		data:{
			list:[],
			pagination:{},
		},
		loading:true,
	},
	effects:{
       *fetch(payload,{call,put}){
           yield put({
           	  type:'changeLoading',
           	  payload:true
           })
           const response=yield call(getIntention,payload.payload);
           console.log("response is "+JSON.stringify(response));
           yield put({
           	  type:'save',
           	  payload:response['result']
           })
       },
       *addIntention({payload,callback},{call,put}){
           yield put({
              type:'changeLoading',
              payload:true
           })
           const response=yield call(saveIntention,payload);
           console.log("response is "+JSON.stringify(response));
           yield put({
              type:'changeLoading',
              payload:false
           })
           //新增意图成功后返回的意图FID ，做后续的新增相应词槽用
           const FID=response['data']['fid'];
           if(callback)callback(FID);
           
       },
       *updateIntention({payload,callback},{call,put}){
        console.log("payload is "+JSON.stringify(payload));
           yield put({
              type:'changeLoading',
              payload:true
           })
           const response=yield call(updateIntention,payload);
           yield put({
               type:'changeLoading',
               payload:false
           })
           yield put({
               type:'update',
               payload:response.data
           })
           if(callback) callback();
       },
       *delIntention({payload,callback},{call,put}){
            yield put({
                type:'changeLoading',
                payload:true
            })
            const response=yield call(delIntention,payload);
            // yield put({
            //    type:'changeLoading',
            //    payload:false
            // })
            yield put({
              type:'save',
              payload:response['result']
            })
            if(callback) callback();

       },
       *jump({payload},{put}){
           console.log("payload2 is "+JSON.stringify(payload));
          if(payload.action=='dispatch'){
            console.log("test");
               yield put(routerRedux.push("/AIConfig/Dispatch/"+payload.fid+"/"+payload.intentionName))
           }else{
               yield put(routerRedux.push("/AIConfig/EditIntention/"+payload.action+"/"+payload.fid))
           }


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
        update(state,{payload}){
            state.data.list.map(item=>{
                if(item.fid==payload.fid){
                  item.fname=payload.fname;
                  item.fnumber=payload.fnumber;
                }
            })
            return {
              ...state,
              data:{
                ...state.data,
                ...payload
              }
            }
        },
        changeLoading(state,{payload}){
        	return {
        		...state,
        		loading:payload
        	}
        },
        saveTempData(state,{payload}){
          //console.log("payload is "+JSON.stringify(payload));
            return {
              ...state,
              tempIntention:payload
            }
        }

	}
}