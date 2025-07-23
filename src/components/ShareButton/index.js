import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./ShareButton.module.css";
import { FiShare2, FiCopy, FiEdit, FiEye, FiLock } from "react-icons/fi";

export default function ShareButton({ editCode, viewCode, isGuest = false }) {
    const { data: session } = useSession();
    const isAuthenticated = !!session;
    const [showModal, setShowModal] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [activeLink, setActiveLink] = useState("view"); // Default to view for guests
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const shareUrl = `${window.location.origin}/editor/${activeLink === "edit" ? editCode : viewCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        setShowLoginPrompt(false);
    };

    const handleEditAccessClick = () => {
        if (!isAuthenticated || isGuest) {
            setShowLoginPrompt(true);
        } else {
            setActiveLink("edit");
            setShowLoginPrompt(false);
        }
    };

    return (
        <>
            <button className={styles.topbarShareButton} onClick={toggleModal} title="Share">
                <FiShare2 size={16} />
                <span>Share</span>
            </button>

            {showModal && (
                <div className={styles.modalOverlay} onClick={toggleModal}>
                    <div className={styles.shareModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Share Project</h3>
                            <button className={styles.closeButton} onClick={toggleModal}>
                                ×
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            <p className={styles.shareDescription}>Share this project with others by copying the link:</p>

                            <div className={styles.linkTypeSelector}>
                                {editCode && (
                                    <button
                                        className={`${styles.linkType} ${activeLink === "edit" ? styles.active : ""} ${
                                            !isAuthenticated || isGuest ? styles.disabled : ""
                                        }`}
                                        onClick={handleEditAccessClick}
                                    >
                                        <FiEdit size={14} />
                                        <span>Edit Access</span>
                                        {(!isAuthenticated || isGuest) && <FiLock size={12} />}
                                    </button>
                                )}
                                <button
                                    className={`${styles.linkType} ${activeLink === "view" ? styles.active : ""}`}
                                    onClick={() => {
                                        setActiveLink("view");
                                        setShowLoginPrompt(false);
                                    }}
                                >
                                    <FiEye size={14} />
                                    <span>View Only</span>
                                </button>
                            </div>

                            {showLoginPrompt && (
                                <div className={styles.loginPrompt}>
                                    <p>🔒 Sign in required to share editable projects</p>
                                    <p>Create an account to enable edit access sharing and save your projects.</p>
                                </div>
                            )}

                            <div className={styles.shareLinkContainer}>
                                <input type="text" value={shareUrl} readOnly className={styles.shareUrlInput} />
                                <button className={styles.copyButton} onClick={copyToClipboard}>
                                    <FiCopy size={16} />
                                    <span>Copy</span>
                                </button>
                            </div>
                            {showTooltip && <div className={styles.tooltip}>Link copied!</div>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
