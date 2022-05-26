DEV STACK
-   BACKEND: Node Js
-   DATABASE: MongoDb
-   DOCKER: To lauch database as a docker container
-   OS: Ubuntu 18.04

PORTS:
-   DATABASE_PORT: 27017
-   APP_PORT: 3000

```
cd mongoDBDocker
docker-compose up -d
export FILE_NAME=inventory.csv
npm install; node index.js
```
API ENDPOINTS:
-   POST: /add
-   GET: /supplier/:supplier
-   GET: /supplier/:supplier?mrp=8
-   GET: /supplier/expiryDate/:supplier
-   GET: /all

END POINTS EXPLAINED:
-   /add => export an env variable FILE_NAME to a csv file that needs to be imported to the database
-   /supplier/:name => Gives all the suppliers with supplier=<'supplier paramater'>
-   /supplier/:supplier?mrp=8 => Gives all the suppliers with supplier=<'supplier paramater'> with an added filter of <'mrp'>. Here any other field also can be used instead of <'mrp'>
-   /supplier/expiryDate/:supplier => Gives all suppliers which has not expired
-   /all => Gives all the data in the database
