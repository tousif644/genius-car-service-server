const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//port
const port = process.env.PORT || 5000;

// dotenv
require("dotenv").config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Mongo server

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.blqzd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// async await for connecting

async function run() {
  try {
    await client.connect();
    //collection
    const serviceCollection = client.db("geniusCar").collection("service");
    const orderCollection = client.db('order').collection('order-details')

    app.get("/services", async (req, res) => {
      //query
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
      console.log("CONNECTED TO DB");
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // post to db

    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    //delete
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    //order
    app.get('/order',async(req,res) => {
      const email = req.query.email;
      console.log(email);
      const query = {email:email};
      const cursor = await orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/order',async(req,res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Runing Genius Server");
});

app.listen(port, () => {
  console.log("Listening to port...");
});
