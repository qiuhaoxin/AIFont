/*
*  api接口 
*/
import {stringify} from 'qs';
import request from '../utils/request';
//const postUrl="/rest/ui";//部署到正式环境通过上下文来获取
const postUrl="http://localhost:8888/rest/ui";
//各业务操作的接口

//获取意图列表
export function getIntention(params){
     return request(postUrl+"/intent/getintentionlist",{//getintentionlist
     	method:'POST',
     	body:params,
     })
}

//保存意图
export function saveIntention(params){
     return request(postUrl+"/intent/saveIntention",{
     	method:'POST',
     	body:params,
     })
}

//删除出意图
export function delIntention(params){
	 console.log("params is "+JSON.stringify(params));
	 return request(postUrl+"/intent/delIntention",{
	 	method:'POST',
	 	body:params,
	 })
}

//更新意图
export function updateIntention(params){
	return request(postUrl+"/intent/updateIntention",{
		method:'POST',
		body:params,
	})
}

//根据FId 获取意图
export function getIntentionById(params){
    return request(postUrl+"/intent/getIntentionById",{
    	method:'POST',
    	body:params,
    })
}

//获取意图的词槽
export function getWordSlotsByIntentionId(params){
	return request(postUrl+"/wordSlot/getWordSlot",{
         method:'POST',
         body:params,
	})
}

//增加或修改词槽
export function addOrUpdateWordSlot(params){
	return request(postUrl+"/wordSlot/addOrUpdate",{
		method:'POST',
		body:params,
	})
}
//删除词槽
export function delWordSlot(params){
	return request(postUrl+"/wordSlot/delete",{
		method:'POST',
		body:params,
	})
}

//获取业务系统
export function getSystemList(params){
	 return request(postUrl+"/bizSystem/getsysList",{
	 	method:'POST',
	 	body:params,
	 })
}


//新增或更新业务系统
export function addOrUpdateSystem(params){
	return request(postUrl+"/bizSystem/saveBizSys",{
		method:'POST',
		body:params,
	})
}
//删除业务系统
export function delSystem(params){
	return request(postUrl+"/bizSystem/delBizSys",{
		method:'POST',
		body:params,
	})
}
//获取特殊词槽的配置及配置详情
export function getSpecWord(params){  //getspecconfig
	return request(postUrl+"/wordSlot/getspecconfig",{
		method:'POST',
		body:params,
	})
}

//保存特殊词槽的配置和配置详情
export function saveSpecWord(params){
	return request(postUrl+"/wordSlot/savespecconfig",{
		method:'POST',
		body:params,
	})
}


//修改词槽的优先级
export function modifyseq(params){
	return request(postUrl+"/wordSlot/modifyseq",{
		method:'POST',
		body:params,
	})
}

//根据意图ID获取分配的相关业务系统列表
export function getBizIntention(params){
    return request(postUrl+"/biz/getbizlist",{
    	method:'POST',
    	body:params,
    })
}

//根据意图获取该意图下未分配的业务系统
export function getsystem(params){
	return request(postUrl+"/biz/getsystem",{
		method:'POST',
		body:params,
	})
}

//新增或修改意图分配
export function addorupdate(params){
	console.log("params is "+JSON.stringify(params));
	return request(postUrl+"/biz/addorupdate",{
		method:'POST',
		body:params,
	})
}

//删除分配意图
export function delBiz(params){
	return request(postUrl+"/biz/delbiz",{
		method:'POST',
		body:params,
	})
}

//获取分配意图下的分配词槽getbizwordslotbyid   //getbizwordslot
export function getbizwordslot(params){
	return request(postUrl+"/biz/getbizwordslotbyid",{
		method:'POST',
		body:params,
	})
}

//获取场景列表
export function getSceneList(params){
    return request(postUrl+"/scene/getscenelist",{
    	method:'POST',
    	body:params,
    })
}

//根据场景ID和当前待配置的意图ID获取意图（配置词槽继承关系）
export function getSceneIntentionbyIntentionId(params){
	return request(postUrl+"/scene/getIntentionbyId",{
		method:'POST',
		body:params,
	})
}

//新增或修改场景
export function addOrUpdate(params){
	return request(postUrl+"/scene/addorupdate",{
		method:'POST',
		body:params,
	})
}
//删除场景
export function delScene(params){
    return request(postUrl+"/scene/delscene",{
    	method:'POST',
    	body:params,
    })
}

//获取场景下的意图列表
export function getsceneIntentionById(params){
	return request(postUrl+"/scene/getsceneIntentionById",{
		method:"POST",
		body:params,
	})
}

//修改场景意图
export function updateSceneIntention(params){
	return request(postUrl+"/scene/updatesceneintention",{
		method:'POST',
		body:params,
	})
}

//添加场景意图
export function addSceneIntention(params){
	return request(postUrl+"/scene/addsceneintention",{
		method:'POST',
		body:params,
	})
}

//删除场景意图
export function delSceneIntention(params){
	return request(postUrl+"/scene/delsceneIntention",{
		method:'POST',
		body:params,
	})
}

//修改场景意图的优先级
export function modifySceneIntentionSeq(params){
	return request(postUrl+"/scene/modifyseq",{
		method:'POST',
		body:params,
	})
}

//获取场景意图关系列表
export function getsceneIntentionRelationList(params){
	return request(postUrl+"/scenerelation/getrelationlist",{
		method:'POST',
		body:params,
	})
}

//保存场景意图下词槽继承关系
export function savesceneintentionrelation(params){
	return request(postUrl+"/scenerelation/savesceneintentionrelation",{
		method:'POST',
		body:params,
	})
}

//删除场景意图下词槽继承关系
export function delSceneIntentionRelation(params){
	return request(postUrl+"/scenerelation/delSceneInte",{
		method:'POST',
		body:params,
	})
}