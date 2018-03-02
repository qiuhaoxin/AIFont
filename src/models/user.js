import {getCurrentUser,getUserList,delUser,addorupdateuser} from '../services/userApi';
import {test} from '../services/api';
export default {

	namespace:'user',
	state:{
    data:{
      list:[],
      pagination:{}
    },
		loading:false,
		currentUser:{},

	},
	effects:{
    //获取用户列表
		*fetch({payload,callback},{call,put}){

         yield put({
            type:'changeLoading',
            payload:true
         })   
         const response=yield call(getUserList,payload);
         console.log("response is "+JSON.stringify(response));
         yield put({
            type:'save',
            payload:response['result']
         });
         if(callback)callback();
		},
		*test({payload},{call,put}){
           const response= yield call(test,payload);
           console.log("resut is "+response['msg']);
		},
		*fetchCurrentUser({payload},{call,put}){
        const response=yield call(getCurrentUser);
          yield put({
              type:'saveCurrentUser',
              payload:{userName:response.userName,avatar:response.avatar}
        });
		},
    //删除用户
    *delUser({payload,callback},{call,put}){
         yield put({
            type:'changeLoading',
            payload:true
         })
         const response=yield call(delUser,payload);
         yield put({
              type:'save',
              payload:response['result']
         })
         if(callback)callback();
    },
    //新增或修改用户信息
    *addOrUpdate({payload,callback},{call,put}){
        yield put({
           type:'changeLoading',
           payload:true
        })
        const response=yield call(addorupdateuser,payload);
        console.log("response is "+JSON.stringify(response));
        if(payload.FID==0){
           yield put({
              type:'save',
              payload:response['result']
           })
        }else{
           yield put({
              type:'update',
              payload:response['result']['data']['obj']
           })
        }
        if(callback)callback();
    }
	},
	reducers:{
       save(state,{payload}){
       	  return {
       	  	   ...state,
               ...payload,
               loading:false
       	  };
       },
       changeLoading(state,action){
       	  return {
       	  	...state,
       	  	loading:action.payload
       	  }
       },
       saveCurrentUser(state,action){
       	   return {
       	   	   ...state,
       	   	   currentUser:action.payload
       	   }
       },
       update(state,{payload}){
           console.log("payload is "+JSON.stringify(payload));
           state.data.list.map(item=>{
              if(item.fID==payload.fID){
                item['fName']=payload['fName'];
                item['fEmail']=payload['fEmail'];
                item['fFullName']=payload['fFullName'];
                item['fMobile']=payload['fMobile'];
                item['FIsActive']=payload['FIsActive'];
              }
           })
           return {
               ...state,
               list:{
                   ...state.data

               },
               loading:false
           }
       }
	}
}