import {fakeRegister} from '../services/userApi';

export default {
	namespace:'register',
	state:{
       status: undefined
	},
	effects:{
	  *submit({payload,callback}, { call, put }) {
	      yield put({
	        type: 'changeSubmitting',
	        payload: true,
	      });
	      const response = yield call(fakeRegister,payload);
	      console.log("response is "+JSON.stringify(response));
	      yield put({
	        type: 'registerHandle',
	        payload: response,
	      });
	      yield put({
	        type: 'changeSubmitting',
	        payload: false,
	      });
	      if(callback)callback(response['result']);
	  }
	},
	reducers:{
	    registerHandle(state, { payload }) {
	      return {
	        ...state,
	        status: payload.status,
	      };
	    },
	    changeSubmitting(state, { payload }) {
	      return {
	        ...state,
	        submitting: payload,
	      };
	    },
	}
}