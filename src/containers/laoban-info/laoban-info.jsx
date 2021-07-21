import React, {Component} from "react";
import {connect} from 'react-redux'
import {Button, NavBar, InputItem, TextareaItem} from 'antd-mobile'

import HeaderSelect from '../../components/header-select/header-select'
import {updateUser} from '../../redux/actions'
import { Redirect } from "react-router-dom";
class LaoBanInfo extends Component{
    state = {
        header: '',
        post: '',
        info: '',
        company: '',
        salary: ''
    }
    handleChange = (name, val) => {
        this.setState({
            [name]:val
        })
    }
    save = () => {
        this.props.updateUser(this.state)
    }
    setHeader = (header) =>{
        this.setState({header})
    }
    render(){
        const {header, type} = this.props.user
        if(header){
            const path = type === 'dashen' ? '/dashen' : '/laoban'
            return <Redirect to={path}/>
        }
        return(
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelect setHeader={this.setHeader}/>
                <InputItem placeholder="请输入招聘职位" onChange={(val) =>this.handleChange('post',val)}>招聘职位：</InputItem>
                <InputItem placeholder="请输入公司名称" onChange={(val) =>this.handleChange('company',val)}>公司名称：</InputItem>
                <InputItem placeholder="请输入职位薪资" onChange={(val) =>this.handleChange('salary',val)}>职位薪资：</InputItem>
                <TextareaItem title="职位要求：" rows={3} onChange={(val) =>this.handleChange('info',val)}/>
                <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}

export default connect(
    state=>({user: state.user}),
    {updateUser}
)(LaoBanInfo)