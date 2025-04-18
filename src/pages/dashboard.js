import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import styles from "../styles/Dashboard.module.css";
import CreateProjectModal from "../components/CreateProjectModal";
import {
    FiCode,
    FiPlus,
    FiSearch,
    FiClock,
    FiCalendar,
    FiEdit2,
    FiEye,
    FiShare2,
    FiTrash2,
    FiX,
    FiCopy,
    FiFolder,
    FiGrid,
    FiList,
    FiAlertCircle,
    FiLogOut,
} from "react-icons/fi";
import { set } from "mongoose";

export default function Dashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    const [projects, setProjects] = useState([]);
    const [isProjectsLoading, setIsProjectsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sortBy, setSortBy] = useState("lastUpdated");
    const [sortDir, setSortDir] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [shareType, setShareType] = useState("edit");
    const [showCopyTooltip, setShowCopyTooltip] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    // Fetch user's projects
    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
        }
    }, [isAuthenticated]);

    const fetchProjects = async () => {
        setIsProjectsLoading(true);
        try {
            const response = await axios.get("/api/projects/user-projects");
            if (response.data.projects) {
                setProjects(response.data.projects);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsProjectsLoading(false);
        }
    };

    const handleCreateNewProject = async () => {
        setIsCreateModalOpen(true);
    };

    const handleOpenProject = (editCode) => {
        router.push(`/editor/${editCode}`);
    };

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;

        try {
            await axios.delete(`/api/projects/delete?code=${projectToDelete}`);
            setProjects(projects.filter((p) => p.editCode !== projectToDelete));
            setShowDeleteModal(false);
            setProjectToDelete(null);
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const showConfirmDelete = (editCode, e) => {
        e.stopPropagation();
        setProjectToDelete(editCode);
        setShowDeleteModal(true);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle direction if clicking the same field
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            // New field, set default to descending
            setSortBy(field);
            setSortDir("desc");
        }
    };

    const openShareModal = (project, e) => {
        e.stopPropagation();
        setSelectedProject(project);
        setShowShareModal(true);
    };

    const copyShareLink = () => {
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/editor/${shareType === "edit" ? selectedProject.editCode : selectedProject.viewCode}`;
        navigator.clipboard.writeText(url);
        setShowCopyTooltip(true);
        setTimeout(() => setShowCopyTooltip(false), 2000);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 30) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    // Get languages used in a project
    const getProjectLanguages = (project) => {
        const languages = [];
        if (project.html) languages.push("HTML");
        if (project.css) languages.push("CSS");
        if (project.javascript) languages.push("JS");
        return languages.join(" / ") || "Empty";
    };

    const closeCreateProjectModal = () => {
        setIsCreateModalOpen(false);
    };

    // Filter and sort projects
    const filteredProjects = projects
        .filter(
            (project) =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === "title") {
                return sortDir === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            } else if (sortBy === "createdAt") {
                return sortDir === "asc" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                // lastUpdated is default
                return sortDir === "asc"
                    ? new Date(a.lastUpdated) - new Date(b.lastUpdated)
                    : new Date(b.lastUpdated) - new Date(a.lastUpdated);
            }
        });

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.logo}>
                        <FiCode size={24} />
                        <h1>CodeXeditor</h1>
                    </Link>

                    <div className={styles.userInfo}>
                        {session?.user && (
                            <div className={styles.userProfile}>
                                {session.user.image ? (
                                    <img src={session.user.image} alt={session.user.name} className={styles.userAvatar} />
                                ) : (
                                    <div className={styles.userInitials}>{session.user.name?.charAt(0) || "U"}</div>
                                )}
                                <span className={styles.userName}>{session.user.name}</span>
                                <button className={styles.logoutButton} onClick={() => signOut()} title="Sign Out">
                                    <FiLogOut size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.dashboardHeader}>
                    <div className={styles.titleSection}>
                        <h1>My Projects</h1>
                        <p>Manage your code projects and share them with others</p>
                    </div>

                    <button className={styles.newProjectButton} onClick={handleCreateNewProject}>
                        <FiPlus size={16} />
                        New Project
                    </button>
                </div>

                <div className={styles.controlsContainer}>
                    <div className={styles.searchContainer}>
                        <FiSearch size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className={styles.viewControls}>
                        <button
                            className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
                            onClick={() => setViewMode("grid")}
                            title="Grid View"
                        >
                            <FiGrid size={16} />
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
                            onClick={() => setViewMode("list")}
                            title="List View"
                        >
                            <FiList size={16} />
                        </button>
                    </div>

                    <div className={styles.sortControls}>
                        <button
                            className={`${styles.sortButton} ${sortBy === "title" ? styles.active : ""}`}
                            onClick={() => handleSort("title")}
                        >
                            Name {sortBy === "title" && (sortDir === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            className={`${styles.sortButton} ${sortBy === "lastUpdated" ? styles.active : ""}`}
                            onClick={() => handleSort("lastUpdated")}
                        >
                            Updated {sortBy === "lastUpdated" && (sortDir === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            className={`${styles.sortButton} ${sortBy === "createdAt" ? styles.active : ""}`}
                            onClick={() => handleSort("createdAt")}
                        >
                            Created {sortBy === "createdAt" && (sortDir === "asc" ? "↑" : "↓")}
                        </button>
                    </div>
                </div>

                {isProjectsLoading ? (
                    <div className={styles.loadingProjects}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading your projects...</p>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className={viewMode === "grid" ? styles.projectsGrid : styles.projectsList}>
                        {filteredProjects.map((project) => (
                            <div
                                key={project._id}
                                className={viewMode === "grid" ? styles.projectCard : styles.projectRow}
                                onClick={() => handleOpenProject(project.editCode)}
                            >
                                {viewMode === "grid" ? (
                                    <>
                                        <div className={styles.projectCardHeader}>
                                            <h3 className={styles.projectTitle}>{project.title}</h3>
                                            <div className={styles.projectLanguages}>{getProjectLanguages(project)}</div>
                                        </div>

                                        <p className={styles.projectDescription}>{project.description || "No description provided"}</p>

                                        <div className={styles.projectMeta}>
                                            <div className={styles.projectDate}>
                                                <FiClock size={14} />
                                                <span>Updated {formatDate(project.lastUpdated)}</span>
                                            </div>
                                        </div>

                                        <div className={styles.projectActions}>
                                            <button className={styles.actionButton} title="Edit Project">
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => openShareModal(project, e)}
                                                title="Share Project"
                                            >
                                                <FiShare2 size={16} />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => showConfirmDelete(project.editCode, e)}
                                                title="Delete Project"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.projectRowMain}>
                                            <div className={styles.projectIcon}>
                                                <FiFolder size={20} />
                                            </div>
                                            <div className={styles.projectInfo}>
                                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                                <p className={styles.projectDescription}>
                                                    {project.description || "No description provided"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.projectRowLanguages}>{getProjectLanguages(project)}</div>
                                        <div className={styles.projectRowDate}>
                                            <FiClock size={14} />
                                            <span>{formatDate(project.lastUpdated)}</span>
                                        </div>
                                        <div className={styles.projectRowActions}>
                                            <button className={styles.actionButton} title="Edit Project">
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => openShareModal(project, e)}
                                                title="Share Project"
                                            >
                                                <FiShare2 size={16} />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => showConfirmDelete(project.editCode, e)}
                                                title="Delete Project"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noProjects}>
                        <div className={styles.noProjectsIcon}>
                            <FiAlertCircle size={48} />
                        </div>
                        <h3>No projects found</h3>
                        {searchTerm ? (
                            <p>No projects match your search criteria. Try a different search term.</p>
                        ) : (
                            <p>You haven't created any projects yet. Create your first project to get started!</p>
                        )}
                        <button className={styles.createFirstButton} onClick={handleCreateNewProject}>
                            Create First Project
                        </button>
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Delete Project?</h3>
                            <button className={styles.closeButton} onClick={() => setShowDeleteModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
                            <div className={styles.modalActions}>
                                <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </button>
                                <button className={styles.deleteButton} onClick={handleDeleteProject}>
                                    Delete Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && selectedProject && (
                <div className={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Share Project</h3>
                            <button className={styles.closeButton} onClick={() => setShowShareModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <p className={styles.shareDescription}>
                                Share <strong>{selectedProject.title}</strong> with others by copying the link:
                            </p>

                            <div className={styles.shareModes}>
                                <button
                                    className={`${styles.shareMode} ${shareType === "edit" ? styles.active : ""}`}
                                    onClick={() => setShareType("edit")}
                                >
                                    <FiEdit2 size={16} />
                                    <div>
                                        <strong>Edit Access</strong>
                                        <span>Recipients can make changes to code</span>
                                    </div>
                                </button>
                                <button
                                    className={`${styles.shareMode} ${shareType === "view" ? styles.active : ""}`}
                                    onClick={() => setShareType("view")}
                                >
                                    <FiEye size={16} />
                                    <div>
                                        <strong>View Only</strong>
                                        <span>Recipients can only view the code</span>
                                    </div>
                                </button>
                            </div>

                            <div className={styles.shareLinkContainer}>
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/editor/${
                                        shareType === "edit" ? selectedProject.editCode : selectedProject.viewCode
                                    }`}
                                    className={styles.shareLinkInput}
                                />
                                <button className={styles.copyButton} onClick={copyShareLink}>
                                    <FiCopy size={16} />
                                    <span>Copy</span>
                                </button>
                                {showCopyTooltip && <div className={styles.copyTooltip}>Link copied!</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <CreateProjectModal isOpen={isCreateModalOpen} onClose={closeCreateProjectModal} />
        </div>
    );
}
