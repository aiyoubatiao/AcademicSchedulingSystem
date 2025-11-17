import React, { useState } from 'react'
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  ApartmentOutlined,
  LogoutOutlined,
  BookOutlined,
  ScheduleOutlined,
  FileDoneOutlined,
  
} from '@ant-design/icons'

const { Header, Sider, Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    
    {
      key: '/basic',
      icon: <ApartmentOutlined />,
      label: '基础信息',
      children: [
        { key: '/basic/campus', label: '校区管理' },
        { key: '/basic/rooms', label: '教学场地' },
        { key: '/basic/base', label: '实习基地' },
        { key: '/basic/major-track', label: '专业库' },
        { key: '/basic/new-major', label: '新生专业开设' },
        { key: '/basic/course-catalog', label: '课程库' },
      ]
    },
    {
      key: 'curriculum',
      icon: <BookOutlined />,
      label: '培养方案',
      children: [
        { key: '/curriculum/pro-course-settings', label: '专业课程设置表' },
        { key: '/curriculum/pro-course-stats', label: '专业课程统计' },
      ]
    },
    // 删除“课程”顶级菜单（保留课程库在基础信息内）
    {
      key: '/offering',
      icon: <BookOutlined />,
      label: '开课计划',
      children: [
        { key: '/offering/plan', label: '开课计划' },
        { key: '/offering/audit', label: '开课审核' },
        { key: '/offering/adjust-logs', label: '调整记录' },
        { key: '/offering/electives', label: '公共选修开课' },
        { key: '/offering/preselect-records', label: '预选记录' },
        { key: '/offering/replacement', label: '课程替换规则' },
      ]
    },
    {
      key: '/tasks',
      icon: <FileDoneOutlined />,
      label: '教学任务书',
      children: [
        { key: '/tasks', label: '教学任务书' },
        { key: '/tasks/review', label: '教学任务书审核' },
        { key: '/tasks/workload', label: '工作量统计' },
        { key: '/tasks/adjust-logs', label: '调整记录' },
      ]
    },
    {
      key: '/scheduling',
      icon: <ScheduleOutlined />,
      label: '课表编排',
      children: [
        { key: '/scheduling', label: '课表编排' },
        { key: '/scheduling/electives', label: '公共选修课编排' },
        { key: '/scheduling/audit', label: '课表审核' },
        { key: '/scheduling/publish-records', label: '发布记录' },
        { key: '/scheduling/adjust-logs', label: '调整记录' },
      ]
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        { key: '/users', label: '用户管理' },
        { key: '/roles', label: '角色管理' },
        { key: '/positions', label: '岗位管理' },
        { key: '/departments', label: '部门管理' },
      ]
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) navigate(key)
  }

  return (
    <AntLayout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'MS' : '管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: ({ key }) => {
                if (key === 'logout') {
                  console.log('退出登录')
                }
              }
            }}
          >
            <Avatar icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
