const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! how are you?");
});

// mongo database connection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.mafpasm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const allToyCollection = client.db("All_Toy").collection("toy");

    // get all toy collection
    app.get("/allToy", async (req, res) => {
      const price = req.query?.sort;
      const name = req.query?.name;
      let result;
      const query = {};
   if (name) {
   query.toyName = { $regex: name, $options: "i" }; // Case-insensitive search using regex
   }

      if (price === "Ascending") {
        result = await allToyCollection
          .find(query)
          .sort({ price: 1 })
          .limit(20)
          .toArray();
      } else if (price === "Descending") {
        result = await allToyCollection
          .find(query)
          .sort({ price: -1 })
          .limit(20)
          .toArray();
      } else {
        result = await allToyCollection.find(query).limit(20).toArray();
      }

      res.send(result);
    });



    
    // add  toy from client side
    app.post("/allToy", async (req, res) => {
      const data = req.body;
      const result = await allToyCollection.insertOne(data);
      res.send(result);
      // console.log(data);
    });

    // delete  data by id
    app.delete("/allToy/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids) };
      const result = await allToyCollection.deleteOne(query);
      res.send(result);
      console.log(ids);
    });

    // get toy details by id
    app.get("/details/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids) };
      const result = await allToyCollection.findOne(query);
      res.send(result);
      console.log(ids);
    });

    // get  all toy by user email
    app.get("/allToy/:email", async (req, res) => {
      const useremail = req.params.email;
      // console.log(useremail);
      // console.log(email);
      let query = {};
      if (useremail) {
        query = { sellerEmail: useremail };
      }
      const result = await allToyCollection.find(query).toArray();
      res.send(result);

      //  console.log(result);
      // console.log('hello world');
    });

    app.get("/allToy/category/:category", async (req, res) => {
      const categories = req.params.category;
      // console.log(useremail);
      console.log(categories);
      let query = {};
      if (categories) {
        query = { category: categories };
      }
      const result = await allToyCollection.find(query).toArray();
      res.send(result);

      //  console.log(result);
      // console.log('hello world');
    });

    // update data by id
    app.patch("/allToy/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: data,
          availableQuantity: data,
          details: data,
        },
      };
      const result = await allToyCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
