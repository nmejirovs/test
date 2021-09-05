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
 *          id: AxDfNT123
 *          title: Blog about something
 *          content: Blog content Blog content Blog content Blog content Blog content 
 *          author: Some Author
 *          createdAt: "2021-03-20T22:01:10"
 *          updatedAt: "2021-03-21T22:01:10"
 *      BlogNoId:
 *        type: object
 *        required:
 *          - title
 *          - author
 *          - finished
 *        properties:
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

const express = require('express'),
     logger = require('../util/logger'),
     router = express.Router(),
	 blogsService = require('../services/blogs_service');
/**
 * @swagger
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
 */
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

/**
 * @swagger
 *  /blogs/{id}:
 *    get:
 *      summary: Gets a blog by id
 *      parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: Bearer <JWT token base64 string from keycloak>
 *         required: true
 *         description: JWT token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *      tags: [Blogs]
 *      responses:
 *        "200":
 *          description: The blog.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BlogNoId'
 *        "404":
 *          description: Blog not found.
 */
router.get('/:id', async (req, res) => {
    try {
		const blog = await blogsService.getBlogById(req.params.id);
		if(blog.state){
			return res.status(blog.state).send(blog.msg || 'error');
		}
		if (blog)
			return res.status(200).json(blog);
	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on getting blog');
	}
});

/**
 * @swagger
 *  /blogs/:
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
 *        "201":
 *          description: The id of created blog.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BlogAddResponse'
 */
router.post('/', async (req, res) => {
	try {
		const { title,  content } = req.body;
		const result = await blogsService.addBlog({ title,  content }, req.userContext);

		if(result.state){
			if(result.msg){
				return res.status(result.state).send(result.msg);
			}
			else{
				
				if(result.state === 401)
					return res.status(401).send('User is not authorized to post blogs or not registered in blogs application');
			}
		}
		

		return res.status(201).json({ blogId: result });
	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on adding blog');
	}
});

/**
 * @swagger
 *    put:
 *      summary: Updates a blog
 *      tags: [Blogs]
 *      parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: Bearer <JWT token base64 string from keycloak>
 *         required: true
 *         description: JWT token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BlogAddRequest'
 *      responses:
 *        "202":
 *          description: Update was successful.
 *        "404":
 *          description: Blog not found.
 */
router.put('/:id', async (req, res) => {
	try {
		const { title, content } = req.body;
		const result = await blogsService.updateBlog(req.params.id, { title, content }, req.userContext)

		if(result.state){
			if(result.msg){
				return res.status(result.state).send(result.msg);
			}
			else{
				
				if(result.state === 401)
					return res.status(401).send('User is not authorized to update blogs');
			}
		}

		return res.status(202).json(result);

	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on updating blog');
	}
});

/**
 * @swagger
 *    delete:
 *      summary: Deletes a blog by id
 *      tags: [Blogs]
 *      parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: Bearer <JWT token base64 string from keycloak>
 *         required: true
 *         description: JWT token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *      responses:
 *        "202":
 *          description: Delete was successful.
 *        "404":
 *          description: Blog not found.
 */
router.delete('/:id', async (req, res) => {
    try {
		const result = await blogsService.removeBlog(req.params.id, req.userContext)

		if(result.state){
			if(result.msg){
				return res.status(result.state).send(result.msg);
			}
			else{
				
				if(result.state === 401)
					return res.status(401).send('User is not authorized to update blogs');
			}
		}

		return res.status(202).json(result);

	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on deleting blog');
	}
});


module.exports = router;
