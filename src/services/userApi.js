/*
*  用户API包括登录等
*/

import request from '../utils/request';
//const postUrl="/rest/ui";//部署到正式环境通过上下文来获取

const postUrl="http://localhost:8888/rest/ui";

//获取默认用户
export function getCurrentUser(params){
    return request(postUrl+"/login/getcurrentuser",{
    	method:'GET',
    	body:params,
    });
};

//用户登录
export function loginForAccount(params){
    return request(postUrl+"/login/Login",{
    	method:"POST",
    	body:params,
    })
}

//注册用户
export function fakeRegister(params){
	return request(postUrl+"/login/register",{
		method:'POST',
		body:params,
	})
}
//获取用户列表
export function getUserList(params){
	return request(postUrl+"/login/getuserlist",{
		method:'POST',
		body:params,
	})
}
//删除用户  管理员权限
export function delUser(params){
	return request(postUrl+"/login/delUser",{
		method:'POST',
		body:params,
	})
}

//添加或更新用户
export function addorupdateuser(params){
	return request(postUrl+"/login/addorupdateuser",{
		method:'POST',
		body:params,
	})
}
