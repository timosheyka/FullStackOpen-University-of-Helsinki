const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = 
    await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })
  
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = 
    await Blog
      .findById(request.params.id)
      .populate('user', { username: 1, name: 1 })
  
  if (blog) response.json(blog)
  else response.status(404).end()
})
  
blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const { title, author, url, likes = 0} = request.body
  
  const user = request.user
  const blog = new Blog({ title, author, url, likes, user: user._id })

  let savedBlog = await blog.save()
  savedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  
  if (!blog) return response.status(404).end()
  
  const user = request.user
  
  if (!blog.user.equals(user._id))
    return response.status(401).json({ error: 'unauthorized operation' })

  user.blogs = user.blogs.filter((id) => id.toString() !== request.params.id)
  await user.save()

  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  const { title, author, url, likes } = request.body
  const user = request.user

  let updatedFields = { likes }
  if (blog.user.equals(user._id))
    updatedFields = { ...updatedFields, title, author, url }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedFields,
    { new: true }
  ).populate('user', { username: 1, name: 1 })

  if (updatedBlog) response.json(updatedBlog)
  else response.status(404).end()
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const { comment } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  const updatedComments = [...blog.comments, comment]

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { comments: updatedComments },
    { new: true }
  ).populate('user', { username: 1, name: 1 })

  if (updatedBlog) response.json(updatedBlog)
  else response.status(404).end()
})

module.exports = blogsRouter