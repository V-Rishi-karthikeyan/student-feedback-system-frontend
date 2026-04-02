import axiosInstance from './axiosInstance'

export const submitFeedbackApi = (data) =>
  axiosInstance.post('/api/feedback/submit', data)

export const getMyFeedbackApi = () =>
  axiosInstance.get('/api/feedback/my')

export const getFeedbackByCourseApi = (courseId) =>
  axiosInstance.get(`/api/feedback/course/${courseId}`)

export const getTeacherCoursesFeedbackApi = () =>
  axiosInstance.get('/api/feedback/teacher/my-courses')

export const getAllFeedbackApi = () =>
  axiosInstance.get('/api/feedback/all')

export const deleteFeedbackApi = (id) =>
  axiosInstance.delete(`/api/feedback/${id}`)
