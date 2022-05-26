const csvtojson = require('csvtojson');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Express = require("express");
const BodyParser = require("body-parser");
var moment = require('moment');
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.listen(3000, () => {});
var dbConn;
var collection;
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbConn = db.db("myInventory");
    collection = dbConn.collection("customers");
    // console.log("Connected to `" + DATABASE_NAME + "`!");
    if(!collection) {
        dbConn.createCollection("customers", function(err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
          });
        console.log("Database created!");
        db.close();
    }
});

const fileName = process.env.FILE_NAME
var arrayToInsert = [];
app.post("/add", function(request, response){
    console.log("POST:: /add "+fileName)
    csvtojson().fromFile(fileName).then(source => {
        // Fetching the all data from each row
        for (var i = 0; i < source.length; i++) {
            var oneRow = {
                code: source[i]["code"],
                name: source[i]["name"],
                batch: source[i]["batch"],
                stock: source[i]["stock"],
                deal: source[i]["deal"],
                free: source[i]["free"],
                mrp: source[i]["mrp"],
                rate: source[i]["rate"],
                exp: source[i]["exp"],
                company: source[i]["company"],
                supplier: source[i]["supplier"],
            };
            arrayToInsert.push(oneRow);
         }
        //inserting into the table customers
        var collectionName = "customers";
        var collection = dbConn.collection(collectionName);
        collection.insertMany(arrayToInsert, (err, result) => {
             if (err) console.log(err);
             if(result){
                console.log("Import CSV into database successfully.");
                response.send("Import Successful !!!")
             }
        });
    });
})

app.get('/supplier/:supplier', (request, response, next) => {
    console.log("GET:: /supplier/"+request.params.supplier)
    const filters = request.query;
    var data;
    collection.find({$and:[ {"stock": {$gte:'0'}} , {"supplier": request.params.supplier}]}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        const filteredUsers = result.filter(user => {
            let isValid = true;
            for (key in filters) {
                console.log(key, user[key], filters[key]);
                isValid = isValid && user[key] == filters[key];
            }
            return isValid;
        });
        response.send(filteredUsers);
    });
});

app.get('/supplier/expiryDate/:supplier', (request, response, next) => {
    console.log("GET:: /supplier/expiryDate/"+request.params.supplier)
    const filters = request.query;
    var data;
    let nowDate = new Date().getTime();
    collection.find({$and:[ {"stock": {$gte:'0'}} , {"supplier": request.params.supplier}]}).toArray((error, result) => {
        var newResult = []
        result.forEach(res=>{
            var expDate = new Date(res.exp).getTime()
            if(nowDate < expDate){
                newResult.push(res)
                console.log(res.name+": not expired")
            }else{
                console.log(res.name+": expired")
            }
        })
        
        if(error) {
            return response.status(500).send(error);
        }
        response.send(newResult);
    });
});

app.get("/all", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});