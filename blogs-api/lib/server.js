const express = require("express"),
	bodyParser = require("body-parser"),
	swaggerJsdoc = require("swagger-jsdoc"),
	swaggerUi = require("swagger-ui-express"),
	tokenVerifier = require('./security/token_verifier'),
	logger = require('./util/logger'),
	blogsDb = require('./db/blogs_db'),
	authorsDb = require('./db/users_db'),
	cacheClient = require('./util/cache_client'),
	cacheService = require('./cache/cache_service'),
	{ get, indexOf } = require('lodash'),
	blogsLikesDb = require('./db/blogs_likes_db');




const app = express();
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000

const options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "blogs-api",
			version: "0.1.0",
			description:
				"This is a API for blogs",
			license: {
				name: "MIT",
				url: "https://spdx.org/licenses/MIT.html",
			},
			contact: {
				name: "LogRocket",
				url: "https://logrocket.com",
				email: "info@email.com",
			},
		},
		servers: [
			{
				url: `http://localhost:${PORT}`,
			},
		],
	},
	apis: ["./lib/routes/blogs.js", "./lib/routes/blogs_likes.js"],
};

const specs = swaggerJsdoc(options);

app.use(
	"/",
	swaggerUi.serve,
	swaggerUi.setup(specs, { explorer: true })
);

const verify_token = async (req, res, next) => {

	try {
		req.token = req.headers.authorization;
		let token_data = await tokenVerifier.verify_token(req.token.split(' ')[1]);
		if (indexOf(get(token_data, 'aud'), 'blog-client') < 0)
			throw new Error('Token has nout right audience');
		req.userContext = { userName: token_data.preferred_username, isBloger: indexOf(get(token_data, 'resource_access.blog-client.roles'), 'blogger') >= 0 };
		next();
	} catch (err) {
		return res.status(401).send(err.message);
	}
}

let startprom = new Promise(async (resolve, reject) => {
	try {
		const env = process.NODE_ENV || 'dev';
		const configDir = process.CONFIG_DIR || '../config'

		await tokenVerifier.init(require(`${configDir}/${env}/jwt.json`));
		await logger.init(require(`${configDir}/${env}/logger.json`));
		await blogsDb.init(require(`${configDir}/${env}/elastic_srch.json`));
		await blogsLikesDb.init(require(`${configDir}/${env}/elastic_srch.json`));
		await authorsDb.init(require(`${configDir}/${env}/dbconf.json`));
		await cacheClient.init(require(`${configDir}/${env}/cache.json`))
		await cacheService.init(cacheClient.getClient);
		resolve();
	} catch (error) {
		reject(error);
	}
});

app.use(verify_token);

app.use("/blogs", require("./routes/blogs"));
app.use("/blogslikes", require("./routes/blogs_likes"));

startprom.then(() => {
	app.listen(PORT);
	logger.getLoggger().verbose("Server listening on port: " + PORT);
}).catch((err) => {
	logger.getLoggger().error(err);
});

