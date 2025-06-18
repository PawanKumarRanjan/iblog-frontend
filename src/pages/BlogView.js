"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/${id}`)
      setBlog(response.data)
    } catch (error) {
      toast.error("Failed to fetch blog")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  if (!blog) {
    return <div className="container">Blog not found</div>
  }

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back to Dashboard
      </button>

      <div
        style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      >
        <h1 style={{ marginBottom: "20px" }}>{blog.title}</h1>

        <img
          src={blog.image || "/placeholder.svg"}
          alt={blog.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />

        <div style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
          {blog.description.split("\n").map((paragraph, index) => (
            <p key={index} style={{ marginBottom: "15px" }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
          <p style={{ color: "#666", fontSize: "14px" }}>
            By {blog.author.email} • {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlogView
