const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k0zgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("hello from notes");
});
async function run() {
  try {
    await client.connect();
    const noteCollection = client.db("takeNote").collection("note");

    app.get("/notes", async (req, res) => {
      const query = {};
      const cursor = await noteCollection.find(query);
      const notes = await cursor.toArray();
      res.send(notes);
      console.log("notes", notes);
    });
    app.get("/notes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const note = await noteCollection.findOne(query);
      res.send(note);
    });
    // create a document to insert
    app.post("/notes", async (req, res) => {
      const newNote = req.body;
      console.log("New Note", newNote);
      const result = await noteCollection.insertOne(newNote);
      res.send(result);
    });
    app.delete("/notes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.params.id);
      const query = { _id: ObjectId(id) };
      const result = await noteCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening from port", port);
});
