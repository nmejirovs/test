/**
 * @swagger
 *  components:
 *    schemas:
 *      Blog:
 *        type: object
 *        required:
 *          - title
 *          - author
 *          - finished
 *        properties:
 *          id:
 *            type: string
 *            description: The auto-generated id of the blog.
 *          title:
 *            type: string
 *            description: The title of blog.
 *          content:
 *            type: string
 *            description: The content of blog.
 *          author:
 *            type: string
 *            description: Who wrote the blog?
 *          createdAt:
 *            type: string
 *            format: date
 *            description: The date of the record creation.
 *          updatedAt:
 *            type: string
 *            format: date
 *            description: The date of the record update.
 *        example:
 *          title: Blog about something
 *          content: Blog content Blog content Blog content Blog content Blog content 
 *          author: Test User
 *          createdAt: "2021-03-20T22:01:10"
 *          updatedAt: "2021-03-21T22:01:10"
*/
/**
 * @swagger
 * paths:
 *  /blogs/:
 *    get:
 *      summary: Lists all the blogs
 *      tags: [Blogs]
 *      responses:
 *        "200":
 *          description: The list of blogs.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Blog'
 *    post:
 *      summary: Creates a new blog
 *      tags: [Blogs]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      responses:
 *        "200":
 *          description: The created blog.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Blog'
 *  /blogs/{id}:
 *    get:
 *      summary: Gets a blog by id
 *      tags: [Blogs]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: The blog id
 *      responses:
 *        "200":
 *          description: The list of blogs.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Blog'
 *        "404":
 *          description: Blog not found.
 *    put:
 *      summary: Updates a blog
 *      tags: [Blogs]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: The blog id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      responses:
 *        "204":
 *          description: Update was successful.
 *        "404":
 *          description: Blog not found.
 *    delete:
 *      summary: Deletes a blog by id
 *      tags: [Blogs]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: The blog id
 *      responses:
 *        "204":
 *          description: Delete was successful.
 *        "404":
 *          description: Blog not found.
 */

const express = require('express'),
     logger = require('../util/logger'),
     router = express.Router();

const blogsContentSvc = require('../services/blogs_content_svc');

router.get('/', async (req, res) => {
	res.status(200).json([]);
});

router.get('/:id', async (req, res) => {
	let blog = {}

	blog ? res.status(200).json(blog) : res.sendStatus(404);
});

router.post('/', async (req, res) => {
	try {
		const { title,  content, author, createdAt, updatedAt } = req.body;
		await blogsContentSvc.addBlog({ title,  content, author, createdAt, updatedAt });	
		res.status(201).json({ title,  content, author, createdAt, updatedAt });
	} catch (error) {
		logger.getLoggger().error(error);
		res.status(500).send('Error on adding blog');
	}
});

router.put('/:id', async (req, res) => {
	

	if ({}) {
		

		res.sendStatus(204);
	} else {
		
		res.sendStatus(404);
	}
});

router.delete('/:id', async (req, res) => {
	

	if ({}) {
		
	} else {
		return res.sendStatus(404);
	}

	res.sendStatus(204);
});

module.exports = router;
