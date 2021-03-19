const express = require("express"),
	bodyParser = require("body-parser"),
	swaggerJsdoc = require("swagger-jsdoc"),
	swaggerUi = require("swagger-ui-express"),
	token_verifier = require('./security/token_verifier') ;



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
	await token_verifier.init();
	let token =  await token_verifier.verify_token('eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqWWl6WUJxZFpUMXB6X3pBNTU0clQ0YkZEMnBvZVZzb3NIejVMM1o5dVdNIn0.eyJleHAiOjE2MTYxNjcxNjUsImlhdCI6MTYxNjE2NjU2NSwianRpIjoiYjU3N2NlODUtODUxYS00OTA5LThjZjEtNjNlMDhmZGQ5ZGU3IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL2Flcm9iYXNlIiwiYXVkIjpbInRlc3QiLCJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiI4NWQ5YTQyZC04ODI3LTQ1MmQtYTg5Yy03MTMyZDE1NGY2NmQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0ZXN0Iiwic2Vzc2lvbl9zdGF0ZSI6IjM3M2ExY2JjLTFhN2YtNDUwNC1iMWM4LTdhNDY2N2RlYjNhMiIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJibG9nZ2VyIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctcmVhbG0iLCJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwicmVhbG0tYWRtaW4iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3R1c2VyIn0.Ln21yBHjvNJMNlojeCQGdeNUh0orkcP1s4UzAQPbbm4QMI_kKIkV07tf_o-OeJj8mFJI1LCy7OjrmN1FvDon09xD2yv5Aarc0SrZt9qzU2ne-bm99be5RB20qQl0IA-VjoK8JCOI4N06ognvSkdSMCwplL2XWnkQF-c6fS-vjnBRmL-uwrHilnVE01BWPvoSAQnclmu8SWFQEryW0dW_CxxLnmdnOCJ2o89hL0FZhdfPmGvEm0PGcVTv9j1F4aUXRUrrBWltJFbj5IvzaOjwFlOZK67i8hIjrt7gZhq4hNG6QnjJCCMqC6FB3Pd7qAs6FyxPZXrHDkg9QNMx25-Xiw');
});

startprom.then(()=>{
	app.listen(PORT);
	console.debug("Server listening on port: " + PORT);
}).catch((err)=>{
	console.log(err);
});

