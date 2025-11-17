import React, { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Checkbox, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  dataScopes: string[]
  userCount: number
  createTime: string
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '超级管理员',
      description: '拥有系统所有权限',
      permissions: ['user:read', 'user:write', 'role:read', 'role:write', 'system:read', 'system:write'],
      dataScopes: ['全部数据'],
      userCount: 2,
      createTime: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      name: '普通管理员',
      description: '拥有部分管理权限',
      permissions: ['user:read', 'user:write', 'role:read'],
      dataScopes: ['部门数据'],
      userCount: 5,
      createTime: '2024-01-02 11:00:00'
    },
    {
      id: '3',
      name: '普通用户',
      description: '基础用户权限',
      permissions: ['user:read'],
      dataScopes: ['本人数据'],
      userCount: 100,
      createTime: '2024-01-03 12:00:00'
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm()

  const allPermissions = [
    { value: 'user:read', label: '查看用户' },
    { value: 'user:write', label: '管理用户' },
    { value: 'role:read', label: '查看角色' },
    { value: 'role:write', label: '管理角色' },
    { value: 'department:read', label: '查看部门' },
    { value: 'department:write', label: '管理部门' },
    { value: 'system:read', label: '查看系统设置' },
    { value: 'system:write', label: '管理系统设置' },
  ]

  const dataScopeOptions = [
    { value: '全部数据', label: '全部数据' },
    { value: '部门数据', label: '部门数据' },
    { value: '本人数据', label: '本人数据' },
  ]

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <div>
          {permissions.slice(0, 3).map(permission => {
            const permissionLabel = allPermissions.find(p => p.value === permission)?.label || permission
            return (
              <Tag key={permission} color="blue" style={{ marginBottom: 4 }}>
                {permissionLabel}
              </Tag>
            )
          })}
          {permissions.length > 3 && (
            <Tag color="default">+{permissions.length - 3}个权限</Tag>
          )}
        </div>
      ),
    },
    {
      title: '数据权限',
      dataIndex: 'dataScopes',
      key: 'dataScopes',
      render: (scopes: string[]) => (
        <div>
          {(scopes || []).map(scope => (
            <Tag key={scope} color="green" style={{ marginBottom: 4 }}>
              {scope}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个角色吗？"
            description="删除后该角色下的用户将失去相应权限"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={record.userCount > 0}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingRole(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    form.setFieldsValue(role)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setRoles(roles.filter(role => role.id !== id))
    message.success('角色删除成功！')
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editingRole) {
        // 编辑角色
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...values }
            : role
        ))
        message.success('角色更新成功！')
      } else {
        // 新增角色
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
          userCount: 0,
          createTime: new Date().toLocaleString()
        }
        setRoles([...roles, newRole])
        message.success('角色创建成功！')
      }
      setIsModalVisible(false)
    } catch (error) {
      message.error('操作失败，请重试！')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>角色管理</h2>
        <p>管理系统角色和权限配置</p>
      </div>

      <Card className="page-content">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input.Search
              placeholder="搜索角色名称"
              allowClear
              style={{ width: 300 }}
              onSearch={(value) => console.log('搜索:', value)}
            />
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增角色
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={{
            total: roles.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            label="角色描述"
            name="description"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea placeholder="请输入角色描述" rows={3} />
          </Form.Item>

          <Form.Item
            label="权限配置"
            name="permissions"
            rules={[{ required: true, message: '请选择至少一个权限' }]}
          >
            <Checkbox.Group>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {allPermissions.map(permission => (
                  <Checkbox key={permission.value} value={permission.value}>
                    {permission.label}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label="数据权限"
            name="dataScopes"
            rules={[{ required: true, message: '请选择数据权限' }]}
          >
            <Checkbox.Group>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {dataScopeOptions.map(scope => (
                  <Checkbox key={scope.value} value={scope.value}>
                    {scope.label}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRole ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleManagement
