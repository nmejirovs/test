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
 *            type: integer
 *            description: The auto-generated id of the blog.
 *          title:
 *            type: string
 *            description: The title of your blog.
 *          author:
 *            type: string
 *            description: Who wrote the blog?
 *          finished:
 *            type: boolean
 *            description: Have you finished reading it?
 *          createdAt:
 *            type: string
 *            format: date
 *            description: The date of the record creation.
 *        example:
 *           title: The Pragmatic Programmer
 *           author: Andy Hunt / Dave Thomas
 *           finished: true
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

const express = require("express");
const router = express.Router();

const blogs = require("../util/data");

router.get("/", async (req, res) => {
	res.status(200).json(blogs);
});

router.get("/:id", async (req, res) => {
	let blog = blogs.find(function (item) {
		return item.id == req.params.id;
	});

	blog ? res.status(200).json(blog) : res.sendStatus(404);
});

router.post("/", async (req, res) => {
	const { title, author, finished } = req.body;

	let blog = {
		id: blogs.length + 1,
		title: title,
		author: author,
		finished: finished !== undefined ? finished : false,
		createdAt: new Date(),
	};

	blogs.push(blog);

	res.status(201).json(blog);
});

router.put("/:id", async (req, res) => {
	let blog = blogs.find(function (item) {
		return item.id == req.params.id;
	});

	if (blog) {
		const { title, author, finished } = req.body;

		let updated = {
			id: blog.id,
			title: title !== undefined ? title : blog.title,
			author: author !== undefined ? author : blog.author,
			finished: finished !== undefined ? finished : blog.finished,
			createdAt: blog.createdAt,
		};

		blogs.splice(blogs.indexOf(blog), 1, updated);

		res.sendStatus(204);
	} else {
		res.sendStatus(404);
	}
});

router.delete("/:id", async (req, res) => {
	let blog = blogs.find(function (item) {
		return item.id == req.params.id;
	});

	if (blog) {
		blogs.splice(blogs.indexOf(blog), 1);
	} else {
		return res.sendStatus(404);
	}

	res.sendStatus(204);
});

module.exports = router;
