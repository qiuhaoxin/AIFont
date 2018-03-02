import {routerRedux} from 'dva/router';
import {loginForAccount} from '../services/userApi';

export default {
	namespace:'login',
	state:{
		status:undefined,
	},
	effects:{
		*login({payload,callback},{call,put}){
			console.log("payload is "+JSON.stringify(payload));
			yield put({
				type:'changeSubmitting',
				payload:true
			});
			const response=yield call(loginForAccount,payload);
			yield put({
				type:'changeLoginStatus',
				payload:response['result']
			});
			if(response['result'].result=='1'){
				yield put(routerRedux.push('/'));
			}else if(callback){
                 callback(response['result']);
			}

		},
		*logout(_,{put}){
			yield put({
				type:'changeLoginStatus',
				payload:{
					status:false
				},
			});
			console.log("hei logout");
			yield put(routerRedux.push('/user/login'));
		},
	},
	reducers:{
		changeLoginStatus(state,{payload}){
			console.log("payload resutl is "+JSON.stringify(payload));
			return {
				...state,
				status:payload.status,
				type:payload.type,
				submitting:false,
			};
		},
		changeSubmitting(state,{payload}){
			return {
				...state,
				submitting:payload,
			};
		},
	},
};
