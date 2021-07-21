/*
包含n个action creator
异步action
同步action
*/
import {
    reqRegister,
    reqLogin, 
    reqUpdate,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
} from '../api/index'
import {AUTH_SUCCESS, 
        ERROR_MSG,
        RECEIVE_USER,
        RESET_USER, 
        RECEIVE_USER_LIST,
        RECEIVE_MSG,
        RECEIVE_MSG_LIST,
        MSG_READ
    } from './action-types'

import io from 'socket.io-client'

/*
   单列对象
   1.创建对象之前：判断对象是否已经存在，只有不存在才去创建
   2.创建之后：保存对象 
*/
 function initIO(dispatch,userid) {
    //1.创建对象之前：判断对象是否已经存在，只有不存在才去创建
     if(!io.socket){
        //链接服务器，的带代表连接的socket对象
        //2.创建之后：保存对象 
        io.socket = io('ws://localhost:4000')

        //绑定receiveMessage的监听，来接收服务器发送的消息
        io.socket.on('receiveMsg',function(chatMsg) {
            //只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
            // console.log('浏览器接收到消息：', chatMsg)
            if(userid === chatMsg.to || userid === chatMsg.from){
                dispatch(reveiceMsg({chatMsg, userid}))
            }
        })
     }
  

}

//异步获取消息数据
async function getMsgList(dispatch, userid) { 
    initIO(dispatch, userid)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code === 0){
        const {users, chatMsgs} = result.data
        dispatch(reveiceMsgList({users, chatMsgs, userid}))
    }
 }


//发送消息
export const sendMsg = ({from, to, content})=> {
    return dispatch =>{
        console.log('发送消息：', {from, to, content})
       
        //发消息
        io.socket.emit('sendMsg', {from, to, content})
    }
}

//授权成功的同步action
const authSuccess = (user) =>({type: AUTH_SUCCESS, data: user})
//错误提示信息的同步action
const errMsg = (msg) =>({type: ERROR_MSG, data: msg})
//接收用户的同步action
const reveiveUser = (user) => ({type: RECEIVE_USER, data: user})
//重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
//接收用户列表的同步action
const reveiceUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
//接收消息列表的同步action
const reveiceMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}})
//接收一个消息的同步action
const reveiceMsg = ({chatMsg, userid}) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
//更新已读消息的同步action
const msgRead = ({count, from , to}) => ({type: MSG_READ, data: {count, from , to}})


//注册action
export const register = (user) =>{
    const {username, password, password2, type} = user
    if(!username){
        return errMsg('用户名不能为空')
    }else if(password !== password2){
        return errMsg('两次密码不一致')
    }
    return async dispatch =>{
        //发送注册的异步请求{
        const response = await reqRegister({username, password, type})
        const result = response.data
        if(result.code === 0){  //成功
            getMsgList(dispatch,result.data._id)
            //分发授权成功的同步action
            dispatch(authSuccess(result.data))
        }else{ //失败
            //分发错误提示信息的同步action
            dispatch(errMsg(result.msg))
        }
    }
} 
//登录action
export const login = (user) =>{
    const {username, password} = user
    if(!username){
        return errMsg('用户名不能为空')
    }else if(!password){
        return errMsg('密码必须指定')
    }
    return async dispatch => {
        //发送登录的异步请求
        const response = await reqLogin(user)
        const result = response.data
        if(result.code === 0){  //成功
            getMsgList(dispatch, result.data._id)
            //分发授权成功的同步action
            dispatch(authSuccess(result.data))
        }else{ //失败
            //分发错误提示信息的同步action
            dispatch(errMsg(result.msg))
        }
    }
}
//更新用户信息异步action
export const updateUser = (user) =>{
    return async dispatch =>{
        const response = await reqUpdate(user)  
        const result = response.data
        if(result.code === 0){
            dispatch(reveiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}
//获取用户信息异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if(result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(reveiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}
//获取用户列表异步action
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        if(result.code === 0){
            dispatch(reveiceUserList(result.data))
        }
    }
}
//更新消息未读数
export const readMsg = (from,to)=>{
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code === 0){
            const count = result.data
            dispatch(msgRead({count, from, to}))
        }
    }
}


