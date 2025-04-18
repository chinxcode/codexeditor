import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";

export default async function handler(req, res) {
    await dbConnect();
    const { code } = req.query;

    if (req.method === "GET") {
        try {
            const project = await Project.findOne({
                $or: [{ editCode: code }, { viewCode: code }],
            });

            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }

            res.status(200).json(project);
        } catch (error) {
            res.status(500).json({ message: "Error fetching project" });
        }
    }
}
