import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons'

const { Option } = Select

interface Department {
  id: string
  name: string
  parentId: string | null
  leader: string
  leaderPhone: string
  deputy: string
  deputyPhone: string
  description: string
  userCount: number
  createTime: string
  children?: Department[]
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const DEPT_KEY = 'departments'
  useEffect(() => {
    const saved = localStorage.getItem(DEPT_KEY)
    if (saved) {
      try { setDepartments(JSON.parse(saved)) } catch {}
    } else {
      setDepartments([
        {
          id: '1',
          name: '学校',
          parentId: null,
          leader: '校长',
          leaderPhone: '13900000000',
          deputy: '副校长',
          deputyPhone: '13900000001',
          description: '组织架构根节点',
          userCount: 0,
          createTime: '2024-01-01 10:00:00',
          children: [
            {
              id: '2',
              name: '教务处',
              parentId: '1',
              leader: '处长',
              leaderPhone: '13900000002',
              deputy: '副处长',
              deputyPhone: '13900000003',
              description: '教学管理职能部门',
              userCount: 5,
              createTime: '2024-01-02 10:00:00'
            },
            {
              id: '3',
              name: '计算机学院',
              parentId: '1',
              leader: '院长',
              leaderPhone: '13900000004',
              deputy: '副院长',
              deputyPhone: '13900000005',
              description: '工科学院',
              userCount: 20,
              createTime: '2024-01-03 10:00:00',
              children: [
                {
                  id: '5',
                  name: '软件工程系',
                  parentId: '3',
                  leader: '系主任',
                  leaderPhone: '13900000006',
                  deputy: '副主任',
                  deputyPhone: '13900000007',
                  description: '本科专业系',
                  userCount: 10,
                  createTime: '2024-01-04 10:00:00'
                }
              ]
            }
          ]
        }
      ])
    }
  }, [])
  useEffect(() => { localStorage.setItem(DEPT_KEY, JSON.stringify(departments)) }, [departments])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [form] = Form.useForm()

  // 将树形数据转换为平铺数据用于表格显示
  const flattenDepartments = (depts: Department[], level = 0): any[] => {
    let result: any[] = []
    depts.forEach(dept => {
      result.push({
        ...dept,
        level,
        key: dept.id
      })
      if (dept.children && dept.children.length > 0) {
        result = result.concat(flattenDepartments(dept.children, level + 1))
      }
    })
    return result
  }

