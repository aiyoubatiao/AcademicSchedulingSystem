import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Tabs, Table, Form, Input, Button, Select, Space, Modal, Popconfirm, InputNumber, Tag, Row, Col, Upload, message, Descriptions, Steps, Dropdown, Alert } from 'antd'

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
    { key: 'rm1', code: 'ROOM001', campus: 'A校区', buildingName: 'A楼', floor: 1, doorNo: '101', name: 'A-101', type: '普通教室', capacity: 60, department: '教务处', equipment: '投影仪', status: '启用' }
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
          {title:'考核方式',dataIndex:'assessment'},{title:'开设学期',dataIndex:'openSemester'},{title:'来源',render:(_,r)=> (<Tag color={r.source==='新增'?'blue':'green'}>{r.source}</Tag>)},
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
          <Upload accept=".csv,.json" showUploadList={false} beforeUpload={beforeImportPlan}><Button>导入</Button></Upload>
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
          teacherScope: '不限',
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
        plans = [
          { key: `seed_${now}_1`, version: 'v2025', major: '计算机科学与技术', grade: g, category: '专业课', nature: '必修', ctype: '理论', code: 'CUR08090102', name: '操作系统', credit: 3, hoursTotal: 64, hoursTheory: 48, hoursExperiment: 8, hoursTraining: 0, hoursPractice: 8, assess: '考试', term: '1、2' },
          { key: `seed_${now}_2`, version: 'v2025', major: '计算机科学与技术', grade: g, category: '专业课', nature: '必修', ctype: '理论', code: 'CUR08090103', name: '数据库系统', credit: 3, hoursTotal: 48, hoursTheory: 32, hoursExperiment: 16, hoursTraining: 0, hoursPractice: 0, assess: '考查', term: '1' },
          { key: `seed_${now}_3`, version: 'v2025', major: '软件工程', grade: g, category: '专业课', nature: '必修', ctype: '理论', code: 'CUR08090104', name: '软件工程', credit: 3, hoursTotal: 48, hoursTheory: 32, hoursExperiment: 16, hoursTraining: 0, hoursPractice: 0, assess: '考查', term: '2' }
        ]
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
              teacherScope: '不限',
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
  const openOfferingView = (record: any) => {
    setOfferingViewRecord(record)
    setOfferingViewOpen(true)
  }
  const [offeringViewLayout, setOfferingViewLayout] = useState({ width: '72vw', cols: 2 })
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
      return [{ value: '不限', label: '不限' }, ...opts]
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
      const unique = Array.from(new Set(teachers.map((x:string)=> String(x||'').trim()).filter((x)=> x.length>0)))
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
      if (s.size===0) { s.add(`${String(rec.major||'')}${String(rec.grade||'')}-1`); s.add(`${String(rec.major||'')}${String(rec.grade||'')}-2`) }
      return Array.from(s).map((v)=> ({ value: v, label: v }))
    } catch { return [] }
  }, [editingOfferingKey, offerings])
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
    const s = new Set<string>()
    offerings.forEach((o) => { const k = `${o.academic}||${o.grade}||${o.major}`; if (o.academic && o.grade && o.major) s.add(k) })
    if (s.size >= 3) { seededRef.current = true; return }
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
      selected.forEach((m: any, idx: number) => {
        const grade = String(m.grade || String(new Date().getFullYear() - idx))
        const majorName = String(m.name || m.major || '')
        const duration = String(m.durationYears || m.duration || '')
        const term = 1
        const academic = computeAcademicLocal(grade, term)
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
            linkedClass: '',
            term: String(term),
            ctype: c.ctype || '',
            classSizeThreshold: 40,
            teacherScope: '不限',
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
      r.academic||'', r.grade||'', r.major||'', r.duration||'', `${r.course||''}${r.code?`(${r.code})`:''}`, r.category||'', r.assess||'', r.position||'', String(r.credit??''), String(r.hoursTotal??''), String(r.hoursTheory??''), String(r.hoursExperiment??''), String(r.hoursTraining??''), String(r.hoursPractice??''), r.department||'', r.remark||'', r.status||'', r.linkedClass||'', String(r.term||''), r.ctype||'', String(r.classSizeThreshold??''), r.teacherScope||'', r.auditChain||''
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
          teacherScope: '不限',
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
              <Upload accept=".csv,.json" showUploadList={false} beforeUpload={beforeImportLinkedClass}><Button>关联班级导入</Button></Upload>
              <Upload accept=".csv,.json" showUploadList={false} beforeUpload={beforeImportLinkedTeacher}><Button>关联教师导入</Button></Upload>
            </Space>
            <Form form={offFilterForm} layout="inline" onValuesChange={(_,v)=> setOffFilter(v)} style={{ marginBottom: 12 }}>
              <Form.Item name="academic" label="学年学期"><Input style={{ width: 140 }} placeholder="示例：2025~2025 第一学期" /></Form.Item>
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
            <Table size="small" pagination={false} dataSource={offSorted} rowKey="key" columns={[
              {title:'学年学期',dataIndex:'academic', render: (v:any,_r:any,idx:number)=> {
                const s = String(v||'')
                const m = /^(\d{4}).*?(秋|春|第一学期|第二学期)?/.exec(s)
                if (!m) return { children: v, props: { rowSpan: offRowSpan[idx]?.academic ?? 1 } }
                const y = Number(m[1]||0)
                const termRaw = String(m[2]||'')
                const term = termRaw ? ((/秋|第一/.test(termRaw)) ? '第一学期' : '第二学期') : ''
                const disp = `${y}~${y+1}学年${term?` ${term}`:''}`
                return { children: disp, props: { rowSpan: offRowSpan[idx]?.academic ?? 1 } }
              }},
              {title:'年级',dataIndex:'grade', render: (v:any,_r:any,idx:number)=> ({ children: v, props: { rowSpan: offRowSpan[idx]?.grade ?? 1 }})},
              {title:'专业',dataIndex:'major', render: (v:any,_r:any,idx:number)=> ({ children: v, props: { rowSpan: offRowSpan[idx]?.major ?? 1 }})},
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
              {title:'备注',dataIndex:'remark'},
              {title:'审核状态',dataIndex:'status'},
              {title:'关联班级',render:(_:any, r:any)=> {
                const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                const entry = classLinkDB[key]
                const list = entry?.classes || (String(r.linkedClass||'').split(/[、，,;；\s]+/).map(s=>s.trim()).filter(s=>s.length>0))
                const count = list.length
                const text = count>0 ? `已关联${count}个班级（点击可查看详情）` : '未关联'
                return (
                  <Dropdown menu={{
                    items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: nm }))
                  }}>
                    <a>{text}</a>
                  </Dropdown>
                )
              }},
              {title:'关联教师',render:(_:any, r:any)=> {
                const key = `${r.course||''}${r.code?`(${r.code})`:''}`
                const entry = teacherLinkDB[key]
                const list = entry?.teachers || (String(r.teacherScope||'').split(/[、，,;；\s]+/).map(s=>s.trim()).filter(s=>s.length>0))
                const count = list.length
                const text = count>0 ? `已关联${count}位教师（点击可查看详情）` : '未关联'
                return (
                  <Dropdown menu={{
                    items: (list.length>0 ? list : ['暂无']).map((nm,idx)=> ({ key: String(idx), label: nm }))
                  }}>
                    <a>{text}</a>
                  </Dropdown>
                )
              }},
              {title:'操作', fixed:'right', align:'center', width: 120, render:(_:any,record:any)=> {
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
              }}
            ]} />
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
                          { title: '学年学期', render: (_:any, r:any) => addProfile.term ? computeAcademic(String(r.grade||''), String(addProfile.term||'')) : '' },
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
                    {title:'学年学期',dataIndex:'academic', render: (v:any, _r:any, idx:number)=> {
                      const s = String(v||'')
                      const m = /^(\d{4}).*?(秋|春|第一学期|第二学期)?/.exec(s)
                      if (!m) return { children: v, props: { rowSpan: previewRowSpan[idx]?.academic ?? 1 } }
                      const y = Number(m[1]||0)
                      const termRaw = String(m[2]||'')
                      const term = termRaw ? ((/秋|第一/.test(termRaw)) ? '第一学期' : '第二学期') : ''
                      const disp = `${y}~${y+1}学年${term?` ${term}`:''}`
                      return { children: disp, props: { rowSpan: previewRowSpan[idx]?.academic ?? 1 } }
                    }},
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
                            { title: '学年学期', render: (_:any, r:any) => computeAcademic(String(r.grade||''), String(editOfferingForm.getFieldValue('term')||'')||1) },
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
                      {title:'学年学期',dataIndex:'academic'},
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
                  <Input.Search allowClear placeholder="按姓名搜索" onSearch={(v)=> setTeacherNameFilter(String(v||''))} style={{ width: 220 }} />
                  <Select allowClear placeholder="按部门筛选" style={{ width: 200 }} options={teacherDeptOptions} value={teacherDeptFilter} onChange={(v)=> setTeacherDeptFilter(v)} />
                </Space>
                <Form.Item name="teacherScope" label="关联教师">
                  <Select
                    mode="tags"
                    allowClear
                    showSearch
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
                      {label:'学年学期',children: offeringViewRecord.academic||''},
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
                      {label:'备注',children: offeringViewRecord.remark||''},
                      {label:'审核状态',children: offeringViewRecord.status||''},
                      {label:'关联班级',children: offeringViewRecord.linkedClass||''},
                      {label:'开设学期',children: offeringViewRecord.term||''},
                      {label:'类型',children: offeringViewRecord.ctype||''},
                      {label:'分班容量阈值',children: offeringViewRecord.classSizeThreshold},
                      {label:'教师范围',children: offeringViewRecord.teacherScope||''},
                      {label:'审核顺序',children: offeringViewRecord.auditChain||''}
                    ]}
                  />
                  <Steps
                    items={parseAuditNodes(offeringViewRecord.auditChain).map((n)=> ({ title: n }))}
                    current={auditCurrent(offeringViewRecord.status, parseAuditNodes(offeringViewRecord.auditChain).length)}
                    status={offeringViewRecord.status==='已驳回' ? 'error' : undefined}
                  />
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
            const pendingRaw = offerings.filter((o)=> o.status==='待审核' && firstNode(o)===role).filter(matches)
            const reviewedRaw = offerings.filter((o)=> (o.status==='已通过' || o.status==='已驳回') && isRelevant(o)).filter(matches)
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
                g.children = Array.from(uniq.values()).sort((a: any, b: any) => String(a.course||'').localeCompare(String(b.course||'')))
                g.count = g.children.length
              })
              return Array.from(map.values())
            }
            const pending = groupify(pendingRaw)
            const reviewed = groupify(reviewedRaw)
            const auditColumns = [
              { title:'学年学期', render: (_:any, r:any) => {
                if (!r.children) return ''
                const s = String(r.academic||'')
                const m = /^(\d{4}).*?(秋|春|第一学期|第二学期)?/.exec(s)
                if (!m) return s
                const y = Number(m[1]||0)
                const termRaw = String(m[2]||'')
                const term = termRaw ? ((/秋|第一/.test(termRaw)) ? '第一学期' : '第二学期') : ''
                return `${y}~${y+1}学年${term?` ${term}`:''}`
              } },
              { title:'年级', render: (_:any, r:any) => r.children ? (r.grade||'') : '' },
              { title:'专业', render: (_:any, r:any) => r.children ? (r.major||'') : '' },
              { title:'课程名称(编号)', render: (_:any, r:any) => r.children ? `共${r.count||r.children.length}门` : `${r.course||''}${r.code?`(${r.code})`:''}` },
              { title:'学分', render: (_:any, r:any) => r.children ? '' : r.credit },
              { title:'总学时', render: (_:any, r:any) => r.children ? '' : r.hoursTotal },
              { title:'关联班级', dataIndex:'linkedClass', render: (_:any, r:any) => r.children ? '' : (r.linkedClass||'') },
              { title:'关联教师', dataIndex:'teacherScope', render: (_:any, r:any) => r.children ? '' : (r.teacherScope||'') },
              { title:'学时', children: [
                { title:'理论学时', dataIndex:'hoursTheory', render: (_:any, r:any) => r.children ? '' : r.hoursTheory },
                { title:'实验学时', dataIndex:'hoursExperiment', render: (_:any, r:any) => r.children ? '' : r.hoursExperiment },
                { title:'实训学时', dataIndex:'hoursTraining', render: (_:any, r:any) => r.children ? '' : r.hoursTraining },
                { title:'实践学时', dataIndex:'hoursPractice', render: (_:any, r:any) => r.children ? '' : r.hoursPractice }
              ]}
            ]
            return (
              <Tabs items={[
                {
                  key: 'pending',
                  label: '待审核',
                  children: (
                    <Table size="small" pagination={false} rowKey="key" dataSource={pending} expandable={{ defaultExpandAllRows: true }} columns={[
                      ...auditColumns,
                      {title:'操作',render:(_:any,record:any)=> (
                        <Space>
                          {record.children ? null : (
                            <>
                              <Button size="small" type="primary" onClick={()=>approveOffering(record.key)}>通过</Button>
                              <Button size="small" danger onClick={()=>rejectOffering(record.key)}>驳回</Button>
                            </>
                          )}
                        </Space>
                      )}
                    ]} />
                  )
                },
                {
                  key: 'reviewed',
                  label: '已审核',
                  children: (
                    <Table size="small" pagination={false} rowKey="key" dataSource={reviewed} expandable={{ defaultExpandAllRows: true }} columns={[
                      ...auditColumns,
                      {title:'审核顺序',dataIndex:'auditChain'},
                      {title:'状态',dataIndex:'status'},
                      {title:'操作',render:(_:any,record:any)=> (
                        <Space>
                          {record.children ? null : (
                            <Button size="small" onClick={()=> openOfferingView(record)}>查看</Button>
                          )}
                        </Space>
                      )}
                    ]} />
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
    const splitTeachers = (scope: any) => String(scope || '').split(/[、，,;\s]+/).map((s) => s.trim()).filter((s) => s.length > 0)
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
  const [taskForm] = Form.useForm()
  const [filters, setFilters] = useState<any>({})
  const [selectedLeft, setSelectedLeft] = useState<any[]>([])
  const [selectedRightKeys, setSelectedRightKeys] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string>('')
  const TASKS_KEY = 'teachingTasks'
  const BOOKS_KEY = 'teachingTaskBooks'
  useEffect(() => {
    const saved = localStorage.getItem(TASKS_KEY)
    if (saved) { try { setTasks(JSON.parse(saved)) } catch {} }
    const rawBooks = localStorage.getItem(BOOKS_KEY)
    if (rawBooks) { try { setTaskBooks(JSON.parse(rawBooks)) } catch {} }
    const rawOff = localStorage.getItem('offerings')
    if (rawOff) { try { setOfferings(JSON.parse(rawOff)) } catch {} }
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
          <Form form={filterForm} layout="inline" onValuesChange={(_, all) => setFilters(all)}>
            <Form.Item name="grade" label="年级"><Select allowClear style={{ width: 120 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.grade) s.add(String(o.grade)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
            <Form.Item name="major" label="专业"><Select allowClear showSearch style={{ width: 180 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.major) s.add(String(o.major)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
            <Form.Item name="courseCombined" label="课程"><Select allowClear showSearch style={{ width: 260 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.course) s.add(String(o.course)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
            <Form.Item><Button onClick={() => { filterForm.resetFields(); setFilters({}) }}>重置</Button></Form.Item>
          </Form>
          <Row gutter={12}>
            <Col span={8}>
              <Card size="small" title="已选择课程班">
                <Table
                  size="small"
                  pagination={false}
                  rowKey="key"
                  dataSource={selectedLeft}
                  rowSelection={{ selectedRowKeys: [], onChange: (keys) => setSelectedLeft((prev)=> prev.filter((c)=> !(keys as string[]).includes(c.key))) }}
                  columns={[{ title:'班级', dataIndex:'cls' }, { title:'容量', dataIndex:'capacity' }]}
                />
              </Card>
            </Col>
            <Col span={1}>
              <Space direction="vertical" style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Button onClick={() => {
                  const filtered = offerings.filter((o:any)=> (
                    (!filters.grade || String(o.grade)===String(filters.grade)) &&
                    (!filters.major || String(o.major)===String(filters.major)) &&
                    (!filters.courseCombined || String(o.course)===String(filters.courseCombined))
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
                <Table
                  size="small"
                  pagination={{ pageSize: 6 }}
                  rowKey="key"
                  dataSource={(() => {
                    const filtered = offerings.filter((o:any)=> (
                      (!filters.grade || String(o.grade)===String(filters.grade)) &&
                      (!filters.major || String(o.major)===String(filters.major)) &&
                      (!filters.courseCombined || String(o.course)===String(filters.courseCombined))
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
                        capacity:Number(o.classSizeThreshold||40)
                      }) })
                    })
                    list.sort((a,b)=> String(a.major).localeCompare(String(b.major)) || String(a.cls).localeCompare(String(b.cls)))
                    return list
                  })()}
                  rowSelection={{ type:'checkbox', selectedRowKeys:selectedRightKeys, onChange:(keys)=> setSelectedRightKeys(keys as string[]) }}
                  columns={[
                    { title:'学年学期', dataIndex:'academic', width: 160 },
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
          <Form form={taskForm} layout="inline" onFinish={(values) => {
            const t=String(values.teacher||'')
            const c=String(values.courseCombined||filters.courseCombined||'')
            const timePref=String(values.timePref||'')
            const roomType=String(values.roomType||'')
            const mode=String(values.mode||'自然班')
            const splitCount=Number(values.splitCount||2)
            const profile=(()=>{ try{ const raw=localStorage.getItem('teacherProfiles')||'[]'; const list=JSON.parse(raw) as any[]; return list.find((x)=> String(x.name||'')===t) || null }catch{ return null } })()
            const off=offerings.find((o:any)=> String(o.course||'')===c) || null
            const schedules=(()=>{ try{ const raw=localStorage.getItem('schedules')||'[]'; return JSON.parse(raw) as any[] }catch{ return [] } })()
            const sumHoursExisting=tasks.filter((x)=> String(x.teacher||'')===t).reduce((acc,x)=>{ const o=offerings.find((o:any)=> String(o.course||'')===String(x.course||'')); const h=Number(o?.hoursTotal||0); return acc+h },0)
            const baseRows = (()=>{
              const sel = selectedLeft.filter((c:any)=> selectedRightKeys.includes(c.key))
              if(mode==='合班'){
                const combinedCls = sel.map((s)=> s.cls).join('、')
                return [{ key:`${Date.now()}_${Math.random()}`, teacher:t, course:c, cls:combinedCls, time:timePref, roomType }]
              }
              if(mode==='分班'){
                const out:any[]=[]
                sel.forEach((s:any)=>{ for(let i=1;i<=splitCount;i++){ out.push({ key:`${Date.now()}_${s.key}_${i}`, teacher:t, course:c, cls:`${s.cls}-分班${i}`, time:timePref, roomType }) } })
                return out
              }
              return sel.map((s:any)=> ({ key:`${Date.now()}_${s.key}`, teacher:t, course:c, cls:s.cls, time:timePref, roomType }))
            })()
            const rows = baseRows.map((r:any)=>{
              const hours=Number(off?.hoursTotal||0)
              const limit=Number(profile?.maxHours||240)
              const willOk=profile?.willingness==null?true:Boolean(profile?.willingness)
              const qualOk=(()=>{ const title=String(profile?.title||''); const nature=String(off?.category||'')+String(off?.nature||''); if(nature.includes('核心')) return /(教授|副教授)/.test(title); return true })()
              const matchOk=(()=>{ const dep=String(profile?.department||''); const ocdep=String(off?.department||''); if(dep && ocdep && dep!==ocdep) return false; return true })()
              const timeConfTeacher=schedules.some((s)=> s.time && r.time && s.time===r.time && s.teacher && t && s.teacher===t)
              const timeConfClass=schedules.some((s)=> s.time && r.time && s.time===r.time && s.cls && r.cls && s.cls===r.cls)
              const overload=sumHoursExisting+hours>limit
              const issues:string[]=[]
              if(!willOk) issues.push('教师意愿不满足')
              if(!qualOk) issues.push('教学资格不满足')
              if(!matchOk) issues.push('专业对口不满足')
              if(timeConfTeacher) issues.push('教师时间冲突')
              if(timeConfClass) issues.push('班级时间冲突')
              if(overload) issues.push('工作量超限')
              const pass = issues.length===0
              return { ...r, status:'草稿', feedback:'', validationPass: pass?'达标':'未达标', validationIssues: issues.join('；') }
            })
            if(rows.length===0) return
            setTasks((prev)=> [...rows, ...prev])
            taskForm.resetFields()
          }}>
            <Form.Item name="teacher" label="教师"><Input style={{ width: 160 }} placeholder="姓名" /></Form.Item>
            <Form.Item name="courseCombined" label="课程"><Select allowClear showSearch style={{ width: 260 }} options={(() => { const s=new Set<string>(); offerings.forEach((o:any)=>{ if(o.course) s.add(String(o.course)) }); return Array.from(s).map(v=>({value:v,label:v})) })()} /></Form.Item>
            <Form.Item name="mode" label="方式"><Select style={{ width: 140 }} options={[{value:'自然班',label:'自然班'},{value:'合班',label:'合班'},{value:'分班',label:'分班'}]} /></Form.Item>
            <Form.Item name="splitCount" label="分班数"><InputNumber style={{ width: 100 }} /></Form.Item>
            <Form.Item name="timePref" label="时间范围"><Input style={{ width: 220 }} placeholder="如：周一-周三" /></Form.Item>
            <Form.Item name="roomType" label="场地要求"><Select allowClear style={{ width: 180 }} options={[{value:'普通教室',label:'普通教室'},{value:'多媒体教室',label:'多媒体教室'},{value:'计算机房',label:'计算机房'},{value:'实验室',label:'实验室'},{value:'体育馆',label:'体育馆'}]} /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">新增分配</Button></Form.Item>
          </Form>
        </Space>
      </Card>

      <Card className="page-content" title="教学任务书">
        <Table
          size="small"
          pagination={false}
          rowKey="key"
          dataSource={taskBooks}
          columns={[
            {title:'学年学期',dataIndex:'academic', render:(v:any)=>{ const s=String(v||''); const m=/^(\d{4}).*?(秋|春|第一学期|第二学期)?/.exec(s); if(!m) return s; const y=Number(m[1]||0); const termRaw=String(m[2]||''); const term=termRaw?((/秋|第一/.test(termRaw))?'第一学期':'第二学期'):''; return `${y}~${y+1}学年${term?` ${term}`:''}` }},
            {title:'学期',dataIndex:'term'},
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
          <Button onClick={() => {
            const books:any[]=[]
            tasks.forEach((t)=>{
              const og = offerings.find((o:any)=> String(o.course||'')===String(t.course||''))
              const academic = String(og?.academic||'')
              const grade = String(og?.grade||'')
              const major = String(og?.major||'')
              const code = String(og?.code||'')
              const nature = String(og?.category||'')
              const credit = Number(og?.credit||0)
              const assess = String(og?.assess||'')
              const hoursTotal = Number(og?.hoursTotal||0)
              const weekHours = ''
              const weeks = '1-16'
              const location = ''
              const department = String(og?.department||'')
              const chain = String(og?.auditChain||'系主任→教秘→教务处')
              books.push({ key:`${t.key}_book`, academic, term:String(og?.term||''), college:'', major, grade, code, course:String(t.course||''), nature, hoursTotal, credit, assess, weekHours, time:String(t.time||''), weeks, location, cls:String(t.cls||''), teacher:String(t.teacher||''), teacherTitle:'', teacherDept:department, requirements:`场地:${String(t.roomType||'')}`, approvalChain:chain })
            })
            setTaskBooks(books)
          }}>生成任务书</Button>
          <a href={downloadUrl} download={`教学任务书_${Date.now()}.json`}><Button disabled={!taskBooks.length}>导出JSON</Button></a>
        </Space>
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
  return (
    <div>
      <div className="page-header">
        <h2>审批与通知</h2>
        <p>方案/开课/排课例外审批；通知推送</p>
      </div>
      <Card className="page-content" title="审批流">
        <Table size="small" pagination={false} dataSource={[]} columns={[{title:'事项',dataIndex:'item'},{title:'当前节点',dataIndex:'node'},{title:'状态',dataIndex:'status'}]} />
      </Card>
      <Card className="page-content" title="通知配置">
        <Form layout="inline">
          <Form.Item label="渠道"><Select options={[{value:'站内',label:'站内'},{value:'邮件',label:'邮件'},{value:'企业微信',label:'企业微信'}]} /></Form.Item>
          <Form.Item label="上课前提醒"><Input placeholder="提前分钟数，如15" /></Form.Item>
          <Form.Item><Button type="primary">保存配置</Button></Form.Item>
        </Form>
      </Card>
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
