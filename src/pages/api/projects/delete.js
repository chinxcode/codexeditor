import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ message: "Project code is required" });
        }

        // Find the project
        const project = await Project.findOne({ editCode: code });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if project belongs to a user
        if (project.userId) {
            // Verify user is authenticated and is the owner
            const session = await getServerSession(req, res, authOptions);

            if (!session) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (session.user.id !== project.userId.toString()) {
                return res.status(403).json({ message: "You don't have permission to delete this project" });
            }
        }

        // Delete the project
        await Project.findByIdAndDelete(project._id);

        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ message: "Error deleting project" });
    }
}
