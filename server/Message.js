import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        message: String,
    },
    { timestamps: true }
);

export default (collectionName) => {
    return (
        mongoose.models[collectionName] ||
        mongoose.model(collectionName, messageSchema, collectionName)
    );
};
