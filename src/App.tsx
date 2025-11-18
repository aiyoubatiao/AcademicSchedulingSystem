import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import UserManagement from './pages/UserManagement'
import RoleManagement from './pages/RoleManagement'
import DepartmentManagement from './pages/DepartmentManagement'
import { BasicInfoManagement, CurriculumPlan, OfferingPlan, Scheduling, SchedulingElectives, SchedulingAudit, SchedulingPublishRecords, SchedulingAdjustLogs, TeachingTask, TeachingTaskReview, TeachingTaskWorkload, TeachingTaskAdjustLogs, TeachingTaskTeacherCourseStats, PositionsManagement, TimetablePublish, Adjustments, ApprovalsAndNotifications, ImportExportIntegration, ReportsAnalytics, CourseCatalog, CurriculumStats, TaskScheduling, ScheduledCoursesList, TeachingTaskTeacherTaskBook, OfferingPlanMergedList } from './pages/ModulePages'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/basic/campus" replace />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/positions" element={<PositionsManagement />} />
        <Route path="/departments" element={<DepartmentManagement />} />
        <Route path="/basic/*" element={<BasicInfoManagement />} />
        <Route path="/curriculum/pro-course-settings" element={<CurriculumPlan />} />
        <Route path="/curriculum/pro-course-stats" element={<CurriculumStats />} />
        {/* 兼容旧链接：将 /course 重定向到新的 /courses */}
        <Route path="/course" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/offering" element={<Navigate to="/offering/plan" replace />} />
        <Route path="/offering/plan" element={<OfferingPlan />} />
        <Route path="/offering/plan-merged-list" element={<OfferingPlanMergedList />} />
        <Route path="/offering/audit" element={<OfferingPlan />} />
        <Route path="/offering/adjust-logs" element={<OfferingPlan />} />
        <Route path="/offering/electives" element={<OfferingPlan />} />
        <Route path="/offering/preselect-records" element={<OfferingPlan />} />
        <Route path="/offering/replacement" element={<OfferingPlan />} />
        <Route path="/scheduling" element={<Scheduling />} />
        <Route path="/scheduling/electives" element={<SchedulingElectives />} />
        <Route path="/scheduling/audit" element={<SchedulingAudit />} />
        <Route path="/scheduling/publish-records" element={<SchedulingPublishRecords />} />
        <Route path="/scheduling/adjust-logs" element={<SchedulingAdjustLogs />} />
        <Route path="/tasks" element={<TeachingTask />} />
        <Route path="/tasks/review" element={<TeachingTaskReview />} />
        <Route path="/tasks/workload" element={<TeachingTaskWorkload />} />
        <Route path="/tasks/teacher-course-stats" element={<TeachingTaskTeacherCourseStats />} />
        <Route path="/tasks/teacher-taskbook" element={<TeachingTaskTeacherTaskBook />} />
        <Route path="/tasks/adjust-logs" element={<TeachingTaskAdjustLogs />} />
        <Route path="/tasks/schedule" element={<TaskScheduling />} />
        <Route path="/tasks/scheduled-list" element={<ScheduledCoursesList />} />
        <Route path="/timetable" element={<TimetablePublish />} />
        <Route path="/adjust" element={<Adjustments />} />
        <Route path="/approvals" element={<ApprovalsAndNotifications />} />
        <Route path="/io" element={<ImportExportIntegration />} />
        <Route path="/reports" element={<ReportsAnalytics />} />
      </Routes>
    </Layout>
  )
}

export default App
