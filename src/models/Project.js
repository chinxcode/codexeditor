import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    editCode: {
        type: String,
        required: true,
        unique: true,
    },
    viewCode: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: "Untitled Project",
    },
    description: {
        type: String,
        default: "",
    },
    html: {
        type: String,
        default: "",
    },
    css: {
        type: String,
        default: "",
    },
    javascript: {
        type: String,
        default: "",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Not required to support anonymous projects
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
