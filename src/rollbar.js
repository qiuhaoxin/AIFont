import Rollbar from 'rollbar'

if(window.location.host==""){
	Rollbar.init({
		accessToken:'',
		captureUncaght:true,
		captureUnhandledRejection:true,
		payload:{
			environment:'production'
		}
	})

}