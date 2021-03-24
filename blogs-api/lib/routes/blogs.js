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
 *            description: The date of the record creation, genetrated automatically.
 *          updatedAt:
 *            type: string
 *            format: date
 *            description: The date of the record update, genetrated automatically.
 *        example:
 *          title: Blog about something
 *          content: Blog content Blog content Blog content Blog content Blog content 
 *          author: Some Author
 *          createdAt: "2021-03-20T22:01:10"
 *          updatedAt: "2021-03-21T22:01:10"
 *      BlogAddRequest:
 *        type: object
 *        required:
 *          - title
 *          - content
 *        properties:
 *          title:
 *            type: string
 *            description: The title of blog.
 *          content:
 *            type: string
 *            description: The content of blog up to 1000 characters.
 *          example:
 *            title: Blog about something
 *            content: Blog content Blog content Blog content Blog content Blog content 
 *      BlogAddResponse:
 *        type: object
 *        properties:
 *          blogId:
 *            type: string
*/
/**
 * @swagger
 * paths:
 *  /blogs/:
 *    get:
 *      summary: Lists all the blogs
 *      parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: Bearer <JWT token base64 string from keycloak>
 *         required: true
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
 *      parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: Bearer <JWT token base64 string from keycloak>
 *         required: true
 *      tags: [Blogs]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BlogAddRequest'
 *      responses:
 *        "200":
 *          description: The id of created blog.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BlogAddResponse'
 */

const express = require('express'),
     logger = require('../util/logger'),
     router = express.Router(),
	 blogsService = require('../services/blogs_service');

router.get('/', async (req, res) => {
	try {
		const blogs = await blogsService.getAllBlogs(req.query.count);
		if (blogs)
			return res.status(200).json(blogs);
	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on getting blogs');
	}
});

router.post('/', async (req, res) => {
	try {
		const { title,  content } = req.body;
		const blogId = await blogsService.addBlog({ title,  content }, req.userContext);
		if(blogId.state){
			if(blogId.state === 401)
				return res.status(401).send('User is not authorized to post blogs or not registered in blogs application');

			if(blogId.state === 400)
				return res.status(400).send(blogId.msg);
		}
		

		return res.status(201).json({ blogId });
	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on adding blog');
	}
});

module.exports = router;
