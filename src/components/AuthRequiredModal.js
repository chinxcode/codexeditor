import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Modal.module.css";
import { FiX, FiLock, FiUser, FiEdit, FiMail, FiEye } from "react-icons/fi";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function AuthRequiredModal({ isOpen, onClose, projectTitle = "this project" }) {
    const router = useRouter();
    const [currentView, setCurrentView] = useState("main"); // "main", "login", "signup"

    if (!isOpen) return null;

    const handleClose = () => {
        // Reset view when closing
        setCurrentView("main");
        onClose();
    };

    const goToReadOnlyView = () => {
        // Extract the current code and redirect to view-only
        const currentPath = window.location.pathname;
        const code = currentPath.split("/").pop();

        // We'll need to fetch the project to get the viewCode
        fetch(`/api/projects/${code}`)
            .then((response) => response.json())
            .then((project) => {
                if (project.viewCode) {
                    router.push(`/editor/${project.viewCode}`);
                    handleClose();
                }
            })
            .catch((error) => {
                console.error("Error fetching project:", error);
            });
    };

    const switchToLogin = () => {
        setCurrentView("login");
    };

    const switchToSignup = () => {
        setCurrentView("signup");
    };

    const backToMain = () => {
        setCurrentView("main");
    };

    // Render the main auth required view
    const renderMainView = () => (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerIcon}>
                        <FiLock size={24} color="#ff6b6b" />
                        <h3>Authentication Required</h3>
                    </div>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className={styles.modalContent}>
                    <div className={styles.authMessage}>
                        <FiEdit size={32} color="#4ecdc4" />
                        <h4>Sign in to edit {projectTitle}</h4>
                        <p>
                            This is an editable link that requires authentication. Sign in to start editing, or view it in read-only mode.
                        </p>
                    </div>

                    <div className={styles.authOptions}>
                        <button className={styles.primaryButton} onClick={switchToLogin}>
                            <FiMail size={16} />
                            Sign In
                        </button>

                        <button className={styles.tertiaryButton} onClick={switchToSignup}>
                            <FiUser size={16} />
                            Create Account
                        </button>

                        <div className={styles.divider}>
                            <span>or</span>
                        </div>

                        <button className={styles.secondaryButton} onClick={goToReadOnlyView}>
                            <FiEye size={16} />
                            Continue in Read-Only Mode
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Return the appropriate view
    if (currentView === "main") {
        return renderMainView();
    }

    return (
        <>
            {/* Login Modal */}
            <LoginModal isOpen={currentView === "login"} onClose={backToMain} onSwitchToSignup={switchToSignup} />

            {/* Signup Modal */}
            <SignupModal isOpen={currentView === "signup"} onClose={backToMain} onSwitchToLogin={switchToLogin} />
        </>
    );
}
