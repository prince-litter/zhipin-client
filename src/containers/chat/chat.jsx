import React,{Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim';

import {sendMsg, readMsg} from '../../redux/actions'
const Item = List.Item
class Chat extends Component{
    state = {
        content: '',
        isShow:false
    }
    //第一次render之前回调，初始化表情数据
    componentWillMount() {
       const emojis =['😀','😃','😅','🤣','😍','😀','😃','😅','🤣','😍',
                        '😀','😃','😅','🤣','😍','😀','😃','😅','🤣','😍','😀',
                        '😃','😅','🤣','😍','😀','😃','😅','🤣','😍','😀','😃',
                        '😅','🤣','😍','😀','😃','😅','🤣','😍','😀','😃','😅',
                        '🤣','😍','😀','😃','😅','🤣','😍','😀','😃','😅','🤣',
                        '😍','😀','😃','😅','🤣','😍','😀','😅','🤣','😍',]
        this.emojis = emojis.map(item => ({text: item}))                
        }
    componentDidMount() {
        //初始显示列表
        window.scrollTo(0,document.body.scrollHeight)
        
    }
    componentDidUpdate() {
        //更新显示列表
        window.scrollTo(0,document.body.scrollHeight)
    }
    componentWillUnmount() {//在退出之前
        //发请求更新消息的未读数
        const from = this.props.match.params.userid
        const to = this.props.user._id
        // console.log(to);
        this.props.readMsg(from, to)

    }
    handleSend =() =>{
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        if(content){
            this.props.sendMsg({from, to, content})
        }
        this.setState({
            content: '',
            isShow:false
        })
    }
    toggleShow= () => {
        const isShow = !this.state.isShow
        this.setState({isShow})
        if(isShow){
            //异步手动派发resize事件解决表情列表显示bug问题
           setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
           }, 0);
        }
    }
     render() {
        const {users,chatMsgs} = this.props.chat
        const {user} = this.props
        const targetId = this.props.match.params.userid
        const meId = user._id
        if(!users[meId]) { //如果还没有获取数据，直接不做任何显示
            return null
        }

        //计算当前的chat_id
        const chat_id = [targetId, meId].sort().join('_')
        //过滤消息得到和我相关的消息
        const msgs = chatMsgs.filter((msg) => msg.chat_id === chat_id)
        const targetInfo = users[targetId]
        //得到目标用户的头像
        const targetIcon = targetInfo.header ? require(`../../assets/images/${targetInfo.header}.png`).default :null
        //得到我的头像
        const myHeader =user.header ?  require(`../../assets/images/${user.header}.png`).default : null
        return(
            <div id='chat-page'>
                <NavBar
                 icon={<Icon type='left'/>} 
                 className='sticky-header'
                 onLeftClick={() => this.props.history.goBack()}
                 >
                     {targetInfo.username}
                     </NavBar>
                <List style={{marginTop:50,marginBottom:50}}>
                    <QueueAnim type='left' delay={100}>
                        {msgs.map((msg)=>{
                            if(msg.from === targetId){//对方发给我的
                                return (
                                    <Item key={msg._id} thumb={targetIcon}>
                                        {msg.content}
                                    </Item>
                                )
                            }else{
                                return(
                                    <Item key={msg._id} className='chat-me' extra={<img src={myHeader} alt='me'/>}>
                                        {msg.content}    
                                    </Item>
                                )
                            }
                        })}
                    </QueueAnim>
                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        placeholder='请输入'
                        value = {this.state.content}
                        onChange={val => this.setState({content:val})}
                        onFocus = {() => this.setState({isShow: false})}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight:5}}>😀</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>        
                        }
                    />
                    {this.state.isShow ? (
                         <Grid
                         data = {this.emojis}
                         columnNum={8}
                         carouselMaxRow={4}
                         isCarousel={true}
                         onClick={(item) =>this.setState({
                             content: this.state.content + item.text
                         })}
                        />
                    ) : null }
                   
                </div>
            </div>
        )
    }
}

export default connect(
    state =>({user: state.user, chat: state.chat}),
    {sendMsg, readMsg}
)(Chat)