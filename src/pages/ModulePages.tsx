import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Tabs, Table, Form, Input, Button, Select, Space, Modal, Popconfirm, InputNumber, Tag, Row, Col, Upload, message, Descriptions, Steps, Dropdown, Alert, Checkbox, DatePicker, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export const BasicInfoManagement: React.FC = () => {
  const [campusData, setCampusData] = useState<{ key: string; name: string; shortName: string; address: string; zip: string; status: string }[]>([
    { key: 'c1', name: 'A校区', shortName: 'A', address: '浦东新区世纪大道100号', zip: '200120', status: '启用' },
    { key: 'c2', name: 'B校区', shortName: 'B', address: '西湖区学院路88号', zip: '310013', status: '启用' }
  ])
  const [campusForm] = Form.useForm()
  const [campusAddOpen, setCampusAddOpen] = useState(false)
  const [editCampusForm] = Form.useForm()
  const [campusEditOpen, setCampusEditOpen] = useState(false)
  const [editingCampusKey, setEditingCampusKey] = useState<string | null>(null)
  const [buildingsData, setBuildingsData] = useState<{ key: string; campus: string; name: string; type: string; floors: number; status: string }[]>([
    { key: 'bd1', campus: 'A校区', name: 'A楼', type: '教学楼', floors: 6, status: '启用' },
    { key: 'bd2', campus: 'B校区', name: '综合楼', type: '综合楼', floors: 12, status: '启用' }
  ])
  const [classroomsData, setClassroomsData] = useState<{ key: string; code: string; campus: string; buildingName: string; floor: number; doorNo: string; name: string; type: string; capacity: number; department: string; equipment: string; status: string }[]>([
    { key: 'rm1', code: 'ROOM101', campus: 'A校区', buildingName: 'A楼', floor: 1, doorNo: '101', name: 'A-101', type: '普通教室', capacity: 60, department: '教务处', equipment: '投影仪', status: '启用' },
    { key: 'rm2', code: 'ROOM102', campus: 'A校区', buildingName: 'A楼', floor: 1, doorNo: '102', name: 'A-102', type: '普通教室', capacity: 50, department: '教务处', equipment: '投影仪', status: '启用' },
    { key: 'rm3', code: 'ROOM103', campus: 'A校区', buildingName: 'A楼', floor: 1, doorNo: '103', name: 'A-103', type: '普通教室', capacity: 45, department: '教务处', equipment: '投影仪', status: '启用' },
    { key: 'rm4', code: 'ROOM104', campus: 'A校区', buildingName: 'A楼', floor: 2, doorNo: '104', name: 'A-104', type: '普通教室', capacity: 60, department: '教务处', equipment: '投影仪', status: '启用' },
    { key: 'rm5', code: 'ROOM105', campus: 'A校区', buildingName: 'A楼', floor: 2, doorNo: '105', name: 'A-105', type: '普通教室', capacity: 55, department: '教务处', equipment: '投影仪', status: '启用' },
    { key: 'rm6', code: 'ROOM106', campus: 'A校区', buildingName: 'A楼', floor: 2, doorNo: '106', name: 'A-106', type: '实验室', capacity: 40, department: '理学院', equipment: '实验台、电脑', status: '启用' },
    { key: 'rm7', code: 'ROOM107', campus: 'A校区', buildingName: 'A楼', floor: 2, doorNo: '107', name: 'A-107', type: '实验室', capacity: 45, department: '理学院', equipment: '实验台、电脑', status: '启用' },
    { key: 'rm8', code: 'ROOM108', campus: 'A校区', buildingName: 'A楼', floor: 3, doorNo: '108', name: 'A-108', type: '普通教室', capacity: 60, department: '教务处', equipment: '投影仪', status: '启用' },
    { key: 'rm9', code: 'ROOM109', campus: 'A校区', buildingName: 'A楼', floor: 3, doorNo: '109', name: 'A-109', type: '普通教室', capacity: 50, department: '教务处', equipment: '投影仪', status: '启用' },
    { key: 'rm10', code: 'ROOM110', campus: 'A校区', buildingName: 'A楼', floor: 3, doorNo: '110', name: 'A-110', type: '实验室', capacity: 40, department: '理学院', equipment: '实验台、电脑', status: '启用' }
  ])
  const [buildingForm] = Form.useForm()
  const [buildingAddOpen, setBuildingAddOpen] = useState(false)
  const [editBuildingForm] = Form.useForm()
  const [buildingEditOpen, setBuildingEditOpen] = useState(false)
  const [editingBuildingKey, setEditingBuildingKey] = useState<string | null>(null)
  const [classroomForm] = Form.useForm()
  const [classroomAddOpen, setClassroomAddOpen] = useState(false)
  const [editClassroomForm] = Form.useForm()
  const [classroomEditOpen, setClassroomEditOpen] = useState(false)
  const [editingClassroomKey, setEditingClassroomKey] = useState<string | null>(null)
  const roomTypes = ['多媒体教室','实验室','体育场馆机房','画室','智慧教室','报告厅']
  const campusOptions = useMemo(() => campusData.map((c) => ({ value: c.name, label: c.name })), [campusData])
  const watchBuildingNameCL = Form.useWatch('buildingName', classroomForm)
  const floorOptionsCL = useMemo(() => {
    const b = buildingsData.find((x:any)=> String(x.name||'') === String(watchBuildingNameCL||''))
    const top = Number(b?.floors ?? 99)
    const arr: { value:number; label:string }[] = []
    for (let i=-3; i<=top; i++) arr.push({ value: i, label: String(i) })
    return arr
  }, [watchBuildingNameCL, buildingsData])
  const departmentGroupOptions = useMemo(() => {
    try {
      const raw = localStorage.getItem('departments') || '[]'
      const data = JSON.parse(raw)
      const names = new Set<string>()
      const walk = (list:any[]) => list.forEach((d:any)=> { if (d?.name) names.add(String(d.name)); if (Array.isArray(d?.children)) walk(d.children) })
      if (Array.isArray(data)) walk(data)
      return Array.from(names).map((n)=> ({ value: n, label: n }))
    } catch { return [] }
  }, [])
  const [baseData, setBaseData] = useState<{ key: string; code: string; name: string; address: string; contactPerson: string; contact: string; capacity: number; status: string; remark?: string }[]>([
    { key: 'b1', code: 'BASE001', name: '企业A实习基地', address: '浦东新区张江路199号', contactPerson: '张三', contact: '13800001111', capacity: 50, status: '启用' },
    { key: 'b2', code: 'BASE002', name: '产业园区基地', address: '滨江高新区启源路66号', contactPerson: '李四', contact: '13800002222', capacity: 80, status: '启用' }
  ])
  const [baseForm] = Form.useForm()
  const [baseAddOpen, setBaseAddOpen] = useState(false)
  const [editBaseForm] = Form.useForm()
  const [baseEditOpen, setBaseEditOpen] = useState(false)
  const [editingBaseKey, setEditingBaseKey] = useState<string | null>(null)
  const [majorsData, setMajorsData] = useState<{ key: string; code: string; name: string; discipline: string; department: string; durationYears: number; level: string; enabled: string; tracks?: { code: string; name: string }[] }[]>([
    { key: 'm1', code: '080901', name: '计算机科学与技术', discipline: '计算机类', department: '计算机学院', durationYears: 4, level: '本科', enabled: '启用', tracks: [{ code: 'AI01', name: '人工智能' }, { code: 'BD01', name: '大数据' }] },
    { key: 'm2', code: '080902', name: '软件工程', discipline: '计算机类', department: '软件学院', durationYears: 4, level: '本科', enabled: '启用', tracks: [{ code: 'CN01', name: '云原生' }, { code: 'SE01', name: '软件架构' }] }
  ])
  const [editMajorForm] = Form.useForm()
  const [majorEditOpen, setMajorEditOpen] = useState(false)
  const [editingMajorKey, setEditingMajorKey] = useState<string | null>(null)
  const [newMajorData] = useState<{ key: string; grade: string; major: string }[]>([
    { key: 'nm1', grade: String(new Date().getFullYear()), major: '计算机科学与技术' },
    { key: 'nm2', grade: String(new Date().getFullYear()), major: '软件工程' }
  ])
  const [newMajorForm] = Form.useForm()
  const [newMajorAddOpen, setNewMajorAddOpen] = useState(false)
  const [editNewMajorForm] = Form.useForm()
  const [newMajorEditOpen, setNewMajorEditOpen] = useState(false)
  const [editingNewMajorKey, setEditingNewMajorKey] = useState<string | null>(null)
  const [courseCatalogData] = useState<{ key: string; category: string; nature: string; ctype: string; code: string; name: string; credit: number; hoursTheory: number; hoursLab: number; hoursTraining: number; hoursPractice: number; assessment: string; openSemester: string; source: string }[]>([
    { key: 'cc1', category: '专业课', nature: '必修', ctype: '理论', code: 'CUR08090101', name: '数据结构', credit: 4, hoursTheory: 48, hoursLab: 0, hoursTraining: 0, hoursPractice: 0, assessment: '考试', openSemester: '大二上', source: '人才培养方案' },
    { key: 'cc2', category: '专业课', nature: '必修', ctype: '理论', code: 'CUR08090102', name: '操作系统', credit: 4, hoursTheory: 48, hoursLab: 0, hoursTraining: 0, hoursPractice: 0, assessment: '考试', openSemester: '大二下', source: '人才培养方案' },
    { key: 'cc3', category: '专业课', nature: '必修', ctype: '理论', code: 'CUR08090103', name: '数据库系统', credit: 3, hoursTheory: 32, hoursLab: 16, hoursTraining: 0, hoursPractice: 0, assessment: '考查', openSemester: '大二下', source: '新增' }
  ])
  const [catalogForm] = Form.useForm()
  const [catalogAddOpen, setCatalogAddOpen] = useState(false)
  const [editCatalogForm] = Form.useForm()
  const [catalogEditOpen, setCatalogEditOpen] = useState(false)
  const [editingCatalogKey, setEditingCatalogKey] = useState<string | null>(null)
  const [majorForm] = Form.useForm()
  const [majorAddOpen, setMajorAddOpen] = useState(false)
  type Elective = { key: string; ctype: string; nature: string; module: string; code: string; name: string; credit: number; hoursTheory: number; hoursLab: number; hoursTraining: number; hoursPractice: number; hoursTotal: number; assessment: string; weekHours: number; delivery: string; department: string }
  const [electives, setElectives] = useState<Elective[]>([])
  const [electForm] = Form.useForm()
  const [electAddOpen, setElectAddOpen] = useState(false)
  const [electEditOpen, setElectEditOpen] = useState(false)
  const [editingElectKey, setEditingElectKey] = useState<string | null>(null)
  const [electFilterForm] = Form.useForm()
  const [electFilter, setElectFilter] = useState<any>({})
  const majorDisciplineOptions = Array.from(new Set(['纺织类','设计学类','材料类','戏剧与影视学类','工商管理类','物流管理与工程类','金融学类','教育学类','计算机类','机械类','管理科学与工程类','公共管理类','化工与制药类','生物工程类'])).map(v=>({ value: v, label: v }))
  const location = useLocation()
  const [campusFilterForm] = Form.useForm()
  const [buildingFilterForm] = Form.useForm()
  const [classroomFilterForm] = Form.useForm()
  const [baseFilterForm] = Form.useForm()
  const [majorsFilterForm] = Form.useForm()
  const [newMajorFilterForm] = Form.useForm()
  const [catalogFilterForm] = Form.useForm()
  const [campusFilter, setCampusFilter] = useState<any>({})
  const [buildingFilter, setBuildingFilter] = useState<any>({})
  const [classroomFilter, setClassroomFilter] = useState<any>({})
  const [baseFilter, setBaseFilter] = useState<any>({})
  const [majorsFilter, setMajorsFilter] = useState<any>({})
  const [newMajorFilter, setNewMajorFilter] = useState<any>({})
  const [catalogFilter, setCatalogFilter] = useState<any>({})
  const onCatalogValuesChange = (_: any, v: any) => {
    const t = Number(v.hoursTheory || 0)
    const e = Number(v.hoursLab || 0)
    const tr = Number(v.hoursTraining || 0)
    const p = Number(v.hoursPractice || 0)
    catalogForm.setFieldsValue({ hoursTotal: t + e + tr + p })
    editCatalogForm.setFieldsValue({ hoursTotal: t + e + tr + p })
  }
  useEffect(() => {
    if (catalogAddOpen) {
      try {
        catalogForm.setFieldsValue({ credit: 0, hoursTotal: 0, hoursTheory: 0, hoursLab: 0, hoursTraining: 0, hoursPractice: 0 })
      } catch {}
    }
  }, [catalogAddOpen])
  useEffect(() => {
    if (electAddOpen) {
      try {
        electForm.setFieldsValue({ credit: 0, hoursTotal: 0, hoursTheory: 0, hoursLab: 0, hoursTraining: 0, hoursPractice: 0, weekHours: 0 })
      } catch {}
    }
  }, [electAddOpen])
  useEffect(() => {
    try {
      const raw = localStorage.getItem('publicElectives') || ''
      const list = raw ? JSON.parse(raw) : []
      if (Array.isArray(list) && list.length > 0) {
        setElectives(list)
        return
      }
    } catch {}
    const seed: Elective[] = [
      { key: 'e101', ctype: '理论课（含课内实验实训）', nature: '任选', module: '通识教育', code: 'EL0101', name: '大学写作', credit: 2, hoursTheory: 24, hoursLab: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 24, assessment: '考试', weekHours: 2, delivery: '线下课程', department: '人文学院' },
      { key: 'e102', ctype: '独立设置的实验课', nature: '限选', module: '信息基础', code: 'EL0102', name: 'Python实验', credit: 1, hoursTheory: 0, hoursLab: 16, hoursTraining: 0, hoursPractice: 0, hoursTotal: 16, assessment: '考查', weekHours: 2, delivery: '线下课程', department: '计算机学院' },
      { key: 'e103', ctype: '校内实践（集中）', nature: '限选', module: '综合实践', code: 'EL0103', name: '创新创业实践', credit: 1, hoursTheory: 0, hoursLab: 0, hoursTraining: 0, hoursPractice: 16, hoursTotal: 16, assessment: '考查', weekHours: 1, delivery: '线下课程', department: '创新学院' },
      { key: 'e104', ctype: '理论课（含课内实验实训）', nature: '任选', module: '艺术素养', code: 'EL0104', name: '美术鉴赏', credit: 2, hoursTheory: 24, hoursLab: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 24, assessment: '考试', weekHours: 2, delivery: '线下课程', department: '艺术学院' }
    ]
    setElectives(seed)
  }, [])
  useEffect(() => {
    localStorage.setItem('publicElectives', JSON.stringify(electives))
  }, [electives])

  const electFiltered = useMemo(() => {
    return electives.filter((r) => {
      const totalHours = Number(r.hoursTheory || 0) + Number(r.hoursLab || 0) + Number(r.hoursTraining || 0) + Number(r.hoursPractice || 0)
      const hoursMin = electFilter.hoursMin
      const hoursMax = electFilter.hoursMax
      const hoursMatch = (
        (hoursMin == null || totalHours >= Number(hoursMin)) &&
        (hoursMax == null || totalHours <= Number(hoursMax))
      )
      const creditMin = electFilter.creditMin
      const creditMax = electFilter.creditMax
      const creditMatch = (
        (creditMin == null || Number(r.credit || 0) >= Number(creditMin)) &&
        (creditMax == null || Number(r.credit || 0) <= Number(creditMax))
      )
      const weekMin = electFilter.weekMin
      const weekMax = electFilter.weekMax
      const weekMatch = (
        (weekMin == null || Number(r.weekHours || 0) >= Number(weekMin)) &&
        (weekMax == null || Number(r.weekHours || 0) <= Number(weekMax))
      )
      return (
        (!electFilter.ctype || r.ctype === electFilter.ctype) &&
        (!electFilter.nature || r.nature === electFilter.nature) &&
        (!electFilter.module || String(r.module).includes(electFilter.module)) &&
        (!electFilter.code || String(r.code).includes(electFilter.code)) &&
        (!electFilter.name || String(r.name).includes(electFilter.name)) &&
        creditMatch && hoursMatch && weekMatch &&
        (!electFilter.assessment || r.assessment === electFilter.assessment) &&
        (!electFilter.delivery || r.delivery === electFilter.delivery) &&
        (!electFilter.department || String(r.department).includes(electFilter.department))
      )
    })
  }, [electives, electFilter])
  const onElectValuesChange = (_: any, v: any) => {
    const t = Number(v.hoursTheory || 0)
    const e = Number(v.hoursLab || 0)
    const tr = Number(v.hoursTraining || 0)
    const p = Number(v.hoursPractice || 0)
    electForm.setFieldsValue({ hoursTotal: t + e + tr + p })
  }
  const campusFiltered = useMemo(() => {
    return campusData.filter((r) =>
      (!campusFilter.name || String(r.name).includes(campusFilter.name)) &&
      (!campusFilter.shortName || String(r.shortName).includes(campusFilter.shortName)) &&
      (!campusFilter.address || String(r.address).includes(campusFilter.address)) &&
      (!campusFilter.zip || String(r.zip).includes(campusFilter.zip)) &&
      (!campusFilter.status || r.status === campusFilter.status)
    )
  }, [campusData, campusFilter])
  const buildingFiltered = useMemo(() => {
    return buildingsData.filter((r) =>
      (!buildingFilter.campus || String(r.campus).includes(buildingFilter.campus)) &&
      (!buildingFilter.name || String(r.name).includes(buildingFilter.name)) &&
      (!buildingFilter.type || r.type === buildingFilter.type) &&
      (() => {
        const fr = buildingFilter.floorsRange
        if (!fr) return true
        if (Array.isArray(fr)) return r.floors >= Number(fr[0]) && r.floors <= Number(fr[1])
        if (typeof fr === 'string') {
          const m = fr.match(/^\s*(-?\d+)\s*-\s*(-?\d+)\s*$/)
          if (m) return r.floors >= Number(m[1]) && r.floors <= Number(m[2])
          const s = fr.match(/^\s*(-?\d+)\s*$/)
          if (s) return r.floors === Number(s[1])
        }
        return true
      })() &&
      (!buildingFilter.status || r.status === buildingFilter.status)
    )
  }, [buildingsData, buildingFilter])
  const classroomFiltered = useMemo(() => {
    return classroomsData.filter((r) =>
      (!classroomFilter.campus || String(r.campus).includes(classroomFilter.campus)) &&
      (!classroomFilter.buildingName || String(r.buildingName).includes(classroomFilter.buildingName)) &&
      (classroomFilter.floor == null || r.floor === Number(classroomFilter.floor)) &&
      (!classroomFilter.doorNo || String(r.doorNo).includes(classroomFilter.doorNo)) &&
      (!classroomFilter.name || String(r.name).includes(classroomFilter.name)) &&
      (!classroomFilter.type || r.type === classroomFilter.type) &&
      (() => {
        const cr = classroomFilter.capacityRange
        if (!cr) return true
        if (Array.isArray(cr)) return r.capacity >= Number(cr[0]) && r.capacity <= Number(cr[1])
        if (typeof cr === 'string') {
          const m = cr.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/)
          if (m) return r.capacity >= Number(m[1]) && r.capacity <= Number(m[2])
          const s = cr.match(/^\s*(\d+)\s*$/)
          if (s) return r.capacity === Number(s[1])
        }
        return true
      })() &&
      (!classroomFilter.department || String(r.department).includes(classroomFilter.department)) &&
      (!classroomFilter.equipment || String(r.equipment).includes(classroomFilter.equipment)) &&
      (!classroomFilter.status || r.status === classroomFilter.status)
    )
  }, [classroomsData, classroomFilter])
  const baseFiltered = useMemo(() => {
    return baseData.filter((r) =>
      (!baseFilter.code || String(r.code).includes(baseFilter.code)) &&
      (!baseFilter.name || String(r.name).includes(baseFilter.name)) &&
      (!baseFilter.address || String(r.address).includes(baseFilter.address)) &&
      (!baseFilter.contactPerson || String(r.contactPerson).includes(baseFilter.contactPerson)) &&
      (!baseFilter.contact || String(r.contact).includes(baseFilter.contact)) &&
      (() => {
        const cr = baseFilter.capacityRange
        if (!cr) return true
        if (Array.isArray(cr)) return r.capacity >= Number(cr[0]) && r.capacity <= Number(cr[1])
        if (typeof cr === 'string') {
          const m = cr.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/)
          if (m) return r.capacity >= Number(m[1]) && r.capacity <= Number(m[2])
          const s = cr.match(/^\s*(\d+)\s*$/)
          if (s) return r.capacity === Number(s[1])
        }
        return true
      })() &&
      (!baseFilter.status || r.status === baseFilter.status)
    )
  }, [baseData, baseFilter])
  const majorsFiltered = useMemo(() => {
    return majorsData.filter((r) =>
      (!majorsFilter.code || String(r.code).includes(majorsFilter.code)) &&
      (!majorsFilter.name || String(r.name).includes(majorsFilter.name)) &&
      (!majorsFilter.department || String(r.department).includes(majorsFilter.department)) &&
      (majorsFilter.durationYears == null || r.durationYears === Number(majorsFilter.durationYears)) &&
      (!majorsFilter.level || r.level === majorsFilter.level) &&
      (!majorsFilter.enabled || r.enabled === majorsFilter.enabled)
    )
  }, [majorsData, majorsFilter])
  
  useEffect(() => {
    const raw = localStorage.getItem('basic_campus')
    if (raw) {
      try {
        const list = JSON.parse(raw)
        if (Array.isArray(list)) {
          const normalized = list.map((r: any, i: number) => ({
            key: r.key || String(Date.now() + i),
            name: r.name || r.campusName || '',
            shortName: r.shortName || r.abbr || '',
            address: r.address || '',
            zip: r.zip || r.postcode || r.code || '',
            status: r.status || '启用',
          }))
          const cleaned = normalized.filter((r: any) => {
            return [r.name, r.shortName, r.address, r.zip].some((v) => String(v || '').trim().length > 0)
          })
          setCampusData(cleaned)
        }
      } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('basic_campus', JSON.stringify(campusData))
  }, [campusData])
  useEffect(() => {
    const rawBd = localStorage.getItem('basic_buildings')
    if (rawBd) {
      try {
        const list = JSON.parse(rawBd)
        if (Array.isArray(list)) {
          const normalized = list.map((r: any, i: number) => ({
            key: r.key || String(Date.now() + i),
            campus: r.campus || '',
            name: r.name || r.buildingName || '',
            type: r.type || r.buildingType || '',
            floors: Number(r.floors ?? r.levels ?? 0),
            status: r.status || '启用',
          }))
          const cleaned = normalized.filter((r: any) => {
            return [r.campus, r.name, r.type].some((v) => String(v || '').trim().length > 0) || Number(r.floors || 0) !== 0
          })
          setBuildingsData(cleaned)
        }
      } catch {}
    }
    const rawRm = localStorage.getItem('basic_classrooms')
    if (rawRm) {
      try {
        const list = JSON.parse(rawRm)
        if (Array.isArray(list)) {
          const normalized = list.map((r: any, i: number) => ({
            key: r.key || String(Date.now() + i),
            code: r.code || `ROOM${String(i + 1).padStart(3, '0')}`,
            campus: r.campus || '',
            buildingName: r.buildingName || r.building || '',
            floor: Number(r.floor ?? 0),
            doorNo: r.doorNo || r.roomNo || '',
            name: r.name || '',
            type: r.type || '',
            capacity: Number(r.capacity || 0),
            department: r.department || '',
            equipment: r.equipment || '',
            status: r.status || '启用',
          }))
          const cleaned = normalized.filter((r: any) => {
            return [r.code, r.campus, r.buildingName, r.name, r.type].some((v) => String(v || '').trim().length > 0) || Number(r.capacity || 0) > 0
          })
          setClassroomsData(cleaned)
        }
      } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('basic_buildings', JSON.stringify(buildingsData))
  }, [buildingsData])
  useEffect(() => {
    localStorage.setItem('basic_classrooms', JSON.stringify(classroomsData))
  }, [classroomsData])
  useEffect(() => {
    const raw = localStorage.getItem('basic_base')
    if (raw) {
      try {
        const list = JSON.parse(raw)
        if (Array.isArray(list)) {
          const normalized = list.map((r: any, i: number) => ({
            key: r.key || String(Date.now() + i),
            code: r.code || `BASE${String(i + 1).padStart(3, '0')}`,
            name: r.name || '',
            address: r.address || '',
            contactPerson: r.contactPerson || '',
            contact: r.contact || '',
            capacity: Number(r.capacity || 0),
            status: r.status || '启用',
          }))
          const cleaned = normalized.filter((r: any) => {
            return [r.code, r.name, r.address, r.contactPerson].some((v) => String(v || '').trim().length > 0) || Number(r.capacity || 0) > 0
          })
          setBaseData(cleaned)
        }
      } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('basic_base', JSON.stringify(baseData))
  }, [baseData])
  useEffect(() => {
    const raw = localStorage.getItem('basic_major_track')
    if (raw) {
      try {
        const list = JSON.parse(raw)
        if (Array.isArray(list)) {
          const normalized = list.map((r: any, i: number) => ({
            key: r.key || String(Date.now() + i),
            code: r.code || '',
            name: r.name || r.major || '',
            discipline: r.discipline || '',
            department: r.department || '',
            durationYears: Number(r.durationYears || 0),
            level: r.level || '',
            enabled: r.enabled || '启用',
            tracks: Array.isArray(r.tracks) ? r.tracks.map((t: any) => ({ code: t.code || '', name: t.name || t.track || '' })) : (r.track ? [{ code: '', name: r.track }] : []),
          }))
          const cleaned = normalized.filter((r: any) => {
            return [r.code, r.name, r.department].some((v) => String(v || '').trim().length > 0) || Number(r.durationYears || 0) > 0
          })
          setMajorsData(cleaned)
        }
      } catch {}
    }
  }, [])
  useEffect(() => {
    try {
      const base = Array.isArray(majorsData) ? majorsData : []
      const byKey = new Map<string, any>()
      base.forEach((m:any)=> { const k = (String(m.code||'') || String(m.name||'')); if (k) byKey.set(k, m) })
      const fixed = [
        { code: '080903', name: '网络工程', discipline: '计算机类', department: '计算机学院' },
        { code: '080904', name: '信息安全', discipline: '计算机类', department: '计算机学院' },
        { code: '080905', name: '数据科学与大数据技术', discipline: '计算机类', department: '计算机学院' },
        { code: '080906', name: '人工智能', discipline: '计算机类', department: '计算机学院' },
        { code: '080907', name: '物联网工程', discipline: '计算机类', department: '信息学院' },
        { code: '080701', name: '电子信息工程', discipline: '电子信息类', department: '电子与信息学院' },
        { code: '080801', name: '自动化', discipline: '电子信息类', department: '电子与信息学院' },
        { code: '080202', name: '机械设计制造及其自动化', discipline: '机械类', department: '机械学院' },
        { code: '080204', name: '材料科学与工程', discipline: '材料类', department: '材料学院' },
        { code: '081301', name: '化学工程与工艺', discipline: '化工与制药类', department: '化工学院' },
        { code: '083001', name: '生物工程', discipline: '生物工程类', department: '生物工程学院' },
        { code: '070302', name: '应用化学', discipline: '理学类', department: '理学院' },
        { code: '020204', name: '金融学', discipline: '金融学类', department: '经管学院' },
        { code: '120201', name: '工商管理', discipline: '工商管理类', department: '经管学院' },
        { code: '120203', name: '会计学', discipline: '工商管理类', department: '经管学院' },
        { code: '020401', name: '国际经济与贸易', discipline: '经济学类', department: '经管学院' },
        { code: '120601', name: '物流管理', discipline: '物流管理与工程类', department: '经管学院' },
        { code: '040101', name: '教育学', discipline: '教育学类', department: '教育学院' },
        { code: '130501', name: '设计学', discipline: '设计学类', department: '艺术设计学院' },
        { code: '082105', name: '服装设计与工程', discipline: '纺织类', department: '纺织服装学院' }
      ]
      const merged = [...base]
      fixed.forEach((m) => {
        const k1 = String(m.code||'')
        const k2 = String(m.name||'')
        if (!byKey.has(k1) && !byKey.has(k2)) {
          merged.push({ key: `fixed_${m.code}`, code: m.code, name: m.name, discipline: m.discipline, department: m.department, durationYears: 4, level: '本科', enabled: '启用', tracks: [] })
          byKey.set(k1 || k2, m)
        }
      })
      if (merged.length !== base.length) {
        setMajorsData(merged)
        localStorage.setItem('basic_major_track', JSON.stringify(merged))
      }
    } catch {}
  }, [])
  useEffect(() => {
    localStorage.setItem('basic_major_track', JSON.stringify(majorsData))
  }, [majorsData])
  const [newMajorDataState, setNewMajorDataState] = useState(newMajorData)
  const majorOptions = useMemo(() => majorsData.map((m) => ({ label: `${m.code} ${m.name}`, value: m.name })), [majorsData])
  const selectedMajorNames = Form.useWatch('major', newMajorForm)
  const selectedMajorRows = useMemo(() => {
    if (!Array.isArray(selectedMajorNames)) return []
    return majorsData.filter((m) => selectedMajorNames.includes(m.name)).map((m) => ({ code: m.code, name: m.name }))
  }, [selectedMajorNames, majorsData])
  const removeSelectedMajor = (nm: string) => {
    const cur = Array.isArray(selectedMajorNames) ? selectedMajorNames : []
    newMajorForm.setFieldsValue({ major: cur.filter((x: string) => x !== nm) })
  }
  const newMajorFiltered = useMemo(() => {
    return newMajorDataState.filter((r) =>
      (!newMajorFilter.grade || String(r.grade).includes(newMajorFilter.grade)) &&
      (!newMajorFilter.major || String(r.major).includes(newMajorFilter.major))
    )
  }, [newMajorDataState, newMajorFilter])
  useEffect(() => {
    const raw = localStorage.getItem('basic_new_major')
    if (raw) {
      try {
        const list = JSON.parse(raw)
        if (Array.isArray(list)) {
          const normalized = list.map((r: any, i: number) => ({
            key: r.key || String(Date.now() + i),
            grade: r.grade || r.year || String(new Date().getFullYear()),
            major: r.major || r.name || ''
          }))
          const cleaned = normalized.filter((r: any) => {
            return [r.grade, r.major].some((v) => String(v || '').trim().length > 0)
          })
          setNewMajorDataState(cleaned)
        }
      } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('basic_new_major', JSON.stringify(newMajorDataState))
  }, [newMajorDataState])
  const [courseCatalogDataState, setCourseCatalogDataState] = useState(courseCatalogData)
  const catalogFiltered = useMemo(() => {
    return courseCatalogDataState.filter((r) => {
      const totalHours = Number(r.hoursTheory || 0) + Number(r.hoursLab || 0) + Number(r.hoursTraining || 0) + Number(r.hoursPractice || 0)
      const hoursMin = catalogFilter.hoursMin
      const hoursMax = catalogFilter.hoursMax
      const hoursMatch = (
        (hoursMin == null || totalHours >= Number(hoursMin)) &&
        (hoursMax == null || totalHours <= Number(hoursMax))
      )
      const termMatch = (() => {
        const sel = catalogFilter.openSemester
        if (!sel || (Array.isArray(sel) && sel.length === 0)) return true
        const text = String(r.openSemester || '')
        if (Array.isArray(sel)) return sel.some((v: string) => text.includes(v))
        return text.includes(String(sel))
      })()
      return (
        (!catalogFilter.category || r.category === catalogFilter.category) &&
        (!catalogFilter.nature || r.nature === catalogFilter.nature) &&
        (!catalogFilter.ctype || r.ctype === catalogFilter.ctype) &&
        (!catalogFilter.code || String(r.code).includes(catalogFilter.code)) &&
        (!catalogFilter.name || String(r.name).includes(catalogFilter.name)) &&
        (catalogFilter.creditMin == null || r.credit >= Number(catalogFilter.creditMin)) &&
        (catalogFilter.creditMax == null || r.credit <= Number(catalogFilter.creditMax)) &&
        hoursMatch && termMatch &&
        (!catalogFilter.assessment || r.assessment === catalogFilter.assessment) &&
        (!catalogFilter.source || r.source === catalogFilter.source)
      )
    })
  }, [courseCatalogDataState, catalogFilter])
  useEffect(() => {
    const raw = localStorage.getItem('basic_course_catalog')
    if (raw) {
      try {
        const list = JSON.parse(raw)
        if (Array.isArray(list)) {
          const normalized = list.map((r: any, i: number) => ({
            key: r.key || String(Date.now() + i),
            category: r.category || '专业课',
            nature: r.nature || '必修',
            ctype: r.ctype || '理论',
            code: r.code || '',
            name: r.name || '',
            credit: Number(r.credit || 0),
            hoursTheory: Number(r.hoursTheory || 0),
            hoursLab: Number(r.hoursLab || 0),
            hoursTraining: Number(r.hoursTraining || 0),
            hoursPractice: Number(r.hoursPractice || 0),
            assessment: r.assessment || '考试',
            openSemester: r.openSemester || '',
            source: r.source || '新增',
          }))
          const cleaned = normalized.filter((r: any) => {
            const hasText = [r.code, r.name, r.category, r.nature, r.ctype].some((v) => String(v || '').trim().length > 0)
            const hasHours = [r.credit, r.hoursTheory, r.hoursLab, r.hoursTraining, r.hoursPractice].some((n) => Number(n || 0) > 0)
            return hasText || hasHours
          })
          setCourseCatalogDataState(cleaned)
        }
      } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('basic_course_catalog', JSON.stringify(courseCatalogDataState))
  }, [courseCatalogDataState])
  const pathToKey: Record<string, string> = {
    '/basic/campus': 'campus',
    '/basic/rooms': 'rooms',
    '/basic/base': 'base',
    '/basic/major-track': 'majorTrack',
    '/basic/new-major': 'newMajor',
    '/basic/course-catalog': 'courseCatalog',
  }
  const activeKey = pathToKey[location.pathname] || 'campus'
  const renderSection = () => {
    if (activeKey === 'campus') {
      return (
        <Card className="page-content">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button type="primary" onClick={() => setCampusAddOpen(true)}>新增校区</Button>
            </Space>
            <Modal open={campusAddOpen} title="新增校区" footer={null} onCancel={() => setCampusAddOpen(false)}>
              <Form form={campusForm} layout="vertical" initialValues={{ status: '启用' }} onFinish={(v) => {
                const row = {
                  key: Date.now().toString(),
                  name: v.name || '',
                  shortName: v.shortName || '',
                  address: v.address || '',
                  zip: v.zip || '',
                  status: v.status || '启用',
                }
                setCampusData((prev) => [row, ...prev])
                campusForm.resetFields()
                setCampusAddOpen(false)
              }}>
                <Form.Item name="name" label="校区名称" required rules={[{ required: true, message: '请输入校区名称' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input placeholder="如：A校区" /></Form.Item>
                <Form.Item name="shortName" label="校区简称" required rules={[{ required: true, message: '请输入校区简称' }, { max: 200, message: '不超过200字符' }]}><Input placeholder="如：A" /></Form.Item>
                <Form.Item name="address" label="校区地址" required rules={[{ required: true, message: '请输入校区地址' }, { max: 200, message: '不超过200字符' }]}><Input placeholder="详细地址" /></Form.Item>
                <Form.Item name="zip" label="校区邮编" required rules={[{ required: true, message: '请输入校区邮编' }, { max: 20, message: '不超过20字符' }]}><Input placeholder="如：200120" /></Form.Item>
                <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">保存</Button>
                  <Button onClick={() => setCampusAddOpen(false)}>取消</Button>
                </Space>
              </Form>
            </Modal>
            <Form form={campusFilterForm} layout="inline" onValuesChange={(_, v) => setCampusFilter(v)} style={{ marginTop: 12 }}>
              <Form.Item name="name" label="校区名称"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
              <Form.Item name="shortName" label="校区简称"><Input placeholder="包含" style={{ width: 120 }} /></Form.Item>
              <Form.Item name="address" label="校区地址"><Input placeholder="包含" style={{ width: 240 }} /></Form.Item>
              <Form.Item name="zip" label="校区邮编"><Input placeholder="包含" style={{ width: 140 }} /></Form.Item>
              <Form.Item name="status" label="状态"><Select allowClear style={{ width: 120 }} options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
              <Form.Item><Button onClick={() => { campusFilterForm.resetFields(); setCampusFilter({}) }}>重置</Button></Form.Item>
              <Form.Item><Button type="primary" onClick={() => setCampusFilter(campusFilterForm.getFieldsValue())}>查询</Button></Form.Item>
            </Form>
            <Table
              size="small"
              pagination={false}
              rowKey="key"
              dataSource={campusFiltered}
              columns={[
                { title: '校区名称', dataIndex: 'name' },
                { title: '校区简称', dataIndex: 'shortName' },
                { title: '校区地址', dataIndex: 'address' },
                { title: '校区邮编', dataIndex: 'zip' },
                { title: '状态', dataIndex: 'status' },
                {
                  title: '操作',
                  render: (_, record) => (
                    <Space>
                      <Button size="small" onClick={() => {
                        setEditingCampusKey(record.key)
                        editCampusForm.setFieldsValue({
                          name: record.name,
                          shortName: record.shortName,
                          address: record.address,
                          zip: record.zip,
                          status: record.status,
                        })
                        setCampusEditOpen(true)
                      }}>编辑</Button>
                      <Popconfirm title="确认删除该校区？" onConfirm={() => setCampusData((prev) => prev.filter((r) => r.key !== record.key))}>
                        <Button size="small" danger>删除</Button>
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
            />
            <Modal open={campusEditOpen} title="编辑校区" footer={null} onCancel={() => setCampusEditOpen(false)}>
              <Form form={editCampusForm} layout="vertical" onFinish={(v) => {
                setCampusData((prev) => prev.map((r) => r.key === editingCampusKey ? {
                  ...r,
                  name: r.name,
                  shortName: v.shortName || r.shortName || '',
                  address: v.address || '',
                  zip: v.zip || r.zip || '',
                  status: v.status || r.status,
                } : r))
                setCampusEditOpen(false)
                setEditingCampusKey(null)
              }}>
                <Form.Item name="name" label="校区名称" required rules={[{ required: true, message: '请输入校区名称' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input placeholder="如：A校区" disabled /></Form.Item>
                <Form.Item name="shortName" label="校区简称" required rules={[{ required: true, message: '请输入校区简称' }, { max: 200, message: '不超过200字符' }]}><Input placeholder="如：A" /></Form.Item>
                <Form.Item name="address" label="校区地址" required rules={[{ required: true, message: '请输入校区地址' }, { max: 200, message: '不超过200字符' }]}><Input placeholder="详细地址" /></Form.Item>
                <Form.Item name="zip" label="校区邮编" required rules={[{ required: true, message: '请输入校区邮编' }, { max: 20, message: '不超过20字符' }]}><Input placeholder="如：200120" /></Form.Item>
                <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">保存</Button>
                  <Button onClick={() => setCampusEditOpen(false)}>取消</Button>
                </Space>
              </Form>
            </Modal>
          </Space>
        </Card>
      )
    }
    if (activeKey === 'rooms') {
      return (
        <Card className="page-content">
          <Tabs items={[{ key: 'buildings', label: '楼房管理', children: (
            <>
              <Space style={{ marginBottom: 12 }}>
                <Button type="primary" onClick={() => setBuildingAddOpen(true)}>新增楼房</Button>
              </Space>
              <Form form={buildingFilterForm} layout="inline" onValuesChange={(_, v) => setBuildingFilter(v)} style={{ marginBottom: 12 }}>
                <Form.Item name="campus" label="校区"><Select allowClear showSearch options={campusOptions} style={{ width: 160 }} /></Form.Item>
                <Form.Item name="name" label="楼房名称"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
                <Form.Item name="type" label="楼房类型"><Select allowClear style={{ width: 160 }} options={[{value:'教学楼',label:'教学楼'},{value:'实验楼',label:'实验楼'},{value:'办公楼',label:'办公楼'},{value:'综合楼',label:'综合楼'}]} /></Form.Item>
                <Form.Item name="floorsRange" label="楼房层数"><Input placeholder="如：-1-5 或 6" style={{ width: 160 }} /></Form.Item>
                <Form.Item name="status" label="状态"><Select allowClear style={{ width: 120 }} options={[{value:'启用',label:'启用'},{value:'停用',label:'停用'}]} /></Form.Item>
                <Form.Item><Button onClick={() => { buildingFilterForm.resetFields(); setBuildingFilter({}) }}>重置</Button></Form.Item>
                <Form.Item><Button type="primary" onClick={() => setBuildingFilter(buildingFilterForm.getFieldsValue())}>查询</Button></Form.Item>
              </Form>
              <Table size="small" pagination={false} rowKey="key" dataSource={buildingFiltered} columns={[
                { title: '校区', dataIndex: 'campus' },
                { title: '楼房名称', dataIndex: 'name' },
                { title: '楼房类型', dataIndex: 'type' },
                { title: '楼房层数', dataIndex: 'floors' },
                { title: '状态', dataIndex: 'status' },
                { title: '操作', render: (_, record) => (
                  <Space>
                    <Button size="small" onClick={() => { setEditingBuildingKey(record.key); editBuildingForm.setFieldsValue(record); setBuildingEditOpen(true) }}>编辑</Button>
                    <Popconfirm title="确认删除该楼房？" onConfirm={() => setBuildingsData((prev) => prev.filter((r) => r.key !== record.key))}><Button size="small" danger>删除</Button></Popconfirm>
                  </Space>
                )}
              ]} />
              <Modal open={buildingAddOpen} title="新增楼房" footer={null} onCancel={() => setBuildingAddOpen(false)}>
                <Form form={buildingForm} layout="vertical" initialValues={{ status: '启用' }} onFinish={(v) => { const row = { key: Date.now().toString(), campus: v.campus || '', name: v.name || '', type: v.type || '', floors: Number(v.floors ?? 0), status: v.status || '启用' }; setBuildingsData((prev) => [row, ...prev]); buildingForm.resetFields(); setBuildingAddOpen(false) }}>
                  <Form.Item name="campus" label="校区" required rules={[{ required: true, message: '请选择校区' }]}><Select allowClear showSearch options={campusOptions} /></Form.Item>
                  <Form.Item name="name" label="楼房名称" required rules={[{ required: true, message: '请输入楼房名称' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input /></Form.Item>
                  <Form.Item name="type" label="楼房类型" required rules={[{ required: true, message: '请选择楼房类型' }]}><Select options={[{value:'教学楼',label:'教学楼'},{value:'实验楼',label:'实验楼'},{value:'办公楼',label:'办公楼'},{value:'综合楼',label:'综合楼'}]} /></Form.Item>
                  <Form.Item name="floors" label="楼房层数" required rules={[{ required: true, message: '请选择楼房层数' }]}><Select style={{ width: 160 }} options={Array.from({ length: 103 }, (_, i) => ({ value: i - 3, label: String(i - 3) }))} /></Form.Item>
                  <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button onClick={() => setBuildingAddOpen(false)}>取消</Button>
                  </Space>
                </Form>
              </Modal>
              <Modal open={buildingEditOpen} title="编辑楼房" footer={null} onCancel={() => setBuildingEditOpen(false)}>
                <Form form={editBuildingForm} layout="vertical" onFinish={(v) => { setBuildingsData((prev) => prev.map((r) => r.key === editingBuildingKey ? { ...r, campus: r.campus, name: r.name, type: v.type || r.type, floors: Number(v.floors ?? r.floors), status: v.status || r.status } : r)); setBuildingEditOpen(false); setEditingBuildingKey(null) }}>
                  <Form.Item name="campus" label="校区"><Select disabled options={campusOptions} /></Form.Item>
                  <Form.Item name="name" label="楼房名称"><Input disabled /></Form.Item>
                  <Form.Item name="type" label="楼房类型" required rules={[{ required: true, message: '请选择楼房类型' }]}><Select options={[{value:'教学楼',label:'教学楼'},{value:'实验楼',label:'实验楼'},{value:'办公楼',label:'办公楼'},{value:'综合楼',label:'综合楼'}]} /></Form.Item>
                  <Form.Item name="floors" label="楼房层数" required rules={[{ required: true, message: '请选择楼房层数' }]}><Select style={{ width: 160 }} options={Array.from({ length: 103 }, (_, i) => ({ value: i - 3, label: String(i - 3) }))} /></Form.Item>
                  <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button onClick={() => setBuildingEditOpen(false)}>取消</Button>
                  </Space>
                </Form>
              </Modal>
            </>
          ) }, { key: 'classrooms', label: '教室管理', children: (
            <>
              <Space style={{ marginBottom: 12 }}>
                <Button type="primary" onClick={() => setClassroomAddOpen(true)}>新增教室</Button>
              </Space>
              <Form form={classroomFilterForm} layout="inline" onValuesChange={(_, v) => setClassroomFilter(v)} style={{ marginBottom: 12 }}>
                <Form.Item name="campus" label="校区"><Select allowClear showSearch options={campusOptions} style={{ width: 160 }} /></Form.Item>
                <Form.Item name="buildingName" label="楼房名称"><Select allowClear showSearch options={buildingsData.map(b=>({value:b.name,label:b.name}))} style={{ width: 160 }} /></Form.Item>
                <Form.Item name="floor" label="楼层"><InputNumber min={-3} max={99} style={{ width: 120 }} /></Form.Item>
                <Form.Item name="doorNo" label="门牌号"><Input placeholder="包含" style={{ width: 140 }} /></Form.Item>
                <Form.Item name="name" label="教室名称"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
                <Form.Item name="type" label="教室类型"><Select allowClear style={{ width: 160 }} options={roomTypes.map(v=>({value:v,label:v}))} /></Form.Item>
                <Form.Item name="capacityRange" label="容量"><Input placeholder="如：30-60 或 30" style={{ width: 160 }} /></Form.Item>
                <Form.Item name="department" label="使用部门"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
                <Form.Item name="equipment" label="设备情况"><Input placeholder="包含" style={{ width: 200 }} /></Form.Item>
                <Form.Item name="status" label="状态"><Select allowClear style={{ width: 120 }} options={[{value:'启用',label:'启用'},{value:'停用',label:'停用'}]} /></Form.Item>
                <Form.Item><Button onClick={() => { classroomFilterForm.resetFields(); setClassroomFilter({}) }}>重置</Button></Form.Item>
                <Form.Item><Button type="primary" onClick={() => setClassroomFilter(classroomFilterForm.getFieldsValue())}>查询</Button></Form.Item>
              </Form>
              <Table size="small" pagination={false} rowKey="key" dataSource={classroomFiltered} columns={[
                { title: '校区', dataIndex: 'campus' },
                { title: '楼房名称', dataIndex: 'buildingName' },
                { title: '楼层', dataIndex: 'floor' },
                { title: '门牌号', dataIndex: 'doorNo' },
                { title: '教室名称', dataIndex: 'name' },
                { title: '教室类型', dataIndex: 'type' },
                { title: '容量', dataIndex: 'capacity' },
                { title: '使用部门', dataIndex: 'department' },
                { title: '设备情况', dataIndex: 'equipment' },
                { title: '状态', dataIndex: 'status' },
                { title: '操作', render: (_, record) => (
                  <Space>
                    <Button size="small" onClick={() => { setEditingClassroomKey(record.key); editClassroomForm.setFieldsValue(record); setClassroomEditOpen(true) }}>编辑</Button>
                    <Popconfirm title="确认删除该教室？" onConfirm={() => setClassroomsData((prev) => prev.filter((r) => r.key !== record.key))}><Button size="small" danger>删除</Button></Popconfirm>
                  </Space>
                )}
              ]} />
              <Modal open={classroomAddOpen} title="新增教室" footer={null} onCancel={() => setClassroomAddOpen(false)}>
                <Form form={classroomForm} layout="vertical" onFinish={(v) => {
                  const existing = new Set(classroomsData.map(r=>r.code))
                  let idx = classroomsData.length + 1
                  let code = `ROOM${String(idx).padStart(3,'0')}`
                  while (existing.has(code)) { idx++; code = `ROOM${String(idx).padStart(3,'0')}` }
                  const row = { key: Date.now().toString(), code, campus: v.campus || '', buildingName: v.buildingName || '', floor: Number(v.floor ?? 0), doorNo: v.doorNo || '', name: v.name || '', type: v.type || '', capacity: Number(v.capacity ?? 0), department: v.department || '', equipment: v.equipment || '', status: v.status || '启用' }
                  setClassroomsData((prev) => [row, ...prev])
                  classroomForm.resetFields()
                  setClassroomAddOpen(false)
                }}>
                  <Form.Item name="campus" label="校区" required rules={[{ required: true, message: '请选择校区' }]}><Select allowClear showSearch options={campusOptions} /></Form.Item>
                  <Form.Item name="buildingName" label="楼房名称" required rules={[{ required: true, message: '请选择楼房名称' }]}><Select allowClear showSearch options={buildingsData.map(b=>({value:b.name,label:b.name}))} /></Form.Item>
                  <Form.Item name="floor" label="楼层" required rules={[{ required: true, message: '请选择楼层' }]}><Select allowClear options={floorOptionsCL} /></Form.Item>
                  <Form.Item name="doorNo" label="门牌号" required rules={[{ required: true, message: '请输入门牌号' }, { min: 2, max: 200, message: '长度2~200字符' }, { pattern: /[\u4e00-\u9fa5A-Za-z0-9-]+/, message: '仅限汉字、字母、数字、-'}]}><Input /></Form.Item>
                  <Form.Item name="name" label="教室名称" required rules={[{ required: true, message: '请输入教室名称' }, { min: 2, max: 200, message: '长度2~200字符' }, { pattern: /[\u4e00-\u9fa5A-Za-z0-9-]+/, message: '仅限汉字、字母、数字、-'}]}><Input /></Form.Item>
                  <Form.Item name="type" label="教室类型" required rules={[{ required: true, message: '请选择教室类型' }]}><Select options={roomTypes.map(v=>({value:v,label:v}))} /></Form.Item>
                  <Form.Item name="capacity" label="容量" required rules={[{ required: true, message: '请输入容量' }, { type:'number', min: 1, message: '至少为1' }]}><InputNumber min={1} /></Form.Item>
                  <Form.Item name="department" label="使用部门"><Select allowClear showSearch options={departmentGroupOptions} /></Form.Item>
                  <Form.Item name="equipment" label="设备情况"><Input placeholder="如：投影仪、电脑等" /></Form.Item>
                  <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button onClick={() => setClassroomAddOpen(false)}>取消</Button>
                  </Space>
                </Form>
              </Modal>
              <Modal open={classroomEditOpen} title="编辑教室" footer={null} onCancel={() => setClassroomEditOpen(false)}>
                <Form form={editClassroomForm} layout="vertical" onFinish={(v) => { setClassroomsData((prev) => prev.map((r) => r.key === editingClassroomKey ? { ...r, campus: r.campus, buildingName: r.buildingName, floor: r.floor, doorNo: r.doorNo, name: v.name || r.name, type: v.type || r.type, capacity: Number(v.capacity ?? r.capacity), department: v.department || r.department, equipment: v.equipment || r.equipment, status: v.status || r.status } : r)); setClassroomEditOpen(false); setEditingClassroomKey(null) }}>
                  <Form.Item name="campus" label="校区"><Select disabled options={campusOptions} /></Form.Item>
                  <Form.Item name="buildingName" label="楼房名称"><Select disabled options={buildingsData.map(b=>({value:b.name,label:b.name}))} /></Form.Item>
                  <Form.Item name="floor" label="楼层"><InputNumber disabled min={-3} max={99} /></Form.Item>
                  <Form.Item name="doorNo" label="门牌号"><Input disabled /></Form.Item>
                  <Form.Item name="name" label="教室名称" required rules={[{ required: true, message: '请输入教室名称' }, { min: 2, max: 200, message: '长度2~200字符' }, { pattern: /[\u4e00-\u9fa5A-Za-z0-9-]+/, message: '仅限汉字、字母、数字、-'}]}><Input /></Form.Item>
                  <Form.Item name="type" label="教室类型" required rules={[{ required: true, message: '请选择教室类型' }]}><Select options={roomTypes.map(v=>({value:v,label:v}))} /></Form.Item>
                  <Form.Item name="capacity" label="容量" required rules={[{ required: true, message: '请输入容量' }, { type:'number', min: 1, message: '至少为1' }]}><InputNumber min={1} /></Form.Item>
                  <Form.Item name="department" label="使用部门"><Input /></Form.Item>
                  <Form.Item name="equipment" label="设备情况"><Input /></Form.Item>
                  <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button onClick={() => setClassroomEditOpen(false)}>取消</Button>
                  </Space>
                </Form>
              </Modal>
            </>
          ) }]} />
        </Card>
      )
    }
    if (activeKey === 'base') {
      return (
        <Card className="page-content">
          <Space style={{ marginBottom: 12 }}>
            <Button type="primary" onClick={() => setBaseAddOpen(true)}>新增基地</Button>
          </Space>
          <Form form={baseFilterForm} layout="inline" onValuesChange={(_, v) => setBaseFilter(v)} style={{ marginBottom: 12 }}>
            <Form.Item name="code" label="基地编号"><Input placeholder="包含" style={{ width: 140 }} /></Form.Item>
            <Form.Item name="name" label="基地名称"><Input placeholder="包含" style={{ width: 200 }} /></Form.Item>
            <Form.Item name="address" label="地址"><Input placeholder="包含" style={{ width: 240 }} /></Form.Item>
            <Form.Item name="contactPerson" label="对接人"><Input placeholder="包含" style={{ width: 120 }} /></Form.Item>
            <Form.Item name="contact" label="联系方式"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="capacityRange" label="可容纳人数"><Input placeholder="如：10-50 或 30" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="status" label="状态"><Select allowClear style={{ width: 120 }} options={[{value:'启用',label:'启用'},{value:'停用',label:'停用'}]} /></Form.Item>
            <Form.Item><Button onClick={() => { baseFilterForm.resetFields(); setBaseFilter({}) }}>重置</Button></Form.Item>
          </Form>
          <Table size="small" pagination={false} rowKey="key" dataSource={baseFiltered} columns={[
            {title:'基地编号',dataIndex:'code'},{title:'基地名称',dataIndex:'name'},{title:'地址',dataIndex:'address'},{title:'对接人',dataIndex:'contactPerson'},{title:'联系方式',dataIndex:'contact'},{title:'可容纳人数',dataIndex:'capacity'},{title:'状态',dataIndex:'status'},
            {title:'操作',render:(_,record)=> (
              <Space>
                <Button size="small" onClick={()=>{ setEditingBaseKey(record.key); editBaseForm.setFieldsValue(record); setBaseEditOpen(true) }}>编辑</Button>
                <Popconfirm title="确认删除该基地？" onConfirm={()=> setBaseData((prev)=> prev.filter((r)=> r.key!==record.key))}><Button size="small" danger>删除</Button></Popconfirm>
              </Space>
            )}
          ]} />
          <Modal open={baseAddOpen} title="新增基地" footer={null} onCancel={()=> setBaseAddOpen(false)}>
            <Form form={baseForm} layout="vertical" initialValues={{ status: '启用' }} onFinish={(v)=>{ const row = { key: Date.now().toString(), code: v.code||'', name: v.name||'', address: v.address||'', contactPerson: v.contactPerson||'', contact: v.contact||'', capacity: Number(v.capacity||0), status: v.status||'启用', remark: v.remark || '' }; setBaseData((prev)=> [row, ...prev]); baseForm.resetFields(); setBaseAddOpen(false) }}>
              <Form.Item name="code" label="基地编号" required rules={[{ required: true, message: '请输入基地编号' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input placeholder="如：BASE001" /></Form.Item>
              <Form.Item name="name" label="基地名称" required rules={[{ required: true, message: '请输入基地名称' }, { min: 2, max: 200, message: '长度2~200字符' }]}><Input placeholder="如：企业A实习基地" /></Form.Item>
              <Form.Item name="address" label="地址" required rules={[{ required: true, message: '请输入地址' }, { min: 2, max: 200, message: '长度2~200字符' }]}><Input placeholder="详细地址" /></Form.Item>
              <Form.Item name="contactPerson" label="对接人" required rules={[{ required: true, message: '请输入对接人' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input placeholder="如：张三" /></Form.Item>
              <Form.Item name="contact" label="联系方式" required rules={[{ required: true, message: '请输入联系方式' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号' }]}><Input placeholder="如：13800001111" /></Form.Item>
              <Form.Item name="capacity" label="可容纳人数" required rules={[{ required: true, message: '请输入可容纳人数' }]}><Input type="number" /></Form.Item>
              <Form.Item name="remark" label="备注" rules={[{ max: 200, message: '不超过200字符' }]}><Input placeholder="可填写备注信息" /></Form.Item>
              <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={()=> setBaseAddOpen(false)}>取消</Button>
              </Space>
            </Form>
          </Modal>
          <Modal open={baseEditOpen} title="编辑基地" footer={null} onCancel={()=> setBaseEditOpen(false)}>
            <Form form={editBaseForm} layout="vertical" onFinish={(v)=>{ setBaseData((prev)=> prev.map((r)=> r.key===editingBaseKey ? { ...r, code: r.code, name: r.name, address: v.address||r.address||'', contactPerson: v.contactPerson||r.contactPerson||'', contact: v.contact||r.contact||'', capacity: Number(v.capacity||r.capacity||0), remark: v.remark ?? r.remark, status: v.status||r.status } : r)); setBaseEditOpen(false); setEditingBaseKey(null) }}>
              <Form.Item name="code" label="基地编号" required rules={[{ required: true, message: '请输入基地编号' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input disabled /></Form.Item>
              <Form.Item name="name" label="基地名称" required rules={[{ required: true, message: '请输入基地名称' }, { min: 2, max: 200, message: '长度2~200字符' }]}><Input disabled /></Form.Item>
              <Form.Item name="address" label="地址" required rules={[{ required: true, message: '请输入地址' }, { min: 2, max: 200, message: '长度2~200字符' }]}><Input /></Form.Item>
              <Form.Item name="contactPerson" label="对接人" required rules={[{ required: true, message: '请输入对接人' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input /></Form.Item>
              <Form.Item name="contact" label="联系方式" required rules={[{ required: true, message: '请输入联系方式' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号' }]}><Input /></Form.Item>
              <Form.Item name="capacity" label="可容纳人数" required rules={[{ required: true, message: '请输入可容纳人数' }]}><Input type="number" /></Form.Item>
              <Form.Item name="remark" label="备注" rules={[{ max: 200, message: '不超过200字符' }]}><Input /></Form.Item>
              <Form.Item name="status" label="状态"><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={()=> setBaseEditOpen(false)}>取消</Button>
              </Space>
            </Form>
          </Modal>
        </Card>
      )
    }
    if (activeKey === 'majorTrack') {
      return (
        <Card className="page-content">
          <Space style={{ marginBottom: 12 }}>
            <Button type="primary" onClick={() => setMajorAddOpen(true)}>新增专业</Button>
          </Space>
          <Form form={majorsFilterForm} layout="inline" onValuesChange={(_, v) => setMajorsFilter(v)} style={{ marginBottom: 12 }}>
            <Form.Item name="code" label="专业编号"><Input placeholder="国标代码" style={{ width: 140 }} /></Form.Item>
            <Form.Item name="name" label="专业名称"><Input placeholder="包含" style={{ width: 200 }} /></Form.Item>
            <Form.Item name="department" label="所属院系"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="durationYears" label="学制(年)"><InputNumber style={{ width: 120 }} /></Form.Item>
            <Form.Item name="level" label="层次"><Select allowClear style={{ width: 120 }} options={[{value:'本科',label:'本科'},{value:'专科',label:'专科'}]} /></Form.Item>
            <Form.Item name="enabled" label="是否启用"><Select allowClear style={{ width: 120 }} options={[{value:'启用',label:'启用'},{value:'停用',label:'停用'}]} /></Form.Item>
            <Form.Item><Button onClick={() => { majorsFilterForm.resetFields(); setMajorsFilter({}) }}>重置</Button></Form.Item>
            <Form.Item><Button type="primary" onClick={() => setMajorsFilter(majorsFilterForm.getFieldsValue())}>查询</Button></Form.Item>
          </Form>
          <Table
            size="small"
            pagination={false}
            dataSource={majorsFiltered}
            locale={{ emptyText: '暂无数据' }}
            columns={[
              { title: '专业编号', dataIndex: 'code' },
              { title: '专业名称', dataIndex: 'name' },
              { title: '学科门类', dataIndex: 'discipline' },
              { title: '所属院系', dataIndex: 'department' },
              { title: '学制(年)', dataIndex: 'durationYears' },
              { title: '层次', dataIndex: 'level' },
              { title: '是否启用', dataIndex: 'enabled' },
              { title: '关联专业方向', dataIndex: 'tracks', render: (_, r) => (Array.isArray(r.tracks) && r.tracks.length ? r.tracks.map((t: any) => `${t.code}/${t.name}`).join('，') : '-') },
              {
                title: '操作',
                render: (_, record) => (
                  <Space>
                    <Button size="small" onClick={()=>{ setEditingMajorKey(record.key); editMajorForm.setFieldsValue(record); setMajorEditOpen(true) }}>编辑</Button>
                    <Popconfirm title="确认删除该记录？" onConfirm={() => setMajorsData((prev) => prev.filter((r) => r.key !== record.key))}><Button size="small" danger>删除</Button></Popconfirm>
                  </Space>
                )
              },
            ]}
          />
          <Modal open={majorAddOpen} title="新增专业" footer={null} onCancel={() => setMajorAddOpen(false)}>
            <Form form={majorForm} layout="vertical" initialValues={{ enabled: '启用' }} onFinish={(v) => { const row = { key: Date.now().toString(), code: v.code || '', name: v.name || '', discipline: v.discipline || '', department: v.department || '', durationYears: Number(v.durationYears || 0), level: v.level || '', enabled: v.enabled || '启用', tracks: Array.isArray(v.tracks) ? v.tracks : [] }; setMajorsData((prev) => [row, ...prev]); majorForm.resetFields(); setMajorAddOpen(false) }}>
              <Form.Item name="code" label="专业编号" required rules={[{ required: true, message: '请输入专业编号' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input placeholder="如：080901" /></Form.Item>
              <Form.Item name="name" label="专业名称" required rules={[{ required: true, message: '请输入专业名称' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input placeholder="如：计算机科学与技术" /></Form.Item>
              <Form.Item name="discipline" label="学科门类" required rules={[{ required: true, message: '请选择学科门类' }]}><Select allowClear showSearch options={majorDisciplineOptions} /></Form.Item>
              <Form.Item name="department" label="所属院系" required rules={[{ required: true, message: '请选择所属院系' }]}><Select allowClear showSearch options={departmentGroupOptions} placeholder="如：计算机学院" /></Form.Item>
              <Form.Item name="durationYears" label="学制(年)" required rules={[{ required: true, message: '请输入学制' }, { type: 'number', min: 1, max: 5, message: '范围1~5年' }]}><InputNumber min={1} max={5} /></Form.Item>
              <Form.Item name="level" label="层次" required rules={[{ required: true, message: '请选择层次' }]}><Select options={[{value:'本科',label:'本科'},{value:'专科',label:'专科'}]} /></Form.Item>
              <Form.Item name="enabled" label="是否启用" required rules={[{ required: true, message: '请选择是否启用' }]}><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
              <Form.List name="tracks">
                {(fields, { add, remove }) => (
                  <>
                    <Space style={{ display: 'block', marginBottom: 8 }}>
                      <Button type="dashed" size="small" onClick={() => add()}>新增方向</Button>
                    </Space>
                    {fields.map((field) => (
                      <Space key={field.key} align="baseline" style={{ marginBottom: 8 }}>
                        <Form.Item name={[field.name, 'code']} label="方向编码">
                          <Input style={{ width: 140 }} />
                        </Form.Item>
                        <Form.Item name={[field.name, 'name']} label="方向名称">
                          <Input style={{ width: 180 }} />
                        </Form.Item>
                        <Button size="small" danger onClick={() => remove(field.name)}>删除</Button>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
              <Space style={{ marginTop: 8 }}>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={() => setMajorAddOpen(false)}>取消</Button>
              </Space>
            </Form>
          </Modal>
          <Modal open={majorEditOpen} title="编辑专业" footer={null} onCancel={()=> setMajorEditOpen(false)}>
            <Form form={editMajorForm} layout="vertical" onFinish={(v)=>{ setMajorsData((prev)=> prev.map((r)=> r.key===editingMajorKey ? { ...r, code: v.code || r.code, name: v.name || r.name || '', discipline: v.discipline || r.discipline || '', department: v.department || r.department || '', durationYears: Number(v.durationYears || r.durationYears || 0), level: v.level || r.level, enabled: v.enabled || r.enabled, tracks: Array.isArray(v.tracks) ? v.tracks : r.tracks } : r)); setMajorEditOpen(false); setEditingMajorKey(null) }}>
              <Form.Item name="code" label="专业编号" required rules={[{ required: true, message: '请输入专业编号' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input /></Form.Item>
              <Form.Item name="name" label="专业名称" required rules={[{ required: true, message: '请输入专业名称' }, { min: 2, max: 20, message: '长度2~20字符' }]}><Input /></Form.Item>
              <Form.Item name="discipline" label="学科门类" required rules={[{ required: true, message: '请选择学科门类' }]}><Select allowClear showSearch options={majorDisciplineOptions} /></Form.Item>
              <Form.Item name="department" label="所属院系" required rules={[{ required: true, message: '请选择所属院系' }]}><Select allowClear showSearch options={departmentGroupOptions} /></Form.Item>
              <Form.Item name="durationYears" label="学制(年)" required rules={[{ required: true, message: '请输入学制' }, { type: 'number', min: 1, max: 5, message: '范围1~5年' }]}><InputNumber min={1} max={5} /></Form.Item>
              <Form.Item name="level" label="层次" required rules={[{ required: true, message: '请选择层次' }]}><Select options={[{value:'本科',label:'本科'},{value:'专科',label:'专科'}]} /></Form.Item>
              <Form.Item name="enabled" label="是否启用" required rules={[{ required: true, message: '请选择是否启用' }]}><Select options={[{value:'启用',label:'启用'},{value:'禁用',label:'禁用'}]} /></Form.Item>
              <Form.List name="tracks">
                {(fields, { add, remove }) => (
                  <>
                    <Space style={{ display: 'block', marginBottom: 8 }}>
                      <Button type="dashed" size="small" onClick={() => add()}>新增方向</Button>
                    </Space>
                    {fields.map((field) => (
                      <Space key={field.key} align="baseline" style={{ marginBottom: 8 }}>
                        <Form.Item name={[field.name, 'code']} label="方向编码">
                          <Input style={{ width: 140 }} />
                        </Form.Item>
                        <Form.Item name={[field.name, 'name']} label="方向名称">
                          <Input style={{ width: 180 }} />
                        </Form.Item>
                        <Button size="small" danger onClick={() => remove(field.name)}>删除</Button>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
              <Space style={{ marginTop: 8 }}>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={()=> setMajorEditOpen(false)}>取消</Button>
              </Space>
            </Form>
          </Modal>
        </Card>
      )
    }
    if (activeKey === 'newMajor') {
      return (
        <Card className="page-content">
          <Space style={{ marginBottom: 12 }}>
            <Button type="primary" onClick={() => setNewMajorAddOpen(true)}>新增新生专业</Button>
          </Space>
          <Form form={newMajorFilterForm} layout="inline" onValuesChange={(_, v) => setNewMajorFilter(v)} style={{ marginBottom: 12 }}>
            <Form.Item name="grade" label="招生年度"><Input placeholder="包含" style={{ width: 120 }} /></Form.Item>
            <Form.Item name="major" label="可选专业"><Input placeholder="包含" style={{ width: 200 }} /></Form.Item>
            <Form.Item><Button onClick={() => { newMajorFilterForm.resetFields(); setNewMajorFilter({}) }}>重置</Button></Form.Item>
            <Form.Item><Button type="primary" onClick={() => setNewMajorFilter(newMajorFilterForm.getFieldsValue())}>查询</Button></Form.Item>
          </Form>
          <Table size="small" pagination={false} rowKey="key" dataSource={newMajorFiltered} columns={[
            {title:'招生年度',dataIndex:'grade'},
            {title:'年级',render:(_,r)=> (String(r.grade).slice(-2) + '级')},
            {title:'专业编码',render:(_,r)=> { const m = majorsData.find((x)=> x.name===r.major); return m? m.code : '-' }},
            {title:'可选专业',dataIndex:'major'},
            {title:'操作',render:(_,record)=> (
              <Space>
                <Button size="small" onClick={()=>{ setEditingNewMajorKey(record.key); editNewMajorForm.setFieldsValue(record); setNewMajorEditOpen(true) }}>编辑</Button>
                <Popconfirm title="确认删除该记录？" onConfirm={()=> setNewMajorDataState((prev)=> prev.filter((r)=> r.key!==record.key))}><Button size="small" danger>删除</Button></Popconfirm>
              </Space>
            )}
          ]} />
          <Modal open={newMajorAddOpen} title="新增新生专业" footer={null} onCancel={() => setNewMajorAddOpen(false)}>
            <Form form={newMajorForm} layout="vertical" initialValues={{ grade: String(new Date().getFullYear()) }} onFinish={(v)=>{
              const majors = Array.isArray(v.major) ? v.major : (v.major ? [v.major] : [])
              const rows = majors.map((name: string, i: number) => ({ key: String(Date.now()) + '-' + i, grade: v.grade || String(new Date().getFullYear()), major: name }))
              setNewMajorDataState((prev)=> [...rows, ...prev])
              newMajorForm.resetFields(); setNewMajorAddOpen(false)
            }}>
              <Form.Item name="grade" label="招生年度"><Input placeholder="如：2025" /></Form.Item>
              <Form.Item name="major" label="可选专业">
                <Select mode="multiple" showSearch allowClear options={majorOptions} filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())} placeholder="选择一个或多个专业" />
              </Form.Item>
              <Table size="small" pagination={false} rowKey="code" dataSource={selectedMajorRows} columns={[{title:'专业编号',dataIndex:'code'},{title:'专业名称',dataIndex:'name'},{title:'操作',render:(_,r)=> (<Button size="small" danger onClick={()=> removeSelectedMajor(r.name)}>删除</Button>)}]} />
              <Space>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={() => setNewMajorAddOpen(false)}>取消</Button>
              </Space>
            </Form>
          </Modal>
          <Modal open={newMajorEditOpen} title="编辑新生专业" footer={null} onCancel={()=> setNewMajorEditOpen(false)}>
            <Form form={editNewMajorForm} layout="vertical" onFinish={(v)=>{ setNewMajorDataState((prev)=> prev.map((r)=> r.key===editingNewMajorKey ? { ...r, grade: v.grade||r.grade, major: v.major||r.major } : r)); setNewMajorEditOpen(false); setEditingNewMajorKey(null) }}>
              <Form.Item name="grade" label="招生年度"><Input /></Form.Item>
              <Form.Item name="major" label="可选专业">
                <Select showSearch allowClear options={majorOptions} filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())} />
              </Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={()=> setNewMajorEditOpen(false)}>取消</Button>
              </Space>
            </Form>
          </Modal>
        </Card>
      )
    }
    return (
      <Tabs items={[
        { key: 'major', label: '主修课程', children: (
      <Card className="page-content">
        <Space style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={() => setCatalogAddOpen(true)}>新增课程</Button>
        </Space>
        <Form form={catalogFilterForm} layout="inline" onValuesChange={(_, v) => setCatalogFilter(v)} style={{ marginBottom: 12 }}>
          <Form.Item name="category" label="课程类别"><Select allowClear style={{ width: 160 }} options={[
            {value:'通识教育',label:'通识教育'},
            {value:'学科基础教育',label:'学科基础教育'},
            {value:'专业教育',label:'专业教育'},
            {value:'实践教育',label:'实践教育'},
          ]} /></Form.Item>
          <Form.Item name="nature" label="课程性质"><Select allowClear style={{ width: 220 }} options={[
            {value:'通识课程-必修',label:'通识课程-必修'},
            {value:'通识课程-选修',label:'通识课程-选修'},
            {value:'公共基础课-必修',label:'公共基础课-必修'},
            {value:'公共基础课-选修',label:'公共基础课-选修'},
            {value:'专业基础课-必修',label:'专业基础课-必修'},
            {value:'专业课程-必修',label:'专业课程-必修'},
            {value:'专业课程-选修',label:'专业课程-选修'},
            {value:'实践课程-基础实践',label:'实践课程-基础实践'},
            {value:'实践课程-综合实践',label:'实践课程-综合实践'},
            {value:'实践课程-创新实践',label:'实践课程-创新实践'},
          ]} /></Form.Item>
          <Form.Item name="ctype" label="课程类型"><Select allowClear style={{ width: 220 }} options={[
            {value:'理论课（课内实验实训）',label:'理论课（课内实验实训）'},
            {value:'校内实践（集中）',label:'校内实践（集中）'},
            {value:'校外实践（分散）',label:'校外实践（分散）'},
          ]} /></Form.Item>
          <Form.Item name="code" label="课程编号"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
          <Form.Item name="name" label="课程名称"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
          <Form.Item label="学分">
            <Space>
              <Form.Item name="creditMin" noStyle><InputNumber style={{ width: 100 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="creditMax" noStyle><InputNumber style={{ width: 100 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="总学时">
            <Space>
              <Form.Item name="hoursMin" noStyle><InputNumber style={{ width: 100 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="hoursMax" noStyle><InputNumber style={{ width: 100 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="assessment" label="考核方式"><Select allowClear style={{ width: 120 }} options={[{value:'考试',label:'考试'},{value:'考察',label:'考察'}]} /></Form.Item>
          <Form.Item name="source" label="来源"><Select allowClear style={{ width: 160 }} options={[{value:'新增',label:'新增'},{value:'人才培养方案',label:'人才培养方案'}]} /></Form.Item>
          <Form.Item><Button onClick={() => { catalogFilterForm.resetFields(); setCatalogFilter({}) }}>重置</Button></Form.Item>
          <Form.Item><Button type="primary" onClick={() => setCatalogFilter(catalogFilterForm.getFieldsValue())}>查询</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} rowKey="key" dataSource={catalogFiltered} columns={[
          {title:'课程类别',dataIndex:'category'},{title:'课程性质',dataIndex:'nature'},{title:'课程类型',dataIndex:'ctype'},
          {title:'课程编号',dataIndex:'code'},{title:'课程名称',dataIndex:'name'},{title:'学分',dataIndex:'credit'},
          {title:'总学时',render:(_,r)=>{ const t=(r.hoursTheory||0), l=(r.hoursLab||0), tr=(r.hoursTraining||0), p=(r.hoursPractice||0); return t+l+tr+p }},
          {title:'学时',children:[
            {title:'理论',dataIndex:'hoursTheory'},
            {title:'实验',dataIndex:'hoursLab'},
            {title:'实训',dataIndex:'hoursTraining'},
            {title:'实践',dataIndex:'hoursPractice'},
          ]},
          {title:'考核方式',dataIndex:'assessment'},{title:'来源',render:(_,r)=> (<Tag color={r.source==='新增'?'blue':'green'}>{r.source}</Tag>)},
          {title:'操作',render:(_,record)=> (
            <Space>
              <Button size="small" onClick={()=>{ setEditingCatalogKey(record.key); editCatalogForm.setFieldsValue({ ...record }); setCatalogEditOpen(true) }}>编辑</Button>
              <Popconfirm title="确认删除该课程？" onConfirm={()=> setCourseCatalogDataState((prev)=> prev.filter((r)=> r.key!==record.key))}><Button size="small" danger>删除</Button></Popconfirm>
            </Space>
          )}
        ]} />
        <Modal open={catalogAddOpen} title="新增课程" footer={null} onCancel={() => setCatalogAddOpen(false)} width={900}>
          <Form form={catalogForm} layout="vertical" onFinish={(v)=>{ const row = { key: Date.now().toString(), code: v.code||'', name: v.name||'', category: v.category||'', nature: v.nature||'', ctype: v.ctype||'', credit: Number(v.credit||0), hoursTotal: Number(v.hoursTotal||0), hoursTheory: Number(v.hoursTheory||0), hoursLab: Number(v.hoursLab||0), hoursTraining: Number(v.hoursTraining||0), hoursPractice: Number(v.hoursPractice||0), assessment: v.assessment||'', openSemester: '', source: '' }; setCourseCatalogDataState((prev)=> [row, ...prev]); catalogForm.resetFields(); setCatalogAddOpen(false) }} onValuesChange={onCatalogValuesChange}>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input placeholder="CUR08090101" /></Form.Item></Col>
              <Col span={12}><Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input placeholder="数据结构" /></Form.Item></Col>
              <Col span={12}><Form.Item name="category" label="课程类别"><Select options={[
                {value:'通识课程',label:'通识课程'},
                {value:'学科基础教育',label:'学科基础教育'},
                {value:'专业课程',label:'专业课程'},
                {value:'实践课程',label:'实践课程'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="nature" label="课程性质"><Select options={[
                {value:'通识必修',label:'通识必修'},
                {value:'通识选修（限选）',label:'通识选修（限选）'},
                {value:'通识选修（任选）',label:'通识选修（任选）'},
                {value:'通识选修（一任选）',label:'通识选修（一任选）'},
                {value:'数理基础',label:'数理基础'},
                {value:'工程基础',label:'工程基础'},
                {value:'信息基础',label:'信息基础'},
                {value:'人文社科基础',label:'人文社科基础'},
                {value:'专业核心课',label:'专业核心课'},
                {value:'专业选修课',label:'专业选修课'},
                {value:'专业方向课',label:'专业方向课'},
                {value:'基础实践',label:'基础实践'},
                {value:'综合实践',label:'综合实践'},
                {value:'创新实践',label:'创新实践'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="ctype" label="课程类型"><Select options={[
                {value:'理论课（含课内实验实训）',label:'理论课（含课内实验实训）'},
                {value:'独立设置的实验课',label:'独立设置的实验课'},
                {value:'校内实践（集中）',label:'校内实践（集中）'},
                {value:'校内实践（分散）',label:'校内实践（分散）'},
                {value:'校外实践（集中）',label:'校外实践（集中）'},
                {value:'校外实践（分散）',label:'校外实践（分散）'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="credit" label="学分" required rules={[{ required: true, message: '请输入学分' }]}><Input type="number" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTheory" label="理论学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursLab" label="实验学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTraining" label="实训学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursPractice" label="实践学时"><Input type="number" addonAfter="周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="assessment" label="考核方式"><Select options={[{value:'考试',label:'考试'},{value:'考察',label:'考察'}]} /></Form.Item></Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setCatalogAddOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
        <Modal open={catalogEditOpen} title="编辑课程" footer={null} onCancel={()=> setCatalogEditOpen(false)} width={900}>
          <Form form={editCatalogForm} layout="vertical" onFinish={(v)=>{ setCourseCatalogDataState((prev)=> prev.map((r)=> { if (r.key!==editingCatalogKey) return r; const total = Number(v.hoursTheory || r.hoursTheory || 0) + Number(v.hoursLab || r.hoursLab || 0) + Number(v.hoursTraining || r.hoursTraining || 0) + Number(v.hoursPractice || r.hoursPractice || 0); return { ...r, code: v.code||r.code, name: v.name||r.name, category: v.category||r.category, nature: v.nature||r.nature, ctype: v.ctype||r.ctype, credit: Number(v.credit||r.credit||0), hoursTotal: Number(v.hoursTotal||total), hoursTheory: Number(v.hoursTheory||r.hoursTheory||0), hoursLab: Number(v.hoursLab||r.hoursLab||0), hoursTraining: Number(v.hoursTraining||r.hoursTraining||0), hoursPractice: Number(v.hoursPractice||r.hoursPractice||0), assessment: v.assessment||r.assessment } })); setCatalogEditOpen(false); setEditingCatalogKey(null) }} onValuesChange={onCatalogValuesChange}>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="category" label="课程类别"><Select options={[
                {value:'通识课程',label:'通识课程'},
                {value:'学科基础教育',label:'学科基础教育'},
                {value:'专业课程',label:'专业课程'},
                {value:'实践课程',label:'实践课程'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="nature" label="课程性质"><Select options={[
                {value:'通识必修',label:'通识必修'},
                {value:'通识选修（限选）',label:'通识选修（限选）'},
                {value:'通识选修（任选）',label:'通识选修（任选）'},
                {value:'通识选修（一任选）',label:'通识选修（一任选）'},
                {value:'数理基础',label:'数理基础'},
                {value:'工程基础',label:'工程基础'},
                {value:'信息基础',label:'信息基础'},
                {value:'人文社科基础',label:'人文社科基础'},
                {value:'专业核心课',label:'专业核心课'},
                {value:'专业选修课',label:'专业选修课'},
                {value:'专业方向课',label:'专业方向课'},
                {value:'基础实践',label:'基础实践'},
                {value:'综合实践',label:'综合实践'},
                {value:'创新实践',label:'创新实践'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="ctype" label="课程类型"><Select options={[
                {value:'理论课（含课内实验实训）',label:'理论课（含课内实验实训）'},
                {value:'独立设置的实验课',label:'独立设置的实验课'},
                {value:'校内实践（集中）',label:'校内实践（集中）'},
                {value:'校内实践（分散）',label:'校内实践（分散）'},
                {value:'校外实践（集中）',label:'校外实践（集中）'},
                {value:'校外实践（分散）',label:'校外实践（分散）'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="credit" label="学分" required rules={[{ required: true, message: '请输入学分' }]}><Input type="number" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTheory" label="理论学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursLab" label="实验学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTraining" label="实训学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursPractice" label="实践学时"><Input type="number" addonAfter="周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="assessment" label="考核方式"><Select options={[{value:'考试',label:'考试'},{value:'考察',label:'考察'}]} /></Form.Item></Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={()=> setCatalogEditOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
      </Card>
        ) },
        { key: 'elective', label: '公共选修课', children: (
      <Card className="page-content">
        <Space style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={() => { setEditingElectKey(null); electForm.resetFields(); setElectAddOpen(true) }}>新增课程</Button>
        </Space>
        <Form form={electFilterForm} layout="inline" onValuesChange={(_, v) => setElectFilter(v)} style={{ marginBottom: 12 }}>
          <Form.Item name="ctype" label="课程类型"><Select allowClear style={{ width: 220 }} options={[
            {value:'理论课（含课内实验实训）',label:'理论课（含课内实验实训）'},
            {value:'独立设置的实验课',label:'独立设置的实验课'},
            {value:'校内实践（集中）',label:'校内实践（集中）'},
            {value:'校内实践（分散）',label:'校内实践（分散）'},
            {value:'校外实践（集中）',label:'校外实践（集中）'},
            {value:'校外实践（分散）',label:'校外实践（分散）'},
          ]} /></Form.Item>
          <Form.Item name="nature" label="课程性质"><Select allowClear style={{ width: 160 }} options={[{value:'任选',label:'任选'},{value:'限选',label:'限选'}]} /></Form.Item>
          <Form.Item name="module" label="课程模块"><Input placeholder="包含" style={{ width: 180 }} /></Form.Item>
          <Form.Item name="code" label="课程编号"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
          <Form.Item name="name" label="课程名称"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
          <Form.Item label="学分"><Space><Form.Item name="creditMin" noStyle><InputNumber style={{ width: 100 }} /></Form.Item><span>-</span><Form.Item name="creditMax" noStyle><InputNumber style={{ width: 100 }} /></Form.Item></Space></Form.Item>
          <Form.Item label="总学时"><Space><Form.Item name="hoursMin" noStyle><InputNumber style={{ width: 100 }} /></Form.Item><span>-</span><Form.Item name="hoursMax" noStyle><InputNumber style={{ width: 100 }} /></Form.Item></Space></Form.Item>
          <Form.Item label="周学时"><Space><Form.Item name="weekMin" noStyle><InputNumber style={{ width: 100 }} /></Form.Item><span>-</span><Form.Item name="weekMax" noStyle><InputNumber style={{ width: 100 }} /></Form.Item></Space></Form.Item>
          <Form.Item name="assessment" label="考核方式"><Select allowClear style={{ width: 140 }} options={[{value:'考试',label:'考试'},{value:'考查',label:'考查'}]} /></Form.Item>
          <Form.Item name="delivery" label="上课方式"><Select allowClear style={{ width: 160 }} options={[{value:'学堂在线',label:'学堂在线'},{value:'线下课程',label:'线下课程'}]} /></Form.Item>
          <Form.Item name="department" label="教学单位"><Input placeholder="包含" style={{ width: 160 }} /></Form.Item>
          <Form.Item><Button onClick={() => { electFilterForm.resetFields(); setElectFilter({}) }}>重置</Button></Form.Item>
          <Form.Item><Button type="primary" onClick={() => setElectFilter(electFilterForm.getFieldsValue())}>查询</Button></Form.Item>
        </Form>
        <Table size="small" pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }} rowKey="key" dataSource={electFiltered} columns={[
          {title:'课程类型',dataIndex:'ctype'},
          {title:'课程性质',dataIndex:'nature'},
          {title:'课程模块',dataIndex:'module'},
          {title:'课程编号',dataIndex:'code'},
          {title:'课程名称',dataIndex:'name'},
          {title:'学分',dataIndex:'credit'},
          {title:'总学时',dataIndex:'hoursTotal'},
          {title:'学时',children:[
            {title:'理论',dataIndex:'hoursTheory'},
            {title:'实验',dataIndex:'hoursLab'},
            {title:'实训',dataIndex:'hoursTraining'},
            {title:'实践',dataIndex:'hoursPractice'},
          ]},
          {title:'考核方式',dataIndex:'assessment'},
          {title:'周学时',dataIndex:'weekHours'},
          {title:'上课方式',dataIndex:'delivery'},
          {title:'教学单位',dataIndex:'department'},
          {title:'操作',render:(_:any,record:Elective)=> (
            <Space>
              <Button size="small" onClick={()=>{ setEditingElectKey(record.key); electForm.setFieldsValue({ ...record }); setElectEditOpen(true) }}>编辑</Button>
              <Popconfirm title="确认删除该课程？" onConfirm={()=> setElectives((prev)=> prev.filter((r)=> r.key!==record.key))}><Button size="small" danger>删除</Button></Popconfirm>
            </Space>
          )}
        ]} />
        <Modal open={electAddOpen} title="新增公共选修课" footer={null} onCancel={()=> setElectAddOpen(false)} width={900}>
          <Form form={electForm} layout="vertical" onFinish={(v)=>{ const row: Elective = { key: Date.now().toString(), ctype: v.ctype||'', nature: v.nature||'', module: v.module||'', code: v.code||'', name: v.name||'', credit: Number(v.credit||0), hoursTheory: Number(v.hoursTheory||0), hoursLab: Number(v.hoursLab||0), hoursTraining: Number(v.hoursTraining||0), hoursPractice: Number(v.hoursPractice||0), hoursTotal: Number(v.hoursTotal||0), assessment: v.assessment||'', weekHours: Number(v.weekHours||0), delivery: v.delivery||'', department: v.department||'' }; setElectives((prev)=> [row, ...prev]); electForm.resetFields(); setElectAddOpen(false) }} onValuesChange={onElectValuesChange}>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="ctype" label="课程类型" required rules={[{ required: true, message: '请选择课程类型' }]}><Select options={[
                {value:'理论课（含课内实验实训）',label:'理论课（含课内实验实训）'},
                {value:'独立设置的实验课',label:'独立设置的实验课'},
                {value:'校内实践（集中）',label:'校内实践（集中）'},
                {value:'校内实践（分散）',label:'校内实践（分散）'},
                {value:'校外实践（集中）',label:'校外实践（集中）'},
                {value:'校外实践（分散）',label:'校外实践（分散）'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="nature" label="课程性质" required rules={[{ required: true, message: '请选择课程性质' }]}><Select options={[{value:'任选',label:'任选'},{value:'限选',label:'限选'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="module" label="课程模块" required rules={[{ required: true, message: '请输入课程模块' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="credit" label="学分" required rules={[{ required: true, message: '请输入学分' }]}><Input type="number" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTheory" label="理论学时" required rules={[{ required: true, message: '请输入理论学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursLab" label="实验学时" required rules={[{ required: true, message: '请输入实验学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTraining" label="实训学时" required rules={[{ required: true, message: '请输入实训学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursPractice" label="实践学时" required rules={[{ required: true, message: '请输入实践学时' }]}><Input type="number" addonAfter="周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="assessment" label="考核方式" required rules={[{ required: true, message: '请选择考核方式' }]}><Select options={[{value:'考试',label:'考试'},{value:'考查',label:'考查'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="weekHours" label="周学时" required rules={[{ required: true, message: '请输入周学时' }]}><Input type="number" addonAfter="时/周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="delivery" label="上课方式" required rules={[{ required: true, message: '请选择上课方式' }]}><Select options={[{value:'学堂在线',label:'学堂在线'},{value:'线下课程',label:'线下课程'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="department" label="教学单位" required rules={[{ required: true, message: '请输入教学单位' }]}><Input /></Form.Item></Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={()=> setElectAddOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
        <Modal open={electEditOpen} title="编辑公共选修课" footer={null} onCancel={()=> setElectEditOpen(false)} width={900}>
          <Form form={electForm} layout="vertical" onFinish={(v)=>{ setElectives((prev)=> prev.map((r)=> r.key===editingElectKey ? { ...r, ctype: v.ctype||r.ctype, nature: v.nature||r.nature, module: v.module||r.module, code: v.code||r.code, name: v.name||r.name, credit: Number(v.credit||r.credit||0), hoursTheory: Number(v.hoursTheory||r.hoursTheory||0), hoursLab: Number(v.hoursLab||r.hoursLab||0), hoursTraining: Number(v.hoursTraining||r.hoursTraining||0), hoursPractice: Number(v.hoursPractice||r.hoursPractice||0), hoursTotal: Number(v.hoursTotal||r.hoursTotal||0), assessment: v.assessment||r.assessment, weekHours: Number(v.weekHours||r.weekHours||0), delivery: v.delivery||r.delivery, department: v.department||r.department } : r)); setElectEditOpen(false); setEditingElectKey(null) }} onValuesChange={onElectValuesChange}>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="ctype" label="课程类型" required rules={[{ required: true, message: '请选择课程类型' }]}><Select options={[
                {value:'理论课（含课内实验实训）',label:'理论课（含课内实验实训）'},
                {value:'独立设置的实验课',label:'独立设置的实验课'},
                {value:'校内实践（集中）',label:'校内实践（集中）'},
                {value:'校内实践（分散）',label:'校内实践（分散）'},
                {value:'校外实践（集中）',label:'校外实践（集中）'},
                {value:'校外实践（分散）',label:'校外实践（分散）'},
              ]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="nature" label="课程性质" required rules={[{ required: true, message: '请选择课程性质' }]}><Select options={[{value:'任选',label:'任选'},{value:'限选',label:'限选'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="module" label="课程模块" required rules={[{ required: true, message: '请输入课程模块' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="credit" label="学分" required rules={[{ required: true, message: '请输入学分' }]}><Input type="number" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTheory" label="理论学时" required rules={[{ required: true, message: '请输入理论学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursLab" label="实验学时" required rules={[{ required: true, message: '请输入实验学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTraining" label="实训学时" required rules={[{ required: true, message: '请输入实训学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursPractice" label="实践学时" required rules={[{ required: true, message: '请输入实践学时' }]}><Input type="number" addonAfter="周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="assessment" label="考核方式" required rules={[{ required: true, message: '请选择考核方式' }]}><Select options={[{value:'考试',label:'考试'},{value:'考查',label:'考查'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="weekHours" label="周学时" required rules={[{ required: true, message: '请输入周学时' }]}><Input type="number" addonAfter="时/周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="delivery" label="上课方式" required rules={[{ required: true, message: '请选择上课方式' }]}><Select options={[{value:'学堂在线',label:'学堂在线'},{value:'线下课程',label:'线下课程'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="department" label="教学单位" required rules={[{ required: true, message: '请输入教学单位' }]}><Input /></Form.Item></Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={()=> setElectEditOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
      </Card>
        ) },
      ]} />
    )
  }
  return (
    <div>
      {renderSection()}
    </div>
  )
}

export const CurriculumPlan: React.FC = () => {
  const loc = useLocation()
  useEffect(() => {
    if (loc.pathname.endsWith('/pro-course-settings')) {
      const el = document.getElementById('pro-course-settings')
      el && el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loc.pathname])
  type PlanCourse = {
    key: string
    version: string
    major: string
    grade: string
    category: string
    nature: string
    ctype: string
    code: string
    name: string
    credit: number
    hoursTotal: number
    hoursTheory: number
    hoursExperiment: number
    hoursTraining: number
    hoursPractice: number
    assess: string
    term: string
  }
  const cpNatureMap: Record<string, { value: string; label: string }[]> = {
    '通识教育': [
      { value: '通识必修', label: '通识必修' },
      { value: '通识选修（限选）', label: '通识选修（限选）' },
      { value: '通识选修（任选）', label: '通识选修（任选）' },
      { value: '通识选修（一任选）', label: '通识选修（一任选）' },
    ],
    '学科基础教育': [
      { value: '数理基础', label: '数理基础' },
      { value: '工程基础', label: '工程基础' },
      { value: '信息基础', label: '信息基础' },
      { value: '人文社科基础', label: '人文社科基础' },
    ],
    '专业教育': [
      { value: '专业核心课', label: '专业核心课' },
      { value: '专业选修课', label: '专业选修课' },
      { value: '专业方向课', label: '专业方向课' },
    ],
    '实践教育': [
      { value: '基础实践', label: '基础实践' },
      { value: '综合实践', label: '综合实践' },
      { value: '创新实践', label: '创新实践' },
    ],
  }
  const PLAN_COURSES_KEY = 'planCourses'
  const [metaForm] = Form.useForm()
  const [courseForm] = Form.useForm()
  const [planCourses, setPlanCourses] = useState<PlanCourse[]>([])
  const [planAddOpen, setPlanAddOpen] = useState(false)
  const [planEditOpen, setPlanEditOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editingPlanKey, setEditingPlanKey] = useState<string | null>(null)
  const [editPlanForm] = Form.useForm()
  const [planFilterForm] = Form.useForm()
  const [planFilter, setPlanFilter] = useState<any>({})
  const versionOptions = useMemo(() => {
    const s = new Set<string>()
    planCourses.forEach((p) => { if (p.version) s.add(p.version) })
    ;['v2025','v2024','v2023'].forEach((v) => s.add(v))
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [planCourses])
  const majorOptionsCP = useMemo(() => {
    try {
      const raw = localStorage.getItem('basic_major_track') || '[]'
      const list = JSON.parse(raw)
      const s = new Set<string>()
      if (Array.isArray(list)) {
        list.forEach((m: any) => { const nm = m.name || m.major; if (nm) s.add(String(nm)) })
      }
      return Array.from(s).map((v) => ({ value: v, label: v }))
    } catch { return [] }
  }, [])
  const gradeOptions = useMemo(() => {
    const s = new Set<string>()
    planCourses.forEach((p) => { if (p.grade) s.add(p.grade) })
    const y = new Date().getFullYear()
    ;[y, y - 1, y - 2].forEach((v) => s.add(String(v)))
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [planCourses])

  const exportPlanCSV = () => {
    const header = ['版本','专业','年级','课程类别','课程性质','课程类型','课程编号','课程名称','学分','总学时','理论学时','实验学时','实训学时','实践学时','考核方式','开设学期']
    const rows = planCourses.map((p)=>[
      p.version||'',p.major||'',p.grade||'',p.category||'',p.nature||'',p.ctype||'',p.code||'',p.name||'',
      String(p.credit??''),String(p.hoursTotal??''),String(p.hoursTheory??''),String(p.hoursExperiment??''),String(p.hoursTraining??''),String(p.hoursPractice??''),p.assess||'',p.term||''
    ])
    const csv = [header.join(','), ...rows.map(r=> r.map(v=> String(v).replace(/,/g,'\u002C')).join(','))].join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '专业课程设置表.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadPlanTemplateCSV = () => {
    const header = ['版本','专业','年级','课程类别','课程性质','课程类型','课程编号','课程名称','学分','总学时','理论学时','实验学时','实训学时','实践学时','考核方式','开设学期']
    const csv = [header.join(',')].join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '专业课程设置导入模板.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }


  const beforeImportPlan = async (file: File) => {
    try {
      const text = await file.text()
      let imported: any[] = []
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text)
        if (Array.isArray(data)) imported = data
      } else {
        const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0)
        if (lines.length>1) {
          const header = lines[0].split(',').map(h=>h.trim())
          const idx = (name:string)=> header.findIndex(h=> h===name)
          for (let i=1;i<lines.length;i++){
            const cols = lines[i].split(',')
            imported.push({
              version: cols[idx('版本')]||'',
              major: cols[idx('专业')]||'',
              grade: cols[idx('年级')]||'',
              category: cols[idx('课程类别')]||'',
              nature: cols[idx('课程性质')]||'',
              ctype: cols[idx('课程类型')]||'',
              code: cols[idx('课程编号')]||'',
              name: cols[idx('课程名称')]||'',
              credit: Number(cols[idx('学分')]||0),
              hoursTotal: Number(cols[idx('总学时')]||0),
              hoursTheory: Number(cols[idx('理论学时')]||0),
              hoursExperiment: Number(cols[idx('实验学时')]||0),
              hoursTraining: Number(cols[idx('实训学时')]||0),
              hoursPractice: Number(cols[idx('实践学时')]||0),
              assess: cols[idx('考核方式')]||'',
              term: cols[idx('开设学期')]||'',
            })
          }
        }
      }
      if (imported.length===0) { message.warning('未解析到有效数据'); return false }
      const normalized: PlanCourse[] = imported.map((r:any, i:number)=> ({
        key: 'imp_'+Date.now()+'_'+i,
        version: r.version||'', major: r.major||'', grade: r.grade||'',
        category: r.category||'', nature: r.nature||'', ctype: r.ctype||'',
        code: r.code||'', name: r.name||'', credit: Number(r.credit||0),
        hoursTheory: Number(r.hoursTheory||0), hoursExperiment: Number(r.hoursExperiment||0), hoursTraining: Number(r.hoursTraining||0), hoursPractice: Number(r.hoursPractice||0),
        hoursTotal: Number(r.hoursTotal|| (Number(r.hoursTheory||0)+Number(r.hoursExperiment||0)+Number(r.hoursTraining||0)+Number(r.hoursPractice||0))),
        assess: r.assess||'', term: r.term||''
      }))
      setPlanCourses((prev)=> [...normalized, ...prev])
      message.success(`已导入 ${normalized.length} 条课程`)
    } catch(e) { message.error('导入失败，请检查文件格式') }
    return false
  }

  useEffect(() => {
    const saved = localStorage.getItem(PLAN_COURSES_KEY)
    if (saved) {
      try {
        const list: PlanCourse[] = JSON.parse(saved)
        if (Array.isArray(list) && list.length > 0) {
          const normalizeTerm = (t: any) => {
            const parts = String(t || '')
              .split(/[、，\/\s]+/)
              .filter(Boolean)
            const mapped = parts.map((p) => {
              if (/^[1-8]$/.test(p)) return p
              if (p.includes('春')) return '4'
              if (p.includes('秋')) return '3'
              const digits = p.match(/[1-8]/g)
              return digits && digits[0] ? digits[0] : ''
            }).filter(Boolean)
            return mapped.join('、')
          }
          const isMeaningful = (r: any) => {
            const textFields = [r.code, r.name, r.category, r.nature, r.ctype]
            const hasText = textFields.some((v) => String(v || '').trim().length > 0)
            const hasHours = [r.credit, r.hoursTotal, r.hoursTheory, r.hoursExperiment, r.hoursTraining, r.hoursPractice]
              .some((n) => Number(n || 0) > 0)
            return hasText || hasHours
          }
          const migrated = list
            .map((r) => ({ ...r, term: normalizeTerm(r.term) }))
            .filter(isMeaningful)
          setPlanCourses(migrated)
          return
        }
      } catch {}
    }
    const seed: PlanCourse[] = [
      { key: 'pc1', version: 'v2025', major: '计算机科学与技术', grade: '2025', category: '专业教育', nature: '专业课程-必修', ctype: '理论课（课内实验实训）', code: 'CUR08090101', name: '数据结构', credit: 4, hoursTotal: 48, hoursTheory: 48, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, assess: '考试', term: '3' },
      { key: 'pc2', version: 'v2025', major: '计算机科学与技术', grade: '2025', category: '专业教育', nature: '专业课程-必修', ctype: '理论课（课内实验实训）', code: 'CUR08090102', name: '操作系统', credit: 4, hoursTotal: 48, hoursTheory: 48, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, assess: '考试', term: '4' },
      { key: 'pc3', version: 'v2025', major: '计算机科学与技术', grade: '2025', category: '专业教育', nature: '专业课程-必修', ctype: '理论课（课内实验实训）', code: 'CUR08090103', name: '数据库系统', credit: 3, hoursTotal: 48, hoursTheory: 32, hoursExperiment: 16, hoursTraining: 0, hoursPractice: 0, assess: '考查', term: '5' },
      { key: 'pc4', version: 'v2025', major: '计算机科学与技术', grade: '2025', category: '专业教育', nature: '专业课程-必修', ctype: '理论课（课内实验实训）', code: 'CUR08090104', name: '计算机网络', credit: 3, hoursTotal: 48, hoursTheory: 48, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, assess: '考试', term: '5' },
      { key: 'pc5', version: 'v2025', major: '计算机科学与技术', grade: '2025', category: '专业教育', nature: '专业课程-必修', ctype: '理论课（课内实验实训）', code: 'CUR08090105', name: '计算机组成原理', credit: 3, hoursTotal: 48, hoursTheory: 48, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, assess: '考试', term: '4' },
      { key: 'pc6', version: 'v2025', major: '计算机科学与技术', grade: '2025', category: '实践教育', nature: '实践课程-综合实践', ctype: '校外实践（分散）', code: 'CUR08090106', name: '工程实践', credit: 2, hoursTotal: 32, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 32, assess: '考查', term: '7' }
    ]
    setPlanCourses(seed)
  }, [])

  // 新增：课程列表变更时持久化，避免刷新或切换后丢失
  useEffect(() => {
    localStorage.setItem(PLAN_COURSES_KEY, JSON.stringify(planCourses))
  }, [planCourses])

  // 新增：与文档“从方案生成课程清单”对齐——自动将培养方案课程同步到课程字典（去重按课程编号）
  useEffect(() => {
    try {
      const existingRaw = localStorage.getItem('courseCatalog') || '[]'
      const existing: any[] = JSON.parse(existingRaw)
      const byCode = new Map<string, any>(existing.map((c) => [c.code, c]))
      planCourses.forEach((p) => {
        if (p.code && !byCode.has(p.code)) {
          byCode.set(p.code, {
            key: `sync_${p.code}`,
            category: p.category,
            nature: p.nature,
            ctype: p.ctype,
            code: p.code,
            name: p.name,
            credit: p.credit,
            hoursTheory: p.hoursTheory,
            hoursExperiment: p.hoursExperiment,
            hoursTraining: p.hoursTraining,
            hoursPractice: p.hoursPractice,
            hoursTotal: p.hoursTotal,
            assess: p.assess,
          })
        }
      })
      const merged = Array.from(byCode.values())
      localStorage.setItem('courseCatalog', JSON.stringify(merged))
    } catch {}
  }, [planCourses])

  const addCourse = (values: any) => {
    const meta = metaForm.getFieldsValue()
    const total = Number(values.hoursTheory || 0) + Number(values.hoursExperiment || 0) + Number(values.hoursTraining || 0) + Number(values.hoursPractice || 0)
    const row: PlanCourse = {
      key: Date.now().toString(),
      version: values.version || meta.version || '',
      major: values.major || meta.major || '',
      grade: values.grade || meta.grade || '',
      category: values.category || '',
      nature: values.nature || '',
      ctype: values.ctype || '',
      code: values.code || '',
      name: values.name || '',
      credit: Number(values.credit || 0),
      hoursTotal: Number(total || 0),
      hoursTheory: Number(values.hoursTheory || 0),
      hoursExperiment: Number(values.hoursExperiment || 0),
      hoursTraining: Number(values.hoursTraining || 0),
      hoursPractice: Number(values.hoursPractice || 0),
      assess: values.assess || '',
      term: Array.isArray(values.term) ? values.term.join('、') : (values.term || ''),
    }
    setPlanCourses((prev) => [row, ...prev])
    courseForm.resetFields()
    setPlanAddOpen(false)
  }

  const planFiltered = useMemo(() => {
    return planCourses.filter((r) => (
      (!planFilter.version || r.version === planFilter.version) &&
      (!planFilter.major || String(r.major).includes(planFilter.major)) &&
      (!planFilter.grade || String(r.grade).includes(planFilter.grade)) &&
      (!planFilter.category || r.category === planFilter.category) &&
      (!planFilter.nature || r.nature === planFilter.nature) &&
      (!planFilter.ctype || r.ctype === planFilter.ctype) &&
      (!planFilter.code || String(r.code).includes(planFilter.code)) &&
      (!planFilter.name || String(r.name).includes(planFilter.name)) &&
      (!planFilter.assess || r.assess === planFilter.assess) &&
      (!planFilter.term || String(r.term).includes(planFilter.term)) &&
      (!planFilter.creditMin || Number(r.credit) >= Number(planFilter.creditMin)) &&
      (!planFilter.creditMax || Number(r.credit) <= Number(planFilter.creditMax)) &&
      (!planFilter.hoursTotalMin || Number(r.hoursTotal) >= Number(planFilter.hoursTotalMin)) &&
      (!planFilter.hoursTotalMax || Number(r.hoursTotal) <= Number(planFilter.hoursTotalMax)) &&
      (!planFilter.hoursTheoryMin || Number(r.hoursTheory) >= Number(planFilter.hoursTheoryMin)) &&
      (!planFilter.hoursTheoryMax || Number(r.hoursTheory) <= Number(planFilter.hoursTheoryMax)) &&
      (!planFilter.hoursExperimentMin || Number(r.hoursExperiment) >= Number(planFilter.hoursExperimentMin)) &&
      (!planFilter.hoursExperimentMax || Number(r.hoursExperiment) <= Number(planFilter.hoursExperimentMax)) &&
      (!planFilter.hoursTrainingMin || Number(r.hoursTraining) >= Number(planFilter.hoursTrainingMin)) &&
      (!planFilter.hoursTrainingMax || Number(r.hoursTraining) <= Number(planFilter.hoursTrainingMax)) &&
      (!planFilter.hoursPracticeMin || Number(r.hoursPractice) >= Number(planFilter.hoursPracticeMin)) &&
      (!planFilter.hoursPracticeMax || Number(r.hoursPractice) <= Number(planFilter.hoursPracticeMax))
    ))
  }, [planCourses, planFilter])

  const planSorted = useMemo(() => {
    const arr = [...planFiltered]
    arr.sort((a: any, b: any) =>
      String(a.version).localeCompare(String(b.version)) ||
      String(a.major).localeCompare(String(b.major)) ||
      String(a.grade).localeCompare(String(b.grade)) ||
      String(a.code || a.name).localeCompare(String(b.code || b.name))
    )
    return arr
  }, [planFiltered])

  const planRowSpan = useMemo(() => {
    const arr = planSorted
    const rs: number[] = new Array(arr.length).fill(1)
    let i = 0
    while (i < arr.length) {
      const sig = `${String(arr[i].version)}|${String(arr[i].major)}|${String(arr[i].grade)}`
      let j = i + 1
      while (
        j < arr.length &&
        `${String(arr[j].version)}|${String(arr[j].major)}|${String(arr[j].grade)}` === sig
      ) j++
      rs[i] = j - i
      for (let k = i + 1; k < j; k++) rs[k] = 0
      i = j
    }
    return rs
  }, [planSorted])
  useEffect(() => {
    if (planAddOpen) {
      try {
        courseForm.setFieldsValue({ credit: 0, hoursTotal: 0, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0 })
      } catch {}
    }
  }, [planAddOpen])

  const [planPage, setPlanPage] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })

  const onEditSubmit = (v: any) => {
    setPlanCourses((prev) => prev.map((r) => {
      if (r.key !== editingPlanKey) return r
      const total = Number(v.hoursTheory || r.hoursTheory || 0) + Number(v.hoursExperiment || r.hoursExperiment || 0) + Number(v.hoursTraining || r.hoursTraining || 0) + Number(v.hoursPractice || r.hoursPractice || 0)
      return {
        ...r,
        grade: v.grade ?? r.grade,
        major: v.major ?? r.major,
        version: v.version ?? r.version,
        category: v.category ?? r.category,
        nature: v.nature ?? r.nature,
        ctype: v.ctype ?? r.ctype,
        code: v.code ?? r.code,
        name: v.name ?? r.name,
        credit: Number(v.credit ?? r.credit ?? 0),
        hoursTheory: Number(v.hoursTheory ?? r.hoursTheory ?? 0),
        hoursExperiment: Number(v.hoursExperiment ?? r.hoursExperiment ?? 0),
        hoursTraining: Number(v.hoursTraining ?? r.hoursTraining ?? 0),
        hoursPractice: Number(v.hoursPractice ?? r.hoursPractice ?? 0),
        hoursTotal: Number(v.hoursTotal ?? total),
        assess: v.assess ?? r.assess,
        term: Array.isArray(v.term) ? v.term.join('、') : (v.term ?? r.term)
      }
    }))
    setPlanEditOpen(false)
    setEditingPlanKey(null)
  }


  return (
    <div>
      
      <Card className="page-content" id="pro-course-settings">
        <Space style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={() => setPlanAddOpen(true)}>新增设置</Button>
          <Button onClick={() => setImportOpen(true)}>导入</Button>
          <Button onClick={exportPlanCSV}>导出</Button>
        </Space>
      <Form form={planFilterForm} layout="inline" onValuesChange={(_, all)=> setPlanFilter(all)} style={{ marginBottom: 12 }}>
          <Form.Item name="version" label="版本"><Select allowClear style={{ width: 120 }} options={versionOptions} /></Form.Item>
          <Form.Item name="major" label="专业"><Input style={{ width: 160 }} placeholder="包含" /></Form.Item>
          <Form.Item name="grade" label="年级"><Input style={{ width: 120 }} placeholder="包含" /></Form.Item>
          <Form.Item name="category" label="类别"><Select allowClear style={{ width: 140 }} options={[{value:'通识教育',label:'通识教育'},{value:'学科基础教育',label:'学科基础教育'},{value:'专业教育',label:'专业教育'},{value:'实践教育',label:'实践教育'}]} /></Form.Item>
          <Form.Item name="nature" label="性质"><Select allowClear style={{ width: 200 }} options={[{value:'通识课程-必修',label:'通识课程-必修'},{value:'通识课程-选修',label:'通识课程-选修'},{value:'公共基础课-必修',label:'公共基础课-必修'},{value:'公共基础课-选修',label:'公共基础课-选修'},{value:'专业基础课-必修',label:'专业基础课-必修'},{value:'专业课程-必修',label:'专业课程-必修'},{value:'专业课程-选修',label:'专业课程-选修'},{value:'实践课程-基础实践',label:'实践课程-基础实践'},{value:'实践课程-综合实践',label:'实践课程-综合实践'},{value:'实践课程-创新实践',label:'实践课程-创新实践'}]} /></Form.Item>
          <Form.Item name="ctype" label="类型"><Select allowClear style={{ width: 220 }} options={[{value:'理论课（课内实验实训）',label:'理论课（课内实验实训）'},{value:'校内实践（集中）',label:'校内实践（集中）'},{value:'校外实践（分散）',label:'校外实践（分散）'}]} /></Form.Item>
          <Form.Item name="code" label="课程编号"><Input style={{ width: 160 }} placeholder="包含" /></Form.Item>
          <Form.Item name="name" label="课程名称"><Input style={{ width: 160 }} placeholder="包含" /></Form.Item>
          <Form.Item name="assess" label="考核方式"><Select allowClear style={{ width: 120 }} options={[{value:'考试',label:'考试'},{value:'考查',label:'考查'}]} /></Form.Item>
          <Form.Item name="term" label="开设学期"><Input style={{ width: 120 }} placeholder="包含" /></Form.Item>
          <Form.Item label="学分">
            <Space>
              <Form.Item name="creditMin" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="creditMax" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="总学时">
            <Space>
              <Form.Item name="hoursTotalMin" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="hoursTotalMax" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="理论">
            <Space>
              <Form.Item name="hoursTheoryMin" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="hoursTheoryMax" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="实验">
            <Space>
              <Form.Item name="hoursExperimentMin" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="hoursExperimentMax" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="实训">
            <Space>
              <Form.Item name="hoursTrainingMin" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="hoursTrainingMax" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="实践">
            <Space>
              <Form.Item name="hoursPracticeMin" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
              <span>-</span>
              <Form.Item name="hoursPracticeMax" noStyle><InputNumber style={{ width: 90 }} /></Form.Item>
            </Space>
          </Form.Item>
          <Form.Item><Button onClick={()=> { planFilterForm.resetFields(); setPlanFilter({}) }}>重置</Button></Form.Item>
          <Form.Item><Button type="primary" onClick={()=> setPlanFilter(planFilterForm.getFieldsValue())}>查询</Button></Form.Item>
      </Form>

      <Modal open={importOpen} title="导入" footer={null} onCancel={()=> setImportOpen(false)} width={520}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            请参考模板填写内容，若字段不符合规则，将会导入失败
            <a style={{ marginLeft: 8 }} onClick={downloadPlanTemplateCSV}>下载导入模板</a>
          </div>
          <Upload.Dragger accept=".csv,.json" showUploadList={false} beforeUpload={beforeImportPlan}>
            <p>将文件拖到此处，或者点击上传</p>
          </Upload.Dragger>
          <Button type="primary" onClick={()=> setImportOpen(false)}>确定</Button>
        </Space>
      </Modal>
        <Modal open={planAddOpen} title="新增课程" footer={null} onCancel={() => setPlanAddOpen(false)}>
          <Form
            form={courseForm}
            layout="vertical"
            onFinish={addCourse}
            onValuesChange={() => {
              const v = courseForm.getFieldsValue()
              const total = Number(v.hoursTheory || 0) + Number(v.hoursExperiment || 0) + Number(v.hoursTraining || 0) + Number(v.hoursPractice || 0)
              courseForm.setFieldsValue({ hoursTotal: total })
            }}
          >
            {(() => {
              const watchCat = Form.useWatch('category', courseForm)
              const natureOpts = useMemo(() => cpNatureMap[String(watchCat||'')] || [], [watchCat])
              useEffect(() => {
                const val = courseForm.getFieldValue('nature')
                if (val && natureOpts.length && !natureOpts.some(o => String(o.value) === String(val))) {
                  courseForm.setFieldsValue({ nature: undefined })
                }
              }, [watchCat, natureOpts])
              return (
                <Row gutter={16}>
                  <Col span={12}><Form.Item name="grade" label="年级"><Select showSearch allowClear placeholder="如：2025" options={gradeOptions} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="major" label="专业"><Select showSearch allowClear placeholder="选择专业" options={majorOptionsCP} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="version" label="版本"><Select showSearch allowClear placeholder="如：v2025" options={versionOptions} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="category" label="课程类别" required rules={[{ required: true, message: '请选择课程类别' }]}><Select options={[{value:'通识教育',label:'通识教育'},{value:'学科基础教育',label:'学科基础教育'},{value:'专业教育',label:'专业教育'},{value:'实践教育',label:'实践教育'}]} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="nature" label="课程性质" required rules={[{ required: true, message: '请选择课程性质' }]}><Select options={natureOpts} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="ctype" label="课程类型" required rules={[{ required: true, message: '请选择课程类型' }]}><Select options={[{value:'理论课（课内实验实训）',label:'理论课（课内实验实训）'},{value:'独立设置的实验课',label:'独立设置的实验课'},{value:'校内实践（集中）',label:'校内实践（集中）'},{value:'校内实践（分散）',label:'校内实践（分散）'},{value:'校外实践（集中）',label:'校外实践（集中）'},{value:'校外实践（分散）',label:'校外实践（分散）'}]} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input placeholder="如：CUR08090101" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input placeholder="如：数据结构" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="credit" label="学分" required rules={[{ required: true, message: '请输入学分' }]}><Input type="number" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="hoursExperiment" label="实验学时" tooltip="实验教学学时" required rules={[{ required: true, message: '请输入实验学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="hoursTraining" label="实训学时" tooltip="实训教学学时" required rules={[{ required: true, message: '请输入实训学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="hoursPractice" label="实践学时" tooltip="实践教学学时" required rules={[{ required: true, message: '请输入实践学时' }]}><Input type="number" addonAfter="周" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="hoursTheory" label="理论学时" tooltip="理论教学学时" required rules={[{ required: true, message: '请输入理论学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="assess" label="考核方式" required rules={[{ required: true, message: '请选择考核方式' }]}><Select options={[{value:'考试',label:'考试'},{value:'考查',label:'考查'}]} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="term" label="开设学期" required rules={[{ required: true, message: '请选择开设学期' }]}><Select mode="multiple" options={[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'},{value:'5',label:'5'},{value:'6',label:'6'},{value:'7',label:'7'},{value:'8',label:'8'}]} /></Form.Item></Col>
                </Row>
              )
            })()}
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setPlanAddOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
        <Modal open={planEditOpen} title="编辑课程" footer={null} onCancel={() => setPlanEditOpen(false)}>
          <Form
            form={editPlanForm}
            layout="vertical"
            onFinish={onEditSubmit}
            onValuesChange={() => {
              const v = editPlanForm.getFieldsValue()
              const total = Number(v.hoursTheory || 0) + Number(v.hoursExperiment || 0) + Number(v.hoursTraining || 0) + Number(v.hoursPractice || 0)
              editPlanForm.setFieldsValue({ hoursTotal: total })
            }}
          >
            {(() => {
              const watchCat = Form.useWatch('category', editPlanForm)
              const natureOpts = useMemo(() => cpNatureMap[String(watchCat||'')] || [], [watchCat])
              useEffect(() => {
                const val = editPlanForm.getFieldValue('nature')
                if (val && natureOpts.length && !natureOpts.some(o => String(o.value) === String(val))) {
                  editPlanForm.setFieldsValue({ nature: undefined })
                }
              }, [watchCat, natureOpts])
              return (
            <Row gutter={16}>
              <Col span={12}><Form.Item name="grade" label="年级"><Select showSearch allowClear placeholder="如：2025" options={gradeOptions} /></Form.Item></Col>
              <Col span={12}><Form.Item name="major" label="专业"><Select showSearch allowClear placeholder="选择专业" options={majorOptionsCP} /></Form.Item></Col>
              <Col span={12}><Form.Item name="version" label="版本"><Select showSearch allowClear placeholder="如：v2025" options={versionOptions} /></Form.Item></Col>
              <Col span={12}><Form.Item name="category" label="课程类别" required rules={[{ required: true, message: '请选择课程类别' }]}><Select options={[{value:'通识教育',label:'通识教育'},{value:'学科基础教育',label:'学科基础教育'},{value:'专业教育',label:'专业教育'},{value:'实践教育',label:'实践教育'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="nature" label="课程性质" required rules={[{ required: true, message: '请选择课程性质' }]}><Select options={natureOpts} /></Form.Item></Col>
              <Col span={12}><Form.Item name="ctype" label="课程类型" required rules={[{ required: true, message: '请选择课程类型' }]}><Select options={[{value:'理论课（课内实验实训）',label:'理论课（含课内实验实训）'},{value:'独立设置的实验课',label:'独立设置的实验课'},{value:'校内实践（集中）',label:'校内实践（集中）'},{value:'校内实践（分散）',label:'校内实践（分散）'},{value:'校外实践（集中）',label:'校外实践（集中）'},{value:'校外实践（分散）',label:'校外实践（分散）'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="credit" label="学分"><Input type="number" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursExperiment" label="实验学时" tooltip="实验教学学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTraining" label="实训学时" tooltip="实训教学学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursPractice" label="实践学时" tooltip="实践教学学时"><Input type="number" addonAfter="周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTheory" label="理论学时" tooltip="理论教学学时"><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="assess" label="考核方式" required rules={[{ required: true, message: '请选择考核方式' }]}><Select options={[{value:'考试',label:'考试'},{value:'考查',label:'考查'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="term" label="开设学期" required rules={[{ required: true, message: '请选择开设学期' }]}><Select mode="multiple" options={[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'},{value:'5',label:'5'},{value:'6',label:'6'},{value:'7',label:'7'},{value:'8',label:'8'}]} /></Form.Item></Col>
            </Row>
              )
            })()}
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setPlanEditOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
        <Table
          size="small"
          pagination={{
            current: planPage.current,
            pageSize: planPage.pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => setPlanPage({ current: page, pageSize })
          }}
          rowKey="key"
          dataSource={planSorted}
          locale={{ emptyText: '暂无课程，请先填写上方表单并新增' }}
          columns={[
            { title: '版本', dataIndex: 'version', render: (v: any, _: any, idx: number) => { const abs = (planPage.current - 1) * planPage.pageSize + idx; return { children: v, props: { rowSpan: planRowSpan[abs] } } } },
            { title: '专业', dataIndex: 'major', render: (v: any, _: any, idx: number) => { const abs = (planPage.current - 1) * planPage.pageSize + idx; return { children: v, props: { rowSpan: planRowSpan[abs] } } } },
            { title: '年级', dataIndex: 'grade', render: (v: any, _: any, idx: number) => { const abs = (planPage.current - 1) * planPage.pageSize + idx; return { children: v, props: { rowSpan: planRowSpan[abs] } } } },
            { title: '类别', dataIndex: 'category' },
            { title: '性质', dataIndex: 'nature' },
            { title: '类型', dataIndex: 'ctype' },
            { title: '课程编号', dataIndex: 'code' },
            { title: '课程名称', dataIndex: 'name' },
            { title: '学分', dataIndex: 'credit' },
            { title: '总学时', dataIndex: 'hoursTotal' },
            {
              title: '学时',
              children: [
                { title: '理论', dataIndex: 'hoursTheory' },
                { title: '实验', dataIndex: 'hoursExperiment' },
                { title: '实训', dataIndex: 'hoursTraining' },
                { title: '实践', dataIndex: 'hoursPractice' },
              ],
            },
            { title: '考核方式', dataIndex: 'assess' },
            { title: '开设学期', dataIndex: 'term' },
            { title: '操作', render: (_:any, record: PlanCourse) => (
              <Space>
                <Button size="small" onClick={() => { setEditingPlanKey(record.key); const termArr = String(record.term||'').split(/[、，/\s]+/).filter(Boolean); editPlanForm.setFieldsValue({ ...record, term: termArr }); setPlanEditOpen(true) }}>编辑</Button>
                <Popconfirm title="确认删除该课程？" onConfirm={() => setPlanCourses((prev)=> prev.filter((r)=> r.key!==record.key))}><Button size="small" danger>删除</Button></Popconfirm>
              </Space>
            )}
          ]}
        />
      </Card>
    </div>
  )
}

export const CurriculumStats: React.FC = () => {
  const [planCourses, setPlanCourses] = useState<any[]>([])
  const [filtersForm] = Form.useForm()
  const [filters, setFilters] = useState<any>({})
  useEffect(() => {
    try {
      const raw = localStorage.getItem('planCourses') || '[]'
      const list = JSON.parse(raw)
      setPlanCourses(Array.isArray(list) ? list : [])
    } catch { setPlanCourses([]) }
  }, [])
  const gradeOptions = useMemo(() => {
    const s = new Set<string>()
    planCourses.forEach((p) => { if (p.grade) s.add(String(p.grade)) })
    const y = new Date().getFullYear()
    ;[y, y - 1, y - 2].forEach((v) => s.add(String(v)))
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [planCourses])
  const majorOptions = useMemo(() => {
    try {
      const raw = localStorage.getItem('basic_major_track') || '[]'
      const list = JSON.parse(raw)
      const s = new Set<string>()
      if (Array.isArray(list)) {
        list.forEach((m: any) => { const nm = m.name || m.major; if (nm) s.add(String(nm)) })
      }
      return Array.from(s).map((v) => ({ value: v, label: v }))
    } catch { return [] }
  }, [])
  const filteredCourses = useMemo(() => {
    return planCourses.filter((r) => (
      (!filters.grade || String(r.grade).includes(String(filters.grade))) &&
      (!filters.major || String(r.major).includes(String(filters.major)))
    ))
  }, [planCourses, filters])
  const rows = useMemo(() => {
    const map = new Map<string, { grade: string; major: string; set: Set<string> }>()
    filteredCourses.forEach((p: any) => {
      const grade = String(p.grade || '').trim()
      const major = String(p.major || '').trim()
      if (!grade || !major) return
      const key = `${grade}|${major}`
      const sig = String(p.code || p.name || '').trim()
      if (!map.has(key)) map.set(key, { grade, major, set: new Set<string>() })
      if (sig) map.get(key)!.set.add(sig)
    })
    const arr = Array.from(map.values()).map((it) => ({
      key: `${it.grade}-${it.major}`,
      grade: it.grade,
      major: it.major,
      count: it.set.size,
    }))
    arr.sort((a: any, b: any) => String(a.grade).localeCompare(String(b.grade)) || String(a.major).localeCompare(String(b.major)))
    return arr
  }, [filteredCourses])
  return (
    <div>
      <Card className="page-content" title="统计条件">
        <Form form={filtersForm} layout="inline" onValuesChange={(_, all)=> setFilters(all)}>
          <Form.Item name="grade" label="年级"><Select allowClear style={{ width: 120 }} options={gradeOptions} /></Form.Item>
          <Form.Item name="major" label="专业"><Select allowClear showSearch style={{ width: 180 }} options={majorOptions} /></Form.Item>
          <Form.Item><Button onClick={()=> { filtersForm.resetFields(); setFilters({}) }}>重置</Button></Form.Item>
        </Form>
      </Card>
      <Card className="page-content" title="统计表">
        <Table size="small" pagination={false} rowKey="key" dataSource={rows} columns={[
          { title: '年级', dataIndex: 'grade' },
          { title: '专业', dataIndex: 'major' },
          { title: '课程门数', dataIndex: 'count' },
        ]} />
      </Card>
    </div>
  )
}

export const OfferingPlan: React.FC = () => {
  const loc = useLocation()
  // 已移除教师限定与审核链的顶部表单
  const [electiveForm] = Form.useForm()
  const [replacementForm] = Form.useForm()
  const [offerings, setOfferings] = useState<any[]>([])
  const OFFERINGS_KEY = 'offerings'
  const PLAN_COURSES_KEY = 'planCourses'
  const SENTINEL_TEACHER = '张三'
  useEffect(() => {
    const saved = localStorage.getItem(OFFERINGS_KEY)
    if (saved) {
      try {
        setOfferings(JSON.parse(saved))
      } catch {}
    }
  }, [])
  useEffect(() => {
    try {
      const role = localStorage.getItem('currentUserRole')
      if (!role) localStorage.setItem('currentUserRole', '系主任')
      const name = localStorage.getItem('currentUserName')
      if (!name) localStorage.setItem('currentUserName', '演示账号')
    } catch {}
  }, [])
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAN_COURSES_KEY) || '[]'
      const list = JSON.parse(raw)
      if (Array.isArray(list)) {
        const existing = new Set(offerings.map((o)=> `${o.course}|${o.term}|${o.grade}|${o.major}`))
        const gen = list.map((p:any)=> ({
          key: `gen_${p.code||p.name}_${p.term}_${p.grade}_${p.major}`,
          term: p.term || '',
          course: p.name || '',
          ctype: p.ctype || '',
          grade: p.grade || '',
          major: p.major || '',
          classSizeThreshold: 40,
          teacherScope: SENTINEL_TEACHER,
          auditChain: '系主任→教秘→教务处',
          status: '待审核'
        })).filter((r:any)=> !existing.has(`${r.course}|${r.term}|${r.grade}|${r.major}`))
        if (gen.length>0) setOfferings((prev)=> [...gen, ...prev])
      }
    } catch {}
  }, [])
  useEffect(() => {
    localStorage.setItem(OFFERINGS_KEY, JSON.stringify(offerings))
  }, [offerings])
  useEffect(() => {
    const onStorage = (e: any) => {
      if (!e) return
      if (e.key === OFFERINGS_KEY) {
        try {
          const raw = localStorage.getItem(OFFERINGS_KEY) || '[]'
          const arr = JSON.parse(raw)
          setOfferings(Array.isArray(arr) ? arr : [])
          message.info('已同步开课计划关联信息')
        } catch {}
      } else if (e.key === PLAN_COURSES_KEY) {
        try { syncMajorFromPlan() } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  useEffect(() => {
    try {
      const majorRaw = localStorage.getItem('basic_major_track') || ''
      let majors: any[] = []
      if (majorRaw) { try { const parsed = JSON.parse(majorRaw); majors = Array.isArray(parsed) ? parsed : [] } catch { majors = [] } }
      if (majors.length === 0) {
        majors = [
          { name: '计算机科学与技术', code: 'CS01', department: '计算机学院', durationYears: 4 },
          { name: '软件工程', code: 'SE01', department: '计算机学院', durationYears: 4 }
        ]
        localStorage.setItem('basic_major_track', JSON.stringify(majors))
      }
      const planRaw = localStorage.getItem(PLAN_COURSES_KEY) || ''
      let plans: any[] = []
      if (planRaw) { try { const parsed = JSON.parse(planRaw); plans = Array.isArray(parsed) ? parsed : [] } catch { plans = [] } }
      if (plans.length === 0) {
        const g = String(new Date().getFullYear() - 3)
        const now = Date.now()
        const pickMajors = (() => {
          const names = (majors || []).map((m:any)=> String(m.name || m.major || '').trim()).filter(Boolean)
          const uniq:string[] = []
          names.forEach((n)=> { if (!uniq.includes(n)) uniq.push(n) })
          return uniq.slice(0, 6)
        })()
        const baseCourses = [
          { code: 'CUR08090102', name: '操作系统', credit: 3, hoursTotal: 64, hoursTheory: 48, hoursExperiment: 8, hoursTraining: 0, hoursPractice: 8, assess: '考试', term: '1、2' },
          { code: 'CUR08090103', name: '数据库系统', credit: 3, hoursTotal: 48, hoursTheory: 32, hoursExperiment: 16, hoursTraining: 0, hoursPractice: 0, assess: '考查', term: '1' },
          { code: 'CUR08090104', name: '软件工程', credit: 3, hoursTotal: 48, hoursTheory: 32, hoursExperiment: 16, hoursTraining: 0, hoursPractice: 0, assess: '考查', term: '2' }
        ]
        plans = pickMajors.flatMap((mj, idx)=> baseCourses.map((c, ci)=> ({
          key: `seed_${now}_${idx}_${ci}`,
          version: 'v2025',
          major: mj,
          grade: g,
          category: '专业课',
          nature: '必修',
          ctype: '理论',
          code: c.code,
          name: c.name,
          credit: c.credit,
          hoursTotal: c.hoursTotal,
          hoursTheory: c.hoursTheory,
          hoursExperiment: c.hoursExperiment,
          hoursTraining: c.hoursTraining,
          hoursPractice: c.hoursPractice,
          assess: c.assess,
          term: c.term
        })))
        localStorage.setItem(PLAN_COURSES_KEY, JSON.stringify(plans))
      }
    } catch {}
  }, [])
  useEffect(() => {
    generateFromPlan()
  }, [])
  const generateFromPlan = () => {
    try {
      const raw = localStorage.getItem(PLAN_COURSES_KEY) || '[]'
      const list = JSON.parse(raw)
      const majorsRaw = localStorage.getItem('basic_major_track') || '[]'
      const majors = Array.isArray(JSON.parse(majorsRaw)) ? JSON.parse(majorsRaw) : []
      const getMajor = (nm: string) => {
        const m = Array.isArray(majors) ? majors.find((x: any) => (x.name || x.major) === nm) : null
        return m || {}
      }
      const termArr = (t: any) => String(t||'').split(/[、，/\s]+/).filter((v) => /^\d+$/.test(String(v)))
      const academic = (grade: string, term: number) => {
        const g = Number(grade || new Date().getFullYear())
        const y = g + Math.floor((term - 1) / 2)
        const s = term % 2 === 1 ? '秋' : '春'
        return `${y}-${s}`
      }
      if (Array.isArray(list)) {
        const existing = new Set(offerings.map((o)=> `${o.course}|${o.term}|${o.grade}|${o.major}`))
        const gen: any[] = []
        list.forEach((p: any) => {
          const terms = termArr(p.term)
          terms.forEach((t) => {
            const mj = getMajor(p.major)
            const row = {
              key: `gen_${p.code||p.name}_${t}_${p.grade}_${p.major}`,
              academic: academic(p.grade, Number(t)),
              grade: p.grade || '',
              major: p.major || '',
              duration: String(mj.durationYears || ''),
              course: p.name || '',
              code: p.code || '',
              category: p.category || '',
              assess: p.assess || '',
              position: '',
              credit: Number(p.credit || 0),
              hoursTotal: Number(p.hoursTotal || 0),
              hoursTheory: Number(p.hoursTheory || 0),
              hoursExperiment: Number(p.hoursExperiment || 0),
              hoursTraining: Number(p.hoursTraining || 0),
              hoursPractice: Number(p.hoursPractice || 0),
              department: mj.department || '',
              remark: '',
              linkedClass: '',
              ctype: p.ctype || '',
              term: String(t),
              classSizeThreshold: 40,
              teacherScope: SENTINEL_TEACHER,
              auditChain: '系主任→教秘→教务处',
              status: '待审核'
            }
            const sig = `${row.course}|${row.term}|${row.grade}|${row.major}`
            if (!existing.has(sig)) gen.push(row)
          })
        })
        if (gen.length>0) setOfferings((prev)=> [...gen, ...prev])
      }
    } catch {}
  }
  const syncMajorFromPlan = () => {
    try {
      const raw = localStorage.getItem(PLAN_COURSES_KEY) || '[]'
      const list = JSON.parse(raw)
      if (!Array.isArray(list) || list.length===0) return
      const byCode = new Map<string, string>()
      const byName = new Map<string, string>()
      list.forEach((p:any)=> { if (p.code) byCode.set(String(p.code), String(p.major||'')); if (p.name) byName.set(String(p.name), String(p.major||'')) })
      setOfferings((prev)=> prev.map((o)=> {
        const m = byCode.get(String(o.code||'')) || byName.get(String(o.course||''))
        if (m && m.length>0 && String(o.major||'')!==m) return { ...o, major: m }
        return o
      }))
    } catch {}
  }
  useEffect(() => { syncMajorFromPlan() }, [])
  const refreshAuditCache = () => {
    try {
      const raw = localStorage.getItem(OFFERINGS_KEY) || '[]'
      const arr = JSON.parse(raw)
      setOfferings(Array.isArray(arr) ? arr : [])
      syncMajorFromPlan()
      message.success('开课审核缓存已刷新')
    } catch { message.error('刷新失败') }
  }
  const [offeringEditOpen, setOfferingEditOpen] = useState(false)
  const [editingOfferingKey, setEditingOfferingKey] = useState<string | null>(null)
  const [editOfferingForm] = Form.useForm()
  const [editSelectedCourseKeys, setEditSelectedCourseKeys] = useState<string[]>([])
  const [editSelectedMajorKeys, setEditSelectedMajorKeys] = useState<string[]>([])
  const openOfferingEdit = (record: any) => {
    setEditingOfferingKey(record.key)
    editOfferingForm.setFieldsValue(record)
    setOfferingEditOpen(true)
    try {
      const foundCourse = (courseCatalogList || []).find((c:any)=> String(c.code||'')===String(record.code||'') || String(c.name||'')===String(record.course||''))
      if (foundCourse) {
        const k = String(foundCourse.code||'') || String(foundCourse.name||'')
        setEditSelectedCourseKeys([k])
        const th = Number(foundCourse.hoursTheory||0)
        const lab = Number(foundCourse.hoursLab||0)
        const trn = Number(foundCourse.hoursTraining||0)
        const prac = Number(foundCourse.hoursPractice||0)
        editOfferingForm.setFieldsValue({
          courseCombined: `${foundCourse.name||''}${foundCourse.code?`(${foundCourse.code})`:''}`,
          course: foundCourse.name||'',
          code: foundCourse.code||'',
          category: foundCourse.category||'',
          assess: foundCourse.assessment||'',
          credit: Number(foundCourse.credit||0),
          hoursTotal: th+lab+trn+prac,
          hoursTheory: th,
          hoursExperiment: lab,
          hoursTraining: trn,
          hoursPractice: prac
        })
      }
    } catch {}
    try {
      const mk = `${record.grade||''}_${record.major||''}`
      setEditSelectedMajorKeys([mk])
      const info = majorInfoMap.get(String(record.major||'')) || { code: '', duration: '' }
      const dur = info.duration || record.duration || ''
      const term = record.term || '1'
      const ac = computeAcademic(String(record.grade||''), String(term||'')||1)
      editOfferingForm.setFieldsValue({ duration: String(dur||''), academic: ac })
    } catch {}
  }
  const [offeringViewOpen, setOfferingViewOpen] = useState(false)
  const [offeringViewRecord, setOfferingViewRecord] = useState<any | null>(null)
  const [viewAdjustSelected, setViewAdjustSelected] = useState<string | null>(null)
  const openOfferingView = (record: any) => {
    setOfferingViewRecord(record)
    setOfferingViewOpen(true)
    try {
      const related = (adjustLogs || []).filter((l:any)=> String(l.offeringKey||'')===String(record.key||''))
      setViewAdjustSelected(related[0]?.key || null)
    } catch {}
  }
  const [offeringViewLayout, setOfferingViewLayout] = useState({ width: '72vw', cols: 2 })
  const [classCatalog, setClassCatalog] = useState<string[]>([])
  const CLASS_CATALOG_KEY = 'basic_class_catalog'
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLASS_CATALOG_KEY) || ''
      let list: string[] = []
      if (raw) { try { const parsed = JSON.parse(raw); list = Array.isArray(parsed) ? parsed : [] } catch { list = [] } }
      if (list.length === 0) {
        list = [
          '机械设计制造及其自动化2001班',
          '制药工程2001班',
          '动漫制作技术2001班',
          '会计学2004班',
          '小学教育2002班',
          '小学教育2008班',
          '物联网工程2001班',
          '小学教育2003班',
          '测试班级',
          '翟老师测试班级一',
          '服装与服饰设计创新2101班',
          '装饰艺术设计2101班(专)',
          '装饰艺术设计2102班(专)',
          '教育2021本科班',
          '信工2021本科班',
          '服装2021本科班',
          '经管2021本科班',
          '艺术2021本科班',
          '艺术2021专科班',
          '信工2021专科班'
        ]
        localStorage.setItem(CLASS_CATALOG_KEY, JSON.stringify(list))
      }
      setClassCatalog(list)
    } catch {}
  }, [])
  useEffect(() => {
    const handler = () => {
      try {
        const w = window.innerWidth || document.documentElement.clientWidth || 1280
        if (w >= 1440) setOfferingViewLayout({ width: '84vw', cols: 3 })
        else setOfferingViewLayout({ width: '72vw', cols: 2 })
      } catch {}
    }
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const [offeringFormLayout, setOfferingFormLayout] = useState({ width: '72vw' })
  useEffect(() => {
    const handler = () => {
      try {
        const w = window.innerWidth || document.documentElement.clientWidth || 1280
        if (w >= 1440) setOfferingFormLayout({ width: '84vw' })
        else setOfferingFormLayout({ width: '72vw' })
      } catch {}
    }
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const [linkClassOpen, setLinkClassOpen] = useState(false)
  const [linkTeacherOpen, setLinkTeacherOpen] = useState(false)
  const [linkClassForm] = Form.useForm()
  const [linkTeacherForm] = Form.useForm()
  const CLASS_LINK_DB_KEY = 'db_offering_class_links'
  const OP_LOG_DB_KEY = 'db_operation_logs'
  const [classLinkDB, setClassLinkDB] = useState<Record<string, { classes: string[]; createdAt: number }>>({})
  const TEACHER_LINK_DB_KEY = 'db_offering_teacher_links'
  const [teacherLinkDB, setTeacherLinkDB] = useState<Record<string, { teachers: string[]; createdAt: number }>>({})
  const loadClassLinkDB = () => {
    try { const raw = localStorage.getItem(CLASS_LINK_DB_KEY) || '{}'; const parsed = JSON.parse(raw); if (parsed && typeof parsed === 'object') setClassLinkDB(parsed) } catch {}
  }
  const loadTeacherLinkDB = () => {
    try { const raw = localStorage.getItem(TEACHER_LINK_DB_KEY) || '{}'; const parsed = JSON.parse(raw); if (parsed && typeof parsed === 'object') setTeacherLinkDB(parsed) } catch {}
  }
  useEffect(() => {
    loadClassLinkDB();
    loadTeacherLinkDB();
    const onStorage = (e: any) => {
      if (!e) return
      if (e.key === CLASS_LINK_DB_KEY) loadClassLinkDB()
      if (e.key === TEACHER_LINK_DB_KEY) loadTeacherLinkDB()
      if (e.key === 'cache_users_list' || e.key === 'sys_users') fetchUsersCached()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const saveClassLinkDB = async (courseCombined: string, classes: string[]) => {
    const now = Date.now()
    const unique = Array.from(new Set(classes.map((x)=> String(x||'').trim()).filter((x)=> x.length>0)))
    const next = { ...classLinkDB, [courseCombined]: { classes: unique, createdAt: now } }
    localStorage.setItem(CLASS_LINK_DB_KEY, JSON.stringify(next))
    setClassLinkDB(next)
    try {
      const raw = localStorage.getItem(OP_LOG_DB_KEY) || '[]'
      const arr = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []
      arr.push({ type: 'link_class', courseCombined, classes: unique, createdAt: new Date().toLocaleString() })
      localStorage.setItem(OP_LOG_DB_KEY, JSON.stringify(arr))
    } catch {}
  }
  const saveTeacherLinkDB = async (courseCombined: string, teachers: string[]) => {
    const now = Date.now()
    const unique = Array.from(new Set(teachers.map((x)=> String(x||'').trim()).filter((x)=> x.length>0)))
    const next = { ...teacherLinkDB, [courseCombined]: { teachers: unique, createdAt: now } }
    localStorage.setItem(TEACHER_LINK_DB_KEY, JSON.stringify(next))
    setTeacherLinkDB(next)
    try {
      const raw = localStorage.getItem(OP_LOG_DB_KEY) || '[]'
      const arr = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []
      arr.push({ type: 'link_teacher', courseCombined, teachers: unique, createdAt: new Date().toLocaleString() })
      localStorage.setItem(OP_LOG_DB_KEY, JSON.stringify(arr))
    } catch {}
  }
  const openLinkClass = (record: any) => { setEditingOfferingKey(record.key); linkClassForm.setFieldsValue({ linkedClass: record.linkedClass||'' }); setLinkClassOpen(true) }
  const openLinkTeacher = (record: any) => {
    setEditingOfferingKey(record.key)
    linkTeacherForm.setFieldsValue({ teacherScope: record.teacherScope || '' })
    setTeacherNameFilter('')
    const dept = String(record.department || '')
    setTeacherDeptFilter(dept ? dept : undefined)
    setLinkTeacherOpen(true)
    fetchUsersCached()
  }
  const submitLinkClass = async (v: any) => {
    try {
      const raw = v.linkedClass
      const classes = Array.isArray(raw) ? raw : String(raw||'').split(/[、，,;；\s]+/)
      const unique = Array.from(new Set(classes.map((x:string)=> String(x||'').trim()).filter((x)=> x.length>0)))
      const rec = offerings.find((o)=> o.key===editingOfferingKey)
      const courseCombined = rec ? `${rec.course||''}${rec.code?`(${rec.code})`:''}` : ''
      await saveClassLinkDB(courseCombined, unique)
      setOfferings((prev)=> prev.map((o)=> o.key===editingOfferingKey ? { ...o, linkedClass: unique.join('、') } : o))
      setLinkClassOpen(false); setEditingOfferingKey(null); linkClassForm.resetFields()
    } catch {
      message.error('关联失败，请重试')
    }
  }
  const USERS_CACHE_KEY = 'cache_users_list'
  const [usersCache, setUsersCache] = useState<{ list: any[]; updatedAt: number }>({ list: [], updatedAt: 0 })
  const fetchUsersCached = async () => {
    try {
      const cachedRaw = localStorage.getItem(USERS_CACHE_KEY) || ''
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw)
        if (cached && cached.list && Array.isArray(cached.list)) { setUsersCache(cached); return cached.list }
      }
      const raw = localStorage.getItem('sys_users') || ''
      let list: any[] = []
      try {
        const parsed = raw ? JSON.parse(raw) : []
        list = Array.isArray(parsed) ? parsed : []
      } catch {
        list = []
      }
      if (!list || list.length === 0) {
        const now = () => new Date().toLocaleString()
        list = [
          { id: 't1', jobNo: 'T202501', name: '张三', email:'zhangsan@example.com', gender: '男', idCard: '', phone: '13800000001', department: '计算机学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
          { id: 't2', jobNo: 'T202502', name: '李四', email:'lisi@example.com', gender: '男', idCard: '', phone: '13800000002', department: '计算机学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
          { id: 't3', jobNo: 'T202503', name: '王五', email:'wangwu@example.com', gender: '男', idCard: '', phone: '13800000003', department: '信息工程学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
          { id: 't4', jobNo: 'T202504', name: '赵六', email:'zhaoliu@example.com', gender: '男', idCard: '', phone: '13800000004', department: '数学与统计学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
          { id: 't5', jobNo: 'T202505', name: '孙七', email:'sunqi@example.com', gender: '女', idCard: '', phone: '13800000005', department: '物理与电子工程学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() },
          { id: 't6', jobNo: 'T202506', name: '周八', email:'zhouba@example.com', gender: '女', idCard: '', phone: '13800000006', department: '外国语学院', position: '教师', roles: ['教师'], disabled: false, status: '在职', createTime: now() }
        ]
        localStorage.setItem('sys_users', JSON.stringify(list))
      }
      const data = { list, updatedAt: Date.now() }
      localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(data))
      setUsersCache(data)
      return list
    } catch { return [] }
  }
  useEffect(() => { fetchUsersCached() }, [])
  const [teacherNameFilter, setTeacherNameFilter] = useState('')
  const [teacherDeptFilter, setTeacherDeptFilter] = useState<string | undefined>(undefined)
  const teacherDeptOptions = useMemo(() => {
    const s = new Set<string>()
    ;(usersCache.list||[]).forEach((u:any)=> { if(u.department) s.add(String(u.department)) })
    return Array.from(s).map((v)=> ({ value: v, label: v }))
  }, [usersCache])
  const [linkTeacherLoading, setLinkTeacherLoading] = useState(false)
  const linkTeacherOptions = useMemo(() => {
    try {
      const all = (usersCache.list||[]).filter((u:any)=> String(u.position||'')==='教师' || (Array.isArray(u.roles) && u.roles.includes('教师')))
      const list = all.filter((u:any)=> (!teacherNameFilter || String(u.name||'').includes(String(teacherNameFilter))) && (!teacherDeptFilter || String(u.department||'')===String(teacherDeptFilter)))
      const opts = list.map((u:any)=> ({ value: u.name, label: `${u.name}（${u.department||''}${u.departmentPart?`/${u.departmentPart}`:''}）` }))
      return [{ value: SENTINEL_TEACHER, label: SENTINEL_TEACHER }, ...opts]
    } catch { return [] }
  }, [usersCache, teacherNameFilter, teacherDeptFilter])
  const teacherCountAll = useMemo(() => {
    return (usersCache.list||[]).filter((u:any)=> String(u.position||'')==='教师').length
  }, [usersCache])
  useEffect(() => {
    if ((linkTeacherOptions||[]).length<=1 && teacherCountAll>0) {
      setTeacherDeptFilter(undefined)
    }
  }, [linkTeacherOptions, teacherCountAll])
  const submitLinkTeacher = async (v: any) => {
    setLinkTeacherLoading(true)
    try {
      const raw = v.teacherScope
      const teachers = Array.isArray(raw) ? raw : String(raw||'').split(/[、，,;；\s]+/)
      const unique = Array.from(new Set(teachers.map((x:string)=> String(x||'').trim()).filter((x)=> x.length>0 && x!=='不限' && x!==SENTINEL_TEACHER)))
      const rec = offerings.find((o)=> o.key===editingOfferingKey)
      const courseCombined = rec ? `${rec.course||''}${rec.code?`(${rec.code})`:''}` : ''
      await saveTeacherLinkDB(courseCombined, unique)
      setOfferings((prev)=> prev.map((o)=> o.key===editingOfferingKey ? { ...o, teacherScope: unique.join('、') } : o))
      message.success('已关联教师')
      setLinkTeacherOpen(false); setEditingOfferingKey(null); linkTeacherForm.resetFields()
    } catch {
      message.error('关联失败，请重试')
    } finally {
      setLinkTeacherLoading(false)
    }
  }
  const linkClassOptions = useMemo(() => {
    try {
      const rec = offerings.find((o)=> o.key===editingOfferingKey)
      if (!rec) return []
      const s = new Set<string>()
      offerings.filter((o)=> String(o.grade)===String(rec.grade) && String(o.major)===String(rec.major)).forEach((o)=> {
        String(o.linkedClass||'').split(/[、，,;；\s]+/).map((t)=> String(t||'').trim()).filter((t)=> t.length>0).forEach((t)=> s.add(t))
      })
      classCatalog.forEach((name)=> { const v = String(name||'').trim(); if (v.length>0) s.add(v) })
      if (s.size===0) { s.add(`${String(rec.major||'')}${String(rec.grade||'')}-1`); s.add(`${String(rec.major||'')}${String(rec.grade||'')}-2`) }
      return Array.from(s).sort((a,b)=> a.localeCompare(b)).map((v)=> ({ value: v, label: v }))
    } catch { return [] }
  }, [editingOfferingKey, offerings, classCatalog])
  const parseAuditNodes = (chain: string) => {
    if (!chain) return []
    return chain.split('→').map((s) => s.trim()).filter((s) => s.length > 0)
  }
  const auditCurrent = (status: string | undefined, total: number) => {
    if (status === '已通过') return total
    if (status === '已驳回') return Math.max(total - 1, 0)
    return 0
  }
  const onOfferingEditSubmit = (v: any) => {
    setOfferings((prev)=> prev.map((o)=> {
      if (o.key!==editingOfferingKey) return o
      const combined = String(v.courseCombined||'')
      const m = combined.match(/^(.+?)\s*\(([^)]*)\)\s*$/)
      const name = m ? m[1] : (v.course ?? o.course)
      const code = m ? m[2] : (v.code ?? o.code)
      const hoursTotal = (
        Number(v.hoursTheory ?? o.hoursTheory ?? 0) +
        Number(v.hoursExperiment ?? o.hoursExperiment ?? 0) +
        Number(v.hoursTraining ?? o.hoursTraining ?? 0) +
        Number(v.hoursPractice ?? o.hoursPractice ?? 0)
      )
      return {
        ...o,
        academic: v.academic ?? o.academic,
        grade: v.grade ?? o.grade,
        major: v.major ?? o.major,
        duration: v.duration ?? o.duration,
        course: name,
        code: code,
        category: v.category ?? o.category,
        assess: v.assess ?? o.assess,
        position: v.position ?? o.position,
        credit: Number(v.credit ?? o.credit ?? 0),
        hoursTotal,
        hoursTheory: Number(v.hoursTheory ?? o.hoursTheory ?? 0),
        hoursExperiment: Number(v.hoursExperiment ?? o.hoursExperiment ?? 0),
        hoursTraining: Number(v.hoursTraining ?? o.hoursTraining ?? 0),
        hoursPractice: Number(v.hoursPractice ?? o.hoursPractice ?? 0),
        department: v.department ?? o.department,
        remark: v.remark ?? o.remark,
        linkedClass: v.linkedClass ?? o.linkedClass,
        term: v.term ?? o.term,
        ctype: v.ctype ?? o.ctype
      }
    }))
    setOfferingEditOpen(false)
    setEditingOfferingKey(null)
  }
  const deleteOffering = (key: string) => {
    setOfferings((prev)=> prev.filter((o)=> o.key!==key))
  }
  // 已移除手动生成课程班的顶部表单
  const approveOffering = (key: string) => {
    setOfferings((prev) => prev.map((o) => o.key === key ? { ...o, status: '已通过' } : o))
  }
  const rejectOffering = (key: string) => {
    setOfferings((prev) => prev.map((o) => o.key === key ? { ...o, status: '已驳回' } : o))
  }
  const getAuditMajorScope = (): string[] => {
    try {
      const raw = localStorage.getItem('audit_major_scope') || ''
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map((s)=> String(s))
      return String(raw).split(/[、，,;\s]+/).map((s)=> s.trim()).filter((s)=> s.length>0)
    } catch { return [] }
  }
  const isAuthorizedMajor = (major: string): boolean => {
    const scope = getAuditMajorScope()
    if (!scope || scope.length===0) return true
    return scope.includes(String(major||''))
  }
  const approveGroup = (group: any) => {
    const { academic, grade, major, children } = group || {}
    let affected = 0
    setOfferings((prev)=> prev.map((o)=> {
      const match = String(o.academic||'')===String(academic||'') && String(o.grade||'')===String(grade||'') && String(o.major||'')===String(major||'') && String(o.status||'')==='待审核'
      if (match && isAuthorizedMajor(String(o.major||''))) { affected++; return { ...o, status: '已通过' } }
      return o
    }))
    message.success(`已通过 ${affected} 门课程`)
  }
  const rejectGroup = (group: any) => {
    const { academic, grade, major, children } = group || {}
    let affected = 0
    setOfferings((prev)=> prev.map((o)=> {
      const match = String(o.academic||'')===String(academic||'') && String(o.grade||'')===String(grade||'') && String(o.major||'')===String(major||'') && String(o.status||'')==='待审核'
      if (match && isAuthorizedMajor(String(o.major||''))) { affected++; return { ...o, status: '已驳回' } }
      return o
    }))
    message.success(`已驳回 ${affected} 门课程`)
  }
  const [electives, setElectives] = useState<any[]>([])
  const ELECTIVES_KEY = 'electives'
  useEffect(() => {
    const saved = localStorage.getItem(ELECTIVES_KEY)
    if (saved) {
      try { setElectives(JSON.parse(saved)) } catch {}
    }
  }, [])
  const courseCatalogList = useMemo(() => {
    try {
      const raw = localStorage.getItem('basic_course_catalog') || '[]'
      const list = JSON.parse(raw)
      return Array.isArray(list) ? list : []
    } catch { return [] }
  }, [])
  const editWatchTerm = Form.useWatch('term', editOfferingForm)
  const [editCourseFilter, setEditCourseFilter] = useState('')
  const [editCourseFilterDept, setEditCourseFilterDept] = useState<string | undefined>(undefined)
  const [editCourseFilterCtype, setEditCourseFilterCtype] = useState<string | undefined>(undefined)
  const editCourseList = useMemo(() => {
    try {
      return (courseCatalogList || []).filter((c: any) => {
        const t = editCourseFilter.trim()
        const nameCodeMatch = t ? (String(c.name||'').includes(t) || String(c.code||'').includes(t)) : true
        const deptMatch = editCourseFilterDept ? String(c.department||'') === String(editCourseFilterDept) : true
        const ctypeMatch = editCourseFilterCtype ? String(c.ctype||'') === String(editCourseFilterCtype) : true
        return nameCodeMatch && deptMatch && ctypeMatch
      })
    } catch { return [] }
  }, [courseCatalogList, editCourseFilter, editCourseFilterDept, editCourseFilterCtype])
  
  const seededRef = useRef(false)
  useEffect(() => {
    if (seededRef.current) return
    const now = new Date()
    const month = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const currentAcademicKey = `${month>=9 ? currentYear : currentYear-1}-${month>=9 ? '秋' : '春'}`
    const sCurrent = new Set<string>()
    offerings.forEach((o) => {
      if (String(o.academic||'')!==currentAcademicKey) return
      const k = `${o.academic}||${o.grade}||${o.major}`
      if (o.academic && o.grade && o.major) sCurrent.add(k)
    })
    if (sCurrent.size >= 3) { seededRef.current = true; return }
    try {
      const majorsRaw = localStorage.getItem('basic_major_track') || '[]'
      const majors = JSON.parse(majorsRaw)
      const selected: any[] = (Array.isArray(majors) ? majors.slice(0, 3) : [])
      while (selected.length < 3) {
        const idx = selected.length
        selected.push({ name: ['计算机科学与技术','软件工程','信息安全'][idx], grade: String(new Date().getFullYear() - idx), durationYears: 4, department: '计算机学院' })
      }
      const pickCourses = (n: number) => {
        const list = Array.isArray(courseCatalogList) ? courseCatalogList : []
        if (list.length >= n) return list.slice(0, n)
        return Array.from({ length: n }).map((_, i) => ({ name: `示例课程${i + 1}`, code: '', category: '公共基础', assessment: '考查', credit: 2, hoursTheory: 16, hoursLab: 0, hoursTraining: 0, hoursPractice: 0, department: '教务处' }))
      }
      const computeAcademicLocal = (gS: string, t: number) => {
        const g = Number(gS || new Date().getFullYear())
        const y = g + Math.floor((t - 1) / 2)
        const sTerm = t % 2 === 1 ? '秋' : '春'
        return `${y}-${sTerm}`
      }
      const gen: any[] = []
      const now = new Date()
      const month = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const currentAcademicKey = `${month>=9 ? currentYear : currentYear-1}-${month>=9 ? '秋' : '春'}`
      const currentTerm = month>=9 ? 1 : 2
      selected.forEach((m: any, idx: number) => {
        const grade = String(m.grade || String(new Date().getFullYear() - idx))
        const majorName = String(m.name || m.major || '')
        const duration = String(m.durationYears || m.duration || '')
        const term = currentTerm
        const academic = currentAcademicKey
        const courses = pickCourses(2 + (idx % 2))
        courses.forEach((c: any) => {
          const th = Number(c.hoursTheory || 0)
          const lab = Number(c.hoursLab || 0)
          const trn = Number(c.hoursTraining || 0)
          const prac = Number(c.hoursPractice || 0)
          gen.push({
            key: `seed_${Date.now().toString()}_${Math.random()}`,
            academic,
            grade,
            major: majorName,
            duration,
            course: c.name || '',
            code: c.code || '',
            category: c.category || '',
            assess: c.assessment || c.assess || '',
            position: '',
            credit: Number(c.credit || 0),
            hoursTotal: th + lab + trn + prac,
            hoursTheory: th,
            hoursExperiment: lab,
            hoursTraining: trn,
            hoursPractice: prac,
            department: c.department || m.department || '',
            remark: '',
            status: '待审核',
            linkedClass: `${grade}${majorName}1班、${grade}${majorName}2班`,
            term: String(term),
            ctype: c.ctype || '',
            classSizeThreshold: 40,
            teacherScope: '张三、李四',
            auditChain: '系主任→教秘→教务处'
          })
        })
      })
      if (gen.length > 0) { setOfferings((prev) => [...gen, ...prev]); seededRef.current = true }
    } catch {}
  }, [offerings, courseCatalogList])
  useEffect(() => {
    localStorage.setItem(ELECTIVES_KEY, JSON.stringify(electives))
  }, [electives])
  const addElective = (values: any) => {
    const row = { key: Date.now().toString(), course: values.course || '', type: values.type || '正选' }
    setElectives((prev) => [row, ...prev])
    electiveForm.resetFields()
  }
  const [replacements, setReplacements] = useState<any[]>([])
  const REPLACE_KEY = 'courseReplacements'
  useEffect(() => {
    const saved = localStorage.getItem(REPLACE_KEY)
    if (saved) {
      try { setReplacements(JSON.parse(saved)) } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem(REPLACE_KEY, JSON.stringify(replacements))
  }, [replacements])
  const addReplacement = (values: any) => {
    const row = { key: Date.now().toString(), original: values.original || '', substitute: values.substitute || '', creditRule: values.creditRule || '' }
    setReplacements((prev) => [row, ...prev])
    replacementForm.resetFields()
  }
  const [offFilterForm] = Form.useForm()
  const [offFilter, setOffFilter] = useState<any>({})
  const offFiltered = useMemo(() => {
    return offerings.filter((r) => (
      String(r.academic||'').trim().length>0 &&
      String(r.grade||'').trim().length>0 &&
      String(r.major||'').trim().length>0 &&
      (!offFilter.academic || String(r.academic).includes(offFilter.academic)) &&
      (!offFilter.grade || String(r.grade).includes(offFilter.grade)) &&
      (!offFilter.major || String(r.major).includes(offFilter.major)) &&
      (!offFilter.category || String(r.category) === offFilter.category) &&
      (!offFilter.assess || String(r.assess) === offFilter.assess) &&
      (!offFilter.course || String(r.course).includes(offFilter.course)) &&
      (!offFilter.status || String(r.status) === offFilter.status) &&
      (!offFilter.term || String(r.term) === offFilter.term) &&
      (!offFilter.ctype || String(r.ctype) === offFilter.ctype)
    ))
  }, [offerings, offFilter])
  const offSorted = useMemo(() => {
    const arr = [...offFiltered]
    arr.sort((a:any, b:any) =>
      String(a.academic).localeCompare(String(b.academic)) ||
      String(a.grade).localeCompare(String(b.grade)) ||
      String(a.major).localeCompare(String(b.major)) ||
      String(a.code||a.course).localeCompare(String(b.code||b.course))
    )
    return arr
  }, [offFiltered])
  const offRowSpan = useMemo(() => {
    const arr = offSorted
    const spans: { academic:number; grade:number; major:number }[] = Array(arr.length).fill(0).map(()=> ({ academic:1, grade:1, major:1 }))
    const keyOf = (r:any)=> `${r.academic}||${r.grade}||${r.major}`
    let i = 0
    while (i < arr.length) {
      const k = keyOf(arr[i])
      let j = i + 1
      while (j < arr.length && keyOf(arr[j]) === k) j++
      const count = j - i
      spans[i] = { academic: count, grade: count, major: count }
      for (let t=i+1; t<j; t++) spans[t] = { academic: 0, grade: 0, major: 0 }
      i = j
    }
    return spans
  }, [offSorted])
  const exportOfferingsCSV = () => {
    const header = ['学年学期','年级','专业','学制','课程名称(编号)','课程类别','考核方式','课程地位','学分','总学时','理论学时','实验学时','实训学时','实践学时','承担单位','备注','审核状态','关联班级','开设学期','类型','分班容量阈值','教师范围','审核顺序']
    const rows = offerings.map((r:any)=>[
      '2025~2026学年第一学期', r.grade||'', r.major||'', r.duration||'', `${r.course||''}${r.code?`(${r.code})`:''}`, r.category||'', r.assess||'', r.position||'', String(r.credit??''), String(r.hoursTotal??''), String(r.hoursTheory??''), String(r.hoursExperiment??''), String(r.hoursTraining??''), String(r.hoursPractice??''), r.department||'', r.remark||'', r.status||'', r.linkedClass||'', String(r.term||''), r.ctype||'', String(r.classSizeThreshold??''), r.teacherScope||'', r.auditChain||''
    ])
    const csv = [header.join(','), ...rows.map(r=> r.map(v=> String(v).replace(/,/g,'\u002C')).join(','))].join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '开课计划.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  const downloadOfferingsTemplateCSV = () => {
    const header = ['学年学期','年级','专业','学制','课程名称(编号)','课程类别','考核方式','课程地位','学分','总学时','理论学时','实验学时','实训学时','实践学时','承担单位','备注','审核状态','关联班级','开设学期','类型','分班容量阈值','教师范围','审核顺序']
    const csv = [header.join(',')].join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '开课计划导入模板.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  const downloadLinkedClassTemplateCSV = () => {
    const header = ['年级','专业','课程名称(编号)','关联班级']
    const csv = [header.join(',')].join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '关联班级导入模板.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  const downloadLinkedTeacherTemplateCSV = () => {
    const header = ['年级','专业','课程名称(编号)','关联教师']
    const csv = [header.join(',')].join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '关联教师导入模板.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  // 已移除入口按钮，保留清理函数备用
  // const cleanupEmptyOfferings = () => {
  //   setOfferings((prev)=> prev.filter((o)=> {
  //     const hasCourse = String(o.course||'').trim().length>0
  //     const hasAcademic = String(o.academic||'').trim().length>0
  //     const hasGrade = String(o.grade||'').trim().length>0
  //     const hasMajor = String(o.major||'').trim().length>0
  //     return hasCourse && hasAcademic && hasGrade && hasMajor
  //   }))
  // }
  const beforeImportLinkedClass = async (file: File) => {
    try {
      const text = await file.text()
      let rows: any[] = []
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text)
        if (Array.isArray(data)) rows = data
      } else {
        const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0)
        if (lines.length>1) {
          const header = lines[0].split(',').map(h=>h.trim())
          const idx = (name:string)=> header.findIndex(h=> h===name)
          for (let i=1;i<lines.length;i++){
            const cols = lines[i].split(',')
            rows.push({
              grade: cols[idx('年级')]||'',
              major: cols[idx('专业')]||'',
              course: String(cols[idx('课程名称(编号)')]||'').replace(/\(([^)]*)\)$/,''),
              code: (String(cols[idx('课程名称(编号)')]||'').match(/\(([^)]*)\)$/)||[])[1]||'',
              linkedClass: cols[idx('关联班级')]||''
            })
          }
        }
      }
      if (rows.length>0) {
        setOfferings((prev)=> prev.map((o)=> {
          const r = rows.find((x)=> (
            (x.code ? String(o.code)===String(x.code) : x.course ? String(o.course)===String(x.course) : false) &&
            (!x.grade || String(o.grade)===String(x.grade)) &&
            (!x.major || String(o.major)===String(x.major))
          ))
          if (r) return { ...o, linkedClass: String(r.linkedClass||'') }
          return o
        }))
      }
    } catch {}
    return false
  }
  const beforeImportLinkedTeacher = async (file: File) => {
    try {
      const text = await file.text()
      let rows: any[] = []
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text)
        if (Array.isArray(data)) rows = data
      } else {
        const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0)
        if (lines.length>1) {
          const header = lines[0].split(',').map(h=>h.trim())
          const idx = (name:string)=> header.findIndex(h=> h===name)
          for (let i=1;i<lines.length;i++){
            const cols = lines[i].split(',')
            rows.push({
              grade: cols[idx('年级')]||'',
              major: cols[idx('专业')]||'',
              course: String(cols[idx('课程名称(编号)')]||'').replace(/\(([^)]*)\)$/,''),
              code: (String(cols[idx('课程名称(编号)')]||'').match(/\(([^)]*)\)$/)||[])[1]||'',
              teacherScope: cols[idx('关联教师')]||cols[idx('教师范围')]||''
            })
          }
        }
      }
      if (rows.length>0) {
        setOfferings((prev)=> prev.map((o)=> {
          const r = rows.find((x)=> (
            (x.code ? String(o.code)===String(x.code) : x.course ? String(o.course)===String(x.course) : false) &&
            (!x.grade || String(o.grade)===String(x.grade)) &&
            (!x.major || String(o.major)===String(x.major))
          ))
          if (r) return { ...o, teacherScope: String(r.teacherScope||'') }
          return o
        }))
      }
    } catch {}
    return false
  }
  const beforeImportOfferings = async (file: File) => {
    try {
      const text = await file.text()
      let rows: any[] = []
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text)
        if (Array.isArray(data)) rows = data
      } else {
        const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0)
        if (lines.length>1) {
          const header = lines[0].split(',').map(h=>h.trim())
          const idx = (name:string)=> header.findIndex(h=> h===name)
          for (let i=1;i<lines.length;i++){
            const cols = lines[i].split(',')
            const combined = String(cols[idx('课程名称(编号)')]||'')
            const name = combined.replace(/\(([^)]*)\)$/,'')
            const code = (combined.match(/\(([^)]*)\)$/)||[])[1]||''
            rows.push({
              academic: cols[idx('学年学期')]||'',
              grade: cols[idx('年级')]||'',
              major: cols[idx('专业')]||'',
              duration: cols[idx('学制')]||'',
              course: name,
              code,
              category: cols[idx('课程类别')]||'',
              assess: cols[idx('考核方式')]||'',
              position: cols[idx('课程地位')]||'',
              credit: Number(cols[idx('学分')]||0),
              hoursTotal: Number(cols[idx('总学时')]||0),
              hoursTheory: Number(cols[idx('理论学时')]||0),
              hoursExperiment: Number(cols[idx('实验学时')]||0),
              hoursTraining: Number(cols[idx('实训学时')]||0),
              hoursPractice: Number(cols[idx('实践学时')]||0),
              department: cols[idx('承担单位')]||'',
              remark: cols[idx('备注')]||'',
              status: cols[idx('审核状态')]||'待审核',
              linkedClass: cols[idx('关联班级')]||'',
              term: String(cols[idx('开设学期')]||cols[idx('学期')]||''),
              ctype: cols[idx('类型')]||cols[idx('课程类型')]||'',
              classSizeThreshold: Number(cols[idx('分班容量阈值')]||cols[idx('班容量阈值')]||40),
              teacherScope: cols[idx('教师范围')]||cols[idx('关联教师')]||'',
              auditChain: cols[idx('审核顺序')]||'系主任→教秘→教务处'
            })
          }
        }
      }
      if (rows.length>0) {
        setOfferings((prev)=> {
          const existing = new Set(prev.map((o)=> `${o.course}|${o.term}|${o.grade}|${o.major}`))
          const add = rows.filter((r)=> String(r.course||'').trim().length>0 && String(r.grade||'').trim().length>0 && String(r.major||'').trim().length>0 && String(r.term||'').trim().length>0 && !existing.has(`${r.course||''}|${r.term||''}|${r.grade||''}|${r.major||''}`)).map((r)=> ({ key: `imp_${r.code||r.course||''}_${r.term||''}_${r.grade||''}_${r.major||''}`, ...r }))
          return add.length>0 ? [...add, ...prev] : prev
        })
      }
    } catch {}
    return false
  }
  // 已移除“导入”入口按钮，保留导入函数以备后续需要
  // const beforeImportOfferings = async (file: File) => {
  //   try {
  //     const text = await file.text()
  //     let imported: any[] = []
  //     if (file.name.endsWith('.json')) {
  //       const data = JSON.parse(text)
  //       if (Array.isArray(data)) imported = data
  //     } else {
  //       const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0)
  //       if (lines.length>1) {
  //         const header = lines[0].split(',').map(h=>h.trim())
  //         const idx = (name:string)=> header.findIndex(h=> h===name)
  //         for (let i=1;i<lines.length;i++){
  //           const cols = lines[i].split(',')
  //           imported.push({ /* ...省略同上... */ })
  //         }
  //       }
  //     }
  //     if (imported.length>0) {
  //       const existing = new Set(offerings.map((o)=> `${o.course}|${o.term}|${o.grade}|${o.major}`))
  //       const rows = imported.map((r)=> ({ key: Date.now().toString()+Math.random(), ...r })).filter((r)=> !existing.has(`${r.course}|${r.term}|${r.grade}|${r.major}`))
  //       if (rows.length>0) setOfferings((prev)=> [...rows, ...prev])
  //     }
  //   } catch {}
  //   return false
  // }
  const [offeringAddOpen, setOfferingAddOpen] = useState(false)
  const [importOfferingOpen, setImportOfferingOpen] = useState(false)
  const [importLinkedClassOpen, setImportLinkedClassOpen] = useState(false)
  const [importLinkedTeacherOpen, setImportLinkedTeacherOpen] = useState(false)
  const [addCourseFilter, setAddCourseFilter] = useState('')
  const [addCourseFilterDept, setAddCourseFilterDept] = useState<string | undefined>(undefined)
  const [addCourseFilterCtype, setAddCourseFilterCtype] = useState<string | undefined>(undefined)
  const [addCourseDeptMap, setAddCourseDeptMap] = useState<Record<string, string>>({})
  const addCourseDeptOptions = useMemo(() => {
    const s = new Set<string>();
    (courseCatalogList || []).forEach((c: any) => { const d = String(c.department||'').trim(); if (d) s.add(d) })
    return Array.from(s).map((v)=> ({ value: v, label: v }))
  }, [courseCatalogList])
  const addCourseCtypeOptions = useMemo(() => {
    const s = new Set<string>();
    (courseCatalogList || []).forEach((c: any) => { const t = String(c.ctype||'').trim(); if (t) s.add(t) })
    return Array.from(s).map((v)=> ({ value: v, label: v }))
  }, [courseCatalogList])
  const addCourseList = useMemo(() => {
    try {
      return (courseCatalogList || []).filter((c: any) => {
        const t = addCourseFilter.trim()
        const nameCodeMatch = t ? (String(c.name||'').includes(t) || String(c.code||'').includes(t)) : true
        const deptMatch = addCourseFilterDept ? String(c.department||'') === String(addCourseFilterDept) : true
        const ctypeMatch = addCourseFilterCtype ? String(c.ctype||'') === String(addCourseFilterCtype) : true
        return nameCodeMatch && deptMatch && ctypeMatch
      })
    } catch { return [] }
  }, [courseCatalogList, addCourseFilter, addCourseFilterDept, addCourseFilterCtype])
  const [addSelectedCourses, setAddSelectedCourses] = useState<any[]>([])
  const [selectedMajors, setSelectedMajors] = useState<any[]>([])
  const [addProfile, setAddProfile] = useState<{ academic: string; grade: string; major: string; duration: string; term: string; ctype: string }>({ academic: '', grade: '', major: '', duration: '', term: '', ctype: '' })
  const [majorSearchName, setMajorSearchName] = useState('')
  const [majorSearchGrade, setMajorSearchGrade] = useState<string | undefined>(undefined)
  const majorInfoMap = useMemo(() => {
    try {
      const rawTrack = localStorage.getItem('basic_major_track') || '[]'
      const tracks = JSON.parse(rawTrack)
      const map = new Map<string, { code: string; duration: string }>()
      if (Array.isArray(tracks)) {
        tracks.forEach((m: any) => {
          const nm = String(m.name || m.major || '').trim()
          const code = String(m.code || '').trim()
          const durRaw = String(m.durationYears ?? m.duration ?? '').trim()
          const dur = durRaw ? String(Number(durRaw)) : ''
          if (nm) map.set(nm, { code, duration: dur })
        })
      }
      return map
    } catch { return new Map<string, { code: string; duration: string }>() }
  }, [])
  const computeAcademic = (grade: string, term: string | number) => {
    const g = Number(grade || new Date().getFullYear())
    const t = Number(term || 1)
    const y = g + Math.floor((t - 1) / 2)
    const s = t % 2 === 1 ? '秋' : '春'
    return `${y}-${s}`
  }
  const majorListRows = useMemo(() => {
    try {
      const rawNew = localStorage.getItem('basic_new_major') || '[]'
      const news = JSON.parse(rawNew)
      let items: { key: string; grade: string; name: string; code: string; duration: string }[] = []
      if (Array.isArray(news)) {
        items = news.map((r: any) => {
          const name = String(r.major || r.name || '').trim()
          let grade = String(r.grade || '').trim()
          const gMatch = grade.match(/\d{4}/)
          grade = gMatch ? gMatch[0] : grade
          const info = majorInfoMap.get(name) || { code: '', duration: '' }
          const code = String(info.code || '').trim()
          const duration = String(info.duration || '').trim()
          return { key: `${grade}_${name}`, grade, name, code, duration }
        }).filter((i) => i.name && i.grade)
        const uniq = new Map<string, { key: string; grade: string; name: string; code: string; duration: string }>()
        items.forEach((i) => { if (!uniq.has(i.key)) uniq.set(i.key, i) })
        items = Array.from(uniq.values())
      }
      items = items.filter((i) => (!majorSearchName || i.name.includes(majorSearchName)) && (!majorSearchGrade || String(i.grade || '') === String(majorSearchGrade)))
      items.sort((a, b) => String(a.grade).localeCompare(String(b.grade)) || String(a.name).localeCompare(String(b.name)))
      return items
    } catch { return [] }
  }, [majorInfoMap, majorSearchName, majorSearchGrade])
  const addPreviewRows = useMemo(() => {
    const rows: any[] = [];
    (selectedMajors||[]).forEach((m: any) => {
      (addSelectedCourses||[]).forEach((rec: any) => {
        const th = Number(rec.hoursTheory||0)
        const lab = Number(rec.hoursLab||0)
        const trn = Number(rec.hoursTraining||0)
        const prac = Number(rec.hoursPractice||0)
        rows.push({
          key: `${m.key}-${rec.code||rec.name||Math.random()}`,
          academic: computeAcademic(String(m.grade||''), String(addProfile.term||'')||1),
          grade: String(m.grade||''),
          major: String(m.name||''),
          duration: String(m.duration||''),
          course: rec.name || '',
          code: rec.code || '',
          category: rec.category || '',
          assess: rec.assessment || '',
          position: '',
          credit: Number(rec.credit||0),
          hoursTotal: th + lab + trn + prac,
          hoursTheory: th,
          hoursExperiment: lab,
          hoursTraining: trn,
          hoursPractice: prac,
          department: (addCourseDeptMap[(rec.code || rec.name || `${rec.name}-${rec.code}`)] ?? (rec.department || '')),
          remark: ''
        })
      })
    })
    rows.sort((a:any, b:any) =>
      String(a.academic).localeCompare(String(b.academic)) ||
      String(a.grade).localeCompare(String(b.grade)) ||
      String(a.major).localeCompare(String(b.major)) ||
      String(a.code||a.course).localeCompare(String(b.code||b.course))
    )
    return rows
  }, [selectedMajors, addSelectedCourses, addProfile.academic])

  const previewRowSpan = useMemo(() => {
    const arr = addPreviewRows || []
    const spans: { academic:number; grade:number; major:number }[] = Array(arr.length).fill(0).map(()=> ({ academic:1, grade:1, major:1 }))
    const keyOf = (r:any)=> `${r.academic}||${r.grade}||${r.major}`
    let i = 0
    while (i < arr.length) {
      const k = keyOf(arr[i])
      let j = i + 1
      while (j < arr.length && keyOf(arr[j]) === k) j++
      const count = j - i
      spans[i] = { academic: count, grade: count, major: count }
      for (let t=i+1; t<j; t++) spans[t] = { academic: 0, grade: 0, major: 0 }
      i = j
    }
    return spans
  }, [addPreviewRows])
  const canCompleteAdd = !!(addSelectedCourses.length>0 && selectedMajors.length>0)
  const completeAddSelection = () => {
    if (!canCompleteAdd) return
    const rows: any[] = []
    selectedMajors.forEach((m: any) => {
      addSelectedCourses.forEach((rec: any) => {
        const hrsTotal = Number(rec.hoursTheory||0) + Number(rec.hoursLab||0) + Number(rec.hoursTraining||0) + Number(rec.hoursPractice||0)
        const academic = addProfile.academic || computeAcademic(String(m.grade||''), 1)
        rows.push({
          key: Date.now().toString() + Math.random(),
          academic,
          grade: String(m.grade||''),
          major: String(m.name||''),
          duration: String(m.duration||''),
          course: rec.name || '',
          code: rec.code || '',
          category: rec.category || '',
          assess: rec.assessment || '',
          position: '',
          credit: Number(rec.credit||0),
          hoursTotal: hrsTotal,
          hoursTheory: Number(rec.hoursTheory||0),
          hoursExperiment: Number(rec.hoursLab||0),
          hoursTraining: Number(rec.hoursTraining||0),
          hoursPractice: Number(rec.hoursPractice||0),
          department: (addCourseDeptMap[(rec.code || rec.name || `${rec.name}-${rec.code}`)] ?? (rec.department || '')),
          remark: '',
          status: '待审核',
          linkedClass: '',
          term: '',
          ctype: '',
          classSizeThreshold: 0,
          teacherScope: SENTINEL_TEACHER,
          auditChain: '系主任→教秘→教务处'
        })
      })
    })
    if (rows.length>0) setOfferings((prev)=> [...rows, ...prev])
    setOfferingAddOpen(false)
    setAddSelectedCourses([])
    setSelectedMajors([])
    setAddProfile({ academic: '', grade: '', major: '', duration: '', term: '', ctype: '' })
    setAddCourseFilter('')
  }
  const editPreviewRows = useMemo(() => {
    try {
      const majors = (majorListRows || []).filter((m:any)=> editSelectedMajorKeys.includes(m.key))
      const courses = (editCourseList || []).filter((c:any)=> editSelectedCourseKeys.includes(c.code || c.name || `${c.name}-${c.code}`))
      const rows: any[] = []
      majors.forEach((m:any) => {
        courses.forEach((rec:any) => {
          const th = Number(rec.hoursTheory||0)
          const lab = Number(rec.hoursLab||0)
          const trn = Number(rec.hoursTraining||0)
          const prac = Number(rec.hoursPractice||0)
          rows.push({
            key: `${m.key}-${rec.code||rec.name||Math.random()}`,
            academic: computeAcademic(String(m.grade||''), String(editWatchTerm||'')||1),
            grade: String(m.grade||''),
            major: String(m.name||''),
            duration: String(m.duration||''),
            course: rec.name || '',
            code: rec.code || '',
            category: rec.category || '',
            assess: rec.assessment || '',
            position: '',
            credit: Number(rec.credit||0),
            hoursTotal: th + lab + trn + prac,
            hoursTheory: th,
            hoursExperiment: lab,
            hoursTraining: trn,
            hoursPractice: prac,
            department: rec.department || '',
            remark: ''
          })
        })
      })
      rows.sort((a:any, b:any) =>
        String(a.academic).localeCompare(String(b.academic)) ||
        String(a.grade).localeCompare(String(b.grade)) ||
        String(a.major).localeCompare(String(b.major)) ||
        String(a.code||a.course).localeCompare(String(b.code||b.course))
      )
      return rows
    } catch { return [] }
  }, [majorListRows, editCourseList, editSelectedMajorKeys, editSelectedCourseKeys, editWatchTerm])
  const gradeOptions = useMemo(() => {
    const s = new Set<string>()
    offerings.forEach((o) => { if (o.grade) s.add(o.grade) })
    const y = new Date().getFullYear()
    ;[y, y - 1, y - 2].forEach((v) => s.add(String(v)))
    return Array.from(s).map((v) => ({ value: v, label: `${v}级` }))
  }, [offerings])
  const majorOptionsCP = useMemo(() => {
    try {
      const rawTrack = localStorage.getItem('basic_major_track') || '[]'
      const tracks = JSON.parse(rawTrack)
      const rawNew = localStorage.getItem('basic_new_major') || '[]'
      const news = JSON.parse(rawNew)
      const infoMap = new Map<string, { code: string; duration: string }>()
      if (Array.isArray(tracks)) {
        tracks.forEach((m: any) => {
          const nm = m.name || m.major
          if (nm) infoMap.set(String(nm), { code: String(m.code || ''), duration: String(m.durationYears || '') })
        })
      }
      let items: { name: string; grade: string }[] = []
      if (Array.isArray(news) && news.length > 0) {
        items = news.map((r: any) => ({ name: String(r.major || r.name || ''), grade: String(r.grade || '') })).filter((i) => i.name)
      } else {
        items = Array.from(infoMap.keys()).map((nm) => ({ name: nm, grade: '' }))
      }
      items = items.filter((i) => (!majorSearchName || i.name.includes(majorSearchName)) && (!majorSearchGrade || String(i.grade || '') === String(majorSearchGrade)))
      return items.map((i) => {
        const info = infoMap.get(i.name) || { code: '', duration: '' }
        const label = `${i.grade || addProfile.grade || '-'}级 / ${i.name} / ${info.code} / ${info.duration}`
        return { value: i.name, label }
      })
    } catch { return [] }
  }, [addProfile.grade, majorSearchName, majorSearchGrade])
  
  const [adjustLogs, setAdjustLogs] = useState<any[]>([])
  const OFFERING_ADJUST_LOGS_KEY = 'offeringAdjustLogs'
  useEffect(() => {
    const saved = localStorage.getItem(OFFERING_ADJUST_LOGS_KEY)
    if (saved) {
      try { setAdjustLogs(JSON.parse(saved)) } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem(OFFERING_ADJUST_LOGS_KEY, JSON.stringify(adjustLogs))
  }, [adjustLogs])
  const [auditLogs, setAuditLogs] = useState<Record<string, any[]>>({})
  const AUDIT_LOG_KEY = 'offeringAuditLogs'
  useEffect(() => {
    const raw = localStorage.getItem(AUDIT_LOG_KEY)
    if (raw) { try { const parsed = JSON.parse(raw); if (parsed && typeof parsed==='object') setAuditLogs(parsed) } catch {} }
  }, [])
  useEffect(() => {
    try { localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(auditLogs)) } catch {}
  }, [auditLogs])
  useEffect(() => {
    if (offerings.length>0 && adjustLogs.length===0 && !localStorage.getItem('offeringAdjustLogsSeeded')) {
      const pick = (i: number) => offerings[Math.min(i, offerings.length-1)]
      const mk = (base: any, changes: any, status: string) => {
        const before = { ...base }
        const after = { ...before, ...changes }
        after.hoursTotal = Number(after.hoursTheory||0)+Number(after.hoursExperiment||0)+Number(after.hoursTraining||0)+Number(after.hoursPractice||0)
        return {
          key: `${Date.now()}_${Math.random()}`,
          offeringKey: before.key,
          applicant: '系统模拟',
          applyTime: new Date().toLocaleString(),
          handler: status==='待处理' ? '' : '教务处',
          handleTime: status==='待处理' ? '' : new Date().toLocaleString(),
          status,
          before,
          after
        }
      }
      const a = pick(0)
      const b = pick(1)
      const c = pick(2)
      const s: any[] = []
      if (a) s.push(mk(a, { credit: Number(a.credit||0)+1, auditChain: '系主任→教务处', status: '已通过' }, '已通过'))
      if (b) s.push(mk(b, { hoursExperiment: Number(b.hoursExperiment||0)+8, department: '计算机学院', auditChain: '教秘→系主任→教务处', status: '已驳回' }, '已驳回'))
      if (c) s.push(mk(c, { assess: '考查', remark: '调整校验', auditChain: '系主任→教秘→教务处' }, '待处理'))
      if (s.length>0) {
        setAdjustLogs(s)
        localStorage.setItem('offeringAdjustLogsSeeded','1')
      }
    }
  }, [offerings, adjustLogs])
  const [adjustForm] = Form.useForm()
  const addAdjustLog = (values: any) => {
    const off = offerings.find((o)=> o.key === values.offeringKey)
    if (!off) return
    const before = { ...off }
    const hoursTheory = values.hoursTheory != null ? Number(values.hoursTheory) : before.hoursTheory
    const hoursExperiment = values.hoursExperiment != null ? Number(values.hoursExperiment) : before.hoursExperiment
    const hoursTraining = values.hoursTraining != null ? Number(values.hoursTraining) : before.hoursTraining
    const hoursPractice = values.hoursPractice != null ? Number(values.hoursPractice) : before.hoursPractice
    const after = {
      ...before,
      category: values.category ?? before.category,
      assess: values.assess ?? before.assess,
      credit: values.credit != null ? Number(values.credit) : before.credit,
      hoursTheory,
      hoursExperiment,
      hoursTraining,
      hoursPractice,
      hoursTotal: Number(hoursTheory||0)+Number(hoursExperiment||0)+Number(hoursTraining||0)+Number(hoursPractice||0),
      department: values.department ?? before.department,
      remark: values.remark ?? before.remark,
      term: values.term ?? before.term,
      ctype: values.ctype ?? before.ctype
    }
    const row = {
      key: Date.now().toString(),
      offeringKey: off.key,
      applicant: values.applicant || '匿名',
      applyTime: new Date().toLocaleString(),
      handler: '',
      handleTime: '',
      status: '待处理',
      before,
      after
    }
    setAdjustLogs((prev) => [row, ...prev])
    adjustForm.resetFields()
  }
  const approveAdjustLog = (key: string) => {
    const handler = String(localStorage.getItem('currentUserName') || localStorage.getItem('currentUserRole') || '教务处')
    setAdjustLogs((prev)=> prev.map((r)=> r.key===key ? { ...r, handler, handleTime: new Date().toLocaleString(), status: '已通过' } : r))
  }
  const rejectAdjustLog = (key: string) => {
    const handler = String(localStorage.getItem('currentUserName') || localStorage.getItem('currentUserRole') || '教务处')
    setAdjustLogs((prev)=> prev.map((r)=> r.key===key ? { ...r, handler, handleTime: new Date().toLocaleString(), status: '已驳回' } : r))
  }
  const [adjustViewOpen, setAdjustViewOpen] = useState(false)
  const [adjustViewRecord, setAdjustViewRecord] = useState<any | null>(null)
  const openAdjustView = (record: any) => { setAdjustViewRecord(record); setAdjustViewOpen(true) }
  const tabKeyByPath: Record<string, string> = {
    '/offering': 'offering',
    '/offering/plan': 'offering',
    '/offering/audit': 'offering-audit',
    '/offering/adjust-logs': 'adjust-logs',
    '/offering/electives': 'electives',
    '/offering/preselect-records': 'preselect-records',
    '/offering/replacement': 'replacement'
  }
  const activeTabKey = tabKeyByPath[loc.pathname] || 'offering'
  const [auditFilter, setAuditFilter] = useState<any>({})
  const [auditFilterForm] = Form.useForm()
  const academicOptions = useMemo(() => {
    const s = new Set<string>()
    offerings.forEach((o)=> { if (o.academic) s.add(String(o.academic)) })
    return Array.from(s).map((v)=> ({ value: v, label: v }))
  }, [offerings])
  const items = [
    {
      key: 'offering',
      label: '开课计划',
      children: (
        <Card className="page-content">
          <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ marginBottom: 12 }}>
            <Button type="primary" onClick={()=> setOfferingAddOpen(true)}>新增开课计划</Button>
            <Button onClick={exportOfferingsCSV}>导出</Button>
            <Button onClick={()=> setImportOfferingOpen(true)}>导入开课计划</Button>
            <Button onClick={()=> setImportLinkedClassOpen(true)}>关联班级导入</Button>
            <Button onClick={()=> setImportLinkedTeacherOpen(true)}>关联教师导入</Button>
          </Space>
            <Form form={offFilterForm} layout="inline" onValuesChange={(_,v)=> setOffFilter(v)} style={{ marginBottom: 12 }}>
              <Form.Item name="academic" label="学年学期"><Input style={{ width: 180 }} placeholder="示例：2025~2026学年第一学期" /></Form.Item>
              <Form.Item name="grade" label="年级"><Input style={{ width: 120 }} placeholder="示例：2025级" /></Form.Item>
              <Form.Item name="major" label="专业"><Input style={{ width: 160 }} placeholder="包含" /></Form.Item>
              <Form.Item name="category" label="课程类别"><Select allowClear style={{ width: 140 }} options={[{value:'通识教育',label:'通识教育'},{value:'学科基础教育',label:'学科基础教育'},{value:'专业教育',label:'专业教育'},{value:'实践教育',label:'实践教育'}]} /></Form.Item>
              <Form.Item name="assess" label="考核方式"><Select allowClear style={{ width: 120 }} options={[{value:'考试',label:'考试'},{value:'考查',label:'考查'}]} /></Form.Item>
              <Form.Item name="course" label="课程名称"><Input style={{ width: 160 }} placeholder="包含" /></Form.Item>
              <Form.Item name="status" label="状态"><Select allowClear style={{ width: 120 }} options={[{value:'待审核',label:'待审核'},{value:'已通过',label:'已通过'},{value:'已驳回',label:'已驳回'}]} /></Form.Item>
              <Form.Item name="term" label="开设学期"><Select allowClear style={{ width: 120 }} options={[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'},{value:'5',label:'5'},{value:'6',label:'6'},{value:'7',label:'7'},{value:'8',label:'8'}]} /></Form.Item>
              <Form.Item name="ctype" label="类型"><Select allowClear style={{ width: 220 }} options={[{value:'理论课（课内实验实训）',label:'理论课（课内实验实训）'},{value:'校内实践（集中）',label:'校内实践（集中）'},{value:'校外实践（分散）',label:'校外实践（分散）'}]} /></Form.Item>
              <Form.Item><Button onClick={()=> { offFilterForm.resetFields(); setOffFilter({}) }}>重置</Button></Form.Item>
              <Form.Item><Button type="primary" onClick={()=> setOffFilter(offFilterForm.getFieldsValue())}>查询</Button></Form.Item>
            </Form>
            {(() => {
              const catalogByCode = new Map((courseCatalogList||[]).map((c:any)=> [String(c.code||''), c]))
              const findCatalog = (r:any) => {
                let c = catalogByCode.get(String(r.code||''))
                if (!c) c = (courseCatalogList||[]).find((x:any)=> String(x.name||'')===String(r.course||''))
                return c
              }
              const fmtNum = (n:any)=> Number(n||0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const auditColumns: any[] = [
                { title:'学年学期', render: (_:any, r:any) => (r.children ? '2025~2026学年第一学期' : ''), align:'center', width: 180 },
                { title:'年级', render: (_:any, r:any) => (r.children ? (r.grade||'') : ''), align:'center', width: 100 },
                { title:'专业', render: (_:any, r:any) => (r.children ? (r.major||'') : ''), align:'center', width: 220 },
                { title:'课程名称(编号)', render: (_:any, r:any) => r.children ? `共${r.count||r.children.length}门` : `${r.course||''}${r.code?`(${r.code})`:''}`, ellipsis:true },
                { title:'学分', align:'right', render: (_:any, r:any) => {
                  if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.creditSum)}</span>)
                  const c = findCatalog(r)
                  return fmtNum(c ? Number(c.credit||0) : r.credit)
                } },
                { title:'总学时', align:'right', render: (_:any, r:any) => {
                  if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursTotalSum)}</span>)
                  const c = findCatalog(r)
                  if (c) {
                    const th=Number(c.hoursTheory||0), lab=Number(c.hoursLab||0), trn=Number(c.hoursTraining||0), prac=Number(c.hoursPractice||0)
                    return fmtNum(th+lab+trn+prac)
                  }
                  return fmtNum(r.hoursTotal)
                } },
                { title:'学时', children: [
                  { title:'理论学时', dataIndex:'hoursTheory', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursTheorySum)}</span>)
                    const c=findCatalog(r); return fmtNum(c ? Number(c.hoursTheory||0) : r.hoursTheory)
                  } },
                  { title:'实验学时', dataIndex:'hoursExperiment', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursExperimentSum)}</span>)
                    const c=findCatalog(r); return fmtNum(c ? Number(c.hoursLab||0) : r.hoursExperiment)
                  } },
                  { title:'实训学时', dataIndex:'hoursTraining', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursTrainingSum)}</span>)
                    const c=findCatalog(r); return fmtNum(c ? Number(c.hoursTraining||0) : r.hoursTraining)
                  } },
                  { title:'实践学时', dataIndex:'hoursPractice', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursPracticeSum)}</span>)
                    const c=findCatalog(r); return fmtNum(c ? Number(c.hoursPractice||0) : r.hoursPractice)
                  } }
                ]}
              ]
              const groupify = (list: any[]) => {
                const map = new Map<string, any>()
                list.forEach((r) => {
                  const k = `${r.academic||''}|${r.grade||''}|${r.major||''}`
                  let g = map.get(k)
                  if (!g) { g = { key: `grp-${k}`, academic: r.academic||'', grade: r.grade||'', major: r.major||'', children: [] as any[], count: 0, creditSum: 0, hoursTotalSum: 0, hoursTheorySum: 0, hoursExperimentSum: 0, hoursTrainingSum: 0, hoursPracticeSum: 0 }; map.set(k, g) }
                  g.children.push(r)
                })
                Array.from(map.values()).forEach((g: any) => {
                  const uniq = new Map<string, any>()
                  g.children.forEach((c: any) => { const sig = `${c.course||''}|${c.code||''}`; if (!uniq.has(sig)) uniq.set(sig, c) })
                  const arr = Array.from(uniq.values()).sort((a: any, b: any) => String(a.course||'').localeCompare(String(b.course||'')))
                  g.children = arr
                  g.count = arr.length
                  g.creditSum = arr.reduce((sum:number, c:any)=> sum + Number(c.credit||0), 0)
                  g.hoursTotalSum = arr.reduce((sum:number, c:any)=> sum + Number(c.hoursTotal||0), 0)
                  g.hoursTheorySum = arr.reduce((sum:number, c:any)=> sum + Number(c.hoursTheory||0), 0)
                  g.hoursExperimentSum = arr.reduce((sum:number, c:any)=> sum + Number(c.hoursExperiment||0), 0)
                  g.hoursTrainingSum = arr.reduce((sum:number, c:any)=> sum + Number(c.hoursTraining||0), 0)
                  g.hoursPracticeSum = arr.reduce((sum:number, c:any)=> sum + Number(c.hoursPractice||0), 0)
                })
                return Array.from(map.values())
              }
              const data = (() => {
                const base = groupify(offSorted)
                const enrich = (arr:any[]) => {
                  try {
                    const trackRaw = localStorage.getItem('basic_major_track') || '[]'
                    const tracks = Array.isArray(JSON.parse(trackRaw)) ? JSON.parse(trackRaw) : []
                    const existing = new Set(arr.map((g:any)=> String(g.major||'')))
                    // 先处理重复的分组名称：为重复分组分配不同的专业名用于展示
                    const namesPool = (()=>{ const ns = (tracks||[]).map((m:any)=> String(m.name||m.major||'').trim()).filter(Boolean); const out:string[]=[]; ns.forEach((n)=>{ if(!existing.has(n) && !out.includes(n)) out.push(n) }); return out })()
                    const seen: Record<string, number> = {}
                    arr.forEach((g:any)=> { const n=String(g.major||''); seen[n]=(seen[n]||0)+1 })
                    const used = new Set<string>(Array.from(existing))
                    arr.forEach((g:any)=>{
                      const n = String(g.major||'')
                      if ((seen[n]||0) > 1) {
                        const alt = namesPool.find((x)=> !used.has(x))
                        if (alt) { g.major = alt; used.add(alt); seen[n] = (seen[n]||0) - 1 }
                      }
                      ;(g.children||[]).forEach((c:any)=> { c.major = g.major })
                    })
                    const academic = arr[0]?.academic || '2025-秋'
                    const grade = arr[0]?.grade || String(new Date().getFullYear()-3)
                    const out = [...arr]
                    for (const m of tracks) {
                      const name = String(m.name || m.major || '').trim()
                      if (!name || existing.has(name)) continue
                      out.push({ key: `grp-fallback-${name}`, academic, grade, major: name, children: [], count: 0, creditSum: 0, hoursTotalSum: 0, hoursTheorySum: 0, hoursExperimentSum: 0, hoursTrainingSum: 0, hoursPracticeSum: 0 })
                      existing.add(name)
                      if (out.length >= Math.max(arr.length, 4)) break
                    }
                    return out
                  } catch { return arr }
                }
                return enrich(base)
              })()
              return (
                <Table
                  size="small"
                  pagination={false}
                  rowKey="key"
                  dataSource={data}
                  expandable={{ defaultExpandAllRows: true }}
                  onRow={(record)=> record.children ? { style: { background: '#fafafa', fontWeight: 500, transition: 'background-color .2s ease' } } : {}}
                  locale={{ emptyText: '暂无数据' }}
                  columns={([
                    ...auditColumns,
                    { title:'关联班级', render: (_:any, r:any) => {
                      try {
                        if (r.children) {
                          return (
                            <Dropdown
                              menu={{
                                items: (() => {
                                  const arr: string[] = []
                                  const sizes: Record<string, number> = {}
                                  ;(r.children || []).forEach((c: any) => {
                                    const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`
                                    const entry = classLinkDB[key]
                                    const list = entry?.classes || (String(c.linkedClass || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0))
                                    const sz = Number(c.classSizeThreshold || 0)
                                    list.forEach((nm: string) => { if (nm && !arr.includes(nm)) arr.push(nm); if (nm) sizes[nm] = Math.max(Number(sizes[nm] || 0), sz) })
                                  })
                                  return (arr.length > 0 ? arr : ['暂无']).map((nm, idx) => ({ key: String(idx), label: arr.length > 0 ? `${nm} ${Number(sizes[nm]||0)>0 ? `${Number(sizes[nm]||0)}人` : ''}` : nm }))
                                })()
                              }}
                            >
                              <a>{(() => { const a: string[] = []; (r.children || []).forEach((c: any) => { const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`; const entry = classLinkDB[key]; const list = entry?.classes || (String(c.linkedClass || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)); list.forEach((nm: string) => { if (nm && !a.includes(nm)) a.push(nm) }); }); const count = a.length; return count > 0 ? `合计已关联${count}个班级` : '未关联'; })()}</a>
                            </Dropdown>
                          )
                        }
                        const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                        const entry = classLinkDB[key]
                        const list = entry?.classes || (String(r.linkedClass||'').split(/[、，,;；\s]+/).map((s:string)=>s.trim()).filter((s:string)=>s.length>0))
                        const count = list.length
                        const text = count>0 ? `已关联${count}个班级` : '未关联'
                        return (
                          <Dropdown menu={{ items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: list.length>0 ? `${nm} ${Number(r.classSizeThreshold||0)>0 ? `${Number(r.classSizeThreshold||0)}人` : ''}` : nm })) }}>
                            <a>{text}</a>
                          </Dropdown>
                        )
                      } catch { return '数据不可用' }
                    } },
                    { title:'关联教师', render: (_:any, r:any) => {
                      try {
                        if (r.children) {
                          return (
                            <Dropdown
                              menu={{
                                items: (() => {
                                  const arr: string[] = []
                                  ;(r.children || []).forEach((c: any) => {
                                    const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`
                                    const entry = teacherLinkDB[key]
                                    const list = entry?.teachers || (String(c.teacherScope || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0))
                                    list.forEach((nm: string) => { if (nm && !arr.includes(nm)) arr.push(nm) })
                                  })
                                  return (arr.length > 0 ? arr : ['暂无']).map((nm, idx) => ({ key: String(idx), label: nm }))
                                })()
                              }}
                            >
                              <a>{(() => { const a: string[] = []; (r.children || []).forEach((c: any) => { const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`; const entry = teacherLinkDB[key]; const list = entry?.teachers || (String(c.teacherScope || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)); list.forEach((nm: string) => { if (nm && !a.includes(nm)) a.push(nm) }); }); const count = a.length; return count > 0 ? `合计已关联${count}位教师` : '未关联'; })()}</a>
                            </Dropdown>
                          )
                        }
                        const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                        const entry = teacherLinkDB[key]
                        const list = entry?.teachers || (String(r.teacherScope||'').split(/[、，,;；\s]+/).map((s:string)=>s.trim()).filter((s:string)=>s.length>0))
                        const count = list.length
                        const text = count>0 ? `已关联${count}位教师` : '未关联'
                        return (
                          <Dropdown menu={{ items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: nm })) }}>
                            <a>{text}</a>
                          </Dropdown>
                        )
                      } catch { return '数据不可用' }
                    } },
                    { title:'操作', align:'center', width: 120, render:(_:any,record:any)=> {
                      if (record.children) return null
                      const items = [
                        { key:'view', label:'查看' },
                        { key:'edit', label:'编辑' },
                        { key:'linkClass', label:'关联班级' },
                        { key:'linkTeacher', label:'关联教师' },
                        { type:'divider' as any },
                        { key:'delete', label:<span style={{ color: '#ff4d4f' }}>删除</span> }
                      ]
                      const onClick = ({ key }: any) => {
                        if (key==='view') return openOfferingView(record)
                        if (key==='edit') return openOfferingEdit(record)
                        if (key==='linkClass') return openLinkClass(record)
                        if (key==='linkTeacher') return openLinkTeacher(record)
                        if (key==='delete') return deleteOffering(record.key)
                      }
                      return (
                        <Dropdown menu={{ items, onClick }} placement="bottomRight">
                          <Button size="small">操作</Button>
                        </Dropdown>
                      )
                    } }
                  ]) as any}
                />
              )
            })()}
            <Modal open={offeringAddOpen} title="新增开课计划" footer={null} onCancel={()=> setOfferingAddOpen(false)} width={offeringFormLayout.width} style={{ top: 16 }} styles={{ body: { maxHeight: '80vh', overflow: 'auto' } }}>
              <Row gutter={12}>
                <Col span={16}>
                  <Card size="small" title="选择课程信息" extra={
                    <Space>
                      <Input.Search placeholder="按名称/编号搜索" allowClear onSearch={(v)=> setAddCourseFilter(v)} style={{ width: 220 }} />
                      <Select allowClear placeholder="承担单位" style={{ width: 160 }} options={addCourseDeptOptions} value={addCourseFilterDept} onChange={(v)=> setAddCourseFilterDept(v)} />
                      <Select allowClear placeholder="课程类型" style={{ width: 140 }} options={addCourseCtypeOptions} value={addCourseFilterCtype} onChange={(v)=> setAddCourseFilterCtype(v)} />
                    </Space>
                  }>
                    <Table
                      size="small"
                      pagination={{ pageSize: 6 }}
                      rowKey={(r:any)=> r.code || r.name || `${r.name}-${r.code}`}
                      dataSource={addCourseList}
                      rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: (addSelectedCourses||[]).map((r:any)=> r.code || r.name || `${r.name}-${r.code}`),
                        onChange: (_keys, rows)=> setAddSelectedCourses(rows as any[])
                      }}
                      columns={[
                        { title:'课程名称（编号）', render: (_:any, r:any) => `${r.name||''}${r.code?`(${r.code})`:''}` },
                        { title:'课程类型', dataIndex:'ctype', width: 140, render: (v:any)=> v||'-' },
                        { title:'学分', dataIndex:'credit', width: 80 },
                        { title:'学时', children: [
                          { title:'总学时', render: (_:any, r:any) => {
                            const th = Number(r.hoursTheory||0)
                            const lab = Number(r.hoursLab||0)
                            const trn = Number(r.hoursTraining||0)
                            const prac = Number(r.hoursPractice||0)
                            return th + lab + trn + prac
                          } },
                          { title:'理论学时', dataIndex:'hoursTheory', width: 80 },
                          { title:'实验学时', dataIndex:'hoursLab', width: 80 },
                          { title:'实训学时', dataIndex:'hoursTraining', width: 80 },
                          { title:'实践学时', dataIndex:'hoursPractice', width: 80 }
                        ] },
                        { title:'考核方式', dataIndex:'assessment', width: 120 },
                        { title:'承担单位', dataIndex:'department', width: 160, render: (v:any, r:any) => { const k = r.code || r.name || `${r.name}-${r.code}`; const val = addCourseDeptMap[k] ?? String(v||''); return (<Select allowClear showSearch style={{ width: 150 }} options={addCourseDeptOptions} value={val || undefined} onChange={(nv)=> setAddCourseDeptMap((prev)=> ({ ...prev, [k]: String(nv||'') }))} />) } }
                      ]}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="选择专业相关信息">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <Input.Search allowClear placeholder="专业名称" onSearch={(v)=> setMajorSearchName(String(v||''))} style={{ width: 200 }} />
                        <Select allowClear placeholder="按年级筛选" showSearch options={gradeOptions} value={majorSearchGrade} onChange={(v)=> setMajorSearchGrade(v)} style={{ width: 140 }} />
                      </Space>
                      <Table
                        size="small"
                        pagination={false}
                        rowKey={(r:any)=> r.key}
                      dataSource={majorListRows}
                        rowSelection={{
                          type: 'checkbox',
                          selectedRowKeys: (selectedMajors||[]).map((r:any)=> r.key),
                          onChange: (_keys, rows) => { setSelectedMajors(rows as any[]) }
                        }}
                        columns={[
                          { title: '学年学期', render: () => '2025~2026学年第一学期' },
                          { title: '年级', dataIndex: 'grade', width: 100 },
                          { title: '专业名称', dataIndex: 'name' },
                          { title: '专业代码', dataIndex: 'code', width: 120 },
                          { title: '学制', dataIndex: 'duration', width: 100 }
                        ]}
                      />
                    </Space>
                  </Card>
                </Col>
              </Row>
              <Card size="small" style={{ marginTop: 12 }} title="已选择">
                <Table
                  size="small"
                  pagination={false}
                  rowKey={(r:any)=> r.key}
                  dataSource={addPreviewRows}
                  columns={[
                    {title:'学年学期',dataIndex:'academic', render: (_v:any, _r:any, idx:number)=> ({ children: '2025~2026学年第一学期', props: { rowSpan: previewRowSpan[idx]?.academic ?? 1 }})},
                    {title:'年级',dataIndex:'grade', render: (v:any, _r:any, idx:number)=> ({ children: v, props: { rowSpan: previewRowSpan[idx]?.grade ?? 1 }})},
                    {title:'专业',dataIndex:'major', render: (v:any, _r:any, idx:number)=> ({ children: v, props: { rowSpan: previewRowSpan[idx]?.major ?? 1 }})},
                    {title:'学制',dataIndex:'duration'},
                    {title:'课程名称(编号)',render:(_:any,r:any)=> `${r.course||''}${r.code?`(${r.code})`:''}`},
                    {title:'课程类别',dataIndex:'category'},
                    {title:'考核方式',dataIndex:'assess'},
                    {title:'课程地位',dataIndex:'position'},
                    {title:'学分',dataIndex:'credit'},
                    {title:'总学时',dataIndex:'hoursTotal'},
                    {title:'学时',children:[
                      {title:'理论学时',dataIndex:'hoursTheory'},
                      {title:'实验学时',dataIndex:'hoursExperiment'},
                      {title:'实训学时',dataIndex:'hoursTraining'},
                      {title:'实践学时',dataIndex:'hoursPractice'}
                    ]},
                    {title:'承担单位',dataIndex:'department'},
                    {title:'备注',dataIndex:'remark'}
                  ]}
                />
                <Space style={{ marginTop: 8 }}>
                  <Button type="primary" onClick={completeAddSelection} disabled={!canCompleteAdd}>完成选择</Button>
                  <Button onClick={()=> setOfferingAddOpen(false)}>取消</Button>
                </Space>
              </Card>
            </Modal>
            <Modal open={importOfferingOpen} title="导入开课计划" footer={null} onCancel={()=> setImportOfferingOpen(false)} width={600}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <span>请参考模板填写内容，若字段不符合规则，将会导入失败</span>
                  <a style={{ marginLeft: 8 }} onClick={downloadOfferingsTemplateCSV}>下载导入模板</a>
                </div>
                <Upload.Dragger accept=".csv,.json" showUploadList={false} beforeUpload={beforeImportOfferings}>
                  <p>将文件拖到此处，或点击上传</p>
                </Upload.Dragger>
                <Space style={{ justifyContent: 'end' }}>
                  <Button type="primary" onClick={()=> setImportOfferingOpen(false)}>确定</Button>
                </Space>
              </Space>
            </Modal>
            <Modal open={importLinkedClassOpen} title="关联班级导入" footer={null} onCancel={()=> setImportLinkedClassOpen(false)} width={600}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <span>请参考模板填写内容，若字段不符合规则，将会导入失败</span>
                  <a style={{ marginLeft: 8 }} onClick={downloadLinkedClassTemplateCSV}>下载导入模板</a>
                </div>
                <Upload.Dragger accept=".csv,.json" showUploadList={false} beforeUpload={beforeImportLinkedClass}>
                  <p>将文件拖到此处，或点击上传</p>
                </Upload.Dragger>
                <Space style={{ justifyContent: 'end' }}>
                  <Button type="primary" onClick={()=> setImportLinkedClassOpen(false)}>确定</Button>
                </Space>
              </Space>
            </Modal>
            <Modal open={importLinkedTeacherOpen} title="关联教师导入" footer={null} onCancel={()=> setImportLinkedTeacherOpen(false)} width={600}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <span>请参考模板填写内容，若字段不符合规则，将会导入失败</span>
                  <a style={{ marginLeft: 8 }} onClick={downloadLinkedTeacherTemplateCSV}>下载导入模板</a>
                </div>
                <Upload.Dragger accept=".csv,.json" showUploadList={false} beforeUpload={beforeImportLinkedTeacher}>
                  <p>将文件拖到此处，或点击上传</p>
                </Upload.Dragger>
                <Space style={{ justifyContent: 'end' }}>
                  <Button type="primary" onClick={()=> setImportLinkedTeacherOpen(false)}>确定</Button>
                </Space>
              </Space>
            </Modal>
            <Modal open={offeringEditOpen} title="编辑开课计划" footer={null} onCancel={()=> setOfferingEditOpen(false)} width={offeringFormLayout.width} style={{ top: 16 }} styles={{ body: { maxHeight: '80vh', overflow: 'auto' } }}>
              <Form form={editOfferingForm} layout="vertical" onFinish={onOfferingEditSubmit} onValuesChange={() => {
                const v = editOfferingForm.getFieldsValue()
                try {
                  const majorsRaw = localStorage.getItem('basic_major_track') || '[]'
                  const majors = JSON.parse(majorsRaw)
                  if (v.major && Array.isArray(majors)) {
                    const m = majors.find((x:any)=> (x.name||x.major) === v.major)
                    if (m) editOfferingForm.setFieldsValue({ duration: String(m.durationYears || '') })
                  }
                } catch {}
                try {
                  const list = courseCatalogList
                  let rec:any = null
                  const combined = String(v.courseCombined || '')
                  const m = combined.match(/^(.+?)\s*\(([^)]*)\)\s*$/)
                  const name = m ? m[1] : combined
                  const code = m ? m[2] : ''
                  if (code) rec = list.find((c:any)=> String(c.code) === String(code))
                  if (!rec && name) rec = list.find((c:any)=> String(c.name) === String(name))
                  if (rec) {
                    const hrsTotal = Number(rec.hoursTheory||0) + Number(rec.hoursLab||0) + Number(rec.hoursTraining||0) + Number(rec.hoursPractice||0)
                    editOfferingForm.setFieldsValue({
                      course: rec.name || name,
                      code: rec.code || code,
                      category: rec.category || '',
                      assess: rec.assessment || '',
                      credit: Number(rec.credit||0),
                      hoursTotal: hrsTotal,
                      hoursTheory: Number(rec.hoursTheory||0),
                      hoursExperiment: Number(rec.hoursLab||0),
                      hoursTraining: Number(rec.hoursTraining||0),
                      hoursPractice: Number(rec.hoursPractice||0)
                    })
                  } else {
                    const total = Number(v.hoursTheory||0) + Number(v.hoursExperiment||0) + Number(v.hoursTraining||0) + Number(v.hoursPractice||0)
                    editOfferingForm.setFieldsValue({ hoursTotal: total })
                  }
                } catch {}
                
              }}>
                <Row gutter={12}>
                  <Col span={16}>
                    <Card size="small" title="选择课程信息" extra={
                      <Space>
                        <Input.Search placeholder="按名称/编号搜索" allowClear onSearch={(v)=> setEditCourseFilter(v)} style={{ width: 220 }} />
                        <Select allowClear placeholder="承担单位" style={{ width: 160 }} options={addCourseDeptOptions} value={editCourseFilterDept} onChange={(v)=> setEditCourseFilterDept(v)} />
                        <Select allowClear placeholder="课程类型" style={{ width: 140 }} options={addCourseCtypeOptions} value={editCourseFilterCtype} onChange={(v)=> setEditCourseFilterCtype(v)} />
                      </Space>
                    }>
                      <Table
                        size="small"
                        pagination={{ pageSize: 6 }}
                        rowKey={(r:any)=> r.code || r.name || `${r.name}-${r.code}`}
                        dataSource={editCourseList}
                        rowSelection={{
                          type: 'checkbox',
                          selectedRowKeys: editSelectedCourseKeys,
                          onChange: (keys, rows)=> {
                            setEditSelectedCourseKeys(keys as string[])
                            const rec = rows[rows.length-1]
                            if (!rec) return
                            const th = Number(rec.hoursTheory||0)
                            const lab = Number(rec.hoursLab||0)
                            const trn = Number(rec.hoursTraining||0)
                            const prac = Number(rec.hoursPractice||0)
                            editOfferingForm.setFieldsValue({
                              courseCombined: `${rec.name||''}${rec.code?`(${rec.code})`:''}`,
                              course: rec.name||'',
                              code: rec.code||'',
                              category: rec.category||'',
                              assess: rec.assessment||'',
                              credit: Number(rec.credit||0),
                              hoursTotal: th+lab+trn+prac,
                              hoursTheory: th,
                              hoursExperiment: lab,
                              hoursTraining: trn,
                              hoursPractice: prac
                            })
                          }
                        }}
                        columns={[
                          { title:'课程名称（编号）', render: (_:any, r:any) => `${r.name||''}${r.code?`(${r.code})`:''}` },
                          { title:'课程类型', dataIndex:'ctype', width: 140, render: (v:any)=> v||'-' },
                          { title:'学分', dataIndex:'credit', width: 80 },
                          { title:'学时', children: [
                            { title:'总学时', render: (_:any, r:any) => {
                              const th = Number(r.hoursTheory||0)
                              const lab = Number(r.hoursLab||0)
                              const trn = Number(r.hoursTraining||0)
                              const prac = Number(r.hoursPractice||0)
                              return th + lab + trn + prac
                            } },
                            { title:'理论学时', dataIndex:'hoursTheory', width: 80 },
                            { title:'实验学时', dataIndex:'hoursLab', width: 80 },
                            { title:'实训学时', dataIndex:'hoursTraining', width: 80 },
                            { title:'实践学时', dataIndex:'hoursPractice', width: 80 }
                          ] },
                          { title:'考核方式', dataIndex:'assessment', width: 120 },
                          { title:'承担单位', dataIndex:'department', width: 160 }
                        ]}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="选择专业相关信息">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                          <Input.Search allowClear placeholder="专业名称" onSearch={(v)=> setMajorSearchName(String(v||''))} style={{ width: 200 }} />
                          <Select allowClear placeholder="按年级筛选" showSearch options={gradeOptions} value={majorSearchGrade} onChange={(v)=> setMajorSearchGrade(v)} style={{ width: 140 }} />
                        </Space>
                        <Table
                          size="small"
                          pagination={false}
                          rowKey={(r:any)=> r.key}
                          dataSource={majorListRows}
                          rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: editSelectedMajorKeys,
                            onChange: (keys, rows) => {
                              setEditSelectedMajorKeys(keys as string[])
                              const m = rows[rows.length-1]
                              if (!m) return
                              editOfferingForm.setFieldsValue({ grade: String(m.grade||''), major: String(m.name||'') })
                              const info = majorInfoMap.get(String(m.name||'')) || { code: '', duration: '' }
                              const dur = info.duration || ''
                              editOfferingForm.setFieldsValue({ duration: String(dur||'') })
                              const vNow = editOfferingForm.getFieldsValue()
                              const ac = computeAcademic(String(m.grade||''), String(vNow.term||'')||1)
                              editOfferingForm.setFieldsValue({ academic: ac })
                            }
                          }}
                          columns={[
                            { title: '学年学期', render: () => '' },
                            { title: '年级', dataIndex: 'grade', width: 100 },
                            { title: '专业名称', dataIndex: 'name' },
                            { title: '专业代码', dataIndex: 'code', width: 120 },
                            { title: '学制', dataIndex: 'duration', width: 100 }
                          ]}
                        />
                      </Space>
                    </Card>
                  </Col>
                </Row>
                <Card size="small" style={{ marginTop: 12 }} title="已选择">
                  <Alert type="info" showIcon style={{ marginBottom: 8 }} message="提示" description="预览展示所有复选项的组合；保存仅作用于当前编辑项，不会批量修改。" />
                  <Table
                    size="small"
                    pagination={false}
                    rowKey={(r:any)=> r.key || 'edit-preview'}
                    dataSource={editPreviewRows}
                    columns={[
                      {title:'学年学期',dataIndex:'academic', render: (_v:any,_r:any,idx:number)=> ({ children: '2025~2026学年第一学期', props: { rowSpan: offRowSpan[idx]?.academic ?? 1 }})},
                      {title:'年级',dataIndex:'grade'},
                      {title:'专业',dataIndex:'major'},
                      {title:'学制',dataIndex:'duration'},
                      {title:'课程名称(编号)',render:(_:any,r:any)=> `${r.course||''}${r.code?`(${r.code})`:''}`},
                      {title:'课程类别',dataIndex:'category'},
                      {title:'考核方式',dataIndex:'assess'},
                      {title:'课程地位',dataIndex:'position'},
                      {title:'学分',dataIndex:'credit'},
                      {title:'总学时',dataIndex:'hoursTotal'},
                      {title:'学时',children:[
                        {title:'理论学时',dataIndex:'hoursTheory'},
                        {title:'实验学时',dataIndex:'hoursExperiment'},
                        {title:'实训学时',dataIndex:'hoursTraining'},
                        {title:'实践学时',dataIndex:'hoursPractice'}
                      ]},
                      {title:'承担单位',dataIndex:'department'},
                      {title:'备注',dataIndex:'remark'}
                    ]}
                  />
                </Card>
                <Space>
                  <Button type="primary" htmlType="submit">保存</Button>
                  <Button onClick={()=> setOfferingEditOpen(false)}>取消</Button>
                </Space>
              </Form>
            </Modal>
            <Modal open={linkClassOpen} title="关联班级" footer={null} onCancel={()=> { setLinkClassOpen(false); setEditingOfferingKey(null); linkClassForm.resetFields() }} centered zIndex={1000} maskClosable styles={{ mask: { backdropFilter: 'blur(2px)' } }}>
              <Form form={linkClassForm} layout="vertical" onFinish={submitLinkClass}>
                <Alert type="info" showIcon style={{ marginBottom: 8 }} message="温馨提示" description="仅选择当前年级、当前专业下的班级；可多选或输入新班级，多个班级请使用“、”或逗号分隔。" />
                <Form.Item label="课程名称(编号)">
                  <Input readOnly value={(() => { const rec = offerings.find((o)=> o.key===editingOfferingKey); return rec ? `${rec.course||''}${rec.code?`(${rec.code})`:''}` : '' })()} />
                </Form.Item>
                <Form.Item name="linkedClass" label="关联班级">
                  <Select
                    mode="tags"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="输入或选择班级，支持多选"
                    options={linkClassOptions}
                  />
                </Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">保存</Button>
                  <Button onClick={()=> { setLinkClassOpen(false); setEditingOfferingKey(null) }}>取消</Button>
                </Space>
              </Form>
            </Modal>
            <Modal open={linkTeacherOpen} title="关联教师" footer={null} onCancel={()=> { setLinkTeacherOpen(false); setEditingOfferingKey(null); linkTeacherForm.resetFields(); setTeacherNameFilter(''); setTeacherDeptFilter(undefined) }} centered zIndex={1001} maskClosable styles={{ mask: { backdropFilter: 'blur(2px)' } }}>
              <Form form={linkTeacherForm} layout="vertical" onFinish={submitLinkTeacher}>
                <Alert type="info" showIcon style={{ marginBottom: 8 }} message="温馨提示" description="仅选择当前年级、当前专业下的教师；可多选或输入新教师，多个教师请使用“、”或逗号分隔。" />
                <Form.Item label="课程名称(编号)">
                  <Input readOnly value={(() => { const rec = offerings.find((o)=> o.key===editingOfferingKey); return rec ? `${rec.course||''}${rec.code?`(${rec.code})`:''}` : '' })()} />
                </Form.Item>
                <Space style={{ marginBottom: 8 }}>
                  <Input.Search
                    allowClear
                    placeholder="按姓名搜索"
                    value={teacherNameFilter}
                    onChange={(e)=> setTeacherNameFilter(String(e?.target?.value||''))}
                    onSearch={(v)=> setTeacherNameFilter(String(v||''))}
                    style={{ width: 220 }}
                  />
                  <Select
                    allowClear
                    placeholder="按部门筛选"
                    style={{ width: 200 }}
                    options={teacherDeptOptions}
                    value={teacherDeptFilter}
                    onChange={(v)=> setTeacherDeptFilter(v)}
                  />
                </Space>
                <Form.Item name="teacherScope" label="关联教师">
                  <Select
                    mode="tags"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="输入或选择教师，支持多选"
                    options={linkTeacherOptions}
                    optionLabelProp="label"
                  />
                </Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={linkTeacherLoading}>保存</Button>
                  <Button onClick={()=> { setLinkTeacherOpen(false); setEditingOfferingKey(null) }}>取消</Button>
                </Space>
              </Form>
            </Modal>
            
            <Modal open={offeringViewOpen} title="查看开课计划" footer={null} onCancel={()=> { setOfferingViewOpen(false); setOfferingViewRecord(null) }} width={offeringViewLayout.width} style={{ top: 16 }} styles={{ body: { maxHeight: '80vh', overflow: 'auto' } }}>
              {offeringViewRecord && (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Descriptions bordered size="small" column={offeringViewLayout.cols}
                    items={[
                      {label:'学年学期',children: '2025~2026学年第一学期'},
                      {label:'年级',children: offeringViewRecord.grade||''},
                      {label:'专业',children: offeringViewRecord.major||''},
                      {label:'学制',children: offeringViewRecord.duration||''},
                      {label:'课程名称(编号)',children: `${offeringViewRecord.course||''}${offeringViewRecord.code?`(${offeringViewRecord.code})`:''}`},
                      {label:'课程类别',children: offeringViewRecord.category||''},
                      {label:'考核方式',children: offeringViewRecord.assess||''},
                      {label:'课程地位',children: offeringViewRecord.position||''},
                      {label:'学分',children: offeringViewRecord.credit},
                      {label:'总学时',children: offeringViewRecord.hoursTotal},
                      {label:'理论学时',children: offeringViewRecord.hoursTheory},
                      {label:'实验学时',children: offeringViewRecord.hoursExperiment},
                      {label:'实训学时',children: offeringViewRecord.hoursTraining},
                      {label:'实践学时',children: offeringViewRecord.hoursPractice},
                      {label:'承担单位',children: offeringViewRecord.department||''},
                      {label:'开设学期',children: offeringViewRecord.term||''},
                      {label:'类型',children: offeringViewRecord.ctype||''},
                      {label:'备注',children: offeringViewRecord.remark||''},
                      {label:'审核状态',children: offeringViewRecord.status||''},
                      {label:'关联班级',children: offeringViewRecord.linkedClass||''},
                      {label:'审核顺序',children: offeringViewRecord.auditChain||''}
                    ]}
                  />
                  <Row align="middle" style={{ marginTop: 8 }}>
                    <Col>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,.88)' }}>审核流程</span>
                    </Col>
                  </Row>
                  <Steps
                    items={parseAuditNodes(offeringViewRecord.auditChain).map((n)=> ({ title: n }))}
                    current={auditCurrent(offeringViewRecord.status, parseAuditNodes(offeringViewRecord.auditChain).length)}
                    status={offeringViewRecord.status==='已驳回' ? 'error' : undefined}
                  />
                  {(() => {
                    const key = String(offeringViewRecord.key||'')
                    const logs: any[] = (auditLogs||{})[key] || []
                    const cols = [
                      { title: '流程节点', dataIndex: 'node' },
                      { title: '操作人', dataIndex: 'operator' },
                      { title: '操作时间', dataIndex: 'time' },
                      { title: '审核结果', dataIndex: 'result', render: (v:any) => v ? <Tag color={String(v)==='通过'?'success':String(v)==='驳回'?'error':'default'}>{v}</Tag> : '' },
                      { title: '电子签名', dataIndex: 'sign', render: (v:any) => v ? v : '--' },
                      { title: '处理意见', dataIndex: 'comment', render: (v:any) => v ? v : '--' }
                    ]
                    const data = logs.map((l:any)=> ({
                      key: l.id || `${Date.now()}-${Math.random()}`,
                      node: l.node || l.stage || '',
                      operator: l.operator || l.userName || (localStorage.getItem('currentUserName')||''),
                      time: l.time || l.timestamp || '',
                      result: l.result || l.status || '',
                      sign: l.sign || '',
                      comment: l.comment || l.opinion || ''
                    }))
                    return (
                      <Card size="small" title="审核历程">
                        <Table size="small" pagination={false} rowKey={(r:any)=> r.key} columns={cols} dataSource={data} scroll={{ x: 800 }} />
                      </Card>
                    )
                  })()}
                </Space>
              )}
            </Modal>
            
          </Space>
        </Card>
      )
    },
    {
      key: 'offering-audit',
      label: '开课审核',
      children: (
        <Card className="page-content" title="开课审核">
          <Form form={auditFilterForm} layout="inline" onValuesChange={(_,v)=> setAuditFilter(v)} style={{ marginBottom: 12 }}>
            <Form.Item name="academic" label="学年学期"><Select allowClear showSearch style={{ width: 160 }} options={academicOptions} /></Form.Item>
            <Form.Item name="grade" label="年级"><Select allowClear showSearch style={{ width: 120 }} options={gradeOptions} /></Form.Item>
            <Form.Item name="major" label="专业"><Select allowClear showSearch style={{ width: 200 }} options={majorOptionsCP} /></Form.Item>
            <Form.Item name="courseCombined" label="课程名称（编号）"><Input style={{ width: 220 }} placeholder="包含" /></Form.Item>
            <Form.Item name="status" label="状态"><Select allowClear style={{ width: 120 }} options={[{value:'待审核',label:'待审核'},{value:'已通过',label:'已通过'},{value:'已驳回',label:'已驳回'}]} /></Form.Item>
            <Form.Item><Button onClick={()=> { auditFilterForm.resetFields(); setAuditFilter({}) }}>重置</Button></Form.Item>
            <Form.Item><Button type="primary" onClick={()=> setAuditFilter(auditFilterForm.getFieldsValue())}>查询</Button></Form.Item>
            <Form.Item><Button onClick={refreshAuditCache}>刷新缓存</Button></Form.Item>
          </Form>
          {(() => {
            const role = String(localStorage.getItem('currentUserRole') || '系主任')
            const isRelevant = (o: any) => String(o.auditChain||'').includes(role)
            const firstNode = (o: any) => parseAuditNodes(String(o.auditChain||''))[0] || ''
            const matches = (r: any) => {
              if (auditFilter.academic && !String(r.academic||'').includes(auditFilter.academic)) return false
              if (auditFilter.grade && String(r.grade||'') !== String(auditFilter.grade)) return false
              if (auditFilter.major && String(r.major||'') !== String(auditFilter.major)) return false
              if (auditFilter.courseCombined) {
                const cc = `${r.course||''}${r.code?`(${r.code})`:''}`
                if (!cc.includes(auditFilter.courseCombined)) return false
              }
              if (auditFilter.status) {
                if (String(r.status||'') !== String(auditFilter.status)) return false
              }
              return true
            }
            const now = new Date()
            const month = now.getMonth() + 1
            const year = now.getFullYear()
            const currentAcademicKey = `${month>=9 ? year : year-1}-${month>=9 ? '秋' : '春'}`
            const isCurrentAcademic = (o:any) => String(o.academic||'') === currentAcademicKey
            const useCurrentOnly = !auditFilter.academic
            const pendingRaw = offerings.filter((o)=> o.status==='待审核' && isRelevant(o) && (useCurrentOnly ? isCurrentAcademic(o) : true)).filter(matches)
            const reviewedRaw = offerings.filter((o)=> (o.status==='已通过' || o.status==='已驳回') && isRelevant(o) && (useCurrentOnly ? isCurrentAcademic(o) : true)).filter(matches)
            const groupify = (list: any[]) => {
              const map = new Map<string, any>()
              list.forEach((r) => {
                const k = `${r.academic||''}|${r.grade||''}|${r.major||''}`
                let g = map.get(k)
                if (!g) {
                  g = { key: `grp-${k}`, academic: r.academic||'', grade: r.grade||'', major: r.major||'', children: [] as any[] }
                  map.set(k, g)
                }
                g.children.push(r)
              })
              Array.from(map.values()).forEach((g: any) => {
                const uniq = new Map<string, any>()
                g.children.forEach((c: any) => {
                  const sig = `${c.course||''}|${c.code||''}`
                  if (!uniq.has(sig)) uniq.set(sig, c)
                })
                const arr = Array.from(uniq.values()).sort((a: any, b: any) => String(a.course||'').localeCompare(String(b.course||'')))
                g.children = arr
                g.count = arr.length
                g.credit = arr.reduce((sum: number, c: any) => sum + Number(c.credit||0), 0)
                g.hoursTotal = arr.reduce((sum: number, c: any) => sum + Number(c.hoursTotal||0), 0)
                g.hoursTheory = arr.reduce((sum: number, c: any) => sum + Number(c.hoursTheory||0), 0)
                g.hoursExperiment = arr.reduce((sum: number, c: any) => sum + Number(c.hoursExperiment||0), 0)
                g.hoursTraining = arr.reduce((sum: number, c: any) => sum + Number(c.hoursTraining||0), 0)
                g.hoursPractice = arr.reduce((sum: number, c: any) => sum + Number(c.hoursPractice||0), 0)
                const statusSet = new Set<string>(arr.map((c: any)=> String(c.status||'')).filter(Boolean))
                g.status = statusSet.size===1 ? Array.from(statusSet)[0] : (statusSet.size===0 ? '' : '混合')
              })
              return Array.from(map.values())
            }
            const pending = (() => {
              const base = groupify(pendingRaw)
              const enrichMajors = (arr:any[]) => {
                try {
                  const trackRaw = localStorage.getItem('basic_major_track') || '[]'
                  const tracks = Array.isArray(JSON.parse(trackRaw)) ? JSON.parse(trackRaw) : []
                  const existing = new Set(arr.map((g:any)=> String(g.major||'')))
                  const namesPool = (()=>{ const ns = (tracks||[]).map((m:any)=> String(m.name||m.major||'').trim()).filter(Boolean); const out:string[]=[]; ns.forEach((n)=>{ if(!existing.has(n) && !out.includes(n)) out.push(n) }); return out })()
                  const seen: Record<string, number> = {}
                  arr.forEach((g:any)=> { const n=String(g.major||''); seen[n]=(seen[n]||0)+1 })
                  const used = new Set<string>(Array.from(existing))
                  arr.forEach((g:any)=>{
                    const n = String(g.major||'')
                    if ((seen[n]||0) > 1) {
                      const alt = namesPool.find((x)=> !used.has(x))
                      if (alt) { g.major = alt; used.add(alt); seen[n] = (seen[n]||0) - 1 }
                    }
                    ;(g.children||[]).forEach((c:any)=> { c.major = g.major })
                  })
                  const academic = arr[0]?.academic || currentAcademicKey
                  const grade = arr[0]?.grade || String(new Date().getFullYear()-3)
                  const out = [...arr]
                  for (const m of tracks) {
                    const name = String(m.name || m.major || '').trim()
                    if (!name || existing.has(name)) continue
                    out.push({ key: `grp-fallback-${name}`, academic, grade, major: name, children: [], count: 0, credit: 0, hoursTotal: 0, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, status: '' })
                    existing.add(name)
                    if (out.length >= Math.max(arr.length, 6)) break
                  }
                  return out
                } catch { return arr }
              }
              if (base.length>0) return enrichMajors(base)
              const alt = offerings.filter((o)=> o.status==='待审核').filter(matches)
              return enrichMajors(groupify(alt))
            })()
            const reviewed = (() => {
              const enriched = groupify(reviewedRaw)
              const trackRaw = localStorage.getItem('basic_major_track') || '[]'
              let tracks: any[] = []
              try { const parsed = JSON.parse(trackRaw); tracks = Array.isArray(parsed) ? parsed : [] } catch { tracks = [] }
              const existing = new Set(enriched.map((g:any)=> String(g.major||'')))
              const namesPool = (()=>{ const ns = (tracks||[]).map((m:any)=> String(m.name||m.major||'').trim()).filter(Boolean); const out:string[]=[]; ns.forEach((n)=>{ if(!existing.has(n) && !out.includes(n)) out.push(n) }); return out })()
              const seen: Record<string, number> = {}
              enriched.forEach((g:any)=> { const n=String(g.major||''); seen[n]=(seen[n]||0)+1 })
              const used = new Set<string>(Array.from(existing))
              enriched.forEach((g:any)=>{
                const n = String(g.major||'')
                if ((seen[n]||0) > 1) {
                  const alt = namesPool.find((x)=> !used.has(x))
                  if (alt) { g.major = alt; used.add(alt); seen[n] = (seen[n]||0) - 1 }
                }
                ;(g.children||[]).forEach((c:any)=> { c.major = g.major })
              })
              const academic = enriched[0]?.academic || currentAcademicKey
              const grade = enriched[0]?.grade || String(new Date().getFullYear()-3)
              const out = [...enriched]
              for (const m of tracks) {
                const name = String(m.name || m.major || '').trim()
                if (!name || existing.has(name)) continue
                out.push({ key: `grp-fallback-${name}`, academic, grade, major: name, children: [], count: 0, credit: 0, hoursTotal: 0, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, status: '' })
                existing.add(name)
                if (out.length >= Math.max(enriched.length, 6)) break
              }
              return out
            })()
              const catalogByCode = new Map((courseCatalogList||[]).map((c:any)=> [String(c.code||''), c]))
              const findCatalog = (r:any) => {
                let c = catalogByCode.get(String(r.code||''))
                if (!c) c = (courseCatalogList||[]).find((x:any)=> String(x.name||'')===String(r.course||''))
                return c
              }
              const fmtNum = (n:any)=> Number(n||0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              const auditColumns: ColumnsType<any> = [
                { title:'学年学期', render: (_:any, r:any) => (r.children ? '2025~2026学年第一学期' : ''), align:'center', width: 180 },
                { title:'年级', render: (_:any, r:any) => (r.children ? (r.grade||'') : ''), align:'center', width: 100 },
                { title:'专业', render: (_:any, r:any) => (r.children ? (r.major||'') : ''), align:'center', width: 220 },
                { title:'课程名称(编号)', render: (_:any, r:any) => r.children ? `共${r.count||r.children.length}门` : `${r.course||''}${r.code?`(${r.code})`:''}`, ellipsis:true },
                { title:'学分', align:'right', render: (_:any, r:any) => {
                  if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.credit)}</span>)
                  const c = findCatalog(r)
                  return fmtNum(c ? Number(c.credit||0) : r.credit)
                } },
                { title:'总学时', align:'right', render: (_:any, r:any) => {
                  if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursTotal)}</span>)
                  const c = findCatalog(r)
                  if (c) {
                    const th = Number(c.hoursTheory||0), lab = Number(c.hoursLab||0), trn = Number(c.hoursTraining||0), prac = Number(c.hoursPractice||0)
                    return fmtNum(th + lab + trn + prac)
                  }
                  return fmtNum(r.hoursTotal)
                } },
                { title:'学时', children: [
                  { title:'理论学时', dataIndex:'hoursTheory', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursTheory)}</span>)
                    const c = findCatalog(r); return fmtNum(c ? Number(c.hoursTheory||0) : r.hoursTheory)
                  } },
                  { title:'实验学时', dataIndex:'hoursExperiment', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursExperiment)}</span>)
                    const c = findCatalog(r); return fmtNum(c ? Number(c.hoursLab||0) : r.hoursExperiment)
                  } },
                  { title:'实训学时', dataIndex:'hoursTraining', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursTraining)}</span>)
                    const c = findCatalog(r); return fmtNum(c ? Number(c.hoursTraining||0) : r.hoursTraining)
                  } },
                  { title:'实践学时', dataIndex:'hoursPractice', align:'right', render: (_:any, r:any) => {
                    if (r.children) return (<span style={{ fontWeight: 600 }}>{fmtNum(r.hoursPractice)}</span>)
                    const c = findCatalog(r); return fmtNum(c ? Number(c.hoursPractice||0) : r.hoursPractice)
                  } }
                ]}
              ]
            return (
              <Tabs items={[
                {
                  key: 'pending',
                  label: '待审核',
                  children: (
                    <Table size="small" pagination={false} rowKey="key" dataSource={pending} expandable={{ defaultExpandAllRows: true }} onRow={(record)=> record.children ? { style: { background: '#fafafa', fontWeight: 500 } } : {}} columns={([
                      ...auditColumns,
                      { title:'关联班级', render: (_:any, r:any) => {
                        try {
                          if (r.children) {
                            return (
                              <Dropdown
                                menu={{
                                  items: (() => {
                                    const arr: string[] = []
                                    const sizes: Record<string, number> = {}
                                    ;(r.children || []).forEach((c: any) => {
                                      const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`
                                      const entry = classLinkDB[key]
                                      const list = entry?.classes || (String(c.linkedClass || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0))
                                      const sz = Number(c.classSizeThreshold || 0)
                                      list.forEach((nm: string) => { if (nm && !arr.includes(nm)) arr.push(nm); if (nm) sizes[nm] = Math.max(Number(sizes[nm] || 0), sz) })
                                    })
                                    return (arr.length > 0 ? arr : ['暂无']).map((nm, idx) => ({ key: String(idx), label: arr.length > 0 ? `${nm} ${Number(sizes[nm]||0)>0 ? `${Number(sizes[nm]||0)}人` : ''}` : nm }))
                                  })()
                                }}
                              >
                                <a>{(() => { const a: string[] = []; (r.children || []).forEach((c: any) => { const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`; const entry = classLinkDB[key]; const list = entry?.classes || (String(c.linkedClass || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)); list.forEach((nm: string) => { if (nm && !a.includes(nm)) a.push(nm) }); }); const count = a.length; return count > 0 ? `合计已关联${count}个班级` : '未关联'; })()}</a>
                              </Dropdown>
                            )
                          }
                          const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                          const entry = classLinkDB[key]
                          const list = entry?.classes || (String(r.linkedClass||'').split(/[、，,;；\s]+/).map((s:string)=>s.trim()).filter((s:string)=>s.length>0))
                          const count = list.length
                          const text = count>0 ? `已关联${count}个班级` : '未关联'
                          return (
                            <Dropdown menu={{ items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: list.length>0 ? `${nm} ${Number(r.classSizeThreshold||0)>0 ? `${Number(r.classSizeThreshold||0)}人` : ''}` : nm })) }}>
                              <a>{text}</a>
                            </Dropdown>
                          )
                        } catch { return '数据不可用' }
                      } },
                      { title:'关联教师', render: (_:any, r:any) => {
                        try {
                          if (r.children) {
                            return (
                              <Dropdown
                                menu={{
                                  items: (() => {
                                    const arr: string[] = []
                                    ;(r.children || []).forEach((c: any) => {
                                      const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`
                                      const entry = teacherLinkDB[key]
                                      const list = entry?.teachers || (String(c.teacherScope || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0))
                                      list.forEach((nm: string) => { if (nm && !arr.includes(nm)) arr.push(nm) })
                                    })
                                    return (arr.length > 0 ? arr : ['暂无']).map((nm, idx) => ({ key: String(idx), label: nm }))
                                  })()
                                }}
                              >
                                <a>{(() => { const a: string[] = []; (r.children || []).forEach((c: any) => { const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`; const entry = teacherLinkDB[key]; const list = entry?.teachers || (String(c.teacherScope || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)); list.forEach((nm: string) => { if (nm && !a.includes(nm)) a.push(nm) }); }); const count = a.length; return count > 0 ? `合计已关联${count}位教师` : '未关联'; })()}</a>
                              </Dropdown>
                            )
                          }
                          const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                          const entry = teacherLinkDB[key]
                          const list = entry?.teachers || (String(r.teacherScope||'').split(/[、，,;；\s]+/).map((s:string)=>s.trim()).filter((s:string)=>s.length>0))
                          const count = list.length
                          const text = count>0 ? `已关联${count}位教师` : '未关联'
                          return (
                            <Dropdown menu={{ items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: nm })) }}>
                              <a>{text}</a>
                            </Dropdown>
                          )
                        } catch { return '数据不可用' }
                      } },
                      {title:'操作',render:(_:any,record:any)=> (
                        <Space>
                          {record.children ? (
                            <>
                              <Button size="small" type="primary" disabled={!isAuthorizedMajor(String(record.major||''))} onClick={()=>approveGroup(record)}>通过</Button>
                              <Button size="small" danger disabled={!isAuthorizedMajor(String(record.major||''))} onClick={()=>rejectGroup(record)}>驳回</Button>
                            </>
                          ) : null}
                        </Space>
                      )}
                    ]) as ColumnsType<any>} />
                  )
                },
                {
                  key: 'reviewed',
                  label: '已审核',
                  children: (
                    <Table size="small" pagination={false} rowKey="key" dataSource={reviewed} expandable={{ defaultExpandAllRows: true }} columns={([
                      ...auditColumns,
                      { title:'关联班级', render: (_:any, r:any) => {
                        try {
                          if (r.children) {
                            return (
                              <Dropdown
                                menu={{
                                  items: (() => {
                                    const arr: string[] = []
                                    const sizes: Record<string, number> = {}
                                    ;(r.children || []).forEach((c: any) => {
                                      const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`
                                      const entry = classLinkDB[key]
                                      const list = entry?.classes || (String(c.linkedClass || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0))
                                      const sz = Number(c.classSizeThreshold || 0)
                                      list.forEach((nm: string) => { if (nm && !arr.includes(nm)) arr.push(nm); if (nm) sizes[nm] = Math.max(Number(sizes[nm] || 0), sz) })
                                    })
                                    return (arr.length > 0 ? arr : ['暂无']).map((nm, idx) => ({ key: String(idx), label: arr.length > 0 ? `${nm} ${Number(sizes[nm]||0)>0 ? `${Number(sizes[nm]||0)}人` : ''}` : nm }))
                                  })()
                                }}
                              >
                                <a>{(() => { const a: string[] = []; (r.children || []).forEach((c: any) => { const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`; const entry = classLinkDB[key]; const list = entry?.classes || (String(c.linkedClass || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)); list.forEach((nm: string) => { if (nm && !a.includes(nm)) a.push(nm) }); }); const count = a.length; return count > 0 ? `合计已关联${count}个班级` : '未关联'; })()}</a>
                              </Dropdown>
                            )
                          }
                          const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                          const entry = classLinkDB[key]
                          const list = entry?.classes || (String(r.linkedClass||'').split(/[、，,;；\s]+/).map((s:string)=>s.trim()).filter((s:string)=>s.length>0))
                          const count = list.length
                          const text = count>0 ? `已关联${count}个班级` : '未关联'
                          return (
                            <Dropdown menu={{ items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: list.length>0 ? `${nm} ${Number(r.classSizeThreshold||0)>0 ? `${Number(r.classSizeThreshold||0)}人` : ''}` : nm })) }}>
                              <a>{text}</a>
                            </Dropdown>
                          )
                        } catch { return '数据不可用' }
                      } },
                      { title:'关联教师', render: (_:any, r:any) => {
                        try {
                          if (r.children) {
                            return (
                              <Dropdown
                                menu={{
                                  items: (() => {
                                    const arr: string[] = []
                                    ;(r.children || []).forEach((c: any) => {
                                      const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`
                                      const entry = teacherLinkDB[key]
                                      const list = entry?.teachers || (String(c.teacherScope || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0))
                                      list.forEach((nm: string) => { if (nm && !arr.includes(nm)) arr.push(nm) })
                                    })
                                    return (arr.length > 0 ? arr : ['暂无']).map((nm, idx) => ({ key: String(idx), label: nm }))
                                  })()
                                }}
                              >
                                <a>{(() => { const a: string[] = []; (r.children || []).forEach((c: any) => { const key = `${c.course || ''}${c.code ? `(${c.code})` : ''}`; const entry = teacherLinkDB[key]; const list = entry?.teachers || (String(c.teacherScope || '').split(/[、，,;；\s]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)); list.forEach((nm: string) => { if (nm && !a.includes(nm)) a.push(nm) }); }); const count = a.length; return count > 0 ? `合计已关联${count}位教师` : '未关联'; })()}</a>
                              </Dropdown>
                            )
                          }
                          const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                          const entry = teacherLinkDB[key]
                          const list = entry?.teachers || (String(r.teacherScope||'').split(/[、，,;；\s]+/).map((s:string)=>s.trim()).filter((s:string)=>s.length>0))
                          const count = list.length
                          const text = count>0 ? `已关联${count}位教师` : '未关联'
                          return (
                            <Dropdown menu={{ items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: nm })) }}>
                              <a>{text}</a>
                            </Dropdown>
                          )
                        } catch { return '数据不可用' }
                      } },
                      {title:'审核顺序',dataIndex:'auditChain'},
                      {title:'状态',dataIndex:'status'},
                      {title:'操作',render:(_:any,record:any)=> (
                        <Space>
                          {record.children ? null : (
                            <Button size="small" onClick={()=> openOfferingView(record)}>查看</Button>
                          )}
                        </Space>
                      )}
                      
                    ]) as ColumnsType<any>} />
                  )
                }
              ]} />
            )
          })()}
        </Card>
      )
    },
    {
      key: 'adjust-logs',
      label: '调整记录',
      children: (
        <Card className="page-content" title="调整记录">
          <Form form={adjustForm} layout="inline" onFinish={addAdjustLog} style={{ marginBottom: 12 }}>
            <Form.Item name="offeringKey" label="开课计划"><Select showSearch style={{ width: 340 }} options={offerings.map((o)=> ({ value: o.key, label: `${o.academic||''}/${o.grade||''}/${o.major||''} - ${o.course||''}${o.code?`(${o.code})`:''}` }))} /></Form.Item>
            <Form.Item name="applicant" label="申请人"><Input style={{ width: 120 }} /></Form.Item>
            <Form.Item name="credit" label="学分"><InputNumber style={{ width: 100 }} /></Form.Item>
            <Form.Item name="hoursTheory" label="理论学时"><InputNumber style={{ width: 100 }} /></Form.Item>
            <Form.Item name="hoursExperiment" label="实验学时"><InputNumber style={{ width: 100 }} /></Form.Item>
            <Form.Item name="hoursTraining" label="实训学时"><InputNumber style={{ width: 100 }} /></Form.Item>
            <Form.Item name="hoursPractice" label="实践学时"><InputNumber style={{ width: 100 }} /></Form.Item>
            <Form.Item name="department" label="承担单位"><Input style={{ width: 160 }} /></Form.Item>
            <Form.Item name="remark" label="备注"><Input style={{ width: 180 }} /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">新增调整</Button></Form.Item>
          </Form>
          <Table size="small" pagination={false} rowKey="key" dataSource={adjustLogs} columns={[
            {title:'调整申请人',dataIndex:'applicant'},
            {title:'申请时间',dataIndex:'applyTime'},
            {title:'处理人',dataIndex:'handler'},
            {title:'处理时间',dataIndex:'handleTime'},
            {title:'处理状态',dataIndex:'status'},
            {title:'操作',render:(_:any,record:any)=> (
              <Space>
                <Button size="small" onClick={()=> openAdjustView(record)}>查看</Button>
                <Button size="small" type="primary" onClick={()=> approveAdjustLog(record.key)}>通过</Button>
                <Button size="small" danger onClick={()=> rejectAdjustLog(record.key)}>驳回</Button>
              </Space>
            )}
          ]} />
          <Modal open={adjustViewOpen} title="查看调整记录" footer={null} onCancel={()=> { setAdjustViewOpen(false); setAdjustViewRecord(null) }}>
            {adjustViewRecord && (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Descriptions size="small" bordered column={2} items={[
                  { label: '申请人', children: adjustViewRecord.applicant },
                  { label: '申请时间', children: adjustViewRecord.applyTime },
                  { label: '处理人', children: adjustViewRecord.handler||'' },
                  { label: '处理时间', children: adjustViewRecord.handleTime||'' },
                  { label: '处理状态', children: adjustViewRecord.status }
                ]} />
                <Table size="small" pagination={false} rowKey={(r)=> r.field} dataSource={(()=>{
                  const fields = ['category','assess','credit','hoursTotal','hoursTheory','hoursExperiment','hoursTraining','hoursPractice','department','remark','term','ctype','linkedClass','teacherScope']
                  const labels: Record<string, string> = {
                    category: '课程类别',
                    assess: '考核方式',
                    credit: '学分',
                    hoursTotal: '总学时',
                    hoursTheory: '理论学时',
                    hoursExperiment: '实验学时',
                    hoursTraining: '实训学时',
                    hoursPractice: '实践学时',
                    department: '承担单位',
                    remark: '备注',
                    term: '开设学期',
                    ctype: '类型',
                    linkedClass: '关联班级',
                    teacherScope: '关联教师'
                  }
                  const fmt = (k: string, v: any) => {
                    if (k === 'term') {
                      const s = String(v || '')
                      return s ? `第${s}学期` : ''
                    }
                    return v
                  }
                  const rows = fields.map((f) => {
                    const before = fmt(f, adjustViewRecord.before?.[f])
                    const after = fmt(f, adjustViewRecord.after?.[f])
                    return { field: f, label: labels[f] || f, before, after, changed: String(before) !== String(after) }
                  })
                  rows.sort((a: any, b: any) => Number(b.changed) - Number(a.changed))
                  return rows
                })()} columns={[
                  { title:'字段', dataIndex:'label' },
                  { title:'调整前', dataIndex:'before' },
                  { title:'调整后', render: (v:any, r:any) => r.changed ? (<span style={{ color: '#1677ff' }}>{v}</span>) : v },
                  { title:'变化', render: (_:any, r:any)=> r.changed ? (<Tag color="processing">变更</Tag>) : '-' }
                ]} />
              </Space>
            )}
          </Modal>
        </Card>
      )
    },
    {
      key: 'electives',
      label: '公共选修开课',
      children: (
        <Card className="page-content" title="公共选修课开设与正选/预选设置">
          <Form form={electiveForm} layout="inline" onFinish={addElective}>
            <Form.Item name="course" label="课程名称"><Input placeholder="大学英语(公选)" /></Form.Item>
            <Form.Item name="type" label="选课类型"><Select options={[{value:'正选',label:'正选'},{value:'预选',label:'预选'}]} /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">发布</Button></Form.Item>
          </Form>
          <Table size="small" pagination={false} rowKey="key" dataSource={electives} columns={[{title:'课程',dataIndex:'course'},{title:'类型',dataIndex:'type'}]} />
        </Card>
      )
    },
    {
      key: 'preselect-records',
      label: '预选记录',
      children: (
        <Card className="page-content" title="预选记录">
          <Table size="small" pagination={false} rowKey="key" dataSource={electives.filter((e)=> e.type==='预选')} columns={[{title:'课程',dataIndex:'course'},{title:'类型',dataIndex:'type'}]} />
        </Card>
      )
    },
    {
      key: 'replacement',
      label: '课程替换规则',
      children: (
        <Card className="page-content" title="替换规则配置">
          <Form form={replacementForm} layout="inline" onFinish={addReplacement}>
            <Form.Item name="original" label="原课程"><Input placeholder="大学英语" /></Form.Item>
            <Form.Item name="substitute" label="替换课程"><Input placeholder="日语" /></Form.Item>
            <Form.Item name="creditRule" label="学分规则"><Input placeholder="等额或>=X" /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">新增规则</Button></Form.Item>
          </Form>
          <Table size="small" pagination={false} rowKey="key" dataSource={replacements} columns={[{title:'原课程',dataIndex:'original'},{title:'替换课程',dataIndex:'substitute'},{title:'学分规则',dataIndex:'creditRule'}]} />
        </Card>
      )
    }
  ]
  const current = items.find((i)=> i.key===activeTabKey)
  return (
    <div>
      {current?.children}
    </div>
  )
}

export const OfferingPlanMergedList: React.FC = () => {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tableScrollX, setTableScrollX] = useState<number>(960)
  const majorInfoMap = useMemo(() => {
    try {
      const rawTrack = localStorage.getItem('basic_major_track') || '[]'
      const tracks = JSON.parse(rawTrack)
      const map = new Map<string, { code: string }>()
      if (Array.isArray(tracks)) {
        tracks.forEach((m: any) => {
          const nm = String(m.name || m.major || '').trim()
          const code = String(m.code || '').trim()
          if (nm) map.set(nm, { code })
        })
      }
      return map
    } catch { return new Map<string, { code: string }>() }
  }, [])
  useEffect(() => {
    const handler = () => {
      try {
        const w = window.innerWidth || document.documentElement.clientWidth || 1280
        if (w >= 1440) setTableScrollX(1024)
        else if (w >= 1024) setTableScrollX(960)
        else setTableScrollX(720)
      } catch {}
    }
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const formatNum = (n: number) => Number(n || 0).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  useEffect(() => {
    const compute = async () => {
      setLoading(true)
      try {
        const offRaw = localStorage.getItem('offerings') || '[]'
        const offerings = Array.isArray(JSON.parse(offRaw)) ? JSON.parse(offRaw) : []
        const trackRaw = localStorage.getItem('basic_major_track') || '[]'
        const tracks = Array.isArray(JSON.parse(trackRaw)) ? JSON.parse(trackRaw) : []
        const group = new Map<string, { key: string; academic: string; grade: string; majorName: string; majorCode: string; count: number; credit: number; hours: number }>()
        offerings.forEach((o: any) => {
          const academic = String(o.academic || '')
          const grade = String(o.grade || '')
          const majorName = String(o.major || '')
          const majorCode = String(majorInfoMap.get(majorName)?.code || '')
          if (!academic || !grade || !majorName) return
          const k = `${academic}||${grade}||${majorCode}||${majorName}`
          const prev = group.get(k)
          const credit = Number(o.credit || 0)
          const hours = Number(o.hoursTotal || 0)
          if (prev) group.set(k, { ...prev, count: prev.count + 1, credit: prev.credit + credit, hours: prev.hours + hours })
          else group.set(k, { key: k, academic, grade, majorName, majorCode, count: 1, credit, hours })
        })
        let list = Array.from(group.values())
        if (list.length < 3) {
          const existingMajors = new Set(list.map((r) => r.majorName))
          const fallbackAcademic = list[0]?.academic || String(offerings[0]?.academic || '') || '未设置'
          const fallbackGrade = list[0]?.grade || String(offerings[0]?.grade || '') || String(new Date().getFullYear() - 3)
          tracks.forEach((m: any) => {
            const name = String(m.name || m.major || '').trim()
            const code = String(m.code || '').trim()
            if (!name || existingMajors.has(name)) return
            if (list.length >= 3) return
            const k = `${fallbackAcademic}||${fallbackGrade}||${code}||${name}`
            list.push({ key: k, academic: fallbackAcademic, grade: fallbackGrade, majorName: name, majorCode: code, count: 0, credit: 0, hours: 0 })
            existingMajors.add(name)
          })
        }
        list.sort((a, b) => String(a.academic).localeCompare(String(b.academic)) || String(a.grade).localeCompare(String(b.grade)) || String(a.majorName).localeCompare(String(b.majorName)) || String(a.majorCode).localeCompare(String(b.majorCode)) )
        setRows(list)
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    compute()
  }, [majorInfoMap])
  return (
    <div>
      <Card className="page-content" title="开课计划汇总">
        <Table
          size="small"
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowKey={(r:any)=> r.key}
          dataSource={rows}
          scroll={{ x: tableScrollX }}
          columns={[
            { title: '学期名称', dataIndex: 'academic' },
            { title: '年级名称', dataIndex: 'grade' },
            { title: '专业名称', dataIndex: 'majorName' },
            { title: '专业代码', dataIndex: 'majorCode' },
            { title: '合计开课门数', dataIndex: 'count', render: (v:any)=> formatNum(Number(v||0)) },
            { title: '总学分', dataIndex: 'credit', render: (v:any)=> formatNum(Number(v||0)) },
            { title: '总学时', dataIndex: 'hours', render: (v:any)=> formatNum(Number(v||0)) },
          ]}
        />
      </Card>
    </div>
  )
}

export const Scheduling: React.FC = () => {
  const [groupForm] = Form.useForm()
  const [scheduleForm] = Form.useForm()
  const [schedules, setSchedules] = useState<any[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const SCHEDULES_KEY = 'schedules'
  useEffect(() => {
    const saved = localStorage.getItem(SCHEDULES_KEY)
    if (saved) {
      try { setSchedules(JSON.parse(saved)) } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules))
  }, [schedules])
  const addSchedule = (values: any) => {
    const row = { key: Date.now().toString(), term: values.term || '', cls: values.cls || '', teacher: values.teacher || '', room: values.room || '', time: values.time || '', weeks: values.weeks || '', practiceLocation: values.practiceLocation || '', groups: Number(groupForm.getFieldValue('groups') || 0), type: values.type || '理论课', students: Number(values.students || 0), roomType: values.roomType || '' }
    setSchedules((prev) => [row, ...prev])
    scheduleForm.resetFields()
  }
  const rooms = (() => { try { const raw = localStorage.getItem('classrooms') || '[]'; return JSON.parse(raw) as any[] } catch { return [] } })()
  const roomCap = new Map<string, number>(rooms.map((r: any) => [String(r.name || r.room || r.doorNo || ''), Number(r.capacity || 0)]))
  const roomType = new Map<string, string>(rooms.map((r: any) => [String(r.name || r.room || r.doorNo || ''), String(r.type || '')]))
  const conflicts = schedules.flatMap((a, i) => {
    return schedules.slice(i + 1).map((b) => {
      const timeConflict = a.time && b.time && a.time === b.time && a.term === b.term
      const teacherConflict = timeConflict && a.teacher && b.teacher && a.teacher === b.teacher
      const classConflict = timeConflict && a.cls && b.cls && a.cls === b.cls
      const roomConflict = timeConflict && a.room && b.room && a.room === b.room
      const capA = a.students && a.room && roomCap.has(a.room) ? (a.students > (roomCap.get(a.room) || 0)) : false
      const capB = b.students && b.room && roomCap.has(b.room) ? (b.students > (roomCap.get(b.room) || 0)) : false
      const typeA = a.type && a.room && roomType.has(a.room) ? (!String(roomType.get(a.room)).includes(String(a.roomType || a.type === '理论课' ? '教室' : '实验'))) : false
      const typeB = b.type && b.room && roomType.has(b.room) ? (!String(roomType.get(b.room)).includes(String(b.roomType || b.type === '理论课' ? '教室' : '实验'))) : false
      const details = [] as string[]
      if (teacherConflict) details.push(`教师 ${a.teacher}`)
      if (classConflict) details.push(`班级 ${a.cls}`)
      if (roomConflict) details.push(`教室 ${a.room}`)
      if (capA) details.push(`容量不足 ${a.room}`)
      if (capB) details.push(`容量不足 ${b.room}`)
      if (typeA) details.push(`类型不匹配 ${a.room}`)
      if (typeB) details.push(`类型不匹配 ${b.room}`)
      if (details.length === 0) return null
      return { key: `${a.key}_${b.key}`, type: '时间冲突', detail: details.join('，'), fix: '调整时间或资源' }
    }).filter(Boolean) as any[]
  })
  const autoPreSchedule = (v: any) => {
    const target = String(v.term || '')
    const times = ['周一第1-2节','周一第3-4节','周二第1-2节','周二第3-4节','周三第1-2节','周三第3-4节']
    const roomsPick = rooms.slice(0, 6).map((r: any) => String(r.name || r.room || r.doorNo || ''))
    const out: any[] = []
    schedules.filter((s)=> s.term===target && !s.room).forEach((s, idx)=> {
      const time = times[idx % times.length]
      const room = roomsPick[idx % roomsPick.length] || 'A-101'
      const score = time.includes('第1-2节') ? 90 : 75
      out.push({ key: `${s.key}_cand`, class: s.cls, room, time, score })
    })
    setCandidates(out)
  }
  const expandLabByGroups = () => {
    const base = [...schedules]
    const timeslots = ['周三第1-2节','周三第3-4节','周三第5-6节','周三第7-8节','周四第1-2节','周四第3-4节']
    const addRows: any[] = []
    base.forEach((s) => {
      if (String(s.type || '') === '实验课' && Number(s.groups || 0) > 1) {
        for (let i = 1; i <= Number(s.groups || 0); i++) {
          addRows.push({ key: `${s.key}_G${i}`, term: s.term, cls: `${s.cls}-G${i}`, teacher: s.teacher, room: s.room, time: timeslots[(i - 1) % timeslots.length], weeks: s.weeks || '1-16', practiceLocation: s.practiceLocation || '', groups: 0, type: s.type, students: Math.max(1, Math.floor(Number(s.students || 0) / Number(s.groups || 1))), roomType: s.roomType || '' })
        }
      }
    })
    setSchedules((prev) => [...addRows, ...prev])
  }
  return (
    <div>
      <Card className="page-content" title="周次与分组设定">
        <Form form={groupForm} layout="inline">
          <Form.Item name="groups" label="分组数"><Input type="number" style={{ width: 120 }} /></Form.Item>
        </Form>
        <Form form={scheduleForm} layout="inline" onFinish={addSchedule}>
          <Form.Item name="term" label="学期"><Select options={[{value:'2025-秋',label:'2025~2025 第一学期'}]} /></Form.Item>
          <Form.Item name="cls" label="课程班"><Input placeholder="数据结构-01" /></Form.Item>
          <Form.Item name="teacher" label="教师"><Input placeholder="张三" /></Form.Item>
          <Form.Item name="room" label="教室"><Input placeholder="A-101" /></Form.Item>
          <Form.Item name="time" label="时间"><Input placeholder="周三第3-4节" /></Form.Item>
          <Form.Item name="weeks" label="周次"><Input placeholder="1-16" /></Form.Item>
          <Form.Item name="practiceLocation" label="实践地点"><Input placeholder="实训基地1" /></Form.Item>
          <Form.Item name="type" label="类型"><Select options={[{value:'理论课',label:'理论课'},{value:'实验课',label:'实验课'},{value:'实训课',label:'实训课'},{value:'实践课',label:'实践课'}]} /></Form.Item>
          <Form.Item name="students" label="人数"><InputNumber style={{ width: 120 }} /></Form.Item>
          <Form.Item name="roomType" label="教室类型"><Select allowClear style={{ width: 160 }} options={[{value:'普通教室',label:'普通教室'},{value:'多媒体教室',label:'多媒体教室'},{value:'计算机房',label:'计算机房'},{value:'实验室',label:'实验室'}]} /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">新增安排</Button></Form.Item>
          <Form.Item><Button onClick={expandLabByGroups}>按分组展开实验安排</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} rowKey="key" dataSource={schedules} columns={[{title:'学期',dataIndex:'term'},{title:'课程班',dataIndex:'cls'},{title:'教师',dataIndex:'teacher'},{title:'教室',dataIndex:'room'},{title:'时间',dataIndex:'time'},{title:'周次',dataIndex:'weeks'},{title:'实践地点',dataIndex:'practiceLocation'},{title:'类型',dataIndex:'type'},{title:'人数',dataIndex:'students'},{title:'教室类型',dataIndex:'roomType'},{title:'分组',dataIndex:'groups'}]} />
      </Card>
      <Card className="page-content" title="自动排课与候选方案">
        <Form layout="inline" onFinish={autoPreSchedule}>
          <Form.Item name="term" label="目标学期"><Select options={[{value:'2025-秋',label:'2025-秋'}]} /></Form.Item>
          <Form.Item label="软约束权重"><Input placeholder="同楼:5,均衡:3,建议周次:2" /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">运行自动排课</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} dataSource={candidates} columns={[{title:'课程班',dataIndex:'class'},{title:'教室',dataIndex:'room'},{title:'时间',dataIndex:'time'},{title:'评分',dataIndex:'score'}]} />
      </Card>
      <Card className="page-content" title="冲突检测与修复建议">
        <Table size="small" pagination={false} rowKey="key" dataSource={conflicts} columns={[{title:'类型',dataIndex:'type'},{title:'详情',dataIndex:'detail'},{title:'修复建议',dataIndex:'fix'}]} />
      </Card>
    </div>
  )
}

export const SchedulingElectives: React.FC = () => {
  const [rows, setRows] = useState<any[]>([])
  const KEY = 'electivesScheduling'
  const [form] = Form.useForm()
  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved) { try { setRows(JSON.parse(saved)) } catch {} }
  }, [])
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(rows)) }, [rows])
  const add = (v: any) => { const row = { key: Date.now().toString(), course: v.course||'', cls: v.cls||'', teacher: v.teacher||'', room: v.room||'', time: v.time||'', weeks: v.weeks||'' }; setRows((prev)=> [row, ...prev]); form.resetFields() }
  return (
    <div>
      <Card className="page-content" title="公共选修课编排">
        <Form form={form} layout="inline" onFinish={add} style={{ marginBottom: 12 }}>
          <Form.Item name="course" label="课程"><Input style={{ width: 200 }} placeholder="公共选修课名" /></Form.Item>
          <Form.Item name="cls" label="课程班"><Input style={{ width: 160 }} placeholder="如：01班" /></Form.Item>
          <Form.Item name="teacher" label="教师"><Input style={{ width: 160 }} /></Form.Item>
          <Form.Item name="room" label="教室"><Input style={{ width: 140 }} /></Form.Item>
          <Form.Item name="time" label="时间"><Input style={{ width: 160 }} placeholder="周几第X-Y节" /></Form.Item>
          <Form.Item name="weeks" label="周次"><Input style={{ width: 120 }} placeholder="1-16" /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">新增编排</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} rowKey="key" dataSource={rows} columns={[
          {title:'课程',dataIndex:'course'},
          {title:'课程班',dataIndex:'cls'},
          {title:'教师',dataIndex:'teacher'},
          {title:'教室',dataIndex:'room'},
          {title:'时间',dataIndex:'time'},
          {title:'周次',dataIndex:'weeks'}
        ]} />
      </Card>
    </div>
  )
}

export const SchedulingAudit: React.FC = () => {
  const [rows, setRows] = useState<any[]>([])
  useEffect(() => { const saved = localStorage.getItem('schedules'); if (saved) { try { setRows(JSON.parse(saved)) } catch {} } }, [])
  const approve = (key: string) => { setRows((prev)=> prev.map((r)=> r.key===key ? { ...r, auditStatus: '已通过' } : r)) }
  const reject = (key: string) => { setRows((prev)=> prev.map((r)=> r.key===key ? { ...r, auditStatus: '已驳回' } : r)) }
  return (
    <div>
      <Card className="page-content" title="课表审核">
        <Table size="small" pagination={false} rowKey="key" dataSource={rows} columns={[
          {title:'学期',dataIndex:'term'},
          {title:'课程班',dataIndex:'cls'},
          {title:'教师',dataIndex:'teacher'},
          {title:'教室',dataIndex:'room'},
          {title:'时间',dataIndex:'time'},
          {title:'周次',dataIndex:'weeks'},
          {title:'审核状态',dataIndex:'auditStatus'},
          {title:'操作',render:(_:any,record:any)=> (
            <Space>
              <Button size="small" type="primary" onClick={()=> approve(record.key)}>通过</Button>
              <Button size="small" danger onClick={()=> reject(record.key)}>驳回</Button>
            </Space>
          )}
        ]} />
      </Card>
    </div>
  )
}

export const TaskScheduling: React.FC = () => {
  const [ruleForm] = Form.useForm()
  const [autoForm] = Form.useForm()
  const SCHEDULES_KEY = 'schedules'
  const CLASS_LINK_DB_KEY = 'db_offering_class_links'
  const TEACHER_LINK_DB_KEY = 'db_offering_teacher_links'
  const [unscheduled, setUnscheduled] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [roomsVersion, setRoomsVersion] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editForm] = Form.useForm()
  const [roomSelect, setRoomSelect] = useState<string | undefined>(undefined)
  const [roomUsageOpen, setRoomUsageOpen] = useState(false)
  const [roomUsageRows, setRoomUsageRows] = useState<any[]>([])
  const [conflictRows, setConflictRows] = useState<any[]>([])
  const [roomFixOpen, setRoomFixOpen] = useState(false)
  const [roomFixOptions, setRoomFixOptions] = useState<any[]>([])
  const [fixKey, setFixKey] = useState<string | null>(null)
  const [timeFixOpen, setTimeFixOpen] = useState(false)
  const [fixRecord, setFixRecord] = useState<any | null>(null)
  useEffect(()=>{ try{ const raw = localStorage.getItem(SCHEDULES_KEY)||'[]'; setSchedules(JSON.parse(raw)||[])}catch{} },[])
  useEffect(()=>{ localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules)) },[schedules])
  const offerings = (()=>{ try{ const raw = localStorage.getItem('offerings')||'[]'; return JSON.parse(raw)||[] }catch{ return [] } })()
  const classLinkDB = (()=>{ try{ const raw = localStorage.getItem(CLASS_LINK_DB_KEY)||'{}'; return JSON.parse(raw)||{} }catch{ return {} } })()
  const teacherLinkDB = (()=>{ try{ const raw = localStorage.getItem(TEACHER_LINK_DB_KEY)||'{}'; return JSON.parse(raw)||{} }catch{ return {} } })()
  const rooms = useMemo(() => { try { const raw = localStorage.getItem('basic_classrooms') || localStorage.getItem('classrooms') || '[]'; return JSON.parse(raw) as any[] } catch { return [] } }, [roomsVersion])
  useEffect(()=>{ if(roomUsageOpen){ const rows = rooms.map((r:any)=>{ const name = String(r.name || r.room || r.doorNo || r.code || ''); const list = schedules.filter((s:any)=> String(s.room||'')===name).map((s:any)=> ({ key: s.key, term: s.term, cls: s.cls, teacher: s.teacher, time: s.time, weeks: s.weeks })) ; return { key: name || r.key || `${Date.now()}_${Math.random()}`, room: name, campus: String(r.campus||''), building: String(r.buildingName||''), type: String(r.type||''), capacity: Number(r.capacity||0), status: list.length>0 ? '已排课' : '未排课', count: list.length, details: list } }); setRoomUsageRows(rows) } }, [roomsVersion, rooms, schedules, roomUsageOpen])
  const timeslots = useMemo(()=>{
    const days = ['周一','周二','周三','周四','周五','周六','周日']
    const periods = ['第1-2节','第3-4节','第5-6节','第7-8节','第9-10节']
    const arr:string[]=[]; days.forEach(d=> periods.forEach(p=> arr.push(`${d}${p}`)))
    return arr
  },[])
  const weekDaysDisplay = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
  const weekDaysValue = ['周一','周二','周三','周四','周五','周六','周日']
  const periodDefs = [
    { key: 'p12', label: '1~2', value: '第1-2节' },
    { key: 'p34', label: '3~4', value: '第3-4节' },
    { key: 'p56', label: '5~6', value: '第5-6节' },
    { key: 'p78', label: '7~8', value: '第7-8节' },
    { key: 'p910', label: '9~10', value: '第9-10节' }
  ]
  const timeGridData = weekDaysDisplay.map((d, idx)=> ({ key: d, day: d, dayValue: weekDaysValue[idx] }))
  const timeGridDataByPeriod = periodDefs.map((p)=> ({ key: p.key, period: p.label, periodValue: p.value }))
  const buildUnscheduled = () => {
    const out:any[]=[]
    const seen = new Set<string>()
    offerings.forEach((o:any)=>{
      const courseCombined = `${o.course||''}${o.code?`(${o.code})`:''}`
      const clsList = (classLinkDB[courseCombined]?.classes || String(o.linkedClass||'').split(/[、，,;；\s]+/)).filter((x:string)=> String(x).trim().length>0)
      let tchList = (teacherLinkDB[courseCombined]?.teachers || []).filter((x:string)=> String(x).trim().length>0)
      if (tchList.length===0 && String(ruleForm.getFieldValue('autoTeachersDept')||'')==='是') {
        try {
          const dept = String(o.department||'')
          const rawUsers = localStorage.getItem('sys_users') || localStorage.getItem('cache_users_list') || '[]'
          const users = JSON.parse(rawUsers)
          if (Array.isArray(users)) {
            tchList = users.filter((u:any)=> String(u.department||u.dept||'')===dept && String(u.name||'').trim().length>0).slice(0,3).map((u:any)=> String(u.name))
          }
        } catch {}
      }
      if (tchList.length===0 && String(ruleForm.getFieldValue('allowNoTeacher')||'')==='是') {
        const placeholder = String(o.teacherScope||'未分配教师') || '未分配教师'
        tchList = [placeholder]
      }
      clsList.forEach((cls:string)=>{
        tchList.forEach((tch:string)=>{
          const exists = schedules.some((s:any)=> String(s.term||'')===String(o.term||'') && String(s.cls||'')===String(cls) && String(s.teacher||'')===String(tch))
          const sig = `${String(o.term||'')}|${String(o.course||'')}|${String(cls)}|${String(tch).trim()}`
          if(!exists && !seen.has(sig)){ out.push({ key:`U_${o.key}_${cls}_${tch}`, term:String(o.term||''), course:String(o.course||''), code:String(o.code||''), grade:String(o.grade||''), major:String(o.major||''), cls:String(cls), teacher:String(tch).trim(), type:String(o.ctype||'理论课'), students:Number(o.classSizeThreshold||40) }); seen.add(sig) }
        })
      })
    })
    setUnscheduled(out)
  }
  useEffect(()=>{ buildUnscheduled() },[])
  const conflictsAt = (term:string, time:string, teacher:string, cls:string, room:string) => {
    const sameTime = schedules.filter((s:any)=> String(s.term||'')===term && String(s.time||'')===time)
    const teacherConflict = sameTime.some((s:any)=> String(s.teacher||'')===teacher)
    const classConflict = sameTime.some((s:any)=> String(s.cls||'')===cls)
    const roomConflict = sameTime.some((s:any)=> String(s.room||'')===room)
    return { teacherConflict, classConflict, roomConflict }
  }
  const pickRoom = (type:string, students:number) => {
    const matchType=(r:any)=> type.includes('实验') ? String(r.type||'').includes('实验') : !String(r.type||'').includes('实验')
    const list = rooms.filter(matchType).sort((a:any,b:any)=> (Number(a.capacity||0)-students) - (Number(b.capacity||0)-students))
    return String((list[0]?.name || list[0]?.doorNo || list[0]?.room || list[0]?.code || 'A-101'))
  }
  const autoScheduleAll = () => {
    const rule = ruleForm.getFieldsValue()
    const added:any[]=[]
    unscheduled.forEach((u:any)=>{
      for(const t of timeslots){
        const room = roomSelect || pickRoom(u.type, Number(u.students||40))
        const c = conflictsAt(u.term, t, u.teacher, u.cls, room)
        const pass = (!rule.checkTeacher || !c.teacherConflict) && (!rule.checkClass || !c.classConflict) && (!rule.checkRoom || !c.roomConflict)
        if(pass){ added.push({ key:`S_${Date.now()}_${Math.random()}`, term:u.term, course: u.course, cls:u.cls, teacher:u.teacher, room, time:t, weeks: rule.weeks || '1-16', practiceLocation:'', groups:0, type:u.type, students:u.students, roomType: u.type.includes('实验') ? '实验室' : '普通教室', createdAt: Date.now() }); break }
      }
    })
    if(added.length>0){ setSchedules((prev)=> [...added, ...prev]); setUnscheduled((prev)=> prev.filter((x)=> !added.some((a)=> a.cls===x.cls && a.teacher===x.teacher && a.term===x.term))) }
  }
  const assignSelected = (slot:string, room:string) => {
    if(!selected) return
    const c = conflictsAt(selected.term, slot, selected.teacher, selected.cls, room)
    const r = ruleForm.getFieldsValue()
    const pass = (!r.checkTeacher || !c.teacherConflict) && (!r.checkClass || !c.classConflict) && (!r.checkRoom || !c.roomConflict)
    if(!pass){ message.warning('存在冲突，请换时段或教室'); return }
    const row = { key:`S_${Date.now()}`, term:selected.term, course: selected.course, cls:selected.cls, teacher:selected.teacher, room, time:slot, weeks: r.weeks || '1-16', practiceLocation:'', groups:0, type:selected.type, students:selected.students, roomType: selected.type.includes('实验') ? '实验室' : '普通教室', createdAt: Date.now() }
    setSchedules((prev)=> [row, ...prev])
    setUnscheduled((prev)=> prev.filter((x)=> x.key!==selected.key))
    setSelected(null)
  }
  const saveSchedules = () => { localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules)); message.success('已保存本次编排') }
  const refreshRooms = () => { setRoomsVersion((v)=> v+1); setRoomUsageOpen(true) }
  const removeSchedule = (key: string) => { setSchedules((prev)=> prev.filter((r)=> r.key!==key)) }
  const onEditSchedule = (record: any) => { setEditingKey(record.key); setEditOpen(true); editForm.setFieldsValue(record); setRoomSelect(record.room) }
  const saveEditSchedule = (v: any) => { setSchedules((prev)=> prev.map((r)=> r.key===editingKey ? { ...r, term: v.term||r.term, cls: v.cls||r.cls, teacher: v.teacher||r.teacher, room: v.room||r.room, time: v.time||r.time, weeks: v.weeks||r.weeks, type: v.type||r.type, students: Number(v.students??r.students), roomType: v.roomType||r.roomType } : r)); setEditOpen(false); setEditingKey(null) }
  const editLast = () => { const rec = schedules[0]; if(!rec){ message.info('暂无已编排记录'); return } ; setEditingKey(rec.key); setEditOpen(true); editForm.setFieldsValue(rec); setRoomSelect(rec.room) }
  useEffect(()=>{
    const arr:any[]=[]
    schedules.forEach((a)=>{
      schedules.forEach((b)=>{
        if(a.key===b.key) return
        if(a.term===b.term && a.time===b.time){
          if(a.teacher&&b.teacher&&a.teacher===b.teacher) arr.push({ key:`T_${a.key}_${b.key}`, type:'教师冲突', detail:`${a.teacher} ${a.time}`, aKey:a.key, bKey:b.key, term:a.term, time:a.time })
          if(a.cls&&b.cls&&a.cls===b.cls) arr.push({ key:`C_${a.key}_${b.key}`, type:'班级冲突', detail:`${a.cls} ${a.time}`, aKey:a.key, bKey:b.key, term:a.term, time:a.time })
          if(a.room&&b.room&&a.room===b.room) arr.push({ key:`R_${a.key}_${b.key}`, type:'教室冲突', detail:`${a.room} ${a.time}`, aKey:a.key, bKey:b.key, term:a.term, time:a.time, room:a.room })
        }
      })
    })
    const uniq = new Map<string, any>()
    arr.forEach((x)=>{ if(!uniq.has(x.key)) uniq.set(x.key, x) })
    setConflictRows(Array.from(uniq.values()))
  },[schedules])
  const availableRooms = (term:string, time:string, type:string, students:number) => {
    const matchType=(r:any)=> type.includes('实验') ? String(r.type||'').includes('实验') : !String(r.type||'').includes('实验')
    return rooms
      .filter(matchType)
      .filter((r:any)=> !schedules.some((s:any)=> String(s.term||'')===term && String(s.time||'')===time && String(s.room||'')===String(r.name || r.room || r.doorNo || r.code || '')))
      .filter((r:any)=> Number(r.capacity||0) >= Number(students||0))
      .map((r:any)=> ({ value: String(r.name || r.room || r.doorNo || r.code || ''), label: `${String(r.name || r.room || r.doorNo || '')}（${String(r.type||'')}，容量${Number(r.capacity||0)}）` }))
  }
  const openRoomFix = (key:string) => {
    const rec = schedules.find((s:any)=> s.key===key)
    if(!rec){ message.info('未找到记录'); return }
    setFixKey(key)
    setRoomFixOptions(availableRooms(String(rec.term||''), String(rec.time||''), String(rec.type||'理论课'), Number(rec.students||0)))
    setRoomFixOpen(true)
  }
  const applyRoomFix = (room:string) => { if(!fixKey){ setRoomFixOpen(false); return } ; setSchedules((prev)=> prev.map((r)=> r.key===fixKey ? { ...r, room } : r)); setRoomFixOpen(false); setFixKey(null) }
  const openTimeFix = (key:string) => { const rec = schedules.find((s:any)=> s.key===key); if(!rec){ message.info('未找到记录'); return } ; setFixRecord(rec); setTimeFixOpen(true) }
  const applyTimeFix = (slot:string) => { if(!fixRecord){ setTimeFixOpen(false); return } ; const c = conflictsAt(String(fixRecord.term||''), slot, String(fixRecord.teacher||''), String(fixRecord.cls||''), String(fixRecord.room||'')); const pass = !c.teacherConflict && !c.classConflict && !c.roomConflict; if(!pass){ message.warning('该时段仍冲突'); return } ; setSchedules((prev)=> prev.map((r)=> r.key===fixRecord.key ? { ...r, time: slot } : r)); setTimeFixOpen(false); setFixRecord(null) }
  const seedDemoData = () => {
    try {
      const sampleOfferings = [
        { key:'o_ds', academic:'2025-秋', grade:'2024', major:'中文系', duration:'4', course:'大学语文', code:'CUR0001', category:'专业课', assess:'考试', position:'核心', credit:2, hoursTotal:32, hoursTheory:32, hoursExperiment:0, hoursTraining:0, hoursPractice:0, department:'文学院', remark:'', status:'待审核', linkedClass:'中文系1班', term:'2025-秋', ctype:'理论课', classSizeThreshold:50, teacherScope:'不限', teacherRange:'', auditChain:'系主任→教秘→教务处' },
        { key:'o_algo', academic:'2025-秋', grade:'2024', major:'计算机科学与技术', duration:'4', course:'数据结构', code:'CUR08090101', category:'专业课', assess:'考试', position:'核心', credit:4, hoursTotal:48, hoursTheory:48, hoursExperiment:0, hoursTraining:0, hoursPractice:0, department:'计算机学院', remark:'', status:'待审核', linkedClass:'计科2024-01班、计科2024-02班', term:'2025-秋', ctype:'理论课', classSizeThreshold:60, teacherScope:'不限', teacherRange:'', auditChain:'系主任→教秘→教务处' }
      ]
      const sampleClasses = {
        '大学语文(CUR0001)': { classes: ['中文系1班'], createdAt: Date.now() },
        '数据结构(CUR08090101)': { classes: ['计科2024-01班','计科2024-02班'], createdAt: Date.now() }
      }
      const sampleTeachers = {
        '大学语文(CUR0001)': { teachers: ['王老师'], createdAt: Date.now() },
        '数据结构(CUR08090101)': { teachers: ['张三','李四'], createdAt: Date.now() }
      }
      const sampleRooms = [
        { key:'rmA101', code:'ROOM001', campus:'A校区', buildingName:'A楼', floor:1, doorNo:'101', name:'A-101', type:'普通教室', capacity:60, department:'教务处', equipment:'投影仪', status:'启用' },
        { key:'rmLab201', code:'ROOM002', campus:'A校区', buildingName:'实验楼', floor:2, doorNo:'201', name:'LAB-201', type:'实验室', capacity:40, department:'理学院', equipment:'实验台', status:'启用' }
      ]
      localStorage.setItem('offerings', JSON.stringify(sampleOfferings))
      localStorage.setItem(CLASS_LINK_DB_KEY, JSON.stringify(sampleClasses))
      localStorage.setItem(TEACHER_LINK_DB_KEY, JSON.stringify(sampleTeachers))
      localStorage.setItem('basic_classrooms', JSON.stringify(sampleRooms))
      message.success('已加载示例数据')
      buildUnscheduled()
    } catch {}
  }
  const undoLast = () => { setSchedules((prev)=> prev.slice(1)) }
  const clearSchedules = () => { setSchedules([]); message.success('已清空本次编排') }
  return (
    <div>
      <Card className="page-content" title="规则与范围">
        <Form form={ruleForm} layout="inline" initialValues={{ checkTeacher:true, checkClass:true, checkRoom:true, weeks:'1-16', autoTeachersDept:'否', allowNoTeacher:'是' }}>
          <Form.Item name="campus" label="校区"><Select allowClear style={{ width: 160 }} options={Array.from(new Set(rooms.map(r=> String(r.campus||'')))).filter(x=>x).map(v=>({value:v,label:v}))} /></Form.Item>
          <Form.Item name="ctype" label="课程类型"><Select allowClear style={{ width: 160 }} options={[{value:'理论课',label:'理论课'},{value:'实验课',label:'实验课'},{value:'实训课',label:'实训课'},{value:'实践课',label:'实践课'}]} /></Form.Item>
          <Form.Item name="department" label="学院"><Input placeholder="如：计算机学院" style={{ width: 180 }} /></Form.Item>
          <Form.Item name="checkTeacher" valuePropName="checked"><Checkbox>检测教师冲突</Checkbox></Form.Item>
          <Form.Item name="checkClass" valuePropName="checked"><Checkbox>检测班级冲突</Checkbox></Form.Item>
          <Form.Item name="checkRoom" valuePropName="checked"><Checkbox>检测教室冲突</Checkbox></Form.Item>
          <Form.Item name="autoTeachersDept" label="按学院补全教师"><Select style={{ width: 180 }} options={[{value:'否',label:'否'},{value:'是',label:'是'}]} /></Form.Item>
          <Form.Item name="weeks" label="周次"><Input placeholder="如：1-16/单周/双周" style={{ width: 180 }} /></Form.Item>
          <Form.Item name="allowNoTeacher" label="无教师也生成"><Select style={{ width: 160 }} options={[{value:'是',label:'是'},{value:'否',label:'否'}]} /></Form.Item>
          <Form.Item><Button type="primary" onClick={buildUnscheduled}>检索待排课</Button></Form.Item>
          <Form.Item><Button onClick={autoScheduleAll}>一键自动编排</Button></Form.Item>
          <Form.Item><Button onClick={seedDemoData}>加载示例数据</Button></Form.Item>
          <Form.Item><Button danger onClick={clearSchedules}>清空本次编排</Button></Form.Item>
        </Form>
      </Card>
      <Row gutter={12}>
        <Col span={12}>
          <Card className="page-content" title="待排课">
            <Table size="small" pagination={{ pageSize: 10 }} rowKey="key" dataSource={unscheduled} onRow={(r)=> ({ onClick:()=> { setSelected(r); setSelectedKey(r.key) }, onDoubleClick:()=> { setSelected(r); setSelectedKey(r.key) } })} rowClassName={(r)=> String(r.key)===String(selectedKey||'') ? 'task-schedule-row-selected' : ''} columns={[
              {title:'课程',dataIndex:'course'},
              {title:'课程班',dataIndex:'cls'},
              {title:'教师',dataIndex:'teacher'},
              {title:'类型',dataIndex:'type'},
              {title:'人数',dataIndex:'students'},
              {title:'学期',dataIndex:'term'}
            ]} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="page-content" title="时间轴与教室选择">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert type="info" message={selected ? `当前：${selected.course} ${selected.cls} ${selected.teacher}` : '双击左侧待排课选择'} />
              <Space wrap>
                <Select
                  allowClear
                  style={{ width: 280 }}
                  placeholder="选择教室"
                  value={roomSelect}
                  onChange={(v)=> setRoomSelect(v)}
                  showSearch
                  optionFilterProp="label"
                  options={rooms
                    .filter((r: any)=> selected ? (selected.type.includes('实验') ? String(r.type||'').includes('实验') : !String(r.type||'').includes('实验')) : true)
                    .map((r: any)=> ({
                      value: String(r.name || r.room || r.doorNo || r.code || ''),
                      label: `${String(r.name || r.room || r.doorNo || '')}（${String(r.type||'')}，容量${Number(r.capacity||0)}）`
                    }))}
                />
                <Button onClick={refreshRooms}>教室选择</Button>
                <Button type="primary" onClick={saveSchedules}>保存本次编排</Button>
              </Space>
              <Table
                size="small"
                pagination={false}
                rowKey="key"
                dataSource={timeGridDataByPeriod}
                columns={[
                  { title: '节次', dataIndex: 'period', width: 100 },
                  ...weekDaysDisplay.map((d, idx)=> ({
                    title: d,
                    key: weekDaysValue[idx],
                    render: (_:any, record:any) => (
                      <Button
                        size="small"
                        style={{ width: '100%' }}
                        onClick={()=> assignSelected(`${weekDaysValue[idx]}${record.periodValue}`, roomSelect || pickRoom(selected?.type||'理论课', Number(selected?.students||40)))}
                      >
                        {record.period}
                      </Button>
                    )
                  }))
                ] as ColumnsType<any>}
              />
              <Descriptions bordered size="small" column={1} title="已编排（本次）">
                {(schedules.slice(0,8)).map((s:any)=> (
                  <Descriptions.Item key={s.key} label={`${s.cls}-${s.teacher}`}>{`${s.time} @ ${s.room} (${s.weeks})`}</Descriptions.Item>
                ))}
              </Descriptions>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={editLast}>修改最近一次</Button>
                <Button onClick={undoLast}>撤销最近一次</Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
      <Card className="page-content" title="已编排课程列表">
        <Table size="small" pagination={{ pageSize: 10 }} rowKey="key" dataSource={schedules} columns={[
          {title:'学期',dataIndex:'term'},
          {title:'课程班',dataIndex:'cls'},
          {title:'教师',dataIndex:'teacher'},
          {title:'教室',dataIndex:'room'},
          {title:'时间',dataIndex:'time'},
          {title:'周次',dataIndex:'weeks'},
          {title:'单双周',render:(_:any, r:any)=> { const w = String(r.weeks||''); return w.includes('单') ? '单周' : (w.includes('双') ? '双周' : '全周') } },
          {title:'类型',dataIndex:'type'},
          {title:'人数',dataIndex:'students'},
          {title:'教室类型',dataIndex:'roomType'},
          {title:'操作',render:(_:any,record:any)=> (
            <Space>
              <Button size="small" onClick={()=> onEditSchedule(record)}>修改</Button>
              <Popconfirm title="确认撤销该编排？" onConfirm={()=> removeSchedule(record.key)}>
                <Button size="small" danger>撤销</Button>
              </Popconfirm>
            </Space>
          )}
        ]} />
        <Modal open={roomUsageOpen} title="教室使用状态" footer={null} onCancel={()=> setRoomUsageOpen(false)} width={960}>
          <Table size="small" pagination={{ pageSize: 10 }} rowKey="key" dataSource={roomUsageRows} columns={[
            {title:'教室',dataIndex:'room'},
            {title:'校区',dataIndex:'campus'},
            {title:'楼栋',dataIndex:'building'},
            {title:'类型',dataIndex:'type'},
            {title:'容量',dataIndex:'capacity'},
            {title:'状态',dataIndex:'status'},
            {title:'已排数',dataIndex:'count'}
          ]} expandable={{ expandedRowRender: (record:any)=> (
            <Table size="small" pagination={false} rowKey="key" dataSource={record.details} columns={[
              {title:'学期',dataIndex:'term'},
              {title:'课程班',dataIndex:'cls'},
              {title:'教师',dataIndex:'teacher'},
              {title:'时间',dataIndex:'time'},
              {title:'周次',dataIndex:'weeks'}
            ]} />
          ) }} />
        </Modal>
        <Modal open={editOpen} title="修改已编排课程" footer={null} onCancel={()=> setEditOpen(false)}>
          <Form form={editForm} layout="vertical" onFinish={saveEditSchedule}>
            <Form.Item name="term" label="学期"><Input /></Form.Item>
            <Form.Item name="cls" label="课程班"><Input /></Form.Item>
            <Form.Item name="teacher" label="教师"><Input /></Form.Item>
            <Form.Item name="room" label="教室"><Select allowClear showSearch optionFilterProp="label" options={rooms.map((r:any)=> ({ value: String(r.name || r.room || r.doorNo || r.code || ''), label: `${String(r.name || r.room || r.doorNo || '')}（${String(r.type||'')}，容量${Number(r.capacity||0)}）` }))} /></Form.Item>
            <Form.Item name="time" label="时间"><Input /></Form.Item>
            <Form.Item name="weeks" label="周次"><Input /></Form.Item>
            <Form.Item name="type" label="类型"><Select allowClear options={[{value:'理论课',label:'理论课'},{value:'实验课',label:'实验课'},{value:'实训课',label:'实训课'},{value:'实践课',label:'实践课'}]} /></Form.Item>
            <Form.Item name="students" label="人数"><InputNumber style={{ width: 140 }} /></Form.Item>
            <Form.Item name="roomType" label="教室类型"><Select allowClear style={{ width: 200 }} options={[{value:'普通教室',label:'普通教室'},{value:'多媒体教室',label:'多媒体教室'},{value:'计算机房',label:'计算机房'},{value:'实验室',label:'实验室'}]} /></Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={()=> setEditOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
      </Card>
      <Card className="page-content" title="冲突检测与调整">
        <Table size="small" pagination={false} rowKey={(r:any)=> r.key} dataSource={conflictRows} columns={[
          {title:'类型',dataIndex:'type'},
          {title:'详情',dataIndex:'detail'},
          {title:'操作',render:(_:any, r:any)=> (
            <Space wrap>
              <Button size="small" onClick={()=> openRoomFix(r.aKey)}>换教室(A)</Button>
              <Button size="small" onClick={()=> openRoomFix(r.bKey)}>换教室(B)</Button>
              <Button size="small" onClick={()=> openTimeFix(r.aKey)}>换时间(A)</Button>
              <Button size="small" onClick={()=> openTimeFix(r.bKey)}>换时间(B)</Button>
              <Popconfirm title="撤销A这条安排？" onConfirm={()=> removeSchedule(r.aKey)}><Button size="small" danger>撤销A</Button></Popconfirm>
              <Popconfirm title="撤销B这条安排？" onConfirm={()=> removeSchedule(r.bKey)}><Button size="small" danger>撤销B</Button></Popconfirm>
            </Space>
          )}
        ]} />
        <Modal open={roomFixOpen} title="选择可用教室" footer={null} onCancel={()=> setRoomFixOpen(false)}>
          <Form onFinish={(v)=> applyRoomFix(String(v.room||''))} layout="inline">
            <Form.Item name="room" label="教室" rules={[{ required: true }]}>
              <Select allowClear showSearch optionFilterProp="label" style={{ width: 360 }} options={roomFixOptions} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">应用</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal open={timeFixOpen} title="选择新的时间" footer={null} onCancel={()=> setTimeFixOpen(false)} width={720}>
          <Table size="small" pagination={false} rowKey="key" dataSource={timeGridDataByPeriod} columns={[
            { title: '节次', dataIndex: 'period', width: 100 },
            ...weekDaysDisplay.map((d, idx)=> ({
              title: d,
              key: weekDaysValue[idx],
              render: (_:any, record:any) => (<Button size="small" style={{ width: '100%' }} onClick={()=> applyTimeFix(`${weekDaysValue[idx]}${record.periodValue}`)}>{record.period}</Button>)
            }))
          ] as ColumnsType<any>} />
        </Modal>
      </Card>
    </div>
  )
}

export const ScheduledCoursesList: React.FC = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [collapsed, setCollapsed] = useState(false)
  const [selectionMode, setSelectionMode] = useState<'single'|'multiple'>('multiple')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  useEffect(()=>{ try{ const raw = localStorage.getItem('schedules')||'[]'; const arr = JSON.parse(raw)||[]; setData(arr) ; setFiltered(arr.sort((a:any,b:any)=> Number(b.createdAt||0) - Number(a.createdAt||0))) }catch{} },[])
  const conflictsMap = useMemo(()=>{
    const arr:any[]=[]
    data.forEach((a)=>{
      data.forEach((b)=>{
        if(a.key===b.key) return
        if(a.term===b.term && a.time===b.time){
          const conflict = (a.teacher&&b.teacher&&a.teacher===b.teacher) || (a.cls&&b.cls&&a.cls===b.cls) || (a.room&&b.room&&a.room===b.room)
          if(conflict){ arr.push(a.key); arr.push(b.key) }
        }
      })
    })
    return new Set(arr)
  },[data])
  const doFilter = () => {
    const v = form.getFieldsValue()
    let arr = [...data]
    if(v.course){ const s=String(v.course||'').trim(); arr = arr.filter((x)=> String(x.cls||x.course||'').includes(s)) }
    if(v.ctype){ arr = arr.filter((x)=> String(x.type||'')===String(v.ctype)) }
    if(v.teacher){ const s=String(v.teacher||'').trim(); arr = arr.filter((x)=> String(x.teacher||'').includes(s)) }
    if(v.range && v.range.length===2){ const [start,end] = v.range; const st = start?.valueOf?.() || 0; const ed = end?.valueOf?.() || 0; arr = arr.filter((x)=> { const t = Number(x.createdAt||0); return t>=st && t<=ed }) }
    if(v.status){ if(v.status==='有效'){ arr = arr.filter((x)=> !conflictsMap.has(x.key)) } else if(v.status==='冲突'){ arr = arr.filter((x)=> conflictsMap.has(x.key)) } }
    arr.sort((a:any,b:any)=> Number(b.createdAt||0) - Number(a.createdAt||0))
    setFiltered(arr)
  }
  useEffect(()=>{ doFilter() },[data])
  const refresh = () => { try{ const raw = localStorage.getItem('schedules')||'[]'; const arr = JSON.parse(raw)||[]; setData(arr) ; message.success('已刷新') }catch{} }
  const exportCSV = () => {
    const headers = ['学期','课程班','教师','教室','时间','周次','单双周','类型','人数','教室类型','编排时间','状态']
    const rows = filtered.map((x)=> [
      String(x.term||''),
      String(x.cls||''),
      String(x.teacher||''),
      String(x.room||''),
      String(x.time||''),
      String(x.weeks||''),
      (String(x.weeks||'').includes('单')?'单周':(String(x.weeks||'').includes('双')?'双周':'全周')),
      String(x.type||''),
      String(x.students||''),
      String(x.roomType||''),
      new Date(Number(x.createdAt||0)).toLocaleString(),
      conflictsMap.has(x.key)?'冲突':'有效'
    ])
    const content = [headers.join(','), ...rows.map(r=> r.map(v=> String(v).replace(/"/g,'""')).join(','))].join('\n')
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '已编排课程列表.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  const columns: any[] = [
    { title:'学期', dataIndex:'term', sorter:(a:any,b:any)=> String(a.term||'').localeCompare(String(b.term||'')) },
    { title:'课程班', dataIndex:'cls', sorter:(a:any,b:any)=> String(a.cls||'').localeCompare(String(b.cls||'')) },
    { title:'教师', dataIndex:'teacher', sorter:(a:any,b:any)=> String(a.teacher||'').localeCompare(String(b.teacher||'')) },
    { title:'教室', dataIndex:'room', sorter:(a:any,b:any)=> String(a.room||'').localeCompare(String(b.room||'')) },
    { title:'时间', dataIndex:'time', sorter:(a:any,b:any)=> String(a.time||'').localeCompare(String(b.time||'')) },
    { title:'周次', dataIndex:'weeks' },
    { title:'单双周', render:(_:any, r:any)=> { const w = String(r.weeks||''); return w.includes('单') ? '单周' : (w.includes('双') ? '双周' : '全周') } },
    { title:'类型', dataIndex:'type', sorter:(a:any,b:any)=> String(a.type||'').localeCompare(String(b.type||'')) },
    { title:'人数', dataIndex:'students', sorter:(a:any,b:any)=> Number(a.students||0) - Number(b.students||0) },
    { title:'教室类型', dataIndex:'roomType' },
    { title:'编排时间', render: (_:any,r:any)=> new Date(Number(r.createdAt||0)).toLocaleString(), sorter:(a:any,b:any)=> Number(a.createdAt||0) - Number(b.createdAt||0), defaultSortOrder: 'descend' },
    { title:'状态', render: (_:any,r:any)=> conflictsMap.has(r.key)? '冲突' : '有效' },
    { title:'操作', render: (_:any,r:any)=> (
      <Space>
        <Button size="small" onClick={()=> message.info(JSON.stringify(r))}>查看详情</Button>
        <Button size="small" onClick={()=> message.info('请在任务排课页面使用“修改”功能')}>编辑</Button>
        <Popconfirm title="确认删除该记录？" onConfirm={()=> { const next = data.filter((x)=> x.key!==r.key); setData(next); localStorage.setItem('schedules', JSON.stringify(next)) }}><Button size="small" danger>删除</Button></Popconfirm>
      </Space>
    ) }
  ]
  const rowSelection:any = {
    type: selectionMode==='single' ? 'radio' : 'checkbox',
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys)
  }
  return (
    <div>
      <Card className="page-content" title="已编排课程列表">
        <Space style={{ marginBottom: 12 }}>
          <Button onClick={()=> setCollapsed((v)=> !v)}>{collapsed? '展开查询' : '折叠查询'}</Button>
          <Button onClick={refresh}>刷新</Button>
          <Button onClick={exportCSV}>导出</Button>
          <Select value={selectionMode} onChange={(v)=> setSelectionMode(v)} style={{ width: 140 }} options={[{value:'single',label:'单选模式'},{value:'multiple',label:'多选模式'}]} />
        </Space>
        {!collapsed && (
          <Card size="small">
            <Form form={form} layout="inline" initialValues={{ status: '全部' }}>
              <Form.Item name="course" label="课程名称"><Input allowClear placeholder="支持模糊搜索" style={{ width: 220 }} /></Form.Item>
              <Form.Item name="ctype" label="课程类型"><Select allowClear style={{ width: 160 }} options={[{value:'理论课',label:'理论课'},{value:'实验课',label:'实验课'},{value:'实训课',label:'实训课'},{value:'实践课',label:'实践课'}]} /></Form.Item>
              <Form.Item name="range" label="编排日期范围"><DatePicker.RangePicker /></Form.Item>
              <Form.Item name="teacher" label="授课教师"><Input allowClear placeholder="支持模糊搜索" style={{ width: 180 }} /></Form.Item>
              <Form.Item name="status" label="课程状态"><Radio.Group options={[{value:'全部',label:'全部'},{value:'有效',label:'有效'},{value:'冲突',label:'冲突'}]} /></Form.Item>
              <Form.Item><Button type="primary" onClick={doFilter}>查询</Button></Form.Item>
            </Form>
          </Card>
        )}
        <Table
          size="small"
          rowKey={(r:any)=> r.key}
          dataSource={filtered}
          pagination={{ pageSize: 10 }}
          rowSelection={rowSelection}
          columns={columns}
        />
      </Card>
    </div>
  )
}

export const TeachingTaskTeacherTaskBook: React.FC = () => {
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{
    try{
      const schRaw = localStorage.getItem('schedules')||'[]'
      const offRaw = localStorage.getItem('offerings')||'[]'
      const schedules = JSON.parse(schRaw)||[]
      const offerings = JSON.parse(offRaw)||[]
      const mapByCourse: Record<string, any> = {}
      offerings.forEach((o:any)=>{ const key = String(o.course||''); if(key) mapByCourse[key] = o })
      const out:any[] = schedules.map((s:any, idx:number)=>{
        const o = mapByCourse[String(s.course||'')] || {}
        const code = String(o.code||'')
        const courseName = String(s.course||o.course||'')
        const major = String(o.major||'')
        const category = String(o.category||o.ctype||s.type||'')
        const teacher = String(s.teacher||'')
        const clsCode = String(s.cls||'')
        const teachMode = String(s.type||'')
        const hoursTotal = Number(o.hoursTotal||o.hoursTheory||0)
        const hoursPlan = Number(o.hoursTotal||0)
        const periodsMatch = /第(\d+)-(\d+)节/.exec(String(s.time||''))
        const periods = periodsMatch ? (Number(periodsMatch[2]) - Number(periodsMatch[1]) + 1) : 0
        const weeksText = String(s.weeks||'')
        const weeksCount = (/^(\d+)-(\d+)$/.test(weeksText)) ? (Number(RegExp.$2) - Number(RegExp.$1) + 1) : (weeksText.includes('单')||weeksText.includes('双') ? 8 : 0)
        const arrangedHours = periods * (weeksCount>0 ? weeksCount : 0)
        const students = Number(s.students||0)
        const weekHours = periods
        const continuousPeriods = periods
        const teachClassName = String(s.cls||'')
        const combineInfo = '-' 
        const auditNote = ''
        const auditStatus = '草稿'
        const remark = ''
        return {
          key: s.key || `TB_${idx}`,
          index: idx+1,
          courseCombined: courseName && code ? `${courseName}(${code})` : (courseName||'-'),
          major,
          category,
          teacher,
          clsCode,
          teachMode,
          hoursTotal,
          hoursPlan,
          arrangedHours,
          students,
          weeks: weeksText,
          weekHours,
          continuousPeriods,
          teachClassName,
          combineInfo,
          auditNote,
          auditStatus,
          remark
        }
      })
      setRows(out)
    }catch{}
  },[])
  return (
    <div>
      <Card className="page-content" title="教学任务书">
        <Table
          size="small"
          pagination={{ pageSize: 10 }}
          rowKey={(r:any)=> r.key}
          dataSource={rows}
          columns={[
            { title:'序号', dataIndex:'index', width: 70 },
            { title:'课程（编号）', dataIndex:'courseCombined' },
            { title:'专业名称', dataIndex:'major' },
            { title:'课程类别', dataIndex:'category' },
            { title:'任课教师', dataIndex:'teacher' },
            { title:'课程班级名称', dataIndex:'teachClassName' },
            { title:'授课方式', dataIndex:'teachMode' },
            { title:'总学时', dataIndex:'hoursTotal' },
            { title:'计划学时', dataIndex:'hoursPlan' },
            { title:'已安排学时', dataIndex:'arrangedHours' },
            { title:'班级人数', dataIndex:'students' },
            { title:'周次', dataIndex:'weeks' },
            { title:'周学时', dataIndex:'weekHours' },
            { title:'连上节数', dataIndex:'continuousPeriods' },
            { title:'教学班级名称', dataIndex:'teachClassName' },
            { title:'合班信息', dataIndex:'combineInfo' },
            { title:'审注', dataIndex:'auditNote' },
            { title:'审核状态', dataIndex:'auditStatus' },
            { title:'备注', dataIndex:'remark' }
          ]}
        />
      </Card>
    </div>
  )
}

export const SchedulingPublishRecords: React.FC = () => {
  const [rows, setRows] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const KEY = 'schedulePublishRecords'
  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved) { try { setRows(JSON.parse(saved)) } catch {} }
    const savedSch = localStorage.getItem('schedules')
    if (savedSch) { try { setSchedules(JSON.parse(savedSch)) } catch {} }
  }, [])
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(rows)) }, [rows])
  const publishAll = () => {
    const at = new Date().toLocaleString()
    const added = schedules.map((s)=> ({ key: `${Date.now()}_${Math.random()}`, term: s.term, cls: s.cls, teacher: s.teacher, room: s.room, time: s.time, weeks: s.weeks, publishedAt: at }))
    setRows((prev)=> [...added, ...prev])
  }
  return (
    <div>
      <Card className="page-content" title="发布记录">
        <Space style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={publishAll}>从当前编排生成发布记录</Button>
        </Space>
        <Table size="small" pagination={false} rowKey="key" dataSource={rows} columns={[
          {title:'学期',dataIndex:'term'},
          {title:'课程班',dataIndex:'cls'},
          {title:'教师',dataIndex:'teacher'},
          {title:'教室',dataIndex:'room'},
          {title:'时间',dataIndex:'time'},
          {title:'周次',dataIndex:'weeks'},
          {title:'发布时间',dataIndex:'publishedAt'}
        ]} />
      </Card>
    </div>
  )
}

export const SchedulingAdjustLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [form] = Form.useForm()
  const KEY = 'scheduleAdjustLogs'
  useEffect(() => { const saved = localStorage.getItem(KEY); if (saved) { try { setLogs(JSON.parse(saved)) } catch {} } }, [])
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(logs)) }, [logs])
  const add = (v: any) => { const row = { key: Date.now().toString(), term: v.term||'', cls: v.cls||'', teacher: v.teacher||'', room: v.room||'', time: v.time||'', weeks: v.weeks||'', applicant: v.applicant||'匿名', applyTime: new Date().toLocaleString(), handler: '', handleTime: '', status: '待处理', detail: v.detail||'' }; setLogs((prev)=> [row, ...prev]); form.resetFields() }
  const approve = (key: string) => { const h = String(localStorage.getItem('currentUserName')||''); setLogs((prev)=> prev.map((r)=> r.key===key ? { ...r, handler: h||'教务处', handleTime: new Date().toLocaleString(), status: '已通过' } : r)) }
  const reject = (key: string) => { const h = String(localStorage.getItem('currentUserName')||''); setLogs((prev)=> prev.map((r)=> r.key===key ? { ...r, handler: h||'教务处', handleTime: new Date().toLocaleString(), status: '已驳回' } : r)) }
  return (
    <div>
      <Card className="page-content" title="课表调整记录">
        <Form form={form} layout="inline" onFinish={add} style={{ marginBottom: 12 }}>
          <Form.Item name="term" label="学期"><Input style={{ width: 140 }} /></Form.Item>
          <Form.Item name="cls" label="课程班"><Input style={{ width: 160 }} /></Form.Item>
          <Form.Item name="teacher" label="教师"><Input style={{ width: 140 }} /></Form.Item>
          <Form.Item name="room" label="教室"><Input style={{ width: 120 }} /></Form.Item>
          <Form.Item name="time" label="时间"><Input style={{ width: 160 }} /></Form.Item>
          <Form.Item name="weeks" label="周次"><Input style={{ width: 120 }} /></Form.Item>
          <Form.Item name="applicant" label="申请人"><Input style={{ width: 140 }} /></Form.Item>
          <Form.Item name="detail" label="调整说明"><Input style={{ width: 280 }} /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">新增调整</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} rowKey="key" dataSource={logs} columns={[
          {title:'学期',dataIndex:'term'},
          {title:'课程班',dataIndex:'cls'},
          {title:'教师',dataIndex:'teacher'},
          {title:'教室',dataIndex:'room'},
          {title:'时间',dataIndex:'time'},
          {title:'周次',dataIndex:'weeks'},
          {title:'申请人',dataIndex:'applicant'},
          {title:'申请时间',dataIndex:'applyTime'},
          {title:'处理人',dataIndex:'handler'},
          {title:'处理时间',dataIndex:'handleTime'},
          {title:'状态',dataIndex:'status'},
          {title:'调整说明',dataIndex:'detail'},
          {title:'操作',render:(_:any,record:any)=> (
            <Space>
              <Button size="small" type="primary" onClick={()=> approve(record.key)}>通过</Button>
              <Button size="small" danger onClick={()=> reject(record.key)}>驳回</Button>
            </Space>
          )}
        ]} />
      </Card>
    </div>
  )
}

export const PositionsManagement: React.FC = () => {
  const [positions, setPositions] = useState<any[]>([])
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const POSITIONS_KEY = 'positions'
  useEffect(() => {
    const saved = localStorage.getItem(POSITIONS_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const mapped = Array.isArray(parsed) ? parsed.map((r: any) => ({ key: r.key || Date.now().toString(), name: r.name || '', description: r.description || '' })) : []
        setPositions(mapped)
      } catch {}
    } else {
      const seed = [
        { key: 'p1', name: '系主任', description: '负责系部教学与管理' },
        { key: 'p2', name: '教学秘书', description: '负责教学事务协调与安排' },
        { key: 'p3', name: '教师', description: '承担课程教学任务' }
      ]
      setPositions(seed)
    }
  }, [])
  useEffect(() => { localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions)) }, [positions])
  const add = (v: any) => {
    const row = { key: Date.now().toString(), name: v.name || '', description: v.description || '' }
    setPositions((prev) => [row, ...prev]); form.resetFields(); setAddOpen(false)
  }
  const onEdit = (record: any) => { setEditingKey(record.key); editForm.setFieldsValue(record); setEditOpen(true) }
  const saveEdit = (v: any) => {
    setPositions((prev) => prev.map((r) => r.key === editingKey ? { ...r, name: v.name || r.name, description: v.description || r.description } : r))
    setEditOpen(false); setEditingKey(null)
  }
  const remove = (key: string) => { setPositions((prev) => prev.filter((r) => r.key !== key)) }
  return (
    <div>
      <Card className="page-content" title="岗位管理">
        <Space style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={() => setAddOpen(true)}>新增岗位</Button>
        </Space>
        <Table size="small" pagination={false} rowKey="key" dataSource={positions} columns={[
          { title: '岗位名称', dataIndex: 'name' },
          { title: '岗位描述', dataIndex: 'description' },
          { title: '操作', render: (_: any, record: any) => (
            <Space>
              <Button size="small" onClick={() => onEdit(record)}>编辑</Button>
              <Popconfirm title="确认删除该岗位？" onConfirm={() => remove(record.key)}><Button size="small" danger>删除</Button></Popconfirm>
            </Space>
          ) }
        ]} />
        <Modal open={addOpen} title="新增岗位" footer={null} onCancel={() => setAddOpen(false)}>
          <Form form={form} layout="vertical" onFinish={add}>
            <Form.Item name="name" label="岗位名称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="description" label="岗位描述"><Input.TextArea rows={3} /></Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setAddOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
        <Modal open={editOpen} title="编辑岗位" footer={null} onCancel={() => setEditOpen(false)}>
          <Form form={editForm} layout="vertical" onFinish={saveEdit}>
            <Form.Item name="name" label="岗位名称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="description" label="岗位描述"><Input.TextArea rows={3} /></Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setEditOpen(false)}>取消</Button>
            </Space>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export const TeachingTaskReview: React.FC = () => {
  const [rows, setRows] = useState<any[]>([])
  const KEY = 'teachingTasks'
  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved) { try { setRows(JSON.parse(saved)) } catch {} }
  }, [])
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(rows))
  }, [rows])
  const approve = (key: string) => { setRows((prev)=> prev.map((r)=> r.key===key ? { ...r, auditStatus: '已通过' } : r)) }
  const reject = (key: string) => { setRows((prev)=> prev.map((r)=> r.key===key ? { ...r, auditStatus: '已驳回' } : r)) }
  return (
    <div>
      <Card className="page-content" title="教学任务书审核">
        <Table size="small" pagination={false} rowKey="key" dataSource={rows} columns={[
          {title:'教师',dataIndex:'teacher'},
          {title:'课程',dataIndex:'course'},
          {title:'课程班',dataIndex:'cls'},
          {title:'时间',dataIndex:'time'},
          {title:'状态',dataIndex:'status'},
          {title:'审核状态',dataIndex:'auditStatus'},
          {title:'操作',render:(_:any,record:any)=> (
            <Space>
              <Button size="small" type="primary" onClick={()=> approve(record.key)}>通过</Button>
              <Button size="small" danger onClick={()=> reject(record.key)}>驳回</Button>
            </Space>
          )}
        ]} />
      </Card>
    </div>
  )
}

export const TeachingTaskWorkload: React.FC = () => {
  const [offerings, setOfferings] = useState<any[]>([])
  const [majors, setMajors] = useState<any[]>([])
  const [filtersForm] = Form.useForm()
  const [filters, setFilters] = useState<any>({})
  useEffect(() => {
    try {
      const rawOff = localStorage.getItem('offerings') || '[]'
      const rawMaj = localStorage.getItem('basic_major_track') || '[]'
      setOfferings(Array.isArray(JSON.parse(rawOff)) ? JSON.parse(rawOff) : [])
      setMajors(Array.isArray(JSON.parse(rawMaj)) ? JSON.parse(rawMaj) : [])
    } catch {}
  }, [])
  const gradeOptions = useMemo(() => {
    const s = new Set<string>()
    offerings.forEach((o) => { if (o.grade) s.add(String(o.grade)) })
    const y = new Date().getFullYear()
    ;[y, y - 1, y - 2].forEach((v) => s.add(String(v)))
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [offerings])
  const majorOptions = useMemo(() => {
    const s = new Set<string>()
    majors.forEach((m: any) => { const nm = m.name || m.major; if (nm) s.add(String(nm)) })
    return Array.from(s).map((v) => ({ value: v, label: v }))
  }, [majors])
  const filteredOfferings = useMemo(() => {
    return offerings.filter((o) => (
      (!filters.grade || String(o.grade) === String(filters.grade)) &&
      (!filters.major || String(o.major) === String(filters.major))
    ))
  }, [offerings, filters])
  const data = useMemo(() => {
    const levelOf = (majorName: string) => {
      const m = Array.isArray(majors) ? majors.find((x: any) => (x.name || x.major) === majorName) : null
      return m?.level || ''
    }
    const splitTeachers = (scope: any) => String(scope || '').split(/[、，,;\s]+/).map((s) => s.trim()).filter((s) => s.length > 0 && s!=='不限' && s!=='张三')
    const map = new Map<string, any>()
    filteredOfferings.forEach((o: any) => {
      const ts = splitTeachers(o.teacherScope)
      const theory = Number(o.hoursTheory || 0)
      const experiment = Number(o.hoursExperiment || 0)
      const training = Number(o.hoursTraining || 0)
      const practice = Number(o.hoursPractice || 0)
      const total = Number(o.hoursTotal || theory + experiment + training + practice)
      const equiv = theory + experiment * 0.8 + training * 0.7 + practice * 0.6
      const lvl = levelOf(String(o.major || ''))
      ts.forEach((t) => {
        const cur = map.get(t) || { key: t, teacher: t, countU: 0, countZ: 0, planHours: 0, equivHours: 0 }
        if (lvl === '本科') cur.countU += 1
        else if (lvl === '专科') cur.countZ += 1
        else cur.countU += 1
        cur.planHours += total
        cur.equivHours += equiv
        map.set(t, cur)
      })
    })
    const rows = Array.from(map.values()).map((r) => ({
      ...r,
      pass: r.equivHours >= 64 ? '达标' : '未达标'
    }))
    const after = rows.filter((r: any) => (
      (!filters.teacher || String(r.teacher).includes(String(filters.teacher))) &&
      (!filters.pass || String(r.pass) === String(filters.pass))
    ))
    after.sort((a: any, b: any) => String(a.teacher).localeCompare(String(b.teacher)))
    return after
  }, [filteredOfferings, majors, filters])
  return (
    <div>
      <Card className="page-content" title="工作量统计">
        <Form form={filtersForm} layout="inline" onValuesChange={(_, all)=> setFilters(all)} style={{ marginBottom: 12 }}>
          <Form.Item name="grade" label="年级"><Select allowClear style={{ width: 120 }} options={gradeOptions} /></Form.Item>
          <Form.Item name="major" label="专业"><Select allowClear showSearch style={{ width: 180 }} options={majorOptions} /></Form.Item>
          <Form.Item name="teacher" label="教师"><Input style={{ width: 160 }} placeholder="包含" /></Form.Item>
          <Form.Item name="pass" label="达标"><Select allowClear style={{ width: 120 }} options={[{value:'达标',label:'达标'},{value:'未达标',label:'未达标'}]} /></Form.Item>
          <Form.Item><Button onClick={()=> { filtersForm.resetFields(); setFilters({}) }}>重置</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} rowKey="key" dataSource={data} columns={[
          {title:'教师姓名',dataIndex:'teacher'},
          {title:'课程门数(本科)',dataIndex:'countU'},
          {title:'课程门数(专科)',dataIndex:'countZ'},
          {title:'计划总课时',dataIndex:'planHours'},
          {title:'折合总课时',dataIndex:'equivHours'},
          {title:'是否达标',dataIndex:'pass'}
        ]} />
      </Card>
    </div>
  )
}

export const TeachingTaskAdjustLogs: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const LOG_KEY = 'taskAdjustLogs'
  const [form] = Form.useForm()
  useEffect(() => {
    const savedTasks = localStorage.getItem('teachingTasks')
    if (savedTasks) { try { setTasks(JSON.parse(savedTasks)) } catch {} }
    const savedLogs = localStorage.getItem(LOG_KEY)
    if (savedLogs) { try { setLogs(JSON.parse(savedLogs)) } catch {} }
  }, [])
  useEffect(() => { localStorage.setItem(LOG_KEY, JSON.stringify(logs)) }, [logs])
  const add = (v: any) => {
    const t = tasks.find((x)=> x.key===v.taskKey)
    const row = { key: Date.now().toString(), teacher: t?.teacher||'', course: t?.course||'', cls: t?.cls||'', applicant: v.applicant||'匿名', applyTime: new Date().toLocaleString(), handler: '', handleTime: '', status: '待处理', detail: v.detail||'' }
    setLogs((prev)=> [row, ...prev]); form.resetFields()
  }
  const approve = (key: string) => { const h = String(localStorage.getItem('currentUserName')||''); setLogs((prev)=> prev.map((r)=> r.key===key ? { ...r, handler: h||'教务处', handleTime: new Date().toLocaleString(), status: '已通过' } : r)) }
  const reject = (key: string) => { const h = String(localStorage.getItem('currentUserName')||''); setLogs((prev)=> prev.map((r)=> r.key===key ? { ...r, handler: h||'教务处', handleTime: new Date().toLocaleString(), status: '已驳回' } : r)) }
  return (
    <div>
      <Card className="page-content" title="教学任务书调整记录">
        <Form form={form} layout="inline" onFinish={add} style={{ marginBottom: 12 }}>
          <Form.Item name="taskKey" label="任务"><Select showSearch style={{ width: 320 }} options={tasks.map((t)=> ({ value: t.key, label: `${t.teacher||''} - ${t.course||''} - ${t.cls||''}` }))} /></Form.Item>
          <Form.Item name="applicant" label="申请人"><Input style={{ width: 160 }} /></Form.Item>
          <Form.Item name="detail" label="调整说明"><Input style={{ width: 280 }} /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">新增调整</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} rowKey="key" dataSource={logs} columns={[
          {title:'教师',dataIndex:'teacher'},
          {title:'课程',dataIndex:'course'},
          {title:'课程班',dataIndex:'cls'},
          {title:'申请人',dataIndex:'applicant'},
          {title:'申请时间',dataIndex:'applyTime'},
          {title:'处理人',dataIndex:'handler'},
          {title:'处理时间',dataIndex:'handleTime'},
          {title:'状态',dataIndex:'status'},
          {title:'调整说明',dataIndex:'detail'},
          {title:'操作',render:(_:any,record:any)=> (
            <Space>
              <Button size="small" type="primary" onClick={()=> approve(record.key)}>通过</Button>
              <Button size="small" danger onClick={()=> reject(record.key)}>驳回</Button>
            </Space>
          )}
        ]} />
      </Card>
    </div>
  )
}

export const TeachingTask: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([])
  const [taskBooks, setTaskBooks] = useState<any[]>([])
  const [offerings, setOfferings] = useState<any[]>([])
  const [filterForm] = Form.useForm()
  const [rightFilterForm] = Form.useForm()
  const [taskSetupForm] = Form.useForm()
  const [editorForm] = Form.useForm()
  const [taskForm] = Form.useForm()
  const [filters, setFilters] = useState<any>({})
  const [rightFilters, setRightFilters] = useState<any>({})
  const [selectedLeft, setSelectedLeft] = useState<any[]>([])
  const [selectedRightKeys, setSelectedRightKeys] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string>('')
  const [editingCourse, setEditingCourse] = useState<any|null>(null)
  const [previewBooks, setPreviewBooks] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const TASKS_KEY = 'teachingTasks'
  const BOOKS_KEY = 'teachingTaskBooks'
  useEffect(() => {
    const saved = localStorage.getItem(TASKS_KEY)
    if (saved) { try { setTasks(JSON.parse(saved)) } catch {} }
    const rawBooks = localStorage.getItem(BOOKS_KEY)
    if (rawBooks) { try { setTaskBooks(JSON.parse(rawBooks)) } catch {} }
    const rawOff = localStorage.getItem('offerings')
    if (rawOff) { try { setOfferings(JSON.parse(rawOff)) } catch {} }
    try {
      let list:any[]=[]
      const rawCache = localStorage.getItem('cache_users_list') || '{}'
      const rawSys = localStorage.getItem('sys_users') || '[]'
      try { const parsed = JSON.parse(rawCache); if (parsed && Array.isArray(parsed.list)) list = parsed.list } catch {}
      if (!Array.isArray(list) || list.length===0) { try { list = JSON.parse(rawSys) } catch {} }
      setUsers(Array.isArray(list)?list:[])
    } catch {}
  }, [])
  useEffect(() => {
    const onStorage = (e: any) => {
      if (!e) return
      if (e.key === 'offerings' || e.key === 'db_offering_class_links' || e.key === 'db_offering_teacher_links') {
        try { const rawOff = localStorage.getItem('offerings') || '[]'; setOfferings(JSON.parse(rawOff)) } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  useEffect(() => { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem(BOOKS_KEY, JSON.stringify(taskBooks)) }, [taskBooks])
  useEffect(() => {
    try {
      const data = encodeURIComponent(JSON.stringify(taskBooks))
      const url = `data:text/json;charset=utf-8,${data}`
      setDownloadUrl(url)
    } catch {}
  }, [taskBooks])
  return (
    <div>
      <Card className="page-content" title="教学任务分配">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={12}>
            <Col span={8}>
              <Card size="small" title="教学任务书分配">
                <div style={{ background:'#f6d6d6', border:'1px solid #d9a3a3', padding:12, borderRadius:4, color:'#333', marginBottom:12, lineHeight:1.7, fontSize:14 }}>
                  {(() => {
                    const o = editingCourse || {}
                    const items:any[] = [
                      `学年学期：2025~2026学年第一学期\u00a0\u00a0年级：${o.grade||''}\u00a0\u00a0专业：${o.major||''}`,
                      `课程名称（编号）：${o.course||''}${o.code?`（${o.code}）`:''}`,
                      `课程类型：${o.category||''}\u00a0\u00a0总学时：${Number(o.hoursTotal|| Number(o.hoursTheory||0)+Number(o.hoursExperiment||0)+Number(o.hoursTraining||0)+Number(o.hoursPractice||0))}`,
                      `课程类别：${o.position||'必修课'}\u00a0\u00a0考核方式：${o.assess||''}`,
                      `关联班级：${String(o.linkedClass||'').trim()}`,
                      `关联教师：${String(o.teacherScope||'').trim()}`
                    ]
                    return items.map((t,idx)=> (<div key={idx}>{t}</div>))
                  })()}
                </div>
                <Form form={editorForm} layout="vertical" style={{ marginTop: 12 }} onValuesChange={(changed) => {
                  if (Object.prototype.hasOwnProperty.call(changed, '是否分组') && String(changed['是否分组']) !== '是') {
                    try { editorForm.setFieldsValue({ 组数: undefined, 每组人数: undefined }) } catch {}
                  }
                }}>
                  <Row gutter={12}>
                    <Col span={12}><Form.Item name="选择第一任课教师" label="选择第一任课教师"><Select allowClear showSearch options={users.map((u:any)=> ({ value: String(u.name||u.username||''), label: String(u.name||u.username||'') }))} /></Form.Item></Col>
                    <Col span={12}><Form.Item name="选择第二任课教师" label="选择第二任课教师"><Select allowClear showSearch options={users.map((u:any)=> ({ value: String(u.name||u.username||''), label: String(u.name||u.username||'') }))} /></Form.Item></Col>
                    <Col span={24}><Form.Item name="上课班级组成" label="上课班级组成"><Select allowClear options={[{value:'自然班',label:'自然班'},{value:'合班',label:'合班'},{value:'分班',label:'分班'}]} /></Form.Item></Col>
                    <Col span={24}><Form.Item name="教学班级名称" label="教学班级名称"><Input placeholder="确保提交后自动生成上课班号" /></Form.Item></Col>
                    <Col span={24}><Form.Item name="行标班级" label="行标班级"><Input.TextArea rows={3} placeholder="示例：计科1班(60人)；计科2班(60人)；计科实验班(30人)" /></Form.Item></Col>
                    <Col span={8}><Form.Item name="合班数" label="合班数"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={8}><Form.Item name="连上节数" label="连上节数"><Select allowClear options={[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'}]} /></Form.Item></Col>
                    <Col span={8}><Form.Item name="单双" label="单双"><Select allowClear options={[{value:'不区分',label:'不区分'},{value:'单周',label:'单周'},{value:'双周',label:'双周'}]} /></Form.Item></Col>
                    <Col span={8}><Form.Item name="周次" label="周次"><Input placeholder="1-18" /></Form.Item></Col>
                    <Col span={12}><Form.Item name="周时分布" label="周时分布"><Select allowClear options={[{value:'周一-周三',label:'周一-周三'},{value:'周一-周五',label:'周一-周五'}]} /></Form.Item></Col>
                    <Col span={12}><Form.Item name="选择上课地点" label="选择上课地点"><Input placeholder="如：一号楼-301" /></Form.Item></Col>
                    <Col span={8}><Form.Item name="是否分组" label="是否分组"><Select allowClear options={[{value:'否',label:'否'},{value:'是',label:'是'}]} /></Form.Item></Col>
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev['是否分组'] !== cur['是否分组']}>
                      {({ getFieldValue }) => {
                        const grouped = String(getFieldValue('是否分组')) === '是'
                        return (
                          <>
                            <Col span={8} style={{ display: grouped ? 'block' : 'none' }}><Form.Item name="组数" label="组数"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                            <Col span={8} style={{ display: grouped ? 'block' : 'none' }}><Form.Item name="每组人数" label="每组人数"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                          </>
                        )
                      }}
                    </Form.Item>
                  </Row>
                </Form>
                <Space style={{ marginTop: 12 }}>
                  <Button onClick={() => {
                    const o = editingCourse
                    if (!o) return
                    const v = editorForm.getFieldsValue()
                    const row = {
                      key: `${Date.now()}_preview`,
                      academic: '2025~2026学年第一学期',
                      term: String(o.term||''),
                      college: '',
                      major: String(o.major||''),
                      grade: String(o.grade||''),
                      code: String(o.code||''),
                      course: String(o.course||''),
                      nature: String(o.category||''),
                      hoursTotal: Number(v['总学时']|| Number(o.hoursTotal||0)),
                      credit: Number(v['学分']|| Number(o.credit||0)),
                      assess: String(o.assess||''),
                      weekHours: '',
                      time: String(v['上课时间']||''),
                      weeks: '1-16',
                      location: String(v['选择上课地点']||''),
                      cls: String(v['教学班级名称']||''),
                      teacher: String(v['选择第一任课教师']||''),
                      teacherTitle: '',
                      teacherDept: String(o.department||''),
                      requirements: `授课方式:${String(v['授课方式']||'')}`,
                      approvalChain: String(o.auditChain||'系主任→教秘→教务处'),
                      secondTeacher: String(v['选择第二任课教师']||'')
                    }
                    setPreviewBooks([row])
                  }}>预览</Button>
                  <Button type="primary" onClick={() => {
                    const o = editingCourse
                    if (!o) return
                    const v = editorForm.getFieldsValue()
                    const row = {
                      key: `${Date.now()}_book`,
                      academic: '2025~2026学年第一学期',
                      term: String(o.term||''),
                      college: '',
                      major: String(o.major||''),
                      grade: String(o.grade||''),
                      code: String(o.code||''),
                      course: String(o.course||''),
                      nature: String(o.category||''),
                      hoursTotal: Number(v['总学时']|| Number(o.hoursTotal||0)),
                      credit: Number(v['学分']|| Number(o.credit||0)),
                      assess: String(o.assess||''),
                      weekHours: '',
                      time: String(v['上课时间']||''),
                      weeks: '1-16',
                      location: String(v['选择上课地点']||''),
                      cls: String(v['教学班级名称']||''),
                      teacher: String(v['选择第一任课教师']||''),
                      teacherTitle: '',
                      teacherDept: String(o.department||''),
                      requirements: `授课方式:${String(v['授课方式']||'')}`,
                      approvalChain: String(o.auditChain||'系主任→教秘→教务处'),
                      secondTeacher: String(v['选择第二任课教师']||'')
                    }
                    setTaskBooks((prev)=> [row, ...prev])
                  }}>确认任务书</Button>
                </Space>
              </Card>
            </Col>
            <Col span={1}>
              <Space direction="vertical" style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Button onClick={() => {
                  const filtered = offerings.filter((o:any)=> (
                    (!filters.grade || String(o.grade)===String(filters.grade)) &&
                    (!filters.major || String(o.major)===String(filters.major)) &&
                    (!filters.courseCombined || String(o.course)===String(filters.courseCombined)) &&
                    (!filters.department || String(o.department)===String(filters.department)) &&
                    (!rightFilters.grade || String(o.grade)===String(rightFilters.grade)) &&
                    (!rightFilters.major || String(o.major)===String(rightFilters.major)) &&
                    (!rightFilters.courseCombined || String(o.course)===String(rightFilters.courseCombined)) &&
                    (!rightFilters.department || String(o.department)===String(rightFilters.department))
                  ))
                  const list:any[]=[]
                  filtered.forEach((o:any)=>{
                    const raw=String(o.linkedClass||'')
                    const arr=raw.split(/[、，,;；\s]+/).map(s=>s.trim()).filter(s=>s.length>0)
                    const gen=arr.length>0?arr:[`${String(o.major||'')}${String(o.grade||'')}-1`]
                    gen.forEach((c)=>{ list.push({ key:`${o.key}_${c}`, grade:String(o.grade||''), major:String(o.major||''), course:String(o.course||''), cls:c, capacity:Number(o.classSizeThreshold||40) }) })
                  })
                  const exist=new Set(selectedLeft.map((c:any)=> c.key))
                  const merged=[...selectedLeft]
                  list.forEach((c:any)=>{ if(!exist.has(c.key)) merged.push(c) })
                  setSelectedLeft(merged)
                }}>←</Button>
              </Space>
            </Col>
            <Col span={15}>
              <Card size="small" title="开课计划">
                <Form form={rightFilterForm} layout="inline" onValuesChange={(_, all) => setRightFilters(all)} style={{ marginBottom: 8 }}>
                  <Form.Item name="grade" label="年级"><Select allowClear style={{ width: 120 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.grade) s.add(String(o.grade)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
                  <Form.Item name="major" label="专业"><Select allowClear showSearch style={{ width: 180 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.major) s.add(String(o.major)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
                  <Form.Item name="courseCombined" label="课程"><Select allowClear showSearch style={{ width: 240 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.course) s.add(String(o.course)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
                  <Form.Item name="department" label="承担单位"><Select allowClear showSearch style={{ width: 180 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.department) s.add(String(o.department)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
                  <Form.Item><Button onClick={() => { rightFilterForm.resetFields(); setRightFilters({}) }}>重置</Button></Form.Item>
                </Form>
                <Table
                  size="small"
                  pagination={{ pageSize: 6 }}
                  rowKey="key"
                  dataSource={(() => {
                    const filtered = offerings.filter((o:any)=> (
                      (!filters.grade || String(o.grade)===String(filters.grade)) &&
                      (!filters.major || String(o.major)===String(filters.major)) &&
                      (!filters.courseCombined || String(o.course)===String(filters.courseCombined)) &&
                      (!filters.department || String(o.department)===String(filters.department)) &&
                      (!rightFilters.grade || String(o.grade)===String(rightFilters.grade)) &&
                      (!rightFilters.major || String(o.major)===String(rightFilters.major)) &&
                      (!rightFilters.courseCombined || String(o.course)===String(rightFilters.courseCombined)) &&
                      (!rightFilters.department || String(o.department)===String(rightFilters.department))
                    ))
                    const list:any[]=[]
                    filtered.forEach((o:any)=>{
                      const raw=String(o.linkedClass||'')
                      const arr=raw.split(/[、，,;；\s]+/).map(s=>s.trim()).filter(s=>s.length>0)
                      const gen=arr.length>0?arr:[`${String(o.major||'')}${String(o.grade||'')}-1`]
                      gen.forEach((c)=>{ list.push({
                        key:`${o.key}_${c}`,
                        academic:String(o.academic||''),
                        grade:String(o.grade||''),
                        major:String(o.major||''),
                        course:String(o.course||''),
                        code:String(o.code||''),
                        department:String(o.department||''),
                        ctype:String(o.ctype||'') || '-',
                        hoursTotal:Number(o.hoursTotal||0),
                        linkedClass:String(o.linkedClass||''),
                        teacherScope:String(o.teacherScope||'') || '',
                        cls:c,
                        capacity:Number(o.classSizeThreshold||40),
                        __off:o
                      }) })
                    })
                    list.sort((a,b)=> String(a.major).localeCompare(String(b.major)) || String(a.cls).localeCompare(String(b.cls)))
                    return list
                  })()}
                  onRow={(r:any)=> ({ onClick: ()=> {
                    setEditingCourse(r.__off)
                    try {
                      const th = Number(r.__off?.hoursTheory||0)
                      const lab = Number(r.__off?.hoursExperiment||0)
                      const trn = Number(r.__off?.hoursTraining||0)
                      const prac = Number(r.__off?.hoursPractice||0)
                      editorForm.setFieldsValue({
                        教学班级名称: r.cls,
                        上课时间: '',
                        选择上课地点: '',
                        选择第一任课教师: '',
                        选择第二任课教师: '',
                        上课班级组成: '',
                        行标班级: '',
                        连上节数: '',
                        单双: '不区分',
                        周次: '1-18',
                        周时分布: '周一-周五',
                        授课方式: r.__off?.category||'',
                        学分: Number(r.__off?.credit||0),
                        总学时: th+lab+trn+prac,
                        理论学时: th,
                        实验学时: lab,
                        实训学时: trn,
                        合班数: 0,
                        组数: 0,
                        每组人数: 0
                      })
                    } catch {}
                  } })}
                  rowSelection={{ type:'checkbox', selectedRowKeys:selectedRightKeys, onChange:(keys)=> setSelectedRightKeys(keys as string[]) }}
                  columns={[
                    { title:'学年学期', render: () => '2025~2026学年第一学期', width: 160 },
                    { title:'年级', dataIndex:'grade', width: 100 },
                    { title:'专业', dataIndex:'major', width: 180 },
                    { title:'课程名称(编号)', render: (_:any, r:any) => `${r.course||''}${r.code?`(${r.code})`:''}` },
                    { title:'承担单位', dataIndex:'department', width: 160 },
                    { title:'课程类型', dataIndex:'ctype', width: 140 },
                    { title:'总学时', dataIndex:'hoursTotal', width: 100 },
                    { title:'关联班级', dataIndex:'linkedClass', width: 200 },
                    { title:'关联教师', dataIndex:'teacherScope', width: 160 }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Space>
      </Card>

      <Card className="page-content" title="预览">
        <Table
          size="small"
          pagination={false}
          rowKey="key"
          dataSource={previewBooks}
          columns={[
            {title:'学年学期',dataIndex:'academic', render:()=> '2025~2026学年第一学期'},
            {title:'课程编号',dataIndex:'code'},
            {title:'课程名称',dataIndex:'course'},
            {title:'课程性质',dataIndex:'nature'},
            {title:'总学时',dataIndex:'hoursTotal'},
            {title:'学分',dataIndex:'credit'},
            {title:'上课时间',dataIndex:'time'},
            {title:'授课班级',dataIndex:'cls'},
            {title:'主讲教师',dataIndex:'teacher'},
            {title:'第二任课教师',dataIndex:'secondTeacher'}
          ]}
        />
      </Card>

      <Card className="page-content" title="教学任务书">
        <Table
          size="small"
          pagination={false}
          rowKey="key"
          dataSource={taskBooks}
          columns={[
            {title:'学年学期',dataIndex:'academic', render:()=> '2025~2026学年第一学期'},
            {title:'学院',dataIndex:'college'},
            {title:'专业',dataIndex:'major'},
            {title:'年级',dataIndex:'grade'},
            {title:'课程编号',dataIndex:'code'},
            {title:'课程名称',dataIndex:'course'},
            {title:'课程性质',dataIndex:'nature'},
            {title:'总学时',dataIndex:'hoursTotal'},
            {title:'学分',dataIndex:'credit'},
            {title:'考核方式',dataIndex:'assess'},
            {title:'周学时',dataIndex:'weekHours'},
            {title:'上课时间',dataIndex:'time'},
            {title:'授课周次',dataIndex:'weeks'},
            {title:'上课地点',dataIndex:'location'},
            {title:'授课班级',dataIndex:'cls'},
            {title:'主讲教师',dataIndex:'teacher'},
            {title:'职称',dataIndex:'teacherTitle'},
            {title:'所属系',dataIndex:'teacherDept'},
            {title:'教学要求',dataIndex:'requirements'},
            {title:'审批信息',dataIndex:'approvalChain'}
          ]}
        />
        <Space style={{ marginTop: 12 }}>
          <a href={downloadUrl} download={`教学任务书_${Date.now()}.json`}><Button disabled={!taskBooks.length}>导出JSON</Button></a>
        </Space>
      </Card>
    </div>
  )
}

export const TeachingTaskTeacherCourseStats: React.FC = () => {
  const [offerings, setOfferings] = useState<any[]>([])
  const [teacherLinkDB, setTeacherLinkDB] = useState<Record<string, { teachers: string[]; createdAt: number }>>({})
  const [users, setUsers] = useState<any[]>([])
  const [filtersForm] = Form.useForm()
  const [filters, setFilters] = useState<any>({})
  useEffect(() => {
    try {
      const rawOff = localStorage.getItem('offerings') || '[]'
      const rawTL = localStorage.getItem('db_offering_teacher_links') || '{}'
      const rawSys = localStorage.getItem('sys_users') || '[]'
      const rawCache = localStorage.getItem('cache_users_list') || '{}'
      setOfferings(Array.isArray(JSON.parse(rawOff)) ? JSON.parse(rawOff) : [])
      const tl = JSON.parse(rawTL)
      setTeacherLinkDB(tl && typeof tl==='object' ? tl : {})
      let list: any[] = []
      try { const parsed = JSON.parse(rawCache); if (parsed && Array.isArray(parsed.list)) list = parsed.list } catch {}
      if (!Array.isArray(list) || list.length===0) { try { const arr = JSON.parse(rawSys); list = Array.isArray(arr) ? arr : [] } catch {} }
      setUsers(list)
    } catch {}
  }, [])
  const userMap = useMemo(() => {
    const m = new Map<string, any>()
    users.forEach((u:any)=> { if (u?.name) m.set(String(u.name), u) })
    return m
  }, [users])
  const splitTeachers = (scope: any) => String(scope || '').split(/[、，,;；\s]+/).map((s) => s.trim()).filter((s) => s.length > 0 && s!=='不限' && s!=='张三')
  const data = useMemo(() => {
    const groups = new Map<string, any>()
    const list = offerings.filter((o)=> (
      (!filters.grade || String(o.grade)===String(filters.grade)) &&
      (!filters.major || String(o.major)===String(filters.major))
    ))
    list.forEach((o:any)=>{
      const keyCombined = `${o.course||''}${o.code?`(${o.code})`:''}`
      const explicit = teacherLinkDB[keyCombined]?.teachers || []
      const ts = explicit.length>0 ? explicit : splitTeachers(o.teacherScope)
      ts.forEach((t)=>{
        const u = userMap.get(String(t)) || {}
        const dept = u?.department || o.department || ''
        const job = u?.jobNo ? `（${u.jobNo}）` : ''
        const g = groups.get(t) || { key: `grp-${t}`, teacher: t, teacherDisplay: `${t}${job}`, dept, count: 0, total: 0, children: [] as any[] }
        const theory = Number(o.hoursTheory||0), experiment = Number(o.hoursExperiment||0), training = Number(o.hoursTraining||0), practice = Number(o.hoursPractice||0)
        const total = Number(o.hoursTotal|| theory+experiment+training+practice)
        g.count += 1
        g.total += total
        g.children.push({ key: `${t}-${o.key}`, code: o.code||'', course: o.course||'', category: `${o.category||''}${o.nature?`/${o.nature}`:''}`, credit: Number(o.credit||0), hoursTheory: theory, hoursExperiment: experiment, hoursTraining: training, hoursPractice: practice,承担学时: total, assess: o.assess||'' })
        groups.set(t, g)
      })
    })
    let arr = Array.from(groups.values())
    if (filters.teacher) arr = arr.filter((g:any)=> String(g.teacherDisplay).includes(String(filters.teacher)))
    arr.forEach((g:any)=> { g.children.sort((a:any,b:any)=> String(a.course).localeCompare(String(b.course))) })
    arr.sort((a:any,b:any)=> String(a.teacher).localeCompare(String(b.teacher)))
    return arr
  }, [offerings, teacherLinkDB, userMap, filters])
  return (
    <div>
      <Card className="page-content" title="任课教师承担课程统计">
        <Form form={filtersForm} layout="inline" onValuesChange={(_, all)=> setFilters(all)} style={{ marginBottom: 12 }}>
          <Form.Item name="grade" label="年级"><Select allowClear style={{ width: 120 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.grade) s.add(String(o.grade)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
          <Form.Item name="major" label="专业"><Select allowClear showSearch style={{ width: 180 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.major) s.add(String(o.major)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
          <Form.Item name="teacher" label="教师"><Input style={{ width: 200 }} placeholder="包含" /></Form.Item>
          <Form.Item><Button onClick={()=> { filtersForm.resetFields(); setFilters({}) }}>重置</Button></Form.Item>
        </Form>
        <Table size="small" pagination={false} rowKey="key" dataSource={data} expandable={{ defaultExpandAllRows: true }} columns={[
          { title:'所属院系', render: (_:any, r:any) => r.children ? r.dept||'' : '' },
          { title:'教师姓名（工号）', render: (_:any, r:any) => r.children ? r.teacherDisplay||'' : '' },
          { title:'承担课程门数', render: (_:any, r:any) => r.children ? r.count||0 : '' },
          { title:'学时', render: (_:any, r:any) => r.children ? r.total||0 : '' },
          { title:'课程编号', dataIndex:'code', render: (_:any, r:any) => r.children ? '' : r.code },
          { title:'课程名称', dataIndex:'course', render: (_:any, r:any) => r.children ? '' : r.course },
          { title:'课程类别', dataIndex:'category', render: (_:any, r:any) => r.children ? '' : r.category },
          { title:'学分', dataIndex:'credit', render: (_:any, r:any) => r.children ? '' : r.credit },
          { title:'讲授', dataIndex:'hoursTheory', render: (_:any, r:any) => r.children ? '' : r.hoursTheory },
          { title:'实验', dataIndex:'hoursExperiment', render: (_:any, r:any) => r.children ? '' : r.hoursExperiment },
          { title:'实训', dataIndex:'hoursTraining', render: (_:any, r:any) => r.children ? '' : r.hoursTraining },
          { title:'实践', dataIndex:'hoursPractice', render: (_:any, r:any) => r.children ? '' : r.hoursPractice },
          { title:'承担学时', dataIndex:'承担学时', render: (_:any, r:any) => r.children ? '' : r['承担学时'] },
          { title:'考核方式', dataIndex:'assess', render: (_:any, r:any) => r.children ? '' : r.assess }
        ]} />
      </Card>
    </div>
  )
}

export const TimetablePublish: React.FC = () => {
  return (
    <div>
      <Card className="page-content" title="课表视图">
        <Tabs items={[
          { key:'teacher', label:'教师', children:<Table size="small" pagination={false} dataSource={[]} columns={[{title:'时间',dataIndex:'time'},{title:'课程',dataIndex:'course'}]} />},
          { key:'student', label:'学生', children:<Table size="small" pagination={false} dataSource={[]} columns={[{title:'时间',dataIndex:'time'},{title:'课程',dataIndex:'course'}]} />},
          { key:'class', label:'班级', children:<Table size="small" pagination={false} dataSource={[]} columns={[{title:'时间',dataIndex:'time'},{title:'课程',dataIndex:'course'}]} />},
          { key:'room', label:'教室', children:<Table size="small" pagination={false} dataSource={[]} columns={[{title:'时间',dataIndex:'time'},{title:'课程',dataIndex:'course'}]} />},
        ]} />
      </Card>
      <Card className="page-content" title="发布管理">
        <Form layout="inline">
          <Form.Item label="发布状态"><Select options={[{value:'草稿',label:'草稿'},{value:'发布',label:'发布'}]} /></Form.Item>
          <Form.Item><Button type="primary">发布课表</Button></Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export const Adjustments: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h2>调停课管理</h2>
        <p>调课/停课申请、审批与级联更新</p>
      </div>
      <Card className="page-content" title="调停课申请">
        <Form layout="inline">
          <Form.Item label="课程班"><Input placeholder="如：数据结构-01" /></Form.Item>
          <Form.Item label="原因"><Input placeholder="教师出差/教室维护" /></Form.Item>
          <Form.Item><Button type="primary">提交申请</Button></Form.Item>
        </Form>
      </Card>
      <Card className="page-content" title="审批队列">
        <Table size="small" pagination={false} dataSource={[]} columns={[{title:'申请人',dataIndex:'applicant'},{title:'类型',dataIndex:'type'},{title:'状态',dataIndex:'status'}]} />
      </Card>
    </div>
  )
}

export const ApprovalsAndNotifications: React.FC = () => {
  const navigate = useNavigate()
  const loc = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [sorter, setSorter] = useState<{ field?: string; order?: 'ascend'|'descend' }>({ field: 'submitTime', order: 'descend' })
  const pullingRef = useRef(false)
  const pullYRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const pollRef = useRef<number | null>(null)

  const userId = String(localStorage.getItem('currentUserId') || 'u_demo')
  const userRoles = (() => { try { const raw = localStorage.getItem('currentUserRoles') || '[]'; const arr = JSON.parse(raw); return Array.isArray(arr) ? arr.map(String) : [] } catch { return [] } })()

  const seedIfEmpty = () => {
    if (items.length > 0) return
    const now = Date.now()
    const gen = Array.from({ length: 25 }).map((_, i) => ({
      id: `AP-${1000 + i}`,
      code: `AP-${1000 + i}`,
      title: i % 3 === 0 ? '开课计划审核' : i % 3 === 1 ? '排课调整审批' : '培养方案变更审批',
      submitTime: new Date(now - i * 3600_000).toISOString(),
      status: '待审核',
      priority: (['低','中','高'])[i % 3],
      applicant: i % 2 === 0 ? '张三' : '李四',
      visibleTo: [userId, ...(userRoles.includes('管理员') ? ['*'] : [])]
    }))
    setItems(gen)
    setTotal(gen.length)
  }

  const fetchPending = async (opts?: { page?: number; pageSize?: number; sortField?: string; sortOrder?: 'ascend'|'descend' }) => {
    const pg = opts?.page ?? page
    const ps = opts?.pageSize ?? pageSize
    const sf = opts?.sortField ?? sorter.field ?? 'submitTime'
    const so = opts?.sortOrder ?? sorter.order ?? 'descend'
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    setError(null)
    try {
      const url = `/api/approvals/pending?userId=${encodeURIComponent(userId)}&page=${pg}&pageSize=${ps}&sort=${sf}&order=${so}`
      const res = await fetch(url, { signal: ac.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const list = Array.isArray(data?.items) ? data.items : []
      const safe = list.filter((x: any) => String(x.status || '') === '待审核' && ((x.visibleTo || []).includes(userId) || (x.visibleTo || []).includes('*')))
      setItems(safe)
      setTotal(Number(data?.total || safe.length))
      setPage(pg)
      setPageSize(ps)
    } catch (e: any) {
      setError('网络异常，已切换为本地演示数据')
      seedIfEmpty()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending({ page: 1, pageSize: 20 })
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(() => { fetchPending({ page, pageSize }) }, 15_000)
    return () => { abortRef.current?.abort(); if (pollRef.current) window.clearInterval(pollRef.current) }
  }, [])

  const onTableChange = (_: any, __: any, sorterArg: any) => {
    const field = sorterArg?.field || sorterArg?.columnKey || 'submitTime'
    const order = sorterArg?.order || 'descend'
    setSorter({ field, order })
    fetchPending({ page: 1, pageSize, sortField: field, sortOrder: order })
  }

  const startPull = (e: React.TouchEvent<HTMLDivElement>) => { pullingRef.current = true; pullYRef.current = e.touches[0]?.clientY || 0 }
  const movePull = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!pullingRef.current) return
    const dy = (e.touches[0]?.clientY || 0) - pullYRef.current
    if (dy > 60) { pullingRef.current = false; fetchPending({ page: 1, pageSize }) }
  }
  const endPull = () => { pullingRef.current = false }

  const handleApprove = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
    message.success('审核通过')
  }
  const handleView = (id: string) => { navigate(`/approvals?detail=${encodeURIComponent(id)}`) }

  const query = new URLSearchParams(loc.search)
  const detailId = query.get('detail') || ''
  const detailItem = items.find((x) => String(x.id) === String(detailId)) || null

  return (
    <div>
      <div className="page-header">
        <h2>待审核事项</h2>
        <p>只显示当前用户有权限的待审核记录</p>
      </div>
      <Card className="page-content" title="待审核列表" extra={<Space><Button onClick={()=> fetchPending({ page: 1, pageSize })}>刷新</Button>{error? <span style={{color:'#faad14'}}>{error}</span>: null}</Space>}>
        <div onTouchStart={startPull} onTouchMove={movePull} onTouchEnd={endPull}>
          <Table
            size="small"
            rowKey={(r:any)=> r.id || r.code}
            loading={loading}
            dataSource={items}
            locale={{ emptyText: loading ? '加载中...' : '暂无待审核事项' }}
            pagination={{ current: page, pageSize, total, showSizeChanger: true, pageSizeOptions: ['10','20','50'], onChange: (p, s)=> { setPage(p); setPageSize(s); fetchPending({ page: p, pageSize: s }) } }}
            onChange={onTableChange}
            columns={[
              { title:'事项ID/编号', dataIndex:'id', key:'id', width: 160 },
              { title:'事项标题/名称', dataIndex:'title', key:'title' },
              { title:'提交时间', dataIndex:'submitTime', key:'submitTime', sorter:true },
              { title:'当前状态', dataIndex:'status', key:'status', width: 100 },
              { title:'优先级', dataIndex:'priority', key:'priority', sorter:true, width: 100 },
              { title:'操作', key:'op', fixed:'right', width: 160, render: (_:any, r:any)=> (
                <Space>
                  <Button size="small" type="primary" onClick={()=> handleApprove(r.id)}>审核</Button>
                  <Button size="small" onClick={()=> handleView(r.id)}>详情</Button>
                </Space>
              )}
            ]}
          />
        </div>
      </Card>
      <Modal open={Boolean(detailItem)} title="事项详情" onCancel={()=> navigate('/approvals')} footer={<Button onClick={()=> navigate('/approvals')}>关闭</Button>}>
        {detailItem ? (
          <Descriptions column={1} size="small" items={[
            { label:'事项ID', children: detailItem.id },
            { label:'事项标题', children: detailItem.title },
            { label:'提交时间', children: detailItem.submitTime },
            { label:'状态', children: detailItem.status },
            { label:'优先级', children: detailItem.priority },
            { label:'申请人', children: detailItem.applicant }
          ]} />
        ) : null}
      </Modal>
    </div>
  )
}

export const ImportExportIntegration: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h2>导入导出与对接</h2>
        <p>Excel模板导入/导出，SSO与主数据同步</p>
      </div>
      <Card className="page-content" title="Excel 模板">
        <Form layout="inline">
          <Form.Item label="模板"><Select options={[{value:'人员',label:'人员'},{value:'课程',label:'课程'},{value:'方案',label:'方案'},{value:'开课计划',label:'开课计划'},{value:'排课',label:'排课'}]} /></Form.Item>
          <Form.Item><Button>下载模板</Button></Form.Item>
          <Form.Item><Button type="primary">导入数据</Button></Form.Item>
        </Form>
      </Card>
      <Card className="page-content" title="系统对接">
        <Table size="small" pagination={false} dataSource={[]} columns={[{title:'系统',dataIndex:'system'},{title:'模式',dataIndex:'mode'},{title:'状态',dataIndex:'status'}]} />
      </Card>
    </div>
  )
}

export const ReportsAnalytics: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h2>报表与统计</h2>
        <p>开课门数/学分对账、教师工作量、教室利用率、冲突统计</p>
      </div>
      <Card className="page-content" title="教师工作量">
        <Table size="small" pagination={false} dataSource={[]} columns={[{title:'教师',dataIndex:'teacher'},{title:'课时',dataIndex:'hours'},{title:'折合课时',dataIndex:'equiv'}]} />
      </Card>
      <Card className="page-content" title="教室利用率">
        <Table size="small" pagination={false} dataSource={[]} columns={[{title:'教室',dataIndex:'room'},{title:'利用率',dataIndex:'util'}]} />
      </Card>
    </div>
  )
}

export const CourseCatalog: React.FC = () => {
  type Course = {
    key: string
    category: string
    nature: string
    ctype: string
    discipline: string
    code: string
    name: string
    credit: number
    hoursTheory: number
    hoursExperiment: number
    hoursTraining: number
    hoursPractice: number
    hoursTotal: number
    assess: string
    openSemester: string
    source: string
  }
  const CATALOG_KEY = 'courseCatalog'
  const [courses, setCourses] = useState<Course[]>([])
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [courseForm] = Form.useForm()
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  type Elective = {
    key: string
    ctype: string
    nature: string
    module: string
    code: string
    name: string
    credit: number
    hoursTheory: number
    hoursExperiment: number
    hoursTraining: number
    hoursPractice: number
    hoursTotal: number
    assess: string
    weekHours: number
    delivery: string
    department: string
  }
  const ELECTIVE_KEY = 'publicElectives'
  const [electives, setElectives] = useState<Elective[]>([])
  const [electEditingKey, setElectEditingKey] = useState<string | null>(null)
  const [electForm] = Form.useForm()
  const [electModalOpen, setElectModalOpen] = useState(false)
  useEffect(() => {
    if (electModalOpen && !electEditingKey) {
      try {
        electForm.setFieldsValue({ credit: 0, hoursTotal: 0, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, weekHours: 0 })
      } catch {}
    }
  }, [electModalOpen, electEditingKey])
  

  

  const courseCategoryOptions = [
    { value: '通识课程', label: '通识课程' },
    { value: '学科基础教育', label: '学科基础教育' },
    { value: '专业课程', label: '专业课程' },
    { value: '实践课程', label: '实践课程' },
  ]
  const natureMap: Record<string, { value: string; label: string }[]> = {
    '通识课程': [
      { value: '通识必修', label: '通识必修' },
      { value: '通识选修（限选）', label: '通识选修（限选）' },
      { value: '通识选修（任选）', label: '通识选修（任选）' },
      { value: '通识选修（一任选）', label: '通识选修（一任选）' },
    ],
    '学科基础教育': [
      { value: '数理基础', label: '数理基础' },
      { value: '工程基础', label: '工程基础' },
      { value: '信息基础', label: '信息基础' },
      { value: '人文社科基础', label: '人文社科基础' },
    ],
    '专业课程': [
      { value: '专业核心课', label: '专业核心课' },
      { value: '专业选修课', label: '专业选修课' },
      { value: '专业方向课', label: '专业方向课' },
    ],
    '实践课程': [
      { value: '基础实践', label: '基础实践' },
      { value: '综合实践', label: '综合实践' },
      { value: '创新实践', label: '创新实践' },
    ],
  }
  const typeOptions = [
    { value: '理论课（含课内实验实训）', label: '理论课（含课内实验实训）' },
    { value: '独立设置的实验课', label: '独立设置的实验课' },
    { value: '校内实践（集中）', label: '校内实践（集中）' },
    { value: '校内实践（分散）', label: '校内实践（分散）' },
    { value: '校外实践（集中）', label: '校外实践（集中）' },
    { value: '校外实践（分散）', label: '校外实践（分散）' },
  ]
  const watchCategory = Form.useWatch('category', courseForm)
  const natureOptions = useMemo(() => natureMap[String(watchCategory||'')] || [], [watchCategory])
  const watchNature = Form.useWatch('nature', courseForm)
  useEffect(() => {
    if (watchNature && natureOptions.length && !natureOptions.some(o => String(o.value) === String(watchNature))) {
      courseForm.setFieldsValue({ nature: undefined })
    }
  }, [watchCategory, natureOptions, watchNature])

  useEffect(() => {
    const saved = localStorage.getItem(CATALOG_KEY)
    if (saved) {
      try {
        const list = JSON.parse(saved)
        if (Array.isArray(list) && list.length > 0) {
          setCourses(list)
          return
        }
      } catch {}
    }
    const seed: Course[] = [
      { key: 'c1', category: '专业课', nature: '必修', ctype: '理论', discipline: '', code: 'CUR08090101', name: '数据结构', credit: 4, hoursTheory: 48, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 48, assess: '考试', openSemester: '3', source: '人才培养方案' },
      { key: 'c2', category: '专业课', nature: '必修', ctype: '理论', discipline: '', code: 'CUR08090102', name: '操作系统', credit: 4, hoursTheory: 48, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 48, assess: '考试', openSemester: '4', source: '人才培养方案' },
      { key: 'c3', category: '专业课', nature: '必修', ctype: '理论', discipline: '', code: 'CUR08090103', name: '数据库系统', credit: 3, hoursTheory: 32, hoursExperiment: 16, hoursTraining: 0, hoursPractice: 0, hoursTotal: 48, assess: '考查', openSemester: '5', source: '新增' },
      { key: 'c4', category: '专业课', nature: '必修', ctype: '理论', discipline: '', code: 'CUR08090104', name: '计算机网络', credit: 3, hoursTheory: 48, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 48, assess: '考试', openSemester: '5', source: '人才培养方案' },
      { key: 'c5', category: '专业课', nature: '必修', ctype: '实践', discipline: '', code: 'CUR08090106', name: '工程实践', credit: 2, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 32, hoursTotal: 32, assess: '考查', openSemester: '6', source: '人才培养方案' }
    ]
    setCourses(seed)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(ELECTIVE_KEY)
    if (saved) {
      try {
        const list = JSON.parse(saved)
        if (Array.isArray(list) && list.length > 0) {
          setElectives(list)
          return
        }
      } catch {}
    }
    const seed: Elective[] = [
      { key: 'e1', ctype: '理论课（含课内实验实训）', nature: '任选', module: '通识教育', code: 'EL0001', name: '大学写作', credit: 2, hoursTheory: 24, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 24, assess: '考试', weekHours: 2, delivery: '线下课程', department: '人文学院' },
      { key: 'e2', ctype: '独立设置的实验课', nature: '限选', module: '信息基础', code: 'EL0002', name: 'Python实验', credit: 1, hoursTheory: 0, hoursExperiment: 16, hoursTraining: 0, hoursPractice: 0, hoursTotal: 16, assess: '考察', weekHours: 2, delivery: '线下课程', department: '计算机学院' },
      { key: 'e3', ctype: '校内实践（集中）', nature: '限选', module: '综合实践', code: 'EL0003', name: '创新创业实践', credit: 1, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 16, hoursTotal: 16, assess: '考察', weekHours: 1, delivery: '线下课程', department: '创新学院' },
      { key: 'e4', ctype: '校外实践（分散）', nature: '任选', module: '社会实践', code: 'EL0004', name: '志愿服务', credit: 1, hoursTheory: 0, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 16, hoursTotal: 16, assess: '考察', weekHours: 1, delivery: '线下课程', department: '团委' },
      { key: 'e5', ctype: '理论课（含课内实验实训）', nature: '任选', module: '艺术素养', code: 'EL0005', name: '美术鉴赏', credit: 2, hoursTheory: 24, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 24, assess: '考试', weekHours: 2, delivery: '线下课程', department: '艺术学院' },
      { key: 'e6', ctype: '理论课（含课内实验实训）', nature: '任选', module: '通识教育', code: 'EL0006', name: '科普素养', credit: 2, hoursTheory: 24, hoursExperiment: 0, hoursTraining: 0, hoursPractice: 0, hoursTotal: 24, assess: '考察', weekHours: 2, delivery: '学堂在线', department: '通识教育中心' },
    ]
    setElectives(seed)
  }, [])

  useEffect(() => {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    localStorage.setItem(ELECTIVE_KEY, JSON.stringify(electives))
  }, [electives])

  const onValuesChange = (_: any, values: any) => {
    const t = Number(values.hoursTheory || 0)
    const e = Number(values.hoursExperiment || 0)
    const tr = Number(values.hoursTraining || 0)
    const p = Number(values.hoursPractice || 0)
    courseForm.setFieldsValue({ hoursTotal: t + e + tr + p })
  }

  const onElectValuesChange = (_: any, values: any) => {
    const t = Number(values.hoursTheory || 0)
    const e = Number(values.hoursExperiment || values.hoursLab || 0)
    const tr = Number(values.hoursTraining || 0)
    const p = Number(values.hoursPractice || 0)
    electForm.setFieldsValue({ hoursTotal: t + e + tr + p })
  }

  const onSubmit = (values: any) => {
    const row: Course = {
      key: editingKey ?? Date.now().toString(),
      category: values.category || '',
      nature: values.nature || '',
      ctype: values.ctype || '',
      discipline: values.discipline || '',
      code: values.code || '',
      name: values.name || '',
      credit: Number(values.credit || 0),
      hoursTheory: Number(values.hoursTheory || 0),
      hoursExperiment: Number(values.hoursExperiment || 0),
      hoursTraining: Number(values.hoursTraining || 0),
      hoursPractice: Number(values.hoursPractice || 0),
      hoursTotal: Number(values.hoursTotal || 0),
      assess: values.assess || '',
      openSemester: Array.isArray(values.openSemester) ? values.openSemester.join('、') : (values.openSemester || ''),
      source: values.source || '新增',
    }
    if (editingKey) {
      setCourses((prev) => prev.map((c) => (c.key === editingKey ? row : c)))
    } else {
      setCourses((prev) => [row, ...prev])
    }
    setEditingKey(null)
    courseForm.resetFields()
    setCourseModalOpen(false)
  }

  const onElectSubmit = (values: any) => {
    const row: Elective = {
      key: electEditingKey ?? Date.now().toString(),
      ctype: values.ctype || '',
      nature: values.nature || '',
      module: values.module || '',
      code: values.code || '',
      name: values.name || '',
      credit: Number(values.credit || 0),
      hoursTheory: Number(values.hoursTheory || 0),
      hoursExperiment: Number(values.hoursExperiment || 0),
      hoursTraining: Number(values.hoursTraining || 0),
      hoursPractice: Number(values.hoursPractice || 0),
      hoursTotal: Number(values.hoursTotal || 0),
      assess: values.assess || '',
      weekHours: Number(values.weekHours || 0),
      delivery: values.delivery || '',
      department: values.department || '',
    }
    if (electEditingKey) {
      setElectives((prev) => prev.map((c) => (c.key === electEditingKey ? row : c)))
    } else {
      setElectives((prev) => [row, ...prev])
    }
    setElectEditingKey(null)
    electForm.resetFields()
    setElectModalOpen(false)
  }

  const handleEdit = (record: Course) => {
    setEditingKey(record.key)
    const arr = String(record.openSemester || '').split(/[、，/\s]+/).filter(Boolean)
    courseForm.setFieldsValue({ ...record, openSemester: arr })
    setCourseModalOpen(true)
  }

  const handleElectEdit = (record: Elective) => {
    setElectEditingKey(record.key)
    electForm.setFieldsValue({ ...record })
    setElectModalOpen(true)
  }

  const handleDelete = (key: string) => {
    setCourses((prev) => prev.filter((c) => c.key !== key))
    if (editingKey === key) {
      setEditingKey(null)
      courseForm.resetFields()
    }
  }

  const handleElectDelete = (key: string) => {
    setElectives((prev) => prev.filter((c) => c.key !== key))
    if (electEditingKey === key) {
      setElectEditingKey(null)
      electForm.resetFields()
    }
  }

  const cancelEdit = () => {
    setEditingKey(null)
    courseForm.resetFields()
    setCourseModalOpen(false)
  }

  const cancelElectEdit = () => {
    setElectEditingKey(null)
    electForm.resetFields()
    setElectModalOpen(false)
  }

  return (
    <div>
      <Tabs items={[
        {
          key: 'major',
          label: '主修课程',
          children: (
      <Card className="page-content" title="课程信息维护" extra={<Button type="primary" onClick={() => { setEditingKey(null); courseForm.resetFields(); setCourseModalOpen(true) }}>新增课程</Button>}>
        <Modal open={courseModalOpen} title={editingKey ? '编辑课程' : '新增课程'} footer={null} onCancel={() => { setCourseModalOpen(false); cancelEdit() }}>
          <Form form={courseForm} layout="vertical" onFinish={onSubmit} onValuesChange={onValuesChange}>
            <Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input placeholder="如：CUR08090101" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input placeholder="如：数据结构" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="category" label="课程类别（课程性质）" required rules={[{ required: true, message: '请选择课程类别' }]}><Select style={{ width: 180 }} options={courseCategoryOptions} /></Form.Item>
            <Form.Item name="nature" label="课程性质" required rules={[{ required: true, message: '请选择课程性质' }]}><Select style={{ width: 180 }} options={natureOptions} /></Form.Item>
            <Form.Item name="ctype" label="课程类型" required rules={[{ required: true, message: '请选择课程类型' }]}><Select style={{ width: 220 }} options={typeOptions} /></Form.Item>
            <Form.Item name="credit" label="学分" required rules={[{ required: true, message: '请输入学分' }]}><Input type="number" style={{ width: 100 }} /></Form.Item>
            <Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" style={{ width: 140 }} /></Form.Item>
            <Form.Item name="hoursTheory" label="理论学时" tooltip="理论教学学时" required rules={[{ required: true, message: '请输入理论学时' }]}><Input type="number" addonAfter="时" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="hoursExperiment" label="实验学时" tooltip="实验教学学时" required rules={[{ required: true, message: '请输入实验学时' }]}><Input type="number" addonAfter="时" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="hoursTraining" label="实训学时" tooltip="实训教学学时" required rules={[{ required: true, message: '请输入实训学时' }]}><Input type="number" addonAfter="时" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="hoursPractice" label="实践学时" tooltip="实践教学学时" required rules={[{ required: true, message: '请输入实践学时' }]}><Input type="number" addonAfter="周" style={{ width: 160 }} /></Form.Item>
            <Form.Item name="assess" label="考核方式" required rules={[{ required: true, message: '请选择考核方式' }]}><Select style={{ width: 140 }} options={[{value:'考试',label:'考试'},{value:'考察',label:'考察'}]} /></Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">{editingKey ? '更新课程' : '新增课程'}</Button>
              <Button onClick={cancelEdit}>取消</Button>
            </Space>
          </Form>
        </Modal>
        <Table
          size="small"
          pagination={false}
          rowKey="key"
          dataSource={courses}
          locale={{ emptyText: '暂无课程' }}
          columns={[
            { title: '课程类别', dataIndex: 'category' },
            { title: '课程性质', dataIndex: 'nature' },
            { title: '课程类型', dataIndex: 'ctype' },
            { title: '学科门类', dataIndex: 'discipline' },
            { title: '课程编号', dataIndex: 'code' },
            { title: '课程名称', dataIndex: 'name' },
            { title: '学分', dataIndex: 'credit' },
            { title: '总学时', render: (_: any, r: Course) => {
              const t = Number(r.hoursTheory || 0)
              const e = Number(r.hoursExperiment || 0)
              const tr = Number(r.hoursTraining || 0)
              const p = Number(r.hoursPractice || 0)
              return t + e + tr + p
            } },
            { title: '学时', children: [
              { title: '理论', dataIndex: 'hoursTheory' },
              { title: '实验', dataIndex: 'hoursExperiment' },
              { title: '实训', dataIndex: 'hoursTraining' },
              { title: '实践', dataIndex: 'hoursPractice' },
            ] },
            { title: '考核方式', dataIndex: 'assess' },
            { title: '开设学期', dataIndex: 'openSemester' },
            { title: '来源', dataIndex: 'source', render: (_: any, r: Course) => (<Tag color={r.source==='新增'?'blue':'green'}>{r.source}</Tag>) },
            { title: '操作', dataIndex: 'actions', render: (_: any, record: Course) => (
              <Space>
                <Button size="small" onClick={() => handleEdit(record)}>编辑</Button>
                <Button danger size="small" onClick={() => handleDelete(record.key)}>删除</Button>
              </Space>
            ) },
          ]}
        />
      </Card>
          )
        },
        {
          key: 'elective',
          label: '公共选修课',
          children: (
      <Card className="page-content" title="公共选修课维护" extra={<Button type="primary" onClick={() => { setElectEditingKey(null); electForm.resetFields(); setElectModalOpen(true) }}>新增课程</Button>}>
        <Modal open={electModalOpen} title={electEditingKey ? '编辑公共选修课' : '新增公共选修课'} footer={null} onCancel={() => { setElectModalOpen(false); cancelElectEdit() }} width={900}>
          <Form form={electForm} layout="vertical" onFinish={onElectSubmit} onValuesChange={onElectValuesChange}>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="ctype" label="课程类型" required rules={[{ required: true, message: '请选择课程类型' }]}><Select options={typeOptions} /></Form.Item></Col>
              <Col span={12}><Form.Item name="nature" label="课程性质" required rules={[{ required: true, message: '请选择课程性质' }]}><Select options={[{value:'任选',label:'任选'},{value:'限选',label:'限选'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="module" label="课程模块" required rules={[{ required: true, message: '请输入课程模块' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="code" label="课程编号" required rules={[{ required: true, message: '请输入课程编号' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="name" label="课程名称" required rules={[{ required: true, message: '请输入课程名称' }, { min: 2, max: 50, message: '长度2~50字符' }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="credit" label="学分" required rules={[{ required: true, message: '请输入学分' }]}><Input type="number" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTotal" label="总学时"><Input disabled addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTheory" label="理论学时" required rules={[{ required: true, message: '请输入理论学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursExperiment" label="实验学时" required rules={[{ required: true, message: '请输入实验学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursTraining" label="实训学时" required rules={[{ required: true, message: '请输入实训学时' }]}><Input type="number" addonAfter="时" /></Form.Item></Col>
              <Col span={12}><Form.Item name="hoursPractice" label="实践学时" required rules={[{ required: true, message: '请输入实践学时' }]}><Input type="number" addonAfter="周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="assess" label="考核方式" required rules={[{ required: true, message: '请选择考核方式' }]}><Select options={[{value:'考试',label:'考试'},{value:'考察',label:'考察'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="weekHours" label="周学时" required rules={[{ required: true, message: '请输入周学时' }]}><Input type="number" addonAfter="时/周" /></Form.Item></Col>
              <Col span={12}><Form.Item name="delivery" label="上课方式" required rules={[{ required: true, message: '请选择上课方式' }]}><Select options={[{value:'学堂在线',label:'学堂在线'},{value:'线下课程',label:'线下课程'}]} /></Form.Item></Col>
              <Col span={12}><Form.Item name="department" label="教学单位" required rules={[{ required: true, message: '请输入教学单位' }]}><Input /></Form.Item></Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">{electEditingKey ? '更新课程' : '新增课程'}</Button>
              <Button onClick={cancelElectEdit}>取消</Button>
            </Space>
          </Form>
        </Modal>
        <Table
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
          rowKey="key"
          dataSource={electives}
          locale={{ emptyText: '暂无课程' }}
          columns={[
            { title: '课程类型', dataIndex: 'ctype' },
            { title: '课程性质', dataIndex: 'nature' },
            { title: '课程模块', dataIndex: 'module' },
            { title: '课程编号', dataIndex: 'code' },
            { title: '课程名称', dataIndex: 'name' },
            { title: '学分', dataIndex: 'credit' },
            { title: '总学时', dataIndex: 'hoursTotal' },
            { title: '学时', children: [
              { title: '理论', dataIndex: 'hoursTheory' },
              { title: '实验', dataIndex: 'hoursExperiment' },
              { title: '实训', dataIndex: 'hoursTraining' },
              { title: '实践', dataIndex: 'hoursPractice' },
            ] },
            { title: '考核方式', dataIndex: 'assess' },
            { title: '周学时', dataIndex: 'weekHours' },
            { title: '上课方式', dataIndex: 'delivery' },
            { title: '教学单位', dataIndex: 'department' },
            { title: '操作', dataIndex: 'actions', render: (_: any, record: Elective) => (
              <Space>
                <Button size="small" onClick={() => handleElectEdit(record)}>编辑</Button>
                <Button danger size="small" onClick={() => handleElectDelete(record.key)}>删除</Button>
              </Space>
            ) },
          ]}
        />
      </Card>
          )
        }
      ]} />
    </div>
  )
}

// 课程管理组件已移除：
// - 从培养方案生成的课程清单：在培养方案页面已通过 useEffect 自动同步到课程字典（courseCatalog）。
// - 公共选修课维护：已迁移至“开课计划”页面的“公共选修课”Tab。
