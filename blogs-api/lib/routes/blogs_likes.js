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
 *        "200":
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
		const blogLikeId = await blogsLikesService.addLike({ blogId }, req.userContext);
		if(blogLikeId.state){
			if(blogblogLikeId.state === 401)
				return res.status(401).send('User is not registered in blogs application');
		}
		
		return res.status(201).json(true);
	} catch (error) {
		logger.getLoggger().error(error);
		return res.status(500).send('Error on adding blog like');
	}
});

module.exports = router;
