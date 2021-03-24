/**
 * @swagger
 *  components:
 *    schemas:
 *      BlogLikeRequest:
 *        type: object
 *        required:
 *          - blogId
 *        properties:
 *          blogId:
 *            type: string
 *            description: The auto-generated id of the blog.
 *        example:
 *          blogId: lZGEX3gBlXuOB9q6j8rj
 *      BlogLikeResponse:
 *        type: boolean
*/
/**
 * @swagger
 * paths:
 *  /blogslikes/:
 *    post:
 *      summary: Add like for blog
 *      parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: Bearer <JWT token base64 string form keycloak>
 *         required: true
 *      tags: [Blogs]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BlogLikeRequest'
 *      responses:
 *        "201":
 *          description: Blog like succeed.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BlogLikeResponse'
 *  /blogslikes/{blogId}:
 *    delete:
 *      summary: Add like for blog
 *      parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: Bearer <JWT token base64 string form keycloak>
 *         required: true
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *      tags: [Blogs]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BlogLikeRequest'
 *      responses:
 *        "202":
 *          description: Blog like succeed.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BlogLikeResponse'
  */

const express = require('express'),
     logger = require('../util/logger'),
     router = express.Router(),
	 blogsLikesService = require('../services/blog_likes_service');

router.post('/', async (req, res) => {
	try {
		const { blogId } = req.body;
		const result = await blogsLikesService.addLike({ blogId }, req.userContext);
		if(result.state){
			if(result.state === 401)
				return res.status(401).send('User is not registered in blogs application');
		}
		
		return res.status(201).json(result);
	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on adding blog like');
	}
});

router.delete('/:blogId', async (req, res) => {
	try {
		const result = await blogsLikesService.removeLike({ blogId:req.params.blogId }, req.userContext);
		if(result.state){
			if(result.state === 401)
				return res.status(401).send('User is not registered in blogs application');
		}
		
		return res.status(202).json(result);
	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on remove blog like');
	}
});

module.exports = router;
