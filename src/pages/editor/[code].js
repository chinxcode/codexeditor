import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "../../components/Editor";

export default function SharedEditor() {
    const router = useRouter();
    const { code } = router.query;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        if (code) {
            fetchProject();
        }
    }, [code]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`/api/projects/${code}`);
            const projectData = response.data;
            setProject(projectData);
            setIsReadOnly(code === projectData.viewCode);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching project:", error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return <Editor initialData={project} readOnly={isReadOnly} editCode={project.editCode} viewCode={project.viewCode} />;
}
