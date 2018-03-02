import React,{PureComponent} from 'react';
import {Spin,Layout,Icon,Avatar,Dropdown,Menu} from 'antd';
import {connect} from 'dva';
import styles from './index.less'


const {Header}=Layout;
@connect(state=>({
   login:state.login
}
))
export default class GlobalHeader extends PureComponent{
	componentDidMount(){
        this.props.dispatch({
           type:'user/fetchCurrentUser',
           payload:{
              
           }
        })
	}
	componentWillUnmount(){

	}
	toggle=()=>{
        const {collapsed}=this.props;
        this.props.dispatch({
        	type:'global/changeLayoutCollapsed',
        	payload:!collapsed,
        });

	}
	triggerResizeEvent(){
		const event=document.createEvent('HTMLEvents');
		event.init('resize',true,false);
		window.dispatchEvent(event);
	}
  handleMenuClick=({key})=>{
    console.log("key is "+key);
    const {dispatch}=this.props;
      if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  }
  render(){
    	const {
    		currentUser,collapsed
    	}=this.props;
      const menu=(
         <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
            <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
            <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
         </Menu>
      )
      return (
          <Header className={styles.header}>
             <Icon
                className={styles.trigger}
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
             />
             <div className={styles.right}>
             {
             	currentUser.userName ? (
                <Dropdown overlay={menu}>
                   <span className={`${styles.action} ${styles.account}` }>
                      <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                      {currentUser.userName}
                   </span>
                </Dropdown>   
             	) : <Spin size='small' style={{marginLeft:8}} />
             }
             </div>
          </Header>
    	)

    }	
}