import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Connected to DB");
        app.listen(3000, () => {
            console.log("server is listening on port 3000");
        });
    })
    .catch((err) => console.log("Error connecting to DB", err));

// create new collection
app.post("/api/create-new-note", (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    } else if (String(title).length < 3 || String(title).length > 20) {
        return res
            .status(400)
            .json({ message: "Title length must be between 3 and 20" });
    }
    mongoose.connection.db
        .createCollection(title)
        .then(() => {
            return res.status(201).json({
                message: "Note created successfully",
            });
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error creating new note" });
        });
});

// edit collection name
app.post("/api/edit-note-name", async (req, res) => {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
        return res
            .status(400)
            .json({ message: "oldName and newName are required" });
    } else if (String(newName).length < 3 || String(newName).length > 20) {
        return res
            .status(400)
            .json({ message: "newName length must be between 3 and 20" });
    }
    // checking if note with oldName exists or not
    const collectionExits = (
        await mongoose.connection.db.listCollections().toArray()
    ).some((collection) => collection.name === oldName);
    if (collectionExits) {
        mongoose.connection.db
            .renameCollection(oldName, newName)
            .then(() => {
                return res.status(200).json({
                    message: "Note name updated successfully",
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error updating note name",
                });
            });
    } else {
        return res.status(404).json({ message: "Note not found" });
    }
});

// delete collection
app.delete("/api/delete-note", async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    const collectionExits = (
        await mongoose.connection.db.listCollections().toArray()
    ).some((collection) => collection.name === title);
    if (!collectionExits) {
        return res.status(404).json({ message: "Note not found" });
    }
    mongoose.connection.db
        .dropCollection(title)
        .then(() => {
            return res
                .status(200)
                .json({ message: "Note deleted successfully" });
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error deleting note" });
        });
});

// get all collection names
app.get("/api/get-notes-names", async (req, res) => {
    const collectionNames = (
        await mongoose.connection.db.listCollections().toArray()
    ).map((collection) => {
        return {
            name: collection.name,
            id: collection.info.uuid,
        };
    });
    return res.status(200).json({ Notes: collectionNames });
});
