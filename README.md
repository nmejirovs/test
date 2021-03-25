# test blog api

To run with docker compose that placed in folder "docker":
    After docker-compose up command please connect with mariadb (for example mysql workbench) client to container "db" with root user (you can find it's password in conainer configuration) 
    and run db_ub/init_db.sql

Add in your hosts file mapping of your physical IP to host name "me.server.com" like this:
192.168.110.12  me.server.com

Postman requests are placed in folder "postman_collection"

For blog-api explanations please look on README.md in "blogs-api" folder
