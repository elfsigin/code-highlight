import React, { useState, useEffect} from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";

import CodeEditor from '../pages/codeEditor';
import CodeMirrorHighlightComponent from '../pages/CodeMirrorHighlightComponent';

import {getHighlightedHtml} from '../utils/getHighlightedHtml'



const { Header, Sider, Content } = Layout;

const LayOut = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  console.log(location, "location");
  console.log(pathname, "path");
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (e) => {
    navigate(e.key);
  };

  


  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          onClick={handleClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "/show",
              icon: <VideoCameraOutlined />,
              label: "高亮code展示",
            },
            {
              key: "/codeonlyHight",
              icon: <VideoCameraOutlined />,
              label: "code进高亮代码",
            },
            {
              key: "/params",
              icon: <VideoCameraOutlined />,
              label: "params代码",
            },
            {
              key: "/CodeMirrorHighlightComponent",
              icon: <UserOutlined />,
              label: "单独使用codemirror的高亮引擎",
            },
            {
              key: "/codeEditor",
              icon: <VideoCameraOutlined />,
              label: "codemirror 代码编辑器",
            },
            
            
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 960,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >


          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayOut;