import React, { useEffect, useMemo, useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Descriptions, Radio, Segmented } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, UserAddOutlined, ApartmentOutlined, IdcardOutlined } from '@ant-design/icons'

 

interface User {
  id: string
  jobNo: string
  name: string
  email: string
  gender: '男' | '女'
  idCard: string
  phone: string
  department: string
  departmentPart?: string
  position: string
  positionPart?: string
  roles: string[]
  disabled: boolean
  remark?: string
  status: '在职' | '离职'
  createTime: string
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [filtersForm] = Form.useForm()
  const [filters, setFilters] = useState<any>({})
  const [addMode, setAddMode] = useState<'single' | 'byDept' | 'byPos'>('single')
  const USERS_KEY = 'sys_users'
  useEffect(() => {
    const saved = localStorage.getItem(USERS_KEY)
    let seeded = false
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed)
          seeded = true
        }
      } catch {}
    }
    if (!seeded) {
      const now = () => new Date().toLocaleString()
      setUsers([
        { id: '1', jobNo: 'U202501', name: '王悦', email:'wangyue@example.com', gender: '女', idCard: '610402199308156503', phone: '15353111959', department: '教学质量监控与评价中心', position: '行政人员', roles: ['管理员'], disabled: false, status: '在职', createTime: now() },
        { id: '2', jobNo: 'U202502', name: '薛淑霖', email:'xueshulin@example.com', gender: '女', idCard: '610402199208156504', phone: '13572849293', department: '教学质量监控与评价中心', position: '行政人员', roles: ['教务处'], disabled: false, status: '在职', createTime: now() },
        { id: '3', jobNo: 'U202503', name: '何文龙', email:'hewenlong@example.com', gender: '男', idCard: '610402198708156505', phone: '15592060601', department: '体育部-基础体育教研室', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
        { id: '4', jobNo: 'U202504', name: '刘乔惠', email:'liuqiiaohui@example.com', gender: '女', idCard: '610402199308156506', phone: '18710486627', department: '信息工程学院-工程造价系', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
        { id: '5', jobNo: 'U202505', name: '张三', email:'zhangsan@example.com', gender: '男', idCard: '610402198808156507', phone: '13800000001', department: '计算机学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
        { id: '6', jobNo: 'U202506', name: '李四', email:'lisi@example.com', gender: '男', idCard: '610402198808156508', phone: '13800000002', department: '计算机学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
        { id: '7', jobNo: 'U202507', name: '王五', email:'wangwu@example.com', gender: '男', idCard: '610402198808156509', phone: '13800000003', department: '信息工程学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
        { id: '8', jobNo: 'U202508', name: '赵六', email:'zhaoliu@example.com', gender: '男', idCard: '610402198808156510', phone: '13800000004', department: '数学与统计学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
        { id: '9', jobNo: 'U202509', name: '孙七', email:'sunqi@example.com', gender: '女', idCard: '610402198808156511', phone: '13800000005', department: '物理与电子工程学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
        { id: '10', jobNo: 'U202510', name: '周八', email:'zhouba@example.com', gender: '女', idCard: '610402198808156512', phone: '13800000006', department: '外国语学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() }
      ])
    }
  }, [])
  useEffect(() => { localStorage.setItem(USERS_KEY, JSON.stringify(users)) }, [users])

  const openView = (u: User) => { setViewUser(u); setIsViewOpen(true) }
  const syncUsers = () => { const seed: User[] = users.map((u)=> ({ ...u, createTime: new Date().toLocaleString() })); setUsers(seed); message.success('已同步人事系统用户数据') }

  const departmentOptions = useMemo(() => {
    const s = new Set<string>()
    users.forEach((u) => { if (u.department) s.add(String(u.department)) })
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [users])
  const positionOptions = useMemo(() => {
    const s = new Set<string>()
    users.forEach((u) => { if (u.position) s.add(String(u.position)) })
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [users])
  const roleOptions = useMemo(() => {
    const s = new Set<string>()
    users.forEach((u) => { (u.roles||[]).forEach((r)=> s.add(String(r))) })
    const base = ['教师','教务处','管理员','学院管理员']
    base.forEach((r)=> s.add(r))
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [users])
  const filteredUsers = useMemo(() => {
    return users.filter((u) => (
      (!filters.keyword || [u.name,u.phone,u.idCard,u.email].some((x)=> String(x||'').includes(String(filters.keyword)))) &&
      (!filters.department || String(u.department) === String(filters.department)) &&
      (!filters.position || String(u.position) === String(filters.position)) &&
      (!filters.role || (u.roles||[]).includes(String(filters.role)))
    ))
  }, [users, filters])

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '所在岗位', dataIndex: 'position', key: 'position' },
    { title: '所属角色', key: 'roles', render: (_: any, r: User) => (r.roles && r.roles.length>0 ? r.roles.join('、') : '--') },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => openView(record)}>查看</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定要移除这个用户吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" danger icon={<DeleteOutlined />}>移除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => { setAddMode('single'); setEditingUser(null); form.resetFields(); setIsModalVisible(true) }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
    message.success('用户删除成功！')
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values }
            : user
        ))
        message.success('用户更新成功！')
      } else {
        const now = Date.now()
        const newUser: User = {
          id: String(now),
          jobNo: values.jobNo || `U${now}`,
          name: values.name || String(values.keyword || '新用户'),
          email: values.email || `${String(values.name||'user')}.${now}@example.com`,
          gender: values.gender || '男',
          idCard: values.idCard || '',
          phone: values.phone || '',
          department: values.department || '',
          departmentPart: values.departmentPart || '',
          position: values.position || '',
          positionPart: values.positionPart || '',
          roles: values.roles || [],
          disabled: values.disabled === '是',
          remark: values.remark || '',
          status: '在职',
          createTime: new Date().toLocaleString()
        }
        setUsers([...users, newUser])
        message.success('用户创建成功！')
      }
      setIsModalVisible(false)
    } catch (error) {
      message.error('操作失败，请重试！')
    }
  }

  const exportCsv = () => {
    const rows = filteredUsers
    const header = ['姓名','手机号','部门','所在岗位','所属角色']
    const data = rows.map((r)=> [r.name, r.phone, r.department, r.position, (r.roles||[]).join('、')])
    const csv = [header.join(','), ...data.map((x)=> x.map((s)=> String(s||'').replace(/"/g,'""')).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '用户导出.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Card className="page-content">
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Form form={filtersForm} layout="inline" onValuesChange={(_, v)=> setFilters(v)}>
              <Form.Item name="keyword" label="姓名/手机号/身份证号"><Input allowClear style={{ width: 220 }} /></Form.Item>
              <Form.Item name="department" label="请选择一级部门"><Select allowClear showSearch style={{ width: 200 }} options={departmentOptions} /></Form.Item>
              <Form.Item name="position" label="请选择岗位"><Select allowClear showSearch style={{ width: 160 }} options={positionOptions} /></Form.Item>
              <Form.Item name="role" label="请选择角色"><Select allowClear showSearch style={{ width: 160 }} options={roleOptions} /></Form.Item>
              <Form.Item><Button type="primary" onClick={()=> setFilters(filtersForm.getFieldsValue())}>查询</Button></Form.Item>
              <Form.Item><Button onClick={()=> { filtersForm.resetFields(); setFilters({}) }}>重置</Button></Form.Item>
            </Form>
          </Space>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加</Button>
            <Button icon={<DownloadOutlined />} onClick={exportCsv}>导出</Button>
            <Button onClick={syncUsers}>同步</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal open={isViewOpen} title="查看" footer={null} onCancel={()=> setIsViewOpen(false)} width={600}>
        {viewUser && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Descriptions bordered size="small" title="人事档案信息" column={2} items={[
              { label:'姓名', children: viewUser.name },
              { label:'身份证号', children: viewUser.idCard||'--' },
              { label:'手机号', children: viewUser.phone||'--' },
              { label:'所属部门', children: viewUser.department||'--' },
              { label:'兼职部门', children: viewUser.departmentPart||'--' },
              { label:'所属岗位', children: viewUser.position||'--' },
              { label:'兼职岗位', children: viewUser.positionPart||'--' },
              { label:'在职状态', children: viewUser.status||'--' }
            ]} />
            <Descriptions bordered size="small" title="自维护信息" column={2} items={[
              { label:'所属角色', children: (viewUser.roles||[]).join('、')||'--' },
              { label:'是否禁用', children: viewUser.disabled ? '是' : '否' },
              { label:'备注', children: viewUser.remark||'--' }
            ]} />
          </Space>
        )}
      </Modal>

      <Modal
        title={editingUser ? '编辑' : '新增'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={640}
      >
        {editingUser ? (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Descriptions bordered size="small" title="人事档案信息" column={2} style={{ marginBottom: 12 }} items={[
              { label:'姓名', children: editingUser.name },
              { label:'身份证号', children: editingUser.idCard||'--' },
              { label:'手机号', children: editingUser.phone||'--' },
              { label:'在职状态', children: editingUser.status||'--' },
              { label:'所属部门', children: editingUser.department||'--' },
              { label:'兼职部门', children: editingUser.departmentPart||'--' },
              { label:'所属岗位', children: editingUser.position||'--' },
              { label:'兼职岗位', children: editingUser.positionPart||'--' }
            ]} />
            <Card size="small" title="自维护信息" style={{ marginBottom: 12 }}>
              <Form.Item label="所属角色" name="roles" rules={[{ required: true, message: '请选择角色' }]}>
                <Select mode="multiple" allowClear showSearch options={roleOptions} />
              </Form.Item>
              <Form.Item label="是否禁用" name="disabled" initialValue={editingUser.disabled ? '是' : '否'}>
                <Radio.Group>
                  <Radio value="是">是</Radio>
                  <Radio value="否">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="备注" name="remark">
                <Input.TextArea rows={3} placeholder="请输入备注" />
              </Form.Item>
            </Card>
            <Space>
              <Button type="primary" htmlType="submit">确定</Button>
              <Button onClick={() => setIsModalVisible(false)}>取消</Button>
            </Space>
          </Form>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="添加方式" required>
              <Segmented
                value={addMode}
                onChange={(v)=> setAddMode(v as any)}
                options={[
                  { label: (<Space><UserAddOutlined />单个添加</Space>), value:'single' },
                  { label: (<Space><ApartmentOutlined />按部门批量添加</Space>), value:'byDept' },
                  { label: (<Space><IdcardOutlined />按岗位批量添加</Space>), value:'byPos' },
                ]}
              />
            </Form.Item>
            {addMode==='single' && (
              <Form.Item label="姓名、手机号、身份证、工号" name="keyword">
                <Input placeholder="姓名、手机号、身份证、工号" />
              </Form.Item>
            )}
            <Card size="small" title="自维护信息" style={{ marginBottom: 12 }}>
              <Form.Item label="分配角色" name="roles" rules={[{ required: true, message: '请选择所属角色' }]}>
                <Select mode="multiple" allowClear showSearch options={roleOptions} />
              </Form.Item>
            </Card>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </Space>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default UserManagement
