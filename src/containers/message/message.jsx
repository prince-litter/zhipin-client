import React,{Component} from 'react'
import { connect } from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

/*
    对chatMsgs按chat_id进行分组，并得到每个组的lastMsg组成的数组
    1.找出每个聊天的lastMsg,并用一个对象容器来保存{chat_id：lastMsg}
    2.得到所有lastMsg的数组
    3.对数组进行排序（按create_time降序）

*/
function getLastMsgs(chatMsgs, userid){
//1.找出每个聊天的lastMsg,并用一个对象容器来保存{chat_id：lastMsg}
    let lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        //对msg进行个体统计
        if(msg.to === userid && !msg.read){
            msg.unReadCount = 1
        }else{
            msg.unReadCount = 0
        }
        //得到分组的最后一条msg
        const lastMsg = lastMsgObjs[msg.chat_id]
        //判断分组是否存在最后一条msg
        if(!lastMsg){//不存在
            lastMsgObjs[msg.chat_id] = msg
        }else{//存在
            //对未读数进行累加，原来的lastMsg的unReadCount + 现在的msg的unReadCount
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
            //比较存在的msg和现在的msg那个出现的最晚，若更晚替换
            if(msg.create_time - lastMsg.create_time > 0){
                lastMsgObjs[msg.chat_id] = msg
            }
            //把累加的未读数赋给最新的最后一条msg
            lastMsgObjs[msg.chat_id].unReadCount = unReadCount
        }
    })
    //  2.得到所有lastMsgs的数组
    const lastMsgs = Object.values(lastMsgObjs)
    //3.对数组进行排序（按create_time降序）
    lastMsgs.sort(function(m1,m2){
        return m2.create_time - m1.create_time
    })
    return lastMsgs
}
class Message extends Component{
  
    render() {
        const {user} = this.props
        const {users, chatMsgs} =this.props.chat
        //按照chat_id对chatMsgs进行分组
        const lastMsgs = getLastMsgs(chatMsgs,user._id)
        return(
            <List style={{marginTop:50,marginBottom:50}}>
                {
                    lastMsgs.map(msg => {
                        //得到目标对象的id
                        const targetId = user._id === msg.to ? msg.from : msg.to
                        //得到目标对象信息
                        const targetInfo = users[targetId]
                       
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={targetInfo.header ? require(`../../assets/images/${targetInfo.header}.png`).default : null}
                                arrow='horizontal'
                                onClick={() => this.props.history.push(`chat/${targetId}`)}
                            >
                            {msg.content}
                            <Brief>{targetInfo.username}</Brief>
                            </Item>
                        )
                    })
                }
               
            </List>
        )
    }
}

export default connect(
    state => ({user:state.user, chat: state.chat}),
    {}
)(Message)