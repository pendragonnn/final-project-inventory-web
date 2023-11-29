import axios from "axios"
import Cookies from "js-cookie"

const baseURL = "http://localhost:8000/api/v1"
const instance = axios.create({ baseURL })

instance.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

module.exports = { instance }
