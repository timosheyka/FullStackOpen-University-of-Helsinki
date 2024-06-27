const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { title } = require('node:process')

describe('test blogs app correctness', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific post is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
    
        const contents = response.body.map(r => r.title)
        assert(contents.includes('React patterns'))
    })

    describe('searching for a specific post', () => {
        test('succeeds with a valid id', async () => {
            const blogs = await helper.blogsInDb();
            const blogToView = blogs[0];
      
            const response = await api
              .get(`/api/blogs/${blogToView.id}`)
              .expect(200)
              .expect('Content-Type', /application\/json/);
      
            assert.deepStrictEqual(response.body, blogToView);
        });

        test('fails with statuscode 404 if blog does not exist', async () => {
            const nonExistingId = await helper.nonExistingId();
            await api.get(`/api/blogs/${nonExistingId}`).expect(404);
        });
      
        test('fails with statuscode 400 if id is invalid', async () => {
            const newBlog = { likes: 333 }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
            
            const blogs = await helper.blogsInDb()
            assert.strictEqual(blogs.length, helper.initialBlogs.length)
        });
    })

    describe('adding new post', () => {
        test('succeeds with valid data', async () => {
            const newBlog = {
              title: 'Testing patterns',
              author: 'Tests are funny',
              url: 'https://testingtpatterns.com/',
              likes: 7,
            };
      
            await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(201)
              .expect('Content-Type', /application\/json/);
      
            const blogs = await helper.blogsInDb();
            assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
        });

        test('verify that newly created blog has the correct userId', async () => {
            const newBlog = {
              title: 'Testing patterns',
              author: 'Tests are funny',
              url: 'https://testingtpatterns.com/',
              likes: 7,
            };
      
            const response = await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(201)
              .expect('Content-Type', /application\/json/);      
        });

        test('verify that if missing the default value of likes is 0', async () => {
            const newBlog = {
              title: 'Likes missing',
              author: 'no likes :(',
              url: 'https://testingtpatterns.com/',
            };
      
            const response = await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(201)
              .expect('Content-Type', /application\/json/);
      
            const blogs = await helper.blogsInDb();
            assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
            assert.strictEqual(response.body.likes, 0);
        });

        test('verify that missing title results with 400 status code', async () => {
            const newBlog = {
              title: 'No URL',
              author: 'that happens',
              likes: 4
            }

            await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(400)
            
            const blogs = await helper.blogsInDb();
            assert.strictEqual(blogs.length, helper.initialBlogs.length);
        })

        test('verify that missing title results with 400 status code', async () => {
          const newBlog = {
            author: 'that happens',
            url: 'title is not there',
            likes: 4
          }

          await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
          
          const blogs = await helper.blogsInDb();
          assert.strictEqual(blogs.length, helper.initialBlogs.length);
        })
    })

    describe('update post', () => {
      test('succeeds with a valid id', async () => {
        const blogs = await helper.blogsInDb();
        const updatedBlog = blogs[0]
        
        const response = await api
          .put(`/api/blogs/${updatedBlog.id}`)
          .send({ title: 'Updated Blog', likes: 99 })
          .expect(200)
          .expect('Content-Type', /application\/json/);
  
        assert.strictEqual(response.body.title, 'Updated Blog');
        assert.strictEqual(response.body.likes, 99);
      });
    })

    describe('updating a blog', () => {
      test('succeeds with a valid id', async () => {
        const blogs = await helper.blogsInDb();
  
        const response = await api
          .put(`/api/blogs/${blogs[0].id}`)
          .send({ title: 'Updated Blog', likes: 47 })
          .expect(200)
          .expect('Content-Type', /application\/json/);
  
        assert.strictEqual(response.body.title, 'Updated Blog');
        assert.strictEqual(response.body.likes, 47);
      });
  
      test('fails with statuscode 404 if blog doesn\'t exist', async () => {
        const nonExistingId = await helper.nonExistingId();
  
        await api
          .put(`/api/blogs/${nonExistingId}`)
          .expect(404);
      });
  
      test('fails with status code 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445';
        await api
          .put(`/api/blogs/${invalidId}`)
          .expect(400);
      });
    });

    describe('delete post', () => {
      test('succeeds with status 204 if id is valid', async () => {
        const blogs = await helper.blogsInDb()
        const toBeDeletedBlog = blogs[0]

        await api
          .delete(`/api/blogs/${toBeDeletedBlog.id}`)
          .expect(204)

        const newBlogs = await helper.blogsInDb()
        assert.strictEqual(newBlogs.length, helper.initialBlogs.length - 1)
      })
    })
})

after(async () => {
    await mongoose.connection.close()
})
