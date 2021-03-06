import React, {Component} from 'react'
import {connect} from 'react-redux'
import {register} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
import {
    NavBar,
    WingBlank,
    List,   
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from 'antd-mobile'

import Logo from '../../components/logo/logo'
const Item = List.Item
class Register extends Component{
    state = {
        username: '',
        password: '',
        password2: '',
        type: 'laoban',
    }
    register = () => {
        this.props.register(this.state)
    }
    //处理输入数据的改变：更新对应的状态
    handleChange = (name, val) =>{
        //更新状态
        this.setState({
            [name]: val //属性名不是name，而是name变量的值
        })
    }
    toLogin = () => {
        this.props.history.replace('/login')
    }
    render(){
        const {type} = this.state
        const {msg, redirectTo} = this.props.user
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return(
            <div>
                <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg ? <div className='error-msg'>{msg}</div> : null}
                        <WhiteSpace/>
                        <InputItem placeholder="请输入用户名" onChange={(val) => this.handleChange('username', val)}>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder="请输入密码" type="password" onChange={(val) => this.handleChange('password', val)}>密&nbsp;码：</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder="请输入确认密码" type="password" onChange={(val) => this.handleChange('password2', val)}>确认密码:</InputItem>
                        <WhiteSpace/>
                        <Item>
                            <span>用户类型：</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'dashen'} onChange={() => this.handleChange('type', 'dashen')}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'laoban'} onChange={() => this.handleChange('type', 'laoban')}>老板</Radio>
                        </Item>
                        <WhiteSpace/>
                        <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {register}
)(Register)