import React, {Component} from 'react'
import PropTypes  from 'prop-types'
import {List, Grid} from 'antd-mobile'


export default class HeaderSelect extends Component{
    static propTypes={
        setHeader:PropTypes.func.isRequired
    }
    state = {
        icon: null
    }
    constructor(props){
        super(props)
        this.headerList = []
        for (let i = 0; i < 20; i++){
            this.headerList.push({
                text:'头像' + (i+1),
                icon: require(`../../assets/images/头像${i+1}.png`).default
            })
        }
    }
    handleClice = ({icon, text}) =>{
        this.setState({icon})
        this.props.setHeader(text)
    }
    render() {
        //头部界面
        const icon = this.state.icon
        const listHeader = !icon ? '请选择头像' : (
            <div>
                已选择头像
                <img src={icon} alt=''/>
            </div>
        )
        return (
            <div>
                <List renderHeader={() => listHeader}>
                    <Grid data={this.headerList} columnNum={5} onClick={(el)=>this.handleClice(el)}></Grid>
                </List>
            </div>
        )
    }
}