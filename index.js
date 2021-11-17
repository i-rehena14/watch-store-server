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
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        //POST user
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });

        //PUT admin
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            // console.log('put', user);
            const filter = { email: user.email };
            const update = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, update);
            res.json(result);
            // console.log(result);
        })

        //POST Add product
        app.post("/addProduct", async (req, res) => {
            // console.log(req.body);
            const result = await productsCollection.insertOne(req.body);
            // console.log(result);
            res.send(result);
        });

        //POST Add review
        app.post("/addReview", async (req, res) => {
            // console.log(req.body);
            const result = await reviewsCollection.insertOne(req.body);
            // console.log(result);
            res.send(result);
        });

        // GET all products
        app.get("/allProducts", async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
            // console.log(result);
        });

        // GET reviews
        app.get("/reviews", async (req, res) => {
            const result = await reviewsCollection.find({}).toArray();
            res.send(result);
            // console.log(result);
        });

        //GET single product
        app.get("/singleProduct/:id", async (req, res) => {
            const result = await productsCollection.find({ _id: ObjectId(req.params.id) }).toArray();
            // console.log(result[0]);
            res.send(result[0]);
        });

        //POST place order
        app.post("/placeOrder", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            // console.log(result);
            res.send(result);
        });

        //GET my orders
        app.get("/myOrders/:email", async (req, res) => {
            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            // console.log("orders", result);
            res.send(result);
        });

        //GET allOrders
        app.get('/allOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //DELETE order from my order
        app.delete("/cancelOrder/:id", async (req, res) => {
            const result = await ordersCollection.deleteOne({ _id: ObjectId(req.params.id) });
            // console.log(result);
            res.send(result);
        });

        //DELETE order in manageAllOrders
        app.delete("/deleteOrder/:id", async (req, res) => {
            const result = await ordersCollection.deleteOne({ _id: ObjectId(req.params.id) });
            // console.log(result);
            res.send(result);
        });

        //DELETE a product
        app.delete("/deleteProduct/:id", async (req, res) => {
            const result = await productsCollection.deleteOne({ _id: ObjectId(req.params.id) });
            // console.log(result);
            res.send(result);
        });



        //UPDATE status
        app.put("/updateStatus/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            // console.log(updatedStatus);
            const result = await ordersCollection.updateOne(filter, {
                $set: { status: updatedStatus },
            });
            // console.log(result);
        });

        //GET make admin
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.send({ admin: isAdmin });
        })

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