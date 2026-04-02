import axiosInstance from './axiosInstance'

export const getAllUsersApi = () =>
  axiosInstance.get('/api/users')

export const getUsersByRoleApi = (role) =>
  axiosInstance.get(`/api/users/role/${role}`)

export const deleteUserApi = (id) =>
  axiosInstance.delete(`/api/users/${id}`)

export const getReportSummaryApi = () =>
  axiosInstance.get('/api/reports/admin/summary')

export const getCourseReportApi = (courseId) =>
  axiosInstance.get(`/api/reports/course/${courseId}`)

export const getTeacherReportApi = () =>
  axiosInstance.get('/api/reports/teacher/my-report')
