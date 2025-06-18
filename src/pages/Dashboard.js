"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import BlogForm from "../components/BlogForm"

const Dashboard = () => {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/my-blogs`)
      setBlogs(response.data)
    } catch (error) {
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/blogs/${id}`)
        setBlogs(blogs.filter((blog) => blog._id !== id))
        toast.success("Blog deleted successfully")
      } catch (error) {
        toast.error("Failed to delete blog")
      }
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingBlog(null)
    fetchBlogs()
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>My Blogs</h2>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add New Blog
            </button>
          </div>

          <div className="blog-table">
            {blogs.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <p>No blogs found. Create your first blog!</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="blog-image" />
                      </td>
                      <td>{blog.title}</td>
                      <td>{blog.description.substring(0, 100)}...</td>
                      <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="actions">
                          <Link to={`/blog/${blog._id}`} className="btn btn-secondary">
                            View
                          </Link>
                          <button className="btn btn-primary" onClick={() => handleEdit(blog)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDelete(blog._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Profile</h3>
          {user.profileImage && (
            <img src={user.profileImage || "/placeholder.svg"} alt="Profile" className="profile-image" />
          )}
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Total Blogs:</strong> {blogs.length}
          </p>
        </div>
      </div>

      {showForm && <BlogForm blog={editingBlog} onClose={handleFormClose} />}
    </div>
  )
}

export default Dashboard
