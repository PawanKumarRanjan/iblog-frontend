"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const BlogForm = ({ blog, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        description: blog.description,
      })
    }
  }, [blog])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)

      if (image) {
        formDataToSend.append("image", image)
      } else if (!blog) {
        toast.error("Please select an image")
        setLoading(false)
        return
      }

      const url = blog ? `${process.env.REACT_APP_API_URL}/blogs/${blog._id}` : `${process.env.REACT_APP_API_URL}/blogs`

      const method = blog ? "put" : "post"

      await axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success(`Blog ${blog ? "updated" : "created"} successfully`)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${blog ? "update" : "create"} blog`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>{blog ? "Edit Blog" : "Add New Blog"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Blog Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Blog Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} required={!blog} />
            {blog && !image && (
              <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>Leave empty to keep current image</p>
            )}
          </div>

          <div className="form-group">
            <label>Blog Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="6" />
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : blog ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogForm
