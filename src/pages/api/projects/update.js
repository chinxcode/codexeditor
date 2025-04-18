import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const { code, html, css, javascript, title, description } = req.body;

        // Find the project
        const project = await Project.findOne({ editCode: code });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Build update object with provided data
        const updateData = {
            lastUpdated: new Date(),
        };

        // Only update fields that were provided
        if (html !== undefined) updateData.html = html;
        if (css !== undefined) updateData.css = css;
        if (javascript !== undefined) updateData.javascript = javascript;
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;

        // Update project
        const updatedProject = await Project.findOneAndUpdate({ editCode: code }, updateData, { new: true });

        res.status(200).json({
            message: "Project updated successfully",
            project: {
                editCode: updatedProject.editCode,
                viewCode: updatedProject.viewCode,
                title: updatedProject.title,
            },
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Error updating project" });
    }
}
