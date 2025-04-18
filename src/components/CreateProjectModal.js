import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Modal.module.css";
import { FiX } from "react-icons/fi";
import axios from "axios";

export default function CreateProjectModal({ isOpen, onClose }) {
    const router = useRouter();
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onCreate = async (projectData) => {
        try {
            const response = await axios.post("/api/projects/create", {
                title: projectData.title || "Untitled Project",
                description: projectData.description || "",
            });

            const { editCode } = response.data;
            onClose();
            router.push(`/editor/${editCode}`);
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onCreate(projectData);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Create New Project</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Project Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={projectData.title}
                                onChange={handleChange}
                                placeholder="Enter project title"
                                autoFocus
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="description">Description (optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                value={projectData.description}
                                onChange={handleChange}
                                placeholder="Enter project description"
                                rows={3}
                            ></textarea>
                        </div>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.cancelButton} onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className={styles.confirmButton}>
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
