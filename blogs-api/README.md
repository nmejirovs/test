# simple-express-crud-api
This is just a simple CRUD API of Blogs made with Express. The aim is to provide an API as starting point to other implementations or tests.

Api documentation can be found on path "/api-docs"

Elastic search used for storing blogs in order to make
quicker records finding.

Authentication powered by "cloud-iam". Management console address: https://lemur-2.cloud-iam.com/auth/admin/natantest/console/#/realms/natantest/users
username:  testadmin  
password: Aa123456!


Only users that have "blog-client" role blogger can publish blogs

To start it, install Node and run:

```
npm install
npm start
```

to run in docker run next from application root:
```
 docker build -t <your username>/blog-api .
 docker run -p 3000:3000 -d <your username>/blog-api
```




