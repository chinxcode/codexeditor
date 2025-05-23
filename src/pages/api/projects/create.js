import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";
import { generateProjectCodes } from "../../../utils/codeGenerator";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const { title, description } = req.body;
        const { editCode, viewCode } = generateProjectCodes();

        // Get user session
        const session = await getServerSession(req, res, authOptions);

        // Create project with user ID if logged in
        const projectData = {
            editCode,
            viewCode,
            title: title || "Untitled Project",
            description: description || "",
        };

        // Associate project with user if logged in
        if (session?.user?.id) {
            projectData.userId = session.user.id;
        }

        const project = await Project.create(projectData);

        res.status(201).json({
            editCode: project.editCode,
            viewCode: project.viewCode,
            title: project.title,
            description: project.description,
        });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Error creating project" });
    }
}
