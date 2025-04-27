import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Editor from "@monaco-editor/react";
import axios from "axios";
import ShareButton from "../ShareButton";
import AIChatButton from "../AIChatButton";
import styles from "./Editor.module.css";
import { FiSave, FiCode, FiLayout, FiColumns, FiEye, FiGrid, FiHome, FiEdit, FiCheck, FiSettings, FiInfo, FiX } from "react-icons/fi";

export default function CodeEditor({ initialData, readOnly, editCode, viewCode }) {
    const router = useRouter();
    const { data: session } = useSession();
    const isAuthenticated = !!session;

    const [activeTab, setActiveTab] = useState("html");
    const [html, setHtml] = useState(initialData?.html || "");
    const [css, setCss] = useState(initialData?.css || "");
    const [js, setJs] = useState(initialData?.javascript || "");
    const [saveStatus, setSaveStatus] = useState("");
    const [projectTitle, setProjectTitle] = useState(initialData?.title || "Untitled Project");
    const [projectDescription, setProjectDescription] = useState(initialData?.description || "");
    const [showTitleModal, setShowTitleModal] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [layout, setLayout] = useState("split"); // "split", "editor", "preview"

    // Check if the current user is the owner of the project
    useEffect(() => {
        if (isAuthenticated && initialData?.userId && session?.user?.id) {
            setIsOwner(initialData.userId === session.user.id);
        } else if (!initialData?.userId) {
            // If the project doesn't have an owner, anyone can edit it
            setIsOwner(true);
        }
    }, [isAuthenticated, initialData, session]);

    // Auto-save logic
    useEffect(() => {
        if (!readOnly && autoSaveEnabled) {
            const timer = setTimeout(() => {
                saveProject();
            }, 5000); // Auto-save after 5 seconds of inactivity

            return () => clearTimeout(timer);
        }
    }, [html, css, js, projectTitle, projectDescription]);

    const tabs = [
        {
            id: "html",
            label: "HTML",
            icon: <FiCode size={16} />,
            language: "html",
        },
        {
            id: "css",
            label: "CSS",
            icon: <FiLayout size={16} />,
            language: "css",
        },
        {
            id: "js",
            label: "JS",
            icon: <FiCode size={16} />,
            language: "javascript",
        },
    ];

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        lineNumbers: "on",
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: readOnly, // Allow editing if user has edit link
        theme: "vs-dark",
        padding: { top: 10 },
        fontFamily: "'Fira Code', monospace",
        fontLigatures: true,
    };

    const saveProject = async () => {
        if (readOnly || isSaving) return; // Anyone with edit link can save

        try {
            setIsSaving(true);
            setSaveStatus("Saving...");

            await axios.post("/api/projects/update", {
                code: editCode,
                html,
                css,
                javascript: js,
                title: isOwner ? projectTitle : undefined, // Only owner can edit title
                description: isOwner ? projectDescription : undefined, // Only owner can edit description
            });

            setSaveStatus("Saved!");
            setTimeout(() => setSaveStatus(""), 2000);
        } catch (error) {
            console.error("Save error:", error);
            setSaveStatus("Save failed");
            setTimeout(() => setSaveStatus(""), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    const openPreview = () => {
        const output = generateOutput();
        const previewWindow = window.open("", "_blank");
        previewWindow.document.write(output);
        previewWindow.document.close();
    };

    const generateOutput = () => {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${projectTitle}</title>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `;
    };

    const handleTitleSave = () => {
        setShowTitleModal(false);
        saveProject();
    };

    const handleDescriptionSave = () => {
        setShowDescriptionModal(false);
        saveProject();
    };

    const toggleLayout = (newLayout) => {
        setLayout(newLayout);
    };

    const goToHome = () => {
        router.push("/");
    };

    const goToDashboard = () => {
        router.push("/dashboard");
    };

    // Handle code generated from AI
    const handleCodeGenerated = (generatedCode) => {
        if (readOnly) return; // Don't update if in read-only mode

        const { html: generatedHtml, css: generatedCss, js: generatedJs } = generatedCode;

        // Update the code in each tab
        if (generatedHtml) {
            setHtml(generatedHtml);
        }

        if (generatedCss) {
            setCss(generatedCss);
        }

        if (generatedJs) {
            setJs(generatedJs);
        }

        // Save the project with the new code
        saveProject();
    };

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div className={styles.logoArea}>
                    <div className={styles.logo} onClick={goToHome}>
                        <FiCode size={24} className={styles.logoIcon} />
                        <span>CodeXeditor</span>
                    </div>
                </div>

                <div className={styles.projectTitleArea}>
                    <h1 className={styles.projectTitle}>
                        {projectTitle}
                        {!readOnly && isOwner && (
                            <button className={styles.editButton} onClick={() => setShowTitleModal(true)} title="Edit Title">
                                <FiEdit size={14} />
                            </button>
                        )}
                    </h1>
                </div>

                <div className={styles.actions}>
                    {!readOnly && (
                        <button
                            className={`${styles.actionButton} ${styles.saveButton}`}
                            onClick={saveProject}
                            disabled={isSaving}
                            title="Save Project"
                        >
                            <FiSave size={16} />
                            <span>{isSaving ? "Saving..." : "Save"}</span>
                        </button>
                    )}

                    <div className={styles.layoutControls}>
                        <button
                            className={`${styles.layoutButton} ${layout === "editor" ? styles.active : ""}`}
                            onClick={() => toggleLayout("editor")}
                            title="Editor Only"
                        >
                            <FiCode size={16} />
                        </button>
                        <button
                            className={`${styles.layoutButton} ${layout === "split" ? styles.active : ""}`}
                            onClick={() => toggleLayout("split")}
                            title="Split View"
                        >
                            <FiColumns size={16} />
                        </button>
                        <button
                            className={`${styles.layoutButton} ${layout === "preview" ? styles.active : ""}`}
                            onClick={() => toggleLayout("preview")}
                            title="Preview Only"
                        >
                            <FiEye size={16} />
                        </button>
                    </div>

                    <button className={styles.infoButton} onClick={() => setShowDescriptionModal(true)} title="Project Info">
                        <FiInfo size={16} />
                        <span>Info</span>
                    </button>

                    <div className={styles.navButtons}>
                        {isAuthenticated && (
                            <button className={styles.navButton} onClick={goToDashboard} title="Go to Dashboard">
                                <FiGrid size={16} className={styles.buttonIcon} />
                                <span>Dashboard</span>
                            </button>
                        )}
                        <button className={styles.navButton} onClick={goToHome} title="Go to Home">
                            <FiHome size={16} className={styles.buttonIcon} />
                            <span>Home</span>
                        </button>
                    </div>

                    {!readOnly && (
                        <div className={styles.shareContainer}>
                            <ShareButton editCode={editCode} viewCode={viewCode} />
                        </div>
                    )}
                    <div className={styles.aiAssistantContainer}>
                        <AIChatButton onCodeGenerated={handleCodeGenerated} />
                    </div>
                </div>
            </div>

            <div className={`${styles.mainContainer} ${styles[layout]}`}>
                <div className={`${styles.editorSection} ${layout === "preview" ? styles.hidden : ""}`}>
                    <div className={styles.editorTabs}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={styles.tabIcon}>{tab.icon}</span>
                                <span className={styles.tabLabel}>{tab.label}</span>
                            </button>
                        ))}

                        <div className={styles.editorSettings}>
                            <button className={styles.settingsButton} onClick={() => setShowSettings(!showSettings)} title="Settings">
                                <FiSettings size={16} />
                            </button>

                            {showSettings && (
                                <div className={styles.settingsDropdown}>
                                    <div className={styles.settingItem}>
                                        <input
                                            type="checkbox"
                                            id="autoSave"
                                            checked={autoSaveEnabled}
                                            onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                                        />
                                        <label htmlFor="autoSave">Auto-save</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.editorContent}>
                        <Editor
                            height="100%"
                            language={tabs.find((t) => t.id === activeTab).language}
                            value={activeTab === "html" ? html : activeTab === "css" ? css : js}
                            onChange={(value) => {
                                if (!readOnly) {
                                    if (activeTab === "html") setHtml(value);
                                    if (activeTab === "css") setCss(value);
                                    if (activeTab === "js") setJs(value);
                                }
                            }}
                            options={editorOptions}
                        />
                    </div>
                </div>

                <div className={`${styles.previewSection} ${layout === "editor" ? styles.hidden : ""}`}>
                    <div className={styles.previewHeader}>
                        <h3>Preview</h3>
                        <button className={styles.previewButton} onClick={openPreview} title="Open in new window">
                            <FiEye size={16} />
                        </button>
                    </div>
                    <iframe srcDoc={generateOutput()} title="preview" sandbox="allow-scripts" className={styles.previewFrame} />
                </div>
            </div>

            {/* Title Edit Modal */}
            {showTitleModal && (
                <div className={styles.modalOverlay} onClick={() => setShowTitleModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Edit Project Title</h3>
                            <button className={styles.closeButton} onClick={() => setShowTitleModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <div className={styles.formGroup}>
                                <label htmlFor="projectTitle">Title</label>
                                <input
                                    type="text"
                                    id="projectTitle"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    className={styles.modalInput}
                                    placeholder="Enter project title"
                                    autoFocus
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.cancelButton} onClick={() => setShowTitleModal(false)}>
                                    Cancel
                                </button>
                                <button className={styles.saveButton} onClick={handleTitleSave}>
                                    <FiCheck size={16} />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Description Edit Modal */}
            {showDescriptionModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDescriptionModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Project Information</h3>
                            <button className={styles.closeButton} onClick={() => setShowDescriptionModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <div className={styles.infoItem}>
                                <h4>Project Title</h4>
                                <p>{projectTitle}</p>
                            </div>
                            {!readOnly && isOwner ? (
                                <div className={styles.formGroup}>
                                    <label htmlFor="projectDescription">Description</label>
                                    <textarea
                                        id="projectDescription"
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                        className={styles.modalTextarea}
                                        placeholder="Add a description for your project"
                                        rows={4}
                                    />
                                </div>
                            ) : (
                                <div className={styles.infoItem}>
                                    <h4>Description</h4>
                                    <p>{projectDescription || "No description provided."}</p>
                                </div>
                            )}
                            {!readOnly && isOwner && (
                                <div className={styles.modalActions}>
                                    <button className={styles.cancelButton} onClick={() => setShowDescriptionModal(false)}>
                                        Cancel
                                    </button>
                                    <button className={styles.saveButton} onClick={handleDescriptionSave}>
                                        <FiCheck size={16} />
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {saveStatus && (
                <div className={styles.saveStatusIndicator}>
                    {saveStatus === "Saved!" ? (
                        <>
                            <FiCheck size={16} className={styles.statusIcon} />
                            {saveStatus}
                        </>
                    ) : (
                        saveStatus
                    )}
                </div>
            )}

            {readOnly && !isOwner && (
                <div className={styles.readOnlyNotice}>
                    {isAuthenticated
                        ? "You're viewing a project you don't own. You cannot make changes."
                        : "Sign in to create and edit your own projects."}
                </div>
            )}
        </div>
    );
}
