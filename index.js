const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fjpfx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/', (req, res) => {
    res.send('Note Taking App');
});

const run = async () => {
    try {
        await client.connect();
        const notesCollection = client.db('myNotes').collection('notes');

        // Get All the Notes
        app.get('/notes', async (req, res) => {
            const query = {};
            const cursor = notesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Insert Note
        app.post('/notes', async (req, res) => {
            const note = req.body;
            const result = await notesCollection.insertOne(note);
            res.json(result)
        });

        // Delete Note
        app.delete('/notes/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }

            const result = await notesCollection.deleteOne(query);
            res.json(result);
        })

        // Update Note
        app.put('/notes/:id', async (req, res) => {
            const id = req.params.id;
            const note = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    title: note.title,
                    description: note.description
                }
            };

            const result = await notesCollection.updateOne(filter, updatedDoc, options);
            res.json(result);
        })
    } finally {
        // Happy Coding
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('Server Running!');
});