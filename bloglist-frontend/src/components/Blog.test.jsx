import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    id: '12345',
    title: 'Testing React components',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'johndoe',
      name: 'John Doe'
    }
  }

  render(<Blog blog={blog} updateBlog={() => {}} removeBlog={() => {}} user={{ username: 'johndoe' }} />)

  screen.debug()

  expect(screen.getByText('Testing React components John Doe')).toBeInTheDocument()

  expect(screen.queryByText('http://example.com')).not.toBeInTheDocument()
  expect(screen.queryByText('5 likes')).not.toBeInTheDocument()
})
