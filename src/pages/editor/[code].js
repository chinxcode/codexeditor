import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Editor from "../../components/Editor";
import AuthRequiredModal from "../../components/AuthRequiredModal";

export default function SharedEditor() {
    const router = useRouter();
    const { code } = router.query;
    const { data: session, status } = useSession();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [needsAuth, setNeedsAuth] = useState(false);

    useEffect(() => {
        if (code && status !== "loading") {
            fetchProject();
        }
    }, [code, status]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`/api/projects/${code}`);
            const projectData = response.data;
            setProject(projectData);

            const isEditableCode = code === projectData.editCode;
            const isViewCode = code === projectData.viewCode;

            // Check if this is an editable link and requires authentication
            // Only require auth for projects that have an owner (userId exists)
            if (isEditableCode && projectData.userId && !session) {
                setNeedsAuth(true);
                setShowAuthModal(true);
                setIsReadOnly(true); // Default to read-only until authenticated
            } else {
                // For guest projects (no userId) or view links, allow access
                setIsReadOnly(isViewCode);
                setNeedsAuth(false);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching project:", error);
            setLoading(false);
        }
    };

    // Handle successful authentication
    useEffect(() => {
        if (session && needsAuth && project) {
            const isEditableCode = code === project.editCode;
            if (isEditableCode) {
                setIsReadOnly(false);
                setShowAuthModal(false);
                setNeedsAuth(false);
            }
        }
    }, [session, needsAuth, project, code]);

    const handleAuthModalClose = () => {
        setShowAuthModal(false);
        // If user closes modal without authenticating, redirect to view-only
        if (needsAuth && project && project.viewCode) {
            router.push(`/editor/${project.viewCode}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <>
            <Editor initialData={project} readOnly={isReadOnly} editCode={project.editCode} viewCode={project.viewCode} />
            <AuthRequiredModal isOpen={showAuthModal} onClose={handleAuthModalClose} projectTitle={project.title} />
        </>
    );
}
