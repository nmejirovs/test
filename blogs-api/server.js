const express = require("express"),
	bodyParser = require("body-parser"),
	swaggerJsdoc = require("swagger-jsdoc"),
	swaggerUi = require("swagger-ui-express"),
	token_verifier = require('./security/token_verifier'),
	logger = require('./util/logger');



const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/blogs", require("./routes/blogs"));

const PORT = process.env.PORT || 3000

const options = {
	definition: {
		openapi: "3.0.0",
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
	apis: ["./routes/blogs.js"],
};

const specs = swaggerJsdoc(options);

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(specs, { explorer: true })
);

let startprom = new Promise(async (resolve, reject)=>{
	try {
		const env = process.NODE_ENV || 'dev';
		await token_verifier.init(require(`./config/${env}/jwt.json`));
		await logger.init(require(`./config/${env}/logger.json`));
		resolve();
	} catch (error) {
		reject(error);
	}
});

startprom.then(()=>{
	app.listen(PORT);
	logger.getLoggger().verbose("Server listening on port: " + PORT);
}).catch((err)=>{
	logger.getLoggger().verbose(err);
});

