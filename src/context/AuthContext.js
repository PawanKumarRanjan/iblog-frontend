"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`)
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
    } finally {
      setLoading(false)
    }
  }

  const login = (token, userData) => {
    localStorage.setItem("token", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
