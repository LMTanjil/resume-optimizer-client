import axios from "axios"
import { ANALYZE_TIMEOUT_MS, API_TIMEOUT_MS, IMPORT_TIMEOUT_MS, STORAGE_KEYS } from "../constants"
import { emitSessionExpired } from "../utils/authEvents"

// Single axios instance — the only place that talks to the backend. See docs/api-contracts.md.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: API_TIMEOUT_MS,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? ""
    const isAuthEndpoint = url.startsWith("/auth/")
    const hadToken = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 401 && hadToken && !isAuthEndpoint) {
      error.isSessionExpired = true
      emitSessionExpired()
    }
    return Promise.reject(error)
  }
)

export default api

// Auth
export const register = (name, email, password) =>
  api.post("/auth/register", { name, email, password })
export const login = (email, password) => api.post("/auth/login", { email, password })

// Resumes
export const getResumes = () => api.get("/resumes")
export const getResume = (id) => api.get(`/resumes/${id}`)
export const createResume = (data) => api.post("/resumes", data)
export const updateResume = (id, data) => api.put(`/resumes/${id}`, data)
export const deleteResume = (id) => api.delete(`/resumes/${id}`)

// Import: multipart upload, field "file". Returns extracted { title?, content }.
export function importResume(file, { signal } = {}) {
  const body = new FormData()
  body.append("file", file)
  return api.post("/resume/import", body, { timeout: IMPORT_TIMEOUT_MS, signal })
}

// Analyze
export const analyzeResume = (resumeId, jobDescription) =>
  api.post("/analyze", { resumeId, jobDescription }, { timeout: ANALYZE_TIMEOUT_MS })
export const getAnalyses = (resumeId) => api.get(`/analyze/${resumeId}`)
