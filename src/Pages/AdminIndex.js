import React, { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { Route } from 'react-router-dom'
import AddArticle from './AddArticle'
import ArticleList from './ArticleList'

import {
  DesktopOutlined,
  FolderAddOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import '../static/css/AdminIndex.css'
import Axios from 'axios'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function AdminIndex(props) {

    const [collapsed, setCollapsed] = useState(false)

    const onCollapse = collapsed => {
        setCollapsed(collapsed)
    };

    const handleClickArticle = e=>{
      console.log(e.key)
      if(e.key == 'addArticle'){
        props.history.push('/index/add')
      }else{
        props.history.push('/index/list')
      }
    }

    return (
    <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className={collapsed ? 'logo2' : 'logo1'}>JeremyGao Blog</div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">

            <Menu.Item icon={<DesktopOutlined />} onClick={() => props.history.push('/index')}>
              工作台
            </Menu.Item>

            <Menu.Item icon={<FolderAddOutlined />} onClick={() => props.history.push('/index/add')}>
              添加文章
            </Menu.Item>

            <SubMenu 
              key="sub1" 
              icon={<UserOutlined />} 
              title={<span>文章管理</span>} 
              onClick={handleClickArticle}
            >
                <Menu.Item key="addArticle">添加文章</Menu.Item>
                <Menu.Item key="articleList">文章列表</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<MailOutlined />} >
              留言管理
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, minHeight: 360,background: '#fff' }}>
              <div>
                  <Route path="/index/" exact component={AddArticle}/>
                  <Route path="/index/add/" exact component={AddArticle}/>
                  <Route path="/index/add/:id" exact component={AddArticle}/>
                  <Route path="/index/list/" exact component={ArticleList}/>
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>JeremyGao.com</Footer>
        </Layout>
    </Layout>
    );
}

export default AdminIndex