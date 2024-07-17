import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogService'
import loginService from './services/loginService'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      initialBlogs.sort((a, b) => b.likes - a.likes) // Järjestetään blogit likejen mukaan
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setNotification({ message: `Welcome ${user.name}`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Wrong username/password', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes)) // Järjestetään uudelleen lisäyksen jälkeen
      setNotification({ message: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setNotification({ message: 'Failed to add blog', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog).sort((a, b) => b.likes - a.likes)) // Järjestetään uudelleen päivityksen jälkeen
      setNotification({ message: `Blog ${returnedBlog.title} updated`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Failed to update blog', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    }
  }

  const removeBlog = async id => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id).sort((a, b) => b.likes - a.likes)) // Järjestetään uudelleen poiston jälkeen
      setNotification({ message: 'Blog removed', type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Failed to remove blog', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
      )}
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </div>
  )
}

export default App
