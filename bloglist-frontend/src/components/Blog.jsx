import React, { useState } from 'react'
import blogService from '../services/blogService'

const Blog = ({ blog, updateBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const likeBlog = async () => {
    if (!blog.id) {
      console.error('Blog ID is missing')
      return
    }

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }

    try {
      await updateBlog(blog.id, updatedBlog)
    } catch (error) {
      console.error('Error liking the blog:', error)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>{blog.likes} likes <button onClick={likeBlog}>like</button></p>
          {blog.user && <p>added by {blog.user.name}</p>}
        </div>
      )}
    </div>
  )
}

export default Blog
