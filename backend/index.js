const express = require("express");
const app = express();
require("dotenv").config();
const port = 5000;

const cors = require("cors");
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.pqcfxjd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const productsCollection = client
      .db("CompleteEcommerce")
      .collection("products");

    const { ObjectId } = require("mongodb");

    app.post("/products", async (req, res) => {
      try {
        const newProduct = {
          ...req.body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const result = await productsCollection.insertOne(newProduct);

        res.status(201).send({
          message: "Product created successfully",
          productId: result.insertedId,
        });
      } catch (error) {
        res.status(500).send({ error: "Failed to create product" });
      }
    });

    app.get("/products", async (req, res) => {
      try {
        const { color, size, model, material } = req.query;

        const query = {};

        if (color) query.color = color;
        if (size) query.size = size;
        if (model) query.model = model;
        if (material) query.material = material;

        const result = await productsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).send({ error: "Failed to fetch products" });
      }
    });

    app.get("/products/all-category", async (req, res) => {
      try {
        const result = await productsCollection
          .find({}, { projection: { category: 1, name: 1 } })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Error fetching categories and titles:", error);
        res
          .status(500)
          .send({ error: "Failed to fetch categories and titles" });
      }
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...req.body,
          updated_at: new Date().toISOString(),
        },
      };
      const result = await productsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
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

app.get("/", (req, res) => {
  res.send("Complete Ecommerce Site Is Running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