  const flatData = flattenDepartments(departments)

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div style={{ paddingLeft: record.level * 20 }}>
          <ApartmentOutlined style={{ marginRight: 8 }} />
          {text}
        </div>
      ),
    },
    {
      title: '部门负责人(电话)',
      key: 'leader',
      render: (_: any, record: Department) => `${record.leader || ''}${record.leaderPhone ? ` (${record.leaderPhone})` : ''}`,
    },
    {
      title: '部门分管人(电话)',
      key: 'deputy',
      render: (_: any, record: Department) => `${record.deputy || ''}${record.deputyPhone ? ` (${record.deputyPhone})` : ''}`,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '人员数量',
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
      render: (_: any, record: Department) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个部门吗？"
            description="删除后子部门也将被删除"
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

  // 获取所有部门用于父部门选择
  const getAllDepartments = (depts: Department[]): { value: string; label: string }[] => {
    let result: { value: string; label: string }[] = [{ value: '', label: '无（作为顶级部门）' }]
    const traverse = (departments: Department[], prefix = '') => {
      departments.forEach(dept => {
        result.push({
          value: dept.id,
          label: prefix + dept.name
        })
        if (dept.children && dept.children.length > 0) {
          traverse(dept.children, prefix + dept.name + ' / ')
        }
      })
    }
    traverse(depts)
    return result
  }

  const handleAdd = () => {
    setEditingDepartment(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    form.setFieldsValue({
      ...department,
      parentId: department.parentId || ''
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    // 递归删除部门及其子部门
    const deleteDepartment = (depts: Department[]): Department[] => {
      return depts.filter(dept => {
        if (dept.id === id) {
          return false
        }
        if (dept.children) {
          dept.children = deleteDepartment(dept.children)
        }
        return true
      })
    }
    
    setDepartments(deleteDepartment(departments))
    message.success('部门删除成功！')
  }

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        parentId: values.parentId || null
      }

      if (editingDepartment) {
        const update = (list: Department[]): Department[] => list.map(d => {
          if (d.id === editingDepartment.id) {
            return { ...d, ...formData }
          }
          if (d.children && d.children.length > 0) {
            return { ...d, children: update(d.children) }
          }
          return d
        })
        setDepartments(update(departments))
        message.success('部门更新成功！')
      } else {
        const newDepartment: Department = {
          id: Date.now().toString(),
          ...formData,
          userCount: 0,
          createTime: new Date().toLocaleString()
        }
        if (formData.parentId) {
          const addToParent = (list: Department[]): Department[] => list.map(d => {
            if (d.id === formData.parentId) {
              const children = d.children ? [...d.children, newDepartment] : [newDepartment]
              return { ...d, children }
            }
            if (d.children && d.children.length > 0) {
              return { ...d, children: addToParent(d.children) }
            }
            return d
          })
          setDepartments(addToParent(departments))
          message.success('子部门创建成功！')
        } else {
          setDepartments([...departments, newDepartment])
          message.success('部门创建成功！')
        }
      }
      setIsModalVisible(false)
    } catch (error) {
      message.error('操作失败，请重试！')
    }
  }

  const syncFromHR = () => {
    const seed: Department[] = [
      {
        id: '1',
        name: '学校',
        parentId: null,
        leader: '校长',
        leaderPhone: '13900000000',
        deputy: '副校长',
        deputyPhone: '13900000001',
        description: '组织架构根节点',
        userCount: 0,
        createTime: new Date().toLocaleString(),
        children: [
          {
            id: '2',
            name: '教务处',
            parentId: '1',
            leader: '处长',
            leaderPhone: '13900000002',
            deputy: '副处长',
            deputyPhone: '13900000003',
            description: '教学管理职能部门',
            userCount: 5,
            createTime: new Date().toLocaleString()
          },
          {
            id: '3',
            name: '计算机学院',
            parentId: '1',
            leader: '院长',
            leaderPhone: '13900000004',
            deputy: '副院长',
            deputyPhone: '13900000005',
            description: '工科学院',
            userCount: 20,
            createTime: new Date().toLocaleString(),
            children: [
              {
                id: '5',
                name: '软件工程系',
                parentId: '3',
                leader: '系主任',
                leaderPhone: '13900000006',
                deputy: '副主任',
                deputyPhone: '13900000007',
                description: '本科专业系',
                userCount: 10,
                createTime: new Date().toLocaleString()
              }
            ]
          }
        ]
      }
    ]
    setDepartments(seed)
    message.success('已同步人事系统数据')
  }

  return (
    <div>
      <div className="page-header">
        <h2>部门管理</h2>
        <p>管理组织架构和部门信息</p>
      </div>

      <Card className="page-content">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input.Search
              placeholder="搜索部门名称"
              allowClear
              style={{ width: 300 }}
              onSearch={(value) => console.log('搜索:', value)}
            />
            <Button onClick={syncFromHR}>同步人事系统</Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增部门
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={flatData}
          rowKey="id"
          pagination={false}
          defaultExpandAllRows
        />
      </Card>

      <Modal
        title={editingDepartment ? '编辑部门' : '新增部门'}
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
            label="部门名称"
            name="name"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item
            label="上级部门"
            name="parentId"
          >
            <Select placeholder="请选择上级部门">
              {getAllDepartments(departments).map(dept => (
                <Option key={dept.value} value={dept.value}>
                  {dept.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="部门负责人"
            name="leader"
            rules={[{ required: true, message: '请输入部门负责人' }]}
          >
            <Input placeholder="请输入负责人" />
          </Form.Item>

          <Form.Item
            label="负责人电话"
            name="leaderPhone"
          >
            <Input placeholder="请输入负责人电话" />
          </Form.Item>

          <Form.Item
            label="部门分管人"
            name="deputy"
          >
            <Input placeholder="请输入分管人" />
          </Form.Item>

          <Form.Item
            label="分管人电话"
            name="deputyPhone"
          >
            <Input placeholder="请输入分管人电话" />
          </Form.Item>

          <Form.Item
            label="部门描述"
            name="description"
          >
            <Input.TextArea placeholder="请输入部门描述" rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDepartment ? '更新' : '创建'}
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

export default DepartmentManagement
