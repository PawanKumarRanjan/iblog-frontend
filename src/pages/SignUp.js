"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("email", formData.email)
      formDataToSend.append("password", formData.password)
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage)
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      login(response.data.token, response.data.user)
      toast.success("Registration successful!")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
