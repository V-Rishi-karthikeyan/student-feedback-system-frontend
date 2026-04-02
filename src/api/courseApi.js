import axiosInstance from './axiosInstance'

export const getAllCoursesApi = () =>
  axiosInstance.get('/api/courses')

export const getMyCourseApi = () =>
  axiosInstance.get('/api/courses/my')

export const createCourseApi = (data) =>
  axiosInstance.post('/api/courses', data)

export const deleteCourseApi = (id) =>
  axiosInstance.delete(`/api/courses/${id}`)
