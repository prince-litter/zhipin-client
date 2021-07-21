import React,{Component} from 'react'
import { TabBar } from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
const Item = TabBar.Item
class NavFooter extends Component{

    static propTypes = {
        navList:PropTypes.array.isRequired,
        // unReadCount:PropTypes.number.isRequired
    }
    render() {
        let {navList, unReadCount} = this.props
        navList = navList.filter(item => !item.hide === true)
        const path = this.props.location.pathname
        return(
            <TabBar>
                {navList.map((nav) =>(
                    <Item key={nav.path}
                        badge ={nav.path === '/message' ? unReadCount : 0}
                        title={nav.text}
                        icon={{uri:require(`./images/${nav.icon}.png`).default}}
                        selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`).default}}
                        selected={path === nav.path}
                        onPress={() => this.props.history.replace(nav.path)}/>
                ))}
            </TabBar>
        )
    }
}
//内部会向组件中传入一些路由组件特有的属性：history/location等
export default withRouter(NavFooter)//向外暴露withRouter()包装产生的组件