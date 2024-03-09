import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import getNoteModel from "./Message.js";
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

// add message in a collection
app.post("/api/add-message", async (req, res) => {
    const { note, message } = req.body;
    console.log(note);
    const collectionExits = (
        await mongoose.connection.db.listCollections().toArray()
    ).some((collection) => collection.name === note);
    if (collectionExits) {
        if (String(message).length < 1) {
            return res.status(400).json({ message: "Message is required" });
        }
        const newMessage = {
            message: message,
        };

        const Note = getNoteModel(note);
        Note.create(newMessage)
            .then(() => {
                return res
                    .status(201)
                    .json({ message: "Message added successfully" });
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ message: "Error adding message" });
            });
    } else {
        return res.status(404).json({ message: "Note not found" });
    }
});

// edit message in a collection
app.post("/api/edit-message", async (req, res) => {
    const { note, id, message } = req.body;
    const collectionExits = (
        await mongoose.connection.db.listCollections().toArray()
    ).some((collection) => collection.name === note);
    if (collectionExits) {
        if (String(message).length < 1) {
            return res.status(400).json({ message: "Message is required" });
        }
        const updatedMessage = {
            message: message,
        };
        const Note = getNoteModel(note);
        Note.findByIdAndUpdate(id, updatedMessage, { new: true })
            .then(() => {
                return res
                    .status(200)
                    .json({ message: "Message updated successfully" });
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ message: "Error updating message" });
            });
    } else {
        return res.status(404).json({ message: "Note not found" });
    }
});

// delete a message from a collection
app.delete("/api/delete-message", async (req, res) => {
    const { note, id } = req.body;
    const collectionExits = (
        await mongoose.connection.db.listCollections().toArray()
    ).some((collection) => collection.name === note);
    if (collectionExits) {
        const Note = getNoteModel(note);
        Note.findByIdAndDelete(id)
            .then(() => {
                return res
                    .status(200)
                    .json({ message: "Message deleted successfully" });
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ message: "Error deleting message" });
            });
    } else {
        return res.status(404).json({ message: "Note not found" });
    }
});

// get all messages from a collection
app.post("/api/get-messages", async (req, res) => {
    const { note } = req.body;
    const collectionExits = (
        await mongoose.connection.db.listCollections().toArray()
    ).some((collection) => collection.name === note);
    if (collectionExits) {
        const Note = getNoteModel(note);
        Note.find()
            .then((messages) => {
                const data = messages.map((message) => {
                    return {
                        id: message._id,
                        text: message.message,
                        updatedAt: getTime(message.updatedAt),
                    };
                });
                return res.status(200).json({ messages: data });
            })
            .catch(() => {
                return res
                    .status(500)
                    .json({ message: "Error getting messages" });
            });
    } else {
        return res.status(404).json({ message: "Note not found" });
    }
});

function getTime(dateStr) {
    let date = new Date(dateStr);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = `${hours}:${minutes}`;
    return time;
}
