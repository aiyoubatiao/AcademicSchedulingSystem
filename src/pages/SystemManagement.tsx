import React, { useState } from 'react'
import { Card, Form, Input, Button, Switch, Select, message, Divider } from 'antd'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons'

const { Option } = Select

const SystemManagement: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('系统配置保存成功！')
      console.log('保存的配置:', values)
    } catch (error) {
      message.error('保存失败，请重试！')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.resetFields()
    message.info('配置已重置')
  }

  return (
    <div>
      <div className="page-header">
        <h2>系统管理</h2>
        <p>管理系统的基本配置和参数设置</p>
      </div>

      <Card title="基本配置" className="page-content">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            systemName: '管理系统',
            systemVersion: '1.0.0',
            enableRegistration: true,
            enableEmailNotification: false,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            theme: 'light'
          }}
        >
          <Form.Item
            label="系统名称"
            name="systemName"
            rules={[{ required: true, message: '请输入系统名称' }]}
          >
            <Input placeholder="请输入系统名称" />
          </Form.Item>

          <Form.Item
            label="系统版本"
            name="systemVersion"
            rules={[{ required: true, message: '请输入系统版本' }]}
          >
            <Input placeholder="请输入系统版本" />
          </Form.Item>

          <Divider>用户设置</Divider>

          <Form.Item
            label="允许用户注册"
            name="enableRegistration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="启用邮件通知"
            name="enableEmailNotification"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="会话超时时间（分钟）"
            name="sessionTimeout"
            rules={[{ required: true, message: '请输入会话超时时间' }]}
          >
            <Input type="number" placeholder="请输入会话超时时间" />
          </Form.Item>

          <Form.Item
            label="最大登录尝试次数"
            name="maxLoginAttempts"
            rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
          >
            <Input type="number" placeholder="请输入最大登录尝试次数" />
          </Form.Item>

          <Divider>界面设置</Divider>

          <Form.Item
            label="系统主题"
            name="theme"
            rules={[{ required: true, message: '请选择系统主题' }]}
          >
            <Select placeholder="请选择系统主题">
              <Option value="light">浅色主题</Option>
              <Option value="dark">深色主题</Option>
              <Option value="auto">自动切换</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              style={{ marginRight: 8 }}
            >
              保存配置
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SystemManagement