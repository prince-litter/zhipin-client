/*
包含n个reducer函数：根据老的state和指定的action返回一个新的state
*/
//利用工具合并reducer
import {combineReducers} from 'redux'
import {AUTH_SUCCESS,
        ERROR_MSG,
        RESET_USER,
        RECEIVE_USER, 
        RECEIVE_USER_LIST,
        RECEIVE_MSG_LIST,
        RECEIVE_MSG,
        MSG_READ
    } from './action-types'
import {getRedirectTo} from '../utils/index'
const initUser = {
    username: '',//用户名
    type: '',   // dashen/laoban
    msg: '', //错误提示信息
    redirectTo: ''//需要自动重定向的路径
}
//产生user状态的reducer
function user(state=initUser, action){
    switch(action.type){
        case AUTH_SUCCESS:
            const {type, header} = action.data
            return  {...action.data, redirectTo: getRedirectTo(type, header)}
        case ERROR_MSG:
            return  {...state, msg: action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return {...initUser, msg: action.data}
        default:
            return state
    }
}
//产生userlist状态的reducer
const initUserList = []
function userList(state=initUserList, action){
    switch(action.type){
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}
//产生聊天状态的reducer
const initChat = {
    users:{},
    chatMsgs: [],
    unReadCount: 0
}
function chat(state=initChat, action){
    switch(action.type){
        case RECEIVE_MSG_LIST:
            const {users, chatMsgs, userid} = action.data
            return {
                users,
                chatMsgs,
                unReadCount:chatMsgs.reduce((preTatol, msg) => preTatol + (msg.to === userid && !msg.read ? 1 : 0),0)
            }
        case RECEIVE_MSG:
            const {chatMsg} = action.data
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount:state.unReadCount + (chatMsg.to === action.data.userid && !chatMsg.read ? 1 : 0)
            }
        case MSG_READ:
            const {count, from , to} = action.data
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from === from && msg.to === to && !msg.read){//需要更新
                        return {...msg, read:true}
                    }
                    else{
                        return msg
                    }
                   
                }),
                unReadCount:state.unReadCount - count
            }
        default:
            return state
    }
}




// function xxx(state=0, action){
//     return state
// }
// function yyy(state=0, action){
//     return state
// }

export default combineReducers({
    // xxx,
    // yyy
    user,
    userList,
    chat
})
//向外暴露的结构是一个对象