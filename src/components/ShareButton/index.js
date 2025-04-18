import { useState } from "react";
import styles from "./ShareButton.module.css";
import { FiShare2, FiCopy, FiEdit, FiEye } from "react-icons/fi";

export default function ShareButton({ editCode, viewCode }) {
    const [showModal, setShowModal] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [activeLink, setActiveLink] = useState("edit");

    const shareUrl = `${window.location.origin}/editor/${activeLink === "edit" ? editCode : viewCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
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
                                        className={`${styles.linkType} ${activeLink === "edit" ? styles.active : ""}`}
                                        onClick={() => setActiveLink("edit")}
                                    >
                                        <FiEdit size={14} />
                                        <span>Edit Access</span>
                                    </button>
                                )}
                                <button
                                    className={`${styles.linkType} ${activeLink === "view" ? styles.active : ""}`}
                                    onClick={() => setActiveLink("view")}
                                >
                                    <FiEye size={14} />
                                    <span>View Only</span>
                                </button>
                            </div>

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
