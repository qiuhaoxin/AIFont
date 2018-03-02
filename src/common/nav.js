import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['login','user'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: 'AI配置',
        icon: 'dashboard',
        path: 'AIConfig',
        children: [
          {
            name:'场景',
            path:'Scene',
            visible:true,
            component:dynamicWrapper(app,['scene'],()=>import('../routes/AIConfig/Scene'))
          },
          {
            name: '意图',
            path: 'Intention',
            visible:true,
            component: dynamicWrapper(app, ['intention'], () => import('../routes/AIConfig/Intention')),
          },
          {
            name: '词槽',
            path: 'EditIntention/:faction/:fid',
            visible:false,
            component: dynamicWrapper(app, ['wordslot','intention'], () => import('../routes/AIConfig/EditIntention')),
          },
          {
             name:'分配',
             path:'Dispatch/:intentionId/:intentionName',
             visible:false,
             component:dynamicWrapper(app,['dispatch','wordslot','system'],()=>import('../routes/AIConfig/Dispatch'))
          },
          {
            name:'业务系统',
            path:'system',
            visible:true,
            component:dynamicWrapper(app,['system'],()=>import('../routes/AIConfig/system'))
          },
          {
            name:'场景意图分配',
            path:'sceneIntention/:sceneId/:sceneName',
            visible:false,
            component:dynamicWrapper(app,['sceneIntention'],()=>import('../routes/AIConfig/sceneIntention'))
          },
          {
            name:'词槽继承关系配置',
            path:'SceneIntentionRelation/:sceneId/:srcIntentionId/:sceneName',
            visible:false,
            component:dynamicWrapper(app,['sceneIntentionRelation'],()=>import('../routes/AIConfig/SceneIntentionRelation'))
          }
        ],
      },
      {
        name:'管理',
        icon:'user',
        path:'manager',
        children:[
          {
            name: '用户管理',
            path: 'userManager',
            visible:true,
            component: dynamicWrapper(app, ['user'], () => import('../routes/manager/userManager')),
          },
        ]
      }
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '统计',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
          {
            name:"注册",
            path:'register',
            component:dynamicWrapper(app,['register'],()=>import('../routes/User/register'))
          }
        ],
      },
    ],
  },
];
