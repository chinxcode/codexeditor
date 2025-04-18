import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        await dbConnect();

        // Get user from session
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Get user's projects
        const projects = await Project.find({ userId: session.user.id })
            .sort({ lastUpdated: -1 })
            .select("title description editCode viewCode createdAt lastUpdated");

        return res.status(200).json({ projects });
    } catch (error) {
        console.error("Failed to get projects:", error);
        return res.status(500).json({ message: "Failed to fetch projects" });
    }
}
