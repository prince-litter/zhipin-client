import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile' 

import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import Chat from '../chat/chat'
import NotFound from '../../components/not-found/not-found'
import {getRedirectTo} from '../../utils/index'
import {getUser} from '../../redux/actions'
import NavFooter from '../../components/nav-footer/nav-footer'
class Main extends Component{
    //给组件对象添加属性
    navList = [ //包含所有导航组件的相关信息数据
        {
            path:'/laoban',
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'            
        },
        {
            path:'/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'            
        },
        {
            path:'/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'            
        },
        {
            path:'/personal',
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人'            
        },

    ]

    componentDidMount () {
        //登录过（cookie中有userid）,但现在没有登录（redux管理的user中没有_id）发请求获取
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if(userid && !_id){
            //发送异步请求
            this.props.getUser()
            // console.log('发送异步请求')
        }
    }
    render(){
        //读取cookie中的useid
        const userid = Cookies.get('userid')
        //如果没有，自动重定向到登录界面
        if(!userid){
            return <Redirect to="/login"/>
        }
        //如果有，读取redux中的user状态
         const {user, unReadCount} = this.props
        if(!user._id){
            return null
        }else{
            //如果有跳转到对应的界面
            //如果请求根路径，根据type和header重新计算出一个重定向的路由路径
            let path = this.props.location.pathname
            if(path === '/'){
                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path}/>
            }
            
        }
        const {navList} = this
        const path = this.props.location.pathname
        const currentNav = navList.find(nav => nav.path === path)//得到当前nav
        if(currentNav){
            if(user.type ==='laoban'){
                navList[1].hide = true
            }else{
                navList[0].hide = true
            }
        }
       
        return(
            <div>
                {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {navList.map((nav, index) => <Route path={nav.path} component={nav.component} key={index}></Route>)}
                    <Route path='/dasheninfo' component={DashenInfo}></Route>
                    <Route path='/laobaninfo' component={LaobanInfo}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound}/>   
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
            </div>
           
        )
    }
}
export default connect(
    state =>({user: state.user,unReadCount: state.chat.unReadCount}),
    {getUser}
)(Main)