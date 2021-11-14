const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cuja6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log('watchStore database connected successfully');
        const database = client.db('watchTime');
        const productsCollection = database.collection('products');

        //POST Add product
        app.post("/addProduct", async (req, res) => {
            // console.log(req.body);
            const result = await productsCollection.insertOne(req.body);
            // console.log(result);
            res.send(result);
        });

        // GET all products
        app.get("/allProducts", async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        //GET single product
        app.get("/singleProduct/:id", async (req, res) => {
            const result = await productsCollection.find({ _id: ObjectId(req.params.id) }).toArray();
            // console.log(result[0]);
            res.send(result[0]);
        });

    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('watch store is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
})